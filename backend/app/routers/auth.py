from fastapi import APIRouter, HTTPException

from app.schemas.auth import LoginRequest, LoginResponse
from app.services.auth import issue_token, verify_password

router = APIRouter(prefix="/api/admin", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest):
    if verify_password(body.password):
        return LoginResponse(token=issue_token())
    raise HTTPException(401, "Invalid password")
