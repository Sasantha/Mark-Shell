import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Partner from '@/models/Partner';
import { verifyAdmin, unauthorized } from '@/lib/auth';

export async function GET() {
    try {
        await dbConnect();
        const partners = await Partner.find({});

        const formatted = partners.map(p => {
            const obj = p.toObject();
            return { ...obj, id: obj._id.toString() };
        });

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Error fetching partners:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorized();
        }

        await dbConnect();
        const body = await request.json();
        const partner = await Partner.create(body);

        const obj = partner.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() }, { status: 201 });
    } catch (error) {
        console.error("Error creating partner:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 });
    }
}
