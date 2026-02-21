import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    description: string;
    image: string;
    itemCount: number;
    slug: string;
}

const CategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        itemCount: { type: Number, required: true, default: 0 },
        slug: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
