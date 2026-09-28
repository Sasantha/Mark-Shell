import mongoose, { Schema, Document } from 'mongoose';
import { INQUIRY_LIMITS } from '@/lib/inquiryLimits';

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
        name: { type: String, required: true, maxlength: INQUIRY_LIMITS.name },
        company: { type: String, maxlength: INQUIRY_LIMITS.company },
        contactMethod: { type: String, enum: ['email', 'phone'], required: true },
        contactValue: { type: String, required: true, maxlength: INQUIRY_LIMITS.contactValue },
        contextType: { type: String, enum: ['general', 'product', 'category'], required: true },
        contextValue: { type: String, maxlength: INQUIRY_LIMITS.contextValue },
        source: { type: String, enum: ['popup', 'contact_page'], required: true },
        message: { type: String, required: true, maxlength: INQUIRY_LIMITS.message },
        status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new' },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
