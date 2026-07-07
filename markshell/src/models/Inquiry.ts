import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
    name: string;
    company?: string;
    contactMethod: 'email' | 'phone';
    contactValue: string;
    contextType: 'general' | 'product' | 'category';
    contextValue?: string;
    source: 'popup' | 'contact_page';
    message: string;
    status: 'new' | 'read' | 'resolved';
    createdAt: Date;
}

const InquirySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        company: { type: String },
        contactMethod: { type: String, enum: ['email', 'phone'], required: true },
        contactValue: { type: String, required: true },
        contextType: { type: String, enum: ['general', 'product', 'category'], required: true },
        contextValue: { type: String },
        source: { type: String, enum: ['popup', 'contact_page'], required: true },
        message: { type: String, required: true },
        status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new' },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
