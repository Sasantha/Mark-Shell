import type { IInquiry } from '@/models/Inquiry';

// MarkShell brand palette (see globals.css --primary and Footer.tsx), reused
// here so the email looks like it came from the same site.
const COLORS = {
    navy: '#0f172a',      // header bar / footer (matches Footer.tsx, AdminSidebar)
    green: '#16a34a',     // brand primary (globals.css --primary, Button default)
    greenDark: '#15803d', // hover shade, used for the button's border
    greenTint: '#edfdf3', // light green card background (globals.css --secondary)
    yellow: '#facc15',    // accent bar
    textDark: '#111827',
    textMuted: '#6b7280',
    border: '#e5e7eb',
};

function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

/** Small uppercase label + value pair, styled like the site's spec sheets (e.g. product detail page). */
function field(label: string, value: string): string {
    return `
    <tr>
        <td style="padding:0 0 14px;">
            <div style="font-size:11px;font-weight:700;color:${COLORS.textMuted};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;">${label}</div>
            <div style="font-size:15px;font-weight:600;color:${COLORS.textDark};">${value}</div>
        </td>
    </tr>`;
}

/**
 * Renders the inquiry notification as an HTML email matching the site's look
 * (see COLORS above). Table-based layout with inline styles, for consistent
 * rendering across email clients including older ones (e.g. Outlook desktop).
 */
export function renderInquiryEmailHtml(inquiry: IInquiry): string {
    const name = escapeHtml(inquiry.name);
    const company = inquiry.company ? escapeHtml(inquiry.company) : null;
    const contactValue = escapeHtml(inquiry.contactValue);
    const message = escapeHtml(inquiry.message).replace(/\n/g, '<br>');

    const contextLine = inquiry.contextType === 'general'
        ? 'General inquiry'
        : `${inquiry.contextType === 'product' ? 'Product' : 'Category'}: ${escapeHtml(inquiry.contextValue || '')}`;

    const sourceLabel = inquiry.source === 'popup' ? 'Quote popup' : 'Contact page';

    // Tappable reply action, matching how the site treats email vs. phone contact elsewhere.
    const replyHref = inquiry.contactMethod === 'email' ? `mailto:${contactValue}` : `tel:${contactValue.replace(/[^\d+]/g, '')}`;
    const replyLabel = inquiry.contactMethod === 'email' ? 'Reply by Email' : 'Call Now';

    const receivedAt = new Date(inquiry.createdAt ?? Date.now()).toLocaleString('en-GB', {
        dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Colombo',
    });

    // Optional deep link into the admin panel; omitted entirely if SITE_URL isn't configured.
    const siteUrl = process.env.SITE_URL?.replace(/\/$/, '');
    const adminButton = siteUrl ? `
    <tr>
        <td style="padding:28px 32px 4px;text-align:center;">
            <a href="${siteUrl}/admin/inquiries" style="display:inline-block;background:${COLORS.green};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:999px;">
                Open in Admin Panel &rarr;
            </a>
        </td>
    </tr>` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>New MarkShell Inquiry</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${COLORS.border};">

    <!-- Header -->
    <tr>
        <td style="background:${COLORS.navy};padding:22px 32px;">
            <span style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">MarkShell</span>
            <span style="float:right;font-size:11px;font-weight:700;color:${COLORS.yellow};text-transform:uppercase;letter-spacing:0.06em;line-height:24px;">New Inquiry</span>
        </td>
    </tr>

    <!-- Accent bar -->
    <tr><td style="background:${COLORS.yellow};height:4px;line-height:4px;font-size:0;">&nbsp;</td></tr>

    <!-- Name + reply action -->
    <tr>
        <td style="padding:28px 32px 4px;">
            <div style="font-size:22px;font-weight:800;color:${COLORS.textDark};">${name}</div>
            ${company ? `<div style="font-size:14px;color:${COLORS.textMuted};margin-top:2px;">${company}</div>` : ''}
        </td>
    </tr>
    <tr>
        <td style="padding:14px 32px 24px;">
            <a href="${replyHref}" style="display:inline-block;background:${COLORS.green};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:10px 22px;border-radius:999px;">
                ${replyLabel}: ${contactValue}
            </a>
        </td>
    </tr>

    <!-- Details -->
    <tr>
        <td style="padding:0 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${COLORS.border};padding-top:20px;">
                ${field('Regarding', contextLine)}
                ${field('Submitted via', sourceLabel)}
                ${field('Received', receivedAt + ' (Sri Lanka time)')}
            </table>
        </td>
    </tr>

    <!-- Message -->
    <tr>
        <td style="padding:4px 32px 8px;">
            <div style="font-size:11px;font-weight:700;color:${COLORS.textMuted};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Message</div>
            <div style="background:${COLORS.greenTint};border-radius:12px;padding:16px 18px;font-size:14px;line-height:1.6;color:${COLORS.textDark};">
                ${message}
            </div>
        </td>
    </tr>

    ${adminButton}

    <!-- Footer -->
    <tr>
        <td style="padding:28px 32px 24px;text-align:center;">
            <div style="font-size:12px;color:${COLORS.textMuted};">
                Automated notification from the MarkShell website inquiry form.
            </div>
        </td>
    </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
