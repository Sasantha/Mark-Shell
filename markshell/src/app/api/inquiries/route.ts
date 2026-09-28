import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongoose';
import Inquiry from '@/models/Inquiry';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { notifyEmail } from '@/lib/notifyEmail';
import { notifyWhatsApp } from '@/lib/notifyWhatsApp';

export async function GET(request: Request) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorized();
        }

        await dbConnect();
        const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });

        const formatted = inquiries.map(i => {
            const obj = i.toObject();
            return { ...obj, id: obj._id.toString() };
        });

        return NextResponse.json(formatted);
    } catch (error: any) {
        console.error("Error fetching inquiries:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();

        // Each inquiry emails and WhatsApps the owner, so cap it at 5 per IP per hour.
        const { allowed, retryAfterSeconds } = await rateLimit(`inquiry:${getClientIp(request)}`, 5, 60 * 60 * 1000);
        if (!allowed) {
            return NextResponse.json(
                { error: "You've sent several messages recently. Please try again later, or contact us by phone or WhatsApp." },
                { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
            );
        }

        const body = await request.json();
        const { name, company, contactMethod, contactValue, contextType, contextValue, source, message, website } = body;

        // Honeypot: the "website" field is hidden from people, so only bots fill it in.
        // Report success so the bot doesn't adapt, but store and send nothing.
        if (website) {
            console.warn('Inquiry dropped: honeypot field was filled in.');
            return NextResponse.json({ message: 'Inquiry received' }, { status: 201 });
        }

        if (!name || !contactMethod || !contactValue || !contextType || !source || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const inquiry = await Inquiry.create({
            name, company, contactMethod, contactValue, contextType, contextValue, source, message
        });

        // Best-effort notifications — do not block or fail the request on delivery errors.
        void notifyEmail(inquiry);
        void notifyWhatsApp(inquiry);

        const obj = inquiry.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() }, { status: 201 });
    } catch (error: any) {
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json({ error: 'Please check the form: a field is too long or invalid.' }, { status: 400 });
        }
        console.error("Error creating inquiry:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
