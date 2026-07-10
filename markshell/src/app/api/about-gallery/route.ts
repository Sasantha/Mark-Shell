import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import AboutGalleryImage from '@/models/AboutGalleryImage';
import { verifyAdmin, unauthorized } from '@/lib/auth';

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
        console.error("Error fetching about gallery images:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorized();
        }

        await dbConnect();

        // Enforce the gallery cap server-side, mirroring the featured products limit
        const imageCount = await AboutGalleryImage.countDocuments({});
        if (imageCount >= 6) {
            return NextResponse.json({ error: 'Maximum 6 images can be added to the gallery' }, { status: 400 });
        }

        const body = await request.json();
        const image = await AboutGalleryImage.create(body);

        const obj = image.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() }, { status: 201 });
    } catch (error) {
        console.error("Error creating about gallery image:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 });
    }
}
