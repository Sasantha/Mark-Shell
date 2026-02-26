import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    subname?: string;
    category: string;
    material: string;
    image: string;
    price: number;
    badge?: string;
    specs: {
        length?: string;
        case?: string;
    };
    isAvailable: boolean;
    images?: string[];
    longDescription?: string;
    weight?: string;
    cartonQuantity?: string;
    isFeatured?: boolean;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        subname: { type: String },
        category: { type: String, required: true },
        material: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        badge: { type: String },
        specs: {
            length: { type: String },
            case: { type: String },
        },
        isAvailable: { type: Boolean, default: true },
        images: [{ type: String }],
        longDescription: { type: String },
        weight: { type: String },
        cartonQuantity: { type: String },
        isFeatured: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

// Force Mongoose to re-register the model so the new `isFeatured` field is picked up during HMR
if (mongoose.models.Product) {
    delete mongoose.models.Product;
}

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
