import mongoose, { Schema, Document } from 'mongoose';

export interface ICertification extends Document {
    name: string;
    image: string;
    description?: string;
}

/** Fields the admin certification form may set. */
export const CERTIFICATION_FIELDS = ['name', 'image', 'description'] as const;

const CertificationSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Certification || mongoose.model<ICertification>('Certification', CertificationSchema);
