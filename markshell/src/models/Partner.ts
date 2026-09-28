import mongoose, { Schema, Document } from 'mongoose';

export interface IPartner extends Document {
    name: string;
    logo: string;
    websiteUrl?: string;
}

/** Fields the admin partner form may set. */
export const PARTNER_FIELDS = ['name', 'logo', 'websiteUrl'] as const;

/** Only full https:// links, so the public partner logos can't link to javascript: or data: URLs. */
function isHttpsUrl(value: string): boolean {
    try {
        return new URL(value).protocol === 'https:';
    } catch {
        return false;
    }
}

const PartnerSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        logo: { type: String, required: true },
        websiteUrl: {
            type: String,
            validate: { validator: isHttpsUrl, message: 'Website URL must be a full https:// address.' },
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Partner || mongoose.model<IPartner>('Partner', PartnerSchema);
