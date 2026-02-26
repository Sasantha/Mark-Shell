import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
    name: string;
    description?: string;
}

const MaterialSchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
    },
    {
        timestamps: true,
    }
);

// Force Mongoose to re-register the model so the new fields are picked up during HMR
if (mongoose.models.Material) {
    delete mongoose.models.Material;
}

export default mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);
