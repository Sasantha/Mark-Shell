import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Partner, { PARTNER_FIELDS } from '@/models/Partner';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { revalidatePublicPages } from '@/lib/revalidate';
import { pick } from '@/lib/pick';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();

        const partner = await Partner.findById(id);

        if (!partner) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        const obj = partner.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() });
    } catch (error) {
        return apiError(error, "Error fetching partner");
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        const { id } = await params;
        await dbConnect();

        const body = await request.json();

        const updated = await Partner.findByIdAndUpdate(id, pick(body, PARTNER_FIELDS), {
            returnDocument: 'after',
            runValidators: true
        });

        if (!updated) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        const obj = updated.toObject();
        revalidatePublicPages();
        return NextResponse.json({ ...obj, id: obj._id.toString() });
    } catch (error) {
        return apiError(error, "Error updating partner");
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        const { id } = await params;
        await dbConnect();

        const deleted = await Partner.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        revalidatePublicPages();
        return NextResponse.json({ message: 'Partner deleted successfully' });
    } catch (error) {
        return apiError(error, "Error deleting partner");
    }
}
