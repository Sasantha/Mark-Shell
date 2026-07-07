import type { IInquiry } from '@/models/Inquiry';

/**
 * Best-effort WhatsApp notification to the site owner via CallMeBot
 * (https://www.callmebot.com/blog/free-api-whatsapp-messages/).
 * Free, unofficial, single-recipient service — not Meta's official
 * WhatsApp Business API. Requires CALLMEBOT_PHONE and CALLMEBOT_APIKEY,
 * obtained once by messaging the CallMeBot number from the owner's phone.
 * Never throws — failures are logged only.
 */
export async function notifyWhatsApp(inquiry: IInquiry): Promise<void> {
    const phone = process.env.CALLMEBOT_PHONE;
    const apiKey = process.env.CALLMEBOT_APIKEY;

    if (!phone || !apiKey) {
        console.warn('WhatsApp notification skipped: CALLMEBOT_PHONE or CALLMEBOT_APIKEY not configured.');
        return;
    }

    const contextLine = inquiry.contextType === 'general'
        ? 'General inquiry'
        : `${inquiry.contextType === 'product' ? 'Product' : 'Category'}: ${inquiry.contextValue}`;

    const text = [
        `New MarkShell inquiry from ${inquiry.name}`,
        ...(inquiry.company ? [`Company: ${inquiry.company}`] : []),
        `Contact (${inquiry.contactMethod}): ${inquiry.contactValue}`,
        `Regarding: ${contextLine}`,
        `Message: ${inquiry.message}`,
    ].join('\n');

    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&apikey=${encodeURIComponent(apiKey)}&text=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('CallMeBot WhatsApp notification failed:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Failed to send WhatsApp notification:', error);
    }
}
