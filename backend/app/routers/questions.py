from fastapi import APIRouter, Depends, HTTPException

from app.database import get_supabase
from app.dependencies import get_current_admin

router = APIRouter(prefix="/api/admin/questions", tags=["questions"])


@router.get("")
def list_questions(_admin=Depends(get_current_admin)):
    db = get_supabase()
    rows = db.table("unanswered_questions").select("*").order("asked_at", desc=True).execute().data
    return [
        {
            "id": str(r["id"]),
            "question": r["question"],
            "askedAt": r["asked_at"],
            "status": r["status"],
            "answer": r.get("answer"),
        }
        for r in rows
    ]


@router.post("/{question_id}/answer")
def answer_question(question_id: int, body: dict, _admin=Depends(get_current_admin)):
    answer = body.get("answer", "").strip()
    add_to_faq = body.get("addToFaq", False)

    if not answer:
        raise HTTPException(400, "answer must be a non-empty string")

    db = get_supabase()
    result = (
        db.table("unanswered_questions")
        .update({"status": "answered", "answer": answer})
        .eq("id", question_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(404, "Question not found")

    entry = result.data[0]

    if add_to_faq:
        max_order = db.table("faqs").select("sort_order").order("sort_order", desc=True).limit(1).execute().data
        next_order = (max_order[0]["sort_order"] + 1) if max_order else 0
        db.table("faqs").insert({
            "question": entry["question"],
            "answer": answer,
            "sort_order": next_order,
        }).execute()

    return {
        "id": str(entry["id"]),
        "question": entry["question"],
        "askedAt": entry["asked_at"],
        "status": entry["status"],
        "answer": entry.get("answer"),
    }


@router.post("/{question_id}/dismiss")
def dismiss_question(question_id: int, _admin=Depends(get_current_admin)):
    db = get_supabase()
    result = (
        db.table("unanswered_questions")
        .update({"status": "dismissed"})
        .eq("id", question_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(404, "Question not found")

    entry = result.data[0]
    return {
        "id": str(entry["id"]),
        "question": entry["question"],
        "askedAt": entry["asked_at"],
        "status": entry["status"],
        "answer": entry.get("answer"),
    }
