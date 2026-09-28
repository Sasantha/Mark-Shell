import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import AboutGalleryImage, { GALLERY_FIELDS } from '@/models/AboutGalleryImage';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { revalidatePublicPages } from '@/lib/revalidate';
import { pick } from '@/lib/pick';

export async function GET() {
    try {
        await dbConnect();
        const images = await AboutGalleryImage.find({}).sort({ createdAt: 1 });

        const formatted = images.map(img => {
            const obj = img.toObject();
            return { ...obj, id: obj._id.toString() };
        });

        return NextResponse.json(formatted);
    } catch (error) {
        return apiError(error, "Error fetching about gallery images");
    }
}

export async function POST(request: Request) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        await dbConnect();

        // Enforce the gallery cap server-side, mirroring the featured products limit
        const imageCount = await AboutGalleryImage.countDocuments({});
        if (imageCount >= 6) {
            return NextResponse.json({ error: 'Maximum 6 images can be added to the gallery' }, { status: 400 });
        }

        const body = await request.json();
        const image = await AboutGalleryImage.create(pick(body, GALLERY_FIELDS));

        const obj = image.toObject();
        revalidatePublicPages();
        return NextResponse.json({ ...obj, id: obj._id.toString() }, { status: 201 });
    } catch (error) {
        return apiError(error, "Error creating about gallery image");
    }
}
