import nodemailer from 'nodemailer';

// Emails the owner about site events (unanswered chat questions, contact form
// submissions). Silently no-ops unless SMTP is configured — everything is
// always stored in the admin inboxes regardless, so email is a convenience,
// not the record.
export async function notifyOwner(subject: string, text: string): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;
  if (!SMTP_HOST || !NOTIFY_EMAIL) return;

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT) === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    await transport.sendMail({
      from: SMTP_USER ?? NOTIFY_EMAIL,
      to: NOTIFY_EMAIL,
      subject,
      text,
    });
  } catch (err) {
    console.error('[notify] failed to send email:', err);
  }
}
