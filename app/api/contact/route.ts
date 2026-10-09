import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const contactRateLimit = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'client-anon';
    const now = Date.now();
    const entry = contactRateLimit.get(ip);

    if (entry && now < entry.resetAt) {
      if (entry.count >= 5) {
        return NextResponse.json(
          { error: 'Too many messages sent. Please wait 15 minutes before sending another inquiry.' },
          { status: 429 }
        );
      }
      entry.count++;
    } else {
      contactRateLimit.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    }

    const body = await req.json();
    const { name, email, subject, category, message, honeypot } = body;

    // Honeypot check for spam bots
    if (honeypot && typeof honeypot === 'string' && honeypot.trim().length > 0) {
      // Silently discard spam bot submission
      return NextResponse.json({ success: true, message: 'Your message has been received.' });
    }

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your name (minimum 2 characters).' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      return NextResponse.json({ error: 'Please provide a clear subject line.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json({ error: 'Please provide a detailed message (minimum 10 characters).' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || 'contact@colorpixo.com';

    if (!resendApiKey) {
      return NextResponse.json(
        {
          error:
            'Email delivery service is currently not configured on this server. Please send your message directly to contact@colorpixo.com.',
        },
        { status: 503 }
      );
    }

    const resend = new Resend(resendApiKey);

    const fromAddress =
      process.env.RESEND_FROM_EMAIL || 'ColorPixo Contact <contact@colorpixo.com>';

    const emailResult = await resend.emails.send({
      from: fromAddress,
      to: toEmail,
      replyTo: email.trim(),
      subject: `[ColorPixo Contact] [${category || 'General'}] ${subject.trim()}`,
      text: `New contact inquiry received from ColorPixo.Com:\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nCategory: ${category || 'General'}\nSubject: ${subject.trim()}\n\nMessage:\n${message.trim()}`,
    });

    if (emailResult.error) {
      console.error('[Resend Error]', emailResult.error);
      return NextResponse.json(
        {
          error:
            'Unable to dispatch email through the delivery provider. Please send your inquiry directly to contact@colorpixo.com.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        'Your message has been sent successfully to our inbox at contact@colorpixo.com. We typically respond within 1–2 business days.',
      contactEmail: 'contact@colorpixo.com',
    });
  } catch (err: unknown) {
    console.error('[Contact API Unexpected Error]', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while sending your message. Please email contact@colorpixo.com directly.' },
      { status: 500 }
    );
  }
}
