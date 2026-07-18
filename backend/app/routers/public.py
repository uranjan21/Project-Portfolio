from fastapi import APIRouter, HTTPException, Request

from app.database import get_supabase
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.contact import ContactPayload
from app.services.chat import answer_question
from app.services.notify import notify_owner
from app.services.portfolio import get_portfolio

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/portfolio")
def portfolio():
    return get_portfolio()


@router.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest, request: Request):
    msg = body.message.strip()
    if not msg or len(msg) > 1000:
        raise HTTPException(400, "message must be a non-empty string (max 1000 chars)")
    result = await answer_question(msg)
    return result


@router.post("/contact")
async def contact(body: ContactPayload):
    name = body.name.strip()[:120]
    email = body.email.strip()[:200]
    message = body.message.strip()[:4000]

    if not name or not message:
        raise HTTPException(400, "name and message are required")

    db = get_supabase()
    entry = {
        "name": name,
        "email": email,
        "phone": (body.phone or "").strip()[:40] or None,
        "interest": (body.interest or "").strip()[:120] or None,
        "budget": (body.budget or "").strip()[:60] or None,
        "message": message,
    }
    db.table("contact_messages").insert(entry).execute()

    phone_line = f"\nPhone: {entry['phone']}" if entry["phone"] else ""
    interest_line = f"\nInterested in: {entry['interest']}" if entry["interest"] else ""
    budget_line = f"\nBudget: {entry['budget']}" if entry["budget"] else ""
    await notify_owner(
        f"Portfolio contact: {name}",
        f"New message from your portfolio contact form.\n\n"
        f"From: {name} <{email}>{phone_line}{interest_line}{budget_line}\n\n{message}",
    )
    return {"ok": True}
