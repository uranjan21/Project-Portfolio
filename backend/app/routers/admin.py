from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_current_admin
from app.schemas.portfolio import SECTION_KEYS
from app.services.portfolio import update_section

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.put("/portfolio")
def update_portfolio(body: dict, _admin=Depends(get_current_admin)):
    section = body.get("section")
    value = body.get("value")

    if section not in SECTION_KEYS:
        raise HTTPException(400, f'Unknown section "{section}"')

    if section == "profile":
        if not isinstance(value, dict):
            raise HTTPException(400, f'Invalid value shape for section "{section}"')
    else:
        if not isinstance(value, list):
            raise HTTPException(400, f'Invalid value shape for section "{section}"')

    return update_section(section, value)
