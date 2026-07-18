from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.schemas.auth import LoginRequest, LoginResponse
from app.services.auth import issue_token, verify_password

router = APIRouter(prefix="/api/admin", tags=["auth"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/login", response_model=LoginResponse)
@limiter.limit("5/minute")
def login(request: Request, body: LoginRequest):
    if verify_password(body.password):
        return LoginResponse(token=issue_token())
    raise HTTPException(401, "Invalid password")
