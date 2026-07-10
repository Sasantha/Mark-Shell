import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import AboutGalleryImage from '@/models/AboutGalleryImage';
import { verifyAdmin, unauthorized } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorized();
        }

        const { id } = await params;
        await dbConnect();

        const body = await request.json();

        const updated = await AboutGalleryImage.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
        });

        if (!updated) {
            return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
        }

        const obj = updated.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() });
    } catch (error) {
        console.error("Error updating about gallery image:", error);
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

        const deleted = await AboutGalleryImage.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Gallery image deleted successfully' });
    } catch (error) {
        console.error("Error deleting about gallery image:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 });
    }
}
