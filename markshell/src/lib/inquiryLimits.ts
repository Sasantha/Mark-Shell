/**
 * Maximum lengths for inquiry fields, shared by the Inquiry model (enforced on
 * the server) and the public forms (maxLength on the inputs) so they agree.
 */
export const INQUIRY_LIMITS = {
    name: 100,
    company: 150,
    contactValue: 150,
    contextValue: 200,
    message: 2000,
} as const;
