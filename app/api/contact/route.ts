import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { dbConnect } from '@/lib/dbConnect';
import ContactMessage from '@/lib/models/ContactMessage';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Save to Database
    try {
      await dbConnect();
      await ContactMessage.create({ name, email, subject: subject || 'General Inquiry', message });
    } catch (dbErr) {
      console.error('Failed to save contact message to DB:', dbErr);
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    if (!toEmail) {
      return NextResponse.json({ error: 'Contact email not configured.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      html: `
        <div style="font-family: 'Courier New', monospace; background: #050508; color: #fff; padding: 32px; border-radius: 12px; border: 1px solid rgba(0,212,255,0.2);">
          <h2 style="color: #00d4ff; margin-bottom: 16px;">New Portfolio Message</h2>
          <p style="color: rgba(255,255,255,0.6); margin-bottom: 8px;"><strong style="color:#fff;">From:</strong> ${name}</p>
          <p style="color: rgba(255,255,255,0.6); margin-bottom: 8px;"><strong style="color:#fff;">Email:</strong> ${email}</p>
          <hr style="border: 1px solid rgba(0,212,255,0.1); margin: 16px 0;" />
          <p style="color: rgba(255,255,255,0.8); line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact email error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
