import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import AboutGalleryImage, { GALLERY_FIELDS } from '@/models/AboutGalleryImage';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { pick } from '@/lib/pick';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        const { id } = await params;
        await dbConnect();

        const body = await request.json();

        const updated = await AboutGalleryImage.findByIdAndUpdate(id, pick(body, GALLERY_FIELDS), {
            returnDocument: 'after',
            runValidators: true
        });

        if (!updated) {
            return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
        }

        const obj = updated.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() });
    } catch (error) {
        return apiError(error, "Error updating about gallery image");
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin(request))) {
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
        return apiError(error, "Error deleting about gallery image");
    }
}
