import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Partner from '@/models/Partner';
import { verifyAdmin, unauthorized } from '@/lib/auth';

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
        console.error("Error fetching partner:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorized();
        }

        const { id } = await params;
        await dbConnect();

        const body = await request.json();

        const updated = await Partner.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
        });

        if (!updated) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        const obj = updated.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() });
    } catch (error) {
        console.error("Error updating partner:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorized();
        }

        const { id } = await params;
        await dbConnect();

        const deleted = await Partner.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Partner deleted successfully' });
    } catch (error) {
        console.error("Error deleting partner:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 });
    }
}
