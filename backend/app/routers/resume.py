from fastapi import APIRouter
from fastapi.responses import Response

from app.services.resume import generate_resume_pdf
from app.services.resume_docx import generate_resume_docx

router = APIRouter(prefix="/api", tags=["resume"])


@router.get("/resume.pdf")
def resume_pdf():
    pdf_bytes = generate_resume_pdf()
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": 'inline; filename="Utsav_Ranjan_Resume.pdf"'},
    )


@router.get("/resume.docx")
def resume_docx():
    docx_bytes = generate_resume_docx()
    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": 'attachment; filename="Utsav_Ranjan_Resume.docx"'},
    )
