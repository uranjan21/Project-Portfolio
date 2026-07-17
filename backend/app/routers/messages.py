from fastapi import APIRouter, Depends, HTTPException

from app.database import get_supabase
from app.dependencies import get_current_admin
from app.schemas.contact import FollowUpPayload, StatusUpdatePayload

router = APIRouter(prefix="/api/admin/messages", tags=["messages"])


def _format_message(r: dict) -> dict:
    return {
        "id": str(r["id"]),
        "name": r["name"],
        "email": r["email"],
        "phone": r.get("phone"),
        "interest": r.get("interest"),
        "budget": r.get("budget"),
        "message": r["message"],
        "sentAt": r["sent_at"],
        "read": r["status"] != "new",
        "status": r["status"],
        "clientId": r.get("client_id"),
    }


@router.get("")
def list_messages(_admin=Depends(get_current_admin)):
    db = get_supabase()
    rows = db.table("contact_messages").select("*").order("sent_at", desc=True).execute().data
    return [_format_message(r) for r in rows]


@router.post("/{message_id}/read")
def mark_read(message_id: int, _admin=Depends(get_current_admin)):
    db = get_supabase()
    result = (
        db.table("contact_messages")
        .update({"status": "read"})
        .eq("id", message_id)
        .eq("status", "new")
        .execute()
    )
    if not result.data:
        row = db.table("contact_messages").select("*").eq("id", message_id).execute().data
        if not row:
            raise HTTPException(404, "Message not found")
        return _format_message(row[0])
    return _format_message(result.data[0])


@router.put("/{message_id}/status")
def update_status(message_id: int, body: StatusUpdatePayload, _admin=Depends(get_current_admin)):
    valid = {"new", "read", "replied", "converted", "archived"}
    if body.status not in valid:
        raise HTTPException(400, f"Invalid status. Must be one of: {', '.join(valid)}")
    db = get_supabase()
    result = (
        db.table("contact_messages")
        .update({"status": body.status})
        .eq("id", message_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(404, "Message not found")
    return _format_message(result.data[0])


@router.post("/{message_id}/follow-up")
def add_follow_up(message_id: int, body: FollowUpPayload, _admin=Depends(get_current_admin)):
    if not body.note.strip():
        raise HTTPException(400, "note must be non-empty")
    db = get_supabase()
    msg = db.table("contact_messages").select("id").eq("id", message_id).execute().data
    if not msg:
        raise HTTPException(404, "Message not found")
    result = (
        db.table("contact_follow_ups")
        .insert({"message_id": message_id, "note": body.note.strip()})
        .execute()
    )
    return result.data[0]


@router.get("/{message_id}/follow-ups")
def list_follow_ups(message_id: int, _admin=Depends(get_current_admin)):
    db = get_supabase()
    rows = (
        db.table("contact_follow_ups")
        .select("*")
        .eq("message_id", message_id)
        .order("created_at", desc=True)
        .execute()
        .data
    )
    return rows


@router.post("/{message_id}/convert")
def convert_to_client(message_id: int, _admin=Depends(get_current_admin)):
    db = get_supabase()
    msg = db.table("contact_messages").select("*").eq("id", message_id).execute().data
    if not msg:
        raise HTTPException(404, "Message not found")
    m = msg[0]

    client = db.table("clients").insert({
        "name": m["name"],
        "email": m["email"],
        "phone": m.get("phone"),
        "source": "website",
        "notes": f"Converted from contact message. Interest: {m.get('interest', 'N/A')}. Budget: {m.get('budget', 'N/A')}.",
    }).execute()

    client_id = client.data[0]["id"]
    db.table("contact_messages").update({
        "status": "converted",
        "client_id": client_id,
    }).eq("id", message_id).execute()

    return client.data[0]
