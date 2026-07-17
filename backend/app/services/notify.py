from __future__ import annotations

import logging
from email.message import EmailMessage

import aiosmtplib

from app.config import settings

logger = logging.getLogger(__name__)


async def notify_owner(subject: str, text: str) -> None:
    if not settings.smtp_host:
        logger.info("SMTP not configured — skipping notification: %s", subject)
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.smtp_user or settings.notify_to
    msg["To"] = settings.notify_to
    msg.set_content(text)

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user or None,
            password=settings.smtp_pass or None,
            start_tls=True,
        )
    except Exception:
        logger.exception("Failed to send notification email")
