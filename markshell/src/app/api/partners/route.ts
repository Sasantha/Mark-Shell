import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Partner, { PARTNER_FIELDS } from '@/models/Partner';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { revalidatePublicPages } from '@/lib/revalidate';
import { pick } from '@/lib/pick';

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
        return apiError(error, "Error fetching partners");
    }
}

export async function POST(request: Request) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        await dbConnect();
        const body = await request.json();
        const partner = await Partner.create(pick(body, PARTNER_FIELDS));

        const obj = partner.toObject();
        revalidatePublicPages();
        return NextResponse.json({ ...obj, id: obj._id.toString() }, { status: 201 });
    } catch (error) {
        return apiError(error, "Error creating partner");
    }
}
