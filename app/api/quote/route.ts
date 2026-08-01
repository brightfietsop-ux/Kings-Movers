import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const quoteSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.email().max(200),
  movingDate: z.iso.date(),
  serviceType: z.string().trim().min(2).max(100),
  pickupSize: z.string().trim().min(2).max(100),
  pickupAddress: z.string().trim().min(5).max(300),
  dropoffSize: z.string().trim().min(2).max(100),
  dropoffAddress: z.string().trim().min(5).max(300),
  details: z.string().trim().max(3000).optional().default(""),
  company: z.string().max(0).optional().default(""),
});

type Quote = z.infer<typeof quoteSchema>;

const requests = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = requests.get(ip);

  if (!current || current.resetAt <= now) {
    requests.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS;
}

function getQuoteText(quote: Quote) {
  return [
    `Name: ${quote.name}`,
    `Phone: ${quote.phone}`,
    `Email: ${quote.email}`,
    `Preferred moving date: ${quote.movingDate}`,
    `Service: ${quote.serviceType}`,
    `Pickup: ${quote.pickupAddress} (${quote.pickupSize})`,
    `Drop-off: ${quote.dropoffAddress} (${quote.dropoffSize})`,
    `Additional details: ${quote.details || "None provided"}`,
  ].join("\n");
}

function getQuoteHtml(quote: Quote) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#10213d">
      <h1 style="color:#0a2e73">New Kings Movers quote request</h1>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:680px">
        <tr><td><strong>Name</strong></td><td>${quote.name}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${quote.phone}</td></tr>
        <tr><td><strong>Email</strong></td><td>${quote.email}</td></tr>
        <tr><td><strong>Moving date</strong></td><td>${quote.movingDate}</td></tr>
        <tr><td><strong>Service</strong></td><td>${quote.serviceType}</td></tr>
        <tr><td><strong>Pickup</strong></td><td>${quote.pickupAddress}<br>${quote.pickupSize}</td></tr>
        <tr><td><strong>Drop-off</strong></td><td>${quote.dropoffAddress}<br>${quote.dropoffSize}</td></tr>
        <tr><td><strong>Details</strong></td><td>${quote.details || "None provided"}</td></tr>
      </table>
    </div>
  `;
}

async function sendQuoteEmail({
  to,
  replyTo,
  subject,
  text,
  html,
}: {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailAppPassword) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    await transporter.sendMail({
      from: `Kings Movers Website <${gmailUser}>`,
      to,
      replyTo,
      subject,
      text,
      html,
    });
    return;
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.QUOTE_FROM_EMAIL;

  if (!resendApiKey || !resendFromEmail) {
    throw new Error("Email delivery is not configured.");
  }

  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from: resendFromEmail,
    to: [to],
    replyTo,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function POST(request: NextRequest) {
  const isJsonRequest =
    request.headers.get("content-type")?.includes("application/json") ?? false;

  function quoteRedirect(status: "sent" | "error") {
    const url = new URL(request.url);
    url.pathname = "/";
    url.search = `?quote=${status}`;
    url.hash = "quote";
    return NextResponse.redirect(url, { status: 303 });
  }

  function quoteError(message: string, status: number) {
    if (!isJsonRequest) {
      return quoteRedirect("error");
    }

    return NextResponse.json({ message }, { status });
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return quoteError(
      "Too many requests. Please wait a few minutes and try again.",
      429,
    );
  }

  let body: unknown;

  try {
    body = isJsonRequest
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return quoteError("The form data could not be read.", 400);
  }

  const parsed = quoteSchema.safeParse(body);

  if (!parsed.success) {
    return quoteError(
      "Please check the form and complete all required fields.",
      400,
    );
  }

  if (parsed.data.company) {
    return isJsonRequest
      ? NextResponse.json({ success: true })
      : quoteRedirect("sent");
  }

  const toEmail =
    process.env.QUOTE_TO_EMAIL || "movefurniturewithkings@gmail.com";

  const quote = Object.fromEntries(
    Object.entries(parsed.data).map(([key, value]) => [
      key,
      typeof value === "string" ? escapeHtml(value) : value,
    ]),
  ) as Quote;

  try {
    await sendQuoteEmail({
      to: toEmail,
      replyTo: parsed.data.email,
      subject: `New quote request from ${parsed.data.name}`,
      text: getQuoteText(parsed.data),
      html: getQuoteHtml(quote),
    });
  } catch (error) {
    console.error("Unable to send quote email:", error);
    return quoteError(
      "Your request could not be sent. Please call (202) 308-9917.",
      502,
    );
  }

  return isJsonRequest
    ? NextResponse.json({ success: true })
    : quoteRedirect("sent");
}
