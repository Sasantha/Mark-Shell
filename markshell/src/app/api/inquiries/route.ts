import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Inquiry from '@/models/Inquiry';
import { verifyAdmin, unauthorized } from '@/lib/auth';
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
        const body = await request.json();
        const { name, company, contactMethod, contactValue, contextType, contextValue, source, message } = body;

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
        console.error("Error creating inquiry:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
