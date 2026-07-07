import mongoose, { Schema, Document } from 'mongoose';

export interface ICertification extends Document {
    name: string;
    image: string;
    description?: string;
}

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
