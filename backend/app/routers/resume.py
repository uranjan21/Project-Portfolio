from fastapi import APIRouter
from fastapi.responses import Response

from app.services.resume import generate_resume_pdf

router = APIRouter(prefix="/api", tags=["resume"])


@router.get("/resume.pdf")
def resume_pdf():
    pdf_bytes = generate_resume_pdf()
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": 'inline; filename="utsav-ranjan-resume.pdf"'},
    )
