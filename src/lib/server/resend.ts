export type Mail = {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  /** Stops a retried request from sending twice. */
  idempotencyKey: string;
};

export type SendResult = { ok: true; id?: string } | { ok: false; status: number };

/** Sends through Resend. Only a 2xx response counts as delivered. */
export async function sendMail(
  mail: Mail,
  apiKey: string,
  base = "https://api.resend.com",
  fetchImpl: typeof fetch = fetch,
): Promise<SendResult> {
  try {
    const res = await fetchImpl(`${base}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": mail.idempotencyKey,
      },
      body: JSON.stringify({
        from: mail.from,
        to: [mail.to],
        reply_to: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
      }),
    });
    if (!res.ok) return { ok: false, status: res.status };
    const json = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: json.id };
  } catch {
    return { ok: false, status: 0 };
  }
}
