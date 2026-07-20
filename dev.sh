#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FE_DIR="$ROOT/frontend"
BE_DIR="$ROOT/backend"

# ── Colors ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()  { echo -e "${CYAN}${BOLD}[dev]${RESET}  $*"; }
ok()    { echo -e "${GREEN}${BOLD}[ok]${RESET}   $*"; }
warn()  { echo -e "${YELLOW}${BOLD}[warn]${RESET} $*" >&2; }
die()   { echo -e "${RED}${BOLD}[err]${RESET}  $*" >&2; }

# ── Port helpers ─────────────────────────────────────────────────────────────
port_free() { ! lsof -iTCP:"$1" -sTCP:LISTEN -t &>/dev/null; }

find_free_port() {
  local port="$1"
  while ! port_free "$port"; do
    warn "Port $port is in use, trying $((port+1))…"
    port=$((port+1))
  done
  echo "$port"
}

# ── Preflight checks ─────────────────────────────────────────────────────────
preflight_ok=true

if ! command -v node &>/dev/null; then
  die "node not found — install Node.js first"; preflight_ok=false
fi
if ! command -v npm &>/dev/null; then
  die "npm not found — install Node.js first"; preflight_ok=false
fi
if ! command -v python3 &>/dev/null; then
  die "python3 not found — install Python 3 first"; preflight_ok=false
fi
if [[ ! -d "$BE_DIR/venv" ]]; then
  die "Python venv missing at backend/venv — run: python3 -m venv backend/venv && pip install -r backend/requirements.txt"; preflight_ok=false
fi
if [[ ! -f "$FE_DIR/package.json" ]]; then
  die "frontend/package.json not found"; preflight_ok=false
fi
if [[ ! -d "$FE_DIR/node_modules" ]]; then
  warn "frontend/node_modules missing — running npm install…"
  npm --prefix "$FE_DIR" install || { die "npm install failed"; preflight_ok=false; }
fi
if [[ ! -f "$BE_DIR/.env" ]]; then
  warn ".env not found in backend/ — the API may fail on startup (copy .env.example and fill in values)"
fi

$preflight_ok || { die "Fix the above issues and re-run."; exit 1; }

# ── Resolve ports ─────────────────────────────────────────────────────────────
FE_PORT=$(find_free_port 5173)
BE_PORT=$(find_free_port 8001)

# Patch vite proxy target if backend port changed
if [[ "$BE_PORT" != "8001" ]]; then
  warn "Backend will start on :$BE_PORT instead of :8001 — frontend proxy will point there"
fi

# ── Supabase connectivity check (non-blocking) ────────────────────────────────
if [[ -f "$BE_DIR/.env" ]]; then
  SUPABASE_URL=$(grep -E '^SUPABASE_URL=' "$BE_DIR/.env" | cut -d= -f2-)
  if [[ -n "$SUPABASE_URL" && "$SUPABASE_URL" != *"your-project-id"* ]]; then
    info "Checking Supabase connectivity…"
    if curl -sf --max-time 5 "$SUPABASE_URL/rest/v1/" -o /dev/null 2>&1; then
      ok "Supabase reachable at $SUPABASE_URL"
    else
      warn "Supabase unreachable — API routes that touch the DB will fail. Check your network or SUPABASE_URL."
    fi
  else
    warn "SUPABASE_URL not configured in backend/.env — DB-backed routes will fail"
  fi
fi

# ── Cleanup on exit ───────────────────────────────────────────────────────────
PIDS=()
cleanup() {
  echo ""
  info "Shutting down…"
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null && wait "$pid" 2>/dev/null || true
  done
  ok "All processes stopped. Bye!"
}
trap cleanup INT TERM EXIT

# ── Start backend ─────────────────────────────────────────────────────────────
info "Starting backend  →  http://localhost:$BE_PORT  (FastAPI + uvicorn)"
(
  cd "$BE_DIR"
  source venv/bin/activate
  uvicorn app.main:app --reload --port "$BE_PORT" 2>&1 | \
    while IFS= read -r line; do
      echo -e "${CYAN}[be]${RESET} $line"
    done
) &
BE_PID=$!
PIDS+=($BE_PID)

# Give the backend a moment to fail fast on import errors
sleep 2
if ! kill -0 $BE_PID 2>/dev/null; then
  die "Backend exited immediately — check the [be] log above for errors (missing .env vars, import errors, etc.)"
  exit 1
fi
ok "Backend running  (PID $BE_PID)"

# ── Start frontend ────────────────────────────────────────────────────────────
info "Starting frontend →  http://localhost:$FE_PORT  (Vite + React)"
(
  cd "$FE_DIR"
  VITE_BE_PORT=$BE_PORT \
  npm run dev -- --port "$FE_PORT" 2>&1 | \
    while IFS= read -r line; do
      echo -e "${GREEN}[fe]${RESET} $line"
    done
) &
FE_PID=$!
PIDS+=($FE_PID)

sleep 2
if ! kill -0 $FE_PID 2>/dev/null; then
  die "Frontend exited immediately — check the [fe] log above for errors"
  exit 1
fi
ok "Frontend running  (PID $FE_PID)"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "  ${BOLD}Frontend${RESET}  →  ${GREEN}http://localhost:$FE_PORT${RESET}"
echo -e "  ${BOLD}Backend${RESET}   →  ${CYAN}http://localhost:$BE_PORT${RESET}"
echo -e "  ${BOLD}API docs${RESET}  →  ${CYAN}http://localhost:$BE_PORT/docs${RESET}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "  Press ${BOLD}Ctrl+C${RESET} to stop everything"
echo ""

# Wait for either process to die
wait -n "${PIDS[@]}" 2>/dev/null || true

# If we get here, one died unexpectedly
for pid in "${PIDS[@]}"; do
  if ! kill -0 "$pid" 2>/dev/null; then
    if [[ "$pid" == "$BE_PID" ]]; then
      die "Backend crashed — scroll up for [be] log output"
    elif [[ "$pid" == "$FE_PID" ]]; then
      die "Frontend crashed — scroll up for [fe] log output"
    fi
  fi
done

wait
