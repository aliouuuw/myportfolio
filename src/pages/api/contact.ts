import type { APIRoute } from "astro";
import { Resend } from "resend";
import { z } from "zod";

// Server-rendered endpoint (not prerendered) so it runs on Vercel.
export const prerender = false;

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
  website: z.string().optional(), // honeypot
});

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    const errorMessages = result.error.issues.map((i) => i.message).join("; ");
    return Response.json({ error: errorMessages }, { status: 400 });
  }

  const { name, email, message, website } = result.data;

  // Honeypot: silently accept without revealing the trap.
  if (website?.trim()) {
    return Response.json({ ok: true });
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY is not set — skipping email send.");
    return Response.json({ ok: true });
  }

  const toEmail = import.meta.env.CONTACT_EMAIL ?? "wadealiou00@gmail.com";
  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: toEmail,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
  } catch (err) {
    console.error("[contact] Resend error:", err);
    return Response.json({ error: "Failed to send message." }, { status: 500 });
  }

  return Response.json({ ok: true });
};
