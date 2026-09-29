import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Inquiry from '@/models/Inquiry';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import { apiError } from '@/lib/apiError';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        const { id } = await params;
        await dbConnect();

        const body = await request.json();
        const { status } = body;

        if (!['new', 'read', 'resolved'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const updated = await Inquiry.findByIdAndUpdate(id, { status }, { returnDocument: 'after', runValidators: true });

        if (!updated) {
            return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        }

        const obj = updated.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() });
    } catch (error) {
        return apiError(error, "Error updating inquiry");
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        const { id } = await params;
        await dbConnect();

        const deleted = await Inquiry.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        return apiError(error, "Error deleting inquiry");
    }
}
