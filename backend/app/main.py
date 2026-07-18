from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware

from app.config import settings
from app.routers import admin, auth, blogs, clients, messages, projects, public, questions, resume

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="utsavranjan.info API", version="1.0.0")

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Return errors as {"error": "..."} to match the frontend/API contract."""
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    first = exc.errors()[0] if exc.errors() else {}
    field = ".".join(str(p) for p in first.get("loc", []) if p != "body")
    msg = first.get("msg", "Invalid request")
    detail = f"{field}: {msg}" if field else msg
    return JSONResponse(status_code=422, content={"error": detail})

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router)
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(questions.router)
app.include_router(messages.router)
app.include_router(resume.router)
app.include_router(clients.router)
app.include_router(projects.router)
app.include_router(blogs.router)


@app.get("/")
def root():
    return {"status": "ok", "app": "utsavranjan.info"}
