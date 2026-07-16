import nodemailer from 'nodemailer';

// Emails the owner when the chat assistant can't answer a visitor's question.
// Silently no-ops unless SMTP is configured — the question is always stored in
// the admin inbox regardless, so email is a convenience, not the record.
export async function notifyOwner(question: string): Promise<void> {
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
      subject: 'Portfolio assistant: unanswered visitor question',
      text: `A visitor asked a question the assistant could not answer:\n\n"${question}"\n\nAnswer it from the admin inbox on your portfolio to add it to the FAQ.`,
    });
  } catch (err) {
    console.error('[notify] failed to send email:', err);
  }
}
