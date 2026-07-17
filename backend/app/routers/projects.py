from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.database import get_supabase
from app.dependencies import get_current_admin
from app.schemas.contact import ProjectCreate, ProjectUpdate

router = APIRouter(prefix="/api/admin/projects", tags=["projects"])


@router.get("")
def list_projects(_admin=Depends(get_current_admin)):
    db = get_supabase()
    return db.table("projects").select("*").order("sort_order").execute().data


@router.post("")
def create_project(body: ProjectCreate, _admin=Depends(get_current_admin)):
    db = get_supabase()
    data = body.model_dump(exclude_none=True)
    max_order = (
        db.table("projects")
        .select("sort_order")
        .order("sort_order", desc=True)
        .limit(1)
        .execute()
        .data
    )
    data["sort_order"] = (max_order[0]["sort_order"] + 1) if max_order else 0
    result = db.table("projects").insert(data).execute()
    return result.data[0]


@router.put("/{project_id}")
def update_project(project_id: int, body: ProjectUpdate, _admin=Depends(get_current_admin)):
    db = get_supabase()
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "No fields to update")
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = db.table("projects").update(updates).eq("id", project_id).execute()
    if not result.data:
        raise HTTPException(404, "Project not found")
    return result.data[0]


@router.delete("/{project_id}")
def delete_project(project_id: int, _admin=Depends(get_current_admin)):
    db = get_supabase()
    result = db.table("projects").delete().eq("id", project_id).execute()
    if not result.data:
        raise HTTPException(404, "Project not found")
    return {"ok": True}
