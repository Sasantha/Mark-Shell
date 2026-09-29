import mongoose, { Schema, Document } from 'mongoose';

export interface IAboutGalleryImage extends Document {
    image: string;
    alt?: string;
}

/** Fields the admin gallery form may set. */
export const GALLERY_FIELDS = ['image', 'alt'] as const;

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
