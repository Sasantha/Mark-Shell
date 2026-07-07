import nodemailer from 'nodemailer';
import type { IInquiry } from '@/models/Inquiry';

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
    if (transporter) return transporter;

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        return null;
    }

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    return transporter;
}

/** Best-effort email notification to the site owner. Never throws. */
export async function notifyEmail(inquiry: IInquiry): Promise<void> {
    const ownerEmail = process.env.OWNER_EMAIL;
    const client = getTransporter();

    if (!client || !ownerEmail) {
        console.warn('Email notification skipped: SMTP or OWNER_EMAIL not configured.');
        return;
    }

    const contextLine = inquiry.contextType === 'general'
        ? 'General inquiry'
        : `${inquiry.contextType === 'product' ? 'Product' : 'Category'}: ${inquiry.contextValue}`;

    try {
        await client.sendMail({
            from: process.env.SMTP_USER,
            to: ownerEmail,
            subject: `New inquiry from ${inquiry.name} (MarkShell website)`,
            text: [
                `Name: ${inquiry.name}`,
                ...(inquiry.company ? [`Company: ${inquiry.company}`] : []),
                `Contact (${inquiry.contactMethod}): ${inquiry.contactValue}`,
                `Regarding: ${contextLine}`,
                `Source: ${inquiry.source === 'popup' ? 'Quote popup' : 'Contact page'}`,
                '',
                'Message:',
                inquiry.message,
            ].join('\n'),
        });
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
}
