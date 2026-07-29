import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

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

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "The form data could not be read." },
      { status: 400 },
    );
  }

  const parsed = quoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the form and complete all required fields." },
      { status: 400 },
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ success: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail =
    process.env.QUOTE_TO_EMAIL || "movefurniturewithkings@gmail.com";
  const fromEmail = process.env.QUOTE_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return NextResponse.json(
      {
        message:
          "Online quotes are not connected yet. Please call (202) 308-9917.",
      },
      { status: 503 },
    );
  }

  const quote = Object.fromEntries(
    Object.entries(parsed.data).map(([key, value]) => [
      key,
      typeof value === "string" ? escapeHtml(value) : value,
    ]),
  ) as typeof parsed.data;

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: parsed.data.email,
    subject: `New quote request from ${parsed.data.name}`,
    text: [
      `Name: ${parsed.data.name}`,
      `Phone: ${parsed.data.phone}`,
      `Email: ${parsed.data.email}`,
      `Preferred moving date: ${parsed.data.movingDate}`,
      `Service: ${parsed.data.serviceType}`,
      `Pickup: ${parsed.data.pickupAddress} (${parsed.data.pickupSize})`,
      `Drop-off: ${parsed.data.dropoffAddress} (${parsed.data.dropoffSize})`,
      `Additional details: ${parsed.data.details || "None provided"}`,
    ].join("\n"),
    html: `
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
    `,
  });

  if (error) {
    console.error("Unable to send quote email:", error);
    return NextResponse.json(
      {
        message:
          "Your request could not be sent. Please call (202) 308-9917.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
