from fastapi import APIRouter, Depends, HTTPException

from app.database import get_supabase
from app.dependencies import get_current_admin
from app.schemas.portfolio import AnswerQuestionRequest

router = APIRouter(prefix="/api/admin/questions", tags=["questions"])


def _format_question(row: dict) -> dict:
    return {
        "id": str(row["id"]),
        "question": row["question"],
        "askedAt": row["asked_at"],
        "status": row["status"],
        "answer": row.get("answer"),
    }


@router.get("")
def list_questions(_admin=Depends(get_current_admin)):
    db = get_supabase()
    rows = db.table("unanswered_questions").select("*").order("asked_at", desc=True).execute().data
    return [_format_question(r) for r in rows]


@router.post("/{question_id}/answer")
def answer_question(question_id: int, body: AnswerQuestionRequest, _admin=Depends(get_current_admin)):
    if not body.answer.strip():
        raise HTTPException(400, "answer must be a non-empty string")

    db = get_supabase()
    result = (
        db.table("unanswered_questions")
        .update({"status": "answered", "answer": body.answer.strip()})
        .eq("id", question_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(404, "Question not found")

    entry = result.data[0]

    if body.addToFaq:
        max_order = db.table("faqs").select("sort_order").order("sort_order", desc=True).limit(1).execute().data
        next_order = (max_order[0]["sort_order"] + 1) if max_order else 0
        db.table("faqs").insert({
            "question": entry["question"],
            "answer": body.answer.strip(),
            "sort_order": next_order,
        }).execute()

    return _format_question(entry)


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

    return _format_question(result.data[0])
