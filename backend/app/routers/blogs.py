from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.database import get_supabase
from app.dependencies import get_current_admin
from app.schemas.contact import BlogCreate, BlogUpdate

router = APIRouter(prefix="/api/admin/blogs", tags=["blogs"])


@router.get("")
def list_blogs(_admin=Depends(get_current_admin)):
    db = get_supabase()
    return db.table("blog_posts").select("*").order("created_at", desc=True).execute().data


@router.post("")
def create_blog(body: BlogCreate, _admin=Depends(get_current_admin)):
    db = get_supabase()
    data = body.model_dump(exclude_none=True)
    if data.get("is_published") and not data.get("published_at"):
        data["published_at"] = datetime.now(timezone.utc).isoformat()
    result = db.table("blog_posts").insert(data).execute()
    return result.data[0]


@router.put("/{blog_id}")
def update_blog(blog_id: int, body: BlogUpdate, _admin=Depends(get_current_admin)):
    db = get_supabase()
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "No fields to update")
    if updates.get("is_published"):
        existing = db.table("blog_posts").select("published_at").eq("id", blog_id).execute().data
        if existing and not existing[0].get("published_at"):
            updates["published_at"] = datetime.now(timezone.utc).isoformat()
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = db.table("blog_posts").update(updates).eq("id", blog_id).execute()
    if not result.data:
        raise HTTPException(404, "Blog post not found")
    return result.data[0]


@router.delete("/{blog_id}")
def delete_blog(blog_id: int, _admin=Depends(get_current_admin)):
    db = get_supabase()
    result = db.table("blog_posts").delete().eq("id", blog_id).execute()
    if not result.data:
        raise HTTPException(404, "Blog post not found")
    return {"ok": True}
