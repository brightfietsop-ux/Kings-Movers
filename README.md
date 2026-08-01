# Kings Movers Website

A responsive redesign for **Kings Movers and Junk Removal Services** in Charlotte, North Carolina. It is intended to replace the business's current website with a faster, more interactive experience.

## Business contact

- Phone and text: `(202) 308-9917`
- Email: `movefurniturewithkings@gmail.com`
- Location: Charlotte, NC 28269

## What the website includes

- Modern mobile-first homepage
- Local moving, long-distance moving, loading/unloading, and junk removal services
- Click-to-call and click-to-text actions
- Quote form with moving date, pickup/drop-off locations, both home sizes, and additional details
- Server-side email delivery without redirecting visitors to Gmail
- Free manual review cards, with optional Google Places review support
- An official Google review-link button
- A gallery that automatically reads the company's real images from `public/gallery`
- Basic form validation, a spam honeypot, and rate limiting

## Tech stack

- Next.js 16
- React 19
- React-Bootstrap and Bootstrap Icons
- Nodemailer with Gmail SMTP for quote emails
- Google Places API (New) for optional live reviews
- Zod for server-side form validation

## Run locally

Requirements: Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configure quote emails

The quote form sends emails directly from the website. It uses Gmail SMTP first, which lets the site send to the mover's Gmail without opening the visitor's email app.

1. Use a Gmail account that has 2-Step Verification enabled.
2. In the Google Account security settings, create an App Password for this website.
3. Copy `.env.example` to `.env.local`.
4. Set:
   - `QUOTE_TO_EMAIL`
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`

Quote requests are sent to `QUOTE_TO_EMAIL`, with the customer's email set as the reply-to address.

For Kings Movers, use:

```env
QUOTE_TO_EMAIL=movefurniturewithkings@gmail.com
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-google-app-password
```

After filling in `.env.local`, start the dev server and run a test email:

```bash
npm run dev
npm run test:quote-email
```

Never commit `.env.local` or API keys.

Resend is still supported as an optional fallback, but it requires a verified sending domain before it can send to the mover's Gmail.

## Configure reviews

The site includes free manual review cards in `components/Reviews.tsx`, so the reviews section works without a paid widget service. Replace the placeholder review text with real customer quotes when they are available.

## Optional Google reviews

1. Enable **Places API (New)** in Google Cloud.
2. Find the Kings Movers Google Place ID.
3. Set `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` in `.env.local`.
4. In the Google Business Profile, choose **Ask for reviews**, copy the official review link, and set it as `NEXT_PUBLIC_GOOGLE_REVIEW_URL`.

Google does not allow a custom website form to publish a review directly to Google. The website therefore sends customers to Google's official review screen while displaying current Google reviews through the Places API.

## Add real company photos

Add `.jpg`, `.jpeg`, `.png`, `.webp`, or `.avif` images to:

```text
public/gallery/
```

The build automatically discovers and displays them. Use descriptive filenames because the filename is converted into the image's accessible description.

## Before launch

- Confirm that Charlotte, NC 28269 and the stated service area are accurate.
- Add the original high-resolution logo.
- Add real company project photos.
- Add the Google Place ID and official review link.
- Add Gmail SMTP credentials and test a real quote email.
- Replace the placeholder metadata URL in `app/layout.tsx` with the final domain.
- Add a privacy policy before collecting customer details in production.
