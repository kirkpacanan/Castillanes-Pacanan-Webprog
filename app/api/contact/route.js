import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, surname, email, topic, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const topicLabels = {
      general: "General question",
      feedback: "Product feedback",
      support: "Support",
      collaboration: "Collaboration",
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Feelvie Contact" <${process.env.GMAIL_USER}>`,
      to: "pacanan.kirk@gmail.com",
      replyTo: email,
      subject: `[Feelvie Contact] ${topicLabels[topic] ?? topic} — ${name}${surname ? " " + surname : ""}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d0d; color: #f1f5f9; border-radius: 16px; overflow: hidden;">
          <div style="background: #350a0a; padding: 28px 32px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #fff;">New message from Feelvie</h1>
          </div>
          <div style="padding: 28px 32px; display: flex; flex-direction: column; gap: 12px;">
            <table style="width:100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; width: 100px; vertical-align: top;">Name</td>
                <td style="padding: 8px 0; color: #f1f5f9; font-size: 15px;">${name}${surname ? " " + surname : ""}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; vertical-align: top;">Email</td>
                <td style="padding: 8px 0; color: #f1f5f9; font-size: 15px;"><a href="mailto:${email}" style="color: #e57373;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; vertical-align: top;">Topic</td>
                <td style="padding: 8px 0; color: #f1f5f9; font-size: 15px;">${topicLabels[topic] ?? topic}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #1e1e1e; margin: 8px 0;" />
            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 6px;">Message</p>
            <p style="color: #f1f5f9; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <div style="padding: 16px 32px 24px; color: #64748b; font-size: 12px;">
            Sent via the Feelvie contact form. Reply directly to respond to ${name}.
          </div>
        </div>
      `,
      text: `
New message from Feelvie Contact Form
--------------------------------------
Name:    ${name}${surname ? " " + surname : ""}
Email:   ${email}
Topic:   ${topicLabels[topic] ?? topic}

Message:
${message}
      `.trim(),
    });

    return NextResponse.json({ message: "Message sent successfully." });
  } catch (err) {
    console.error("[contact/route] Email error:", err);
    return NextResponse.json(
      { message: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
