import mongoose, { Schema, Document } from 'mongoose';

export interface IAboutGalleryImage extends Document {
    image: string;
    alt?: string;
}

const AboutGalleryImageSchema: Schema = new Schema(
    {
        image: { type: String, required: true },
        alt: { type: String },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.AboutGalleryImage || mongoose.model<IAboutGalleryImage>('AboutGalleryImage', AboutGalleryImageSchema);
