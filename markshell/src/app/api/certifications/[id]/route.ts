import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Certification from '@/models/Certification';
import { verifyAdmin, unauthorized } from '@/lib/auth';

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
        console.error("Error fetching certification:", error);
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

        const updated = await Certification.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
        });

        if (!updated) {
            return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
        }

        const obj = updated.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() });
    } catch (error) {
        console.error("Error updating certification:", error);
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

        const deleted = await Certification.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Certification deleted successfully' });
    } catch (error) {
        console.error("Error deleting certification:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 });
    }
}
