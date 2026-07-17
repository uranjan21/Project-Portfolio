from fastapi import APIRouter, Depends, HTTPException

from app.database import get_supabase
from app.dependencies import get_current_admin
from app.schemas.contact import ClientCreate, ClientUpdate

router = APIRouter(prefix="/api/admin/clients", tags=["clients"])


@router.get("")
def list_clients(_admin=Depends(get_current_admin)):
    db = get_supabase()
    return db.table("clients").select("*").order("created_at", desc=True).execute().data


@router.post("")
def create_client(body: ClientCreate, _admin=Depends(get_current_admin)):
    db = get_supabase()
    result = db.table("clients").insert(body.model_dump(exclude_none=True)).execute()
    return result.data[0]


@router.put("/{client_id}")
def update_client(client_id: int, body: ClientUpdate, _admin=Depends(get_current_admin)):
    db = get_supabase()
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "No fields to update")
    result = db.table("clients").update(updates).eq("id", client_id).execute()
    if not result.data:
        raise HTTPException(404, "Client not found")
    return result.data[0]


@router.delete("/{client_id}")
def delete_client(client_id: int, _admin=Depends(get_current_admin)):
    db = get_supabase()
    result = db.table("clients").delete().eq("id", client_id).execute()
    if not result.data:
        raise HTTPException(404, "Client not found")
    return {"ok": True}
