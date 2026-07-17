import hmac
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.config import settings


def verify_password(password: str) -> bool:
    return hmac.compare_digest(password.encode(), settings.admin_password.encode())


def issue_token() -> str:
    payload = {
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, settings.session_secret, algorithm="HS256")


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.session_secret, algorithms=["HS256"])
    except JWTError:
        return None
