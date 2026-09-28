import type { IInquiry } from '@/models/Inquiry';

const GRAPH_API_VERSION = 'v25.0';

/**
 * Template parameters may not contain newlines, tabs or runs of more than
 * four spaces, and the rendered body is capped at 1024 characters.
 */
function toParam(value: string, maxLength = 200): string {
    const clean = value.replace(/\s+/g, ' ').trim();
    return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}…` : clean;
}

/**
 * Best-effort WhatsApp notification to the site owner via Meta's official
 * WhatsApp Cloud API. Business-initiated messages must use a pre-approved
 * template: the default `new_inquiry` template takes four body parameters
 * (name, contact, regarding, message). Setting WHATSAPP_TEMPLATE_NAME to
 * `hello_world` sends Meta's built-in parameterless test template instead.
 * Requires WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID and OWNER_WHATSAPP.
 * Never throws — failures are logged only.
 */
export async function notifyWhatsApp(inquiry: IInquiry): Promise<void> {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const ownerNumber = process.env.OWNER_WHATSAPP;
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME || 'new_inquiry';
    const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANG || 'en_US';

    if (!token || !phoneNumberId || !ownerNumber) {
        console.warn('WhatsApp notification skipped: WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID or OWNER_WHATSAPP not configured.');
        return;
    }

    const contextLine = inquiry.contextType === 'general'
        ? 'General inquiry'
        : `${inquiry.contextType === 'product' ? 'Product' : 'Category'}: ${inquiry.contextValue}`;

    const name = inquiry.company ? `${inquiry.name} (${inquiry.company})` : inquiry.name;

    const components = templateName === 'hello_world'
        ? undefined
        : [{
            type: 'body',
            parameters: [
                { type: 'text', text: toParam(name) },
                { type: 'text', text: toParam(`${inquiry.contactValue} (${inquiry.contactMethod})`) },
                { type: 'text', text: toParam(contextLine) },
                { type: 'text', text: toParam(inquiry.message, 600) },
            ],
        }];

    try {
        const response = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: ownerNumber.replace(/[^\d]/g, ''),
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: templateLanguage },
                    ...(components ? { components } : {}),
                },
            }),
        });

        if (!response.ok) {
            console.error('WhatsApp Cloud API notification failed:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Failed to send WhatsApp notification:', error);
    }
}
