import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Certification, { CERTIFICATION_FIELDS } from '@/models/Certification';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { pick } from '@/lib/pick';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();

        const certification = await Certification.findById(id);

        if (!certification) {
            return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
        }

        const obj = certification.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() });
    } catch (error) {
        return apiError(error, "Error fetching certification");
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

        const updated = await Certification.findByIdAndUpdate(id, pick(body, CERTIFICATION_FIELDS), {
            returnDocument: 'after',
            runValidators: true
        });

        if (!updated) {
            return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
        }

        const obj = updated.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() });
    } catch (error) {
        return apiError(error, "Error updating certification");
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        const { id } = await params;
        await dbConnect();

        const deleted = await Certification.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Certification deleted successfully' });
    } catch (error) {
        return apiError(error, "Error deleting certification");
    }
}
