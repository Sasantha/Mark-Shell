import mongoose, { Schema, Document } from 'mongoose';

export interface IPartner extends Document {
    name: string;
    logo: string;
    websiteUrl?: string;
}

const PartnerSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        logo: { type: String, required: true },
        websiteUrl: { type: String },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Partner || mongoose.model<IPartner>('Partner', PartnerSchema);
