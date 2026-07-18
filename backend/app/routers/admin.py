from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_current_admin
from app.schemas.portfolio import SECTION_KEYS, SectionUpdateRequest
from app.services.portfolio import update_section

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.put("/portfolio")
def update_portfolio(body: SectionUpdateRequest, _admin=Depends(get_current_admin)):
    if body.section not in SECTION_KEYS:
        raise HTTPException(400, f'Unknown section "{body.section}"')

    if body.section == "profile":
        if not isinstance(body.value, dict):
            raise HTTPException(400, f'Invalid value shape for section "{body.section}"')
    else:
        if not isinstance(body.value, list):
            raise HTTPException(400, f'Invalid value shape for section "{body.section}"')

    return update_section(body.section, body.value)
