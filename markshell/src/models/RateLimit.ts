import mongoose, { Schema, Document } from 'mongoose';

export interface IRateLimit extends Document {
    key: string;
    windowStart: Date;
    count: number;
    expiresAt: Date;
}

const RateLimitSchema: Schema = new Schema({
    key: { type: String, required: true },
    windowStart: { type: Date, required: true },
    count: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
});

RateLimitSchema.index({ key: 1, windowStart: 1 }, { unique: true });
// MongoDB deletes each counter automatically once its window has ended.
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.RateLimit || mongoose.model<IRateLimit>('RateLimit', RateLimitSchema);
