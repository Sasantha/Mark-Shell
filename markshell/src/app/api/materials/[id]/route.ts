import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Material from '@/models/Material';
import Product from '@/models/Product';
import { verifyAdmin, unauthorized, escapeRegex } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();

        const material = await Material.findById(id);

        if (!material) {
            return NextResponse.json({ error: 'Material not found' }, { status: 404 });
        }

        const mObj = material.toObject();
        return NextResponse.json({ ...mObj, id: mObj._id.toString() });
    } catch (error: any) {
        console.error("Error fetching material:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
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

        // Find existing material to check what the name was
        const existingMaterial = await Material.findById(id);
        if (!existingMaterial) {
            return NextResponse.json({ error: 'Material not found' }, { status: 404 });
        }

        // Check if renaming to something that already exists
        if (body.name && body.name.toLowerCase() !== existingMaterial.name.toLowerCase()) {
            const nameConflict = await Material.findOne({ name: { $regex: new RegExp(`^${escapeRegex(body.name)}$`, 'i') } });
            if (nameConflict) {
                return NextResponse.json({ error: 'A material with this new name already exists' }, { status: 400 });
            }
        }

        const updatedMaterial = await Material.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
        });

        // If the name changed, we should probably update all products that used the old material name
        if (body.name && existingMaterial.name !== body.name) {
            await Product.updateMany(
                { material: existingMaterial.name },
                { $set: { material: body.name } }
            );
        }

        const mObj = updatedMaterial!.toObject();
        return NextResponse.json({ ...mObj, id: mObj._id.toString() });
    } catch (error: any) {
        console.error("Error updating material:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorized();
        }

        const { id } = await params;
        await dbConnect();

        const material = await Material.findById(id);

        if (!material) {
            return NextResponse.json({ error: 'Material not found' }, { status: 404 });
        }

        const deletedMaterial = await Material.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Material deleted successfully' });
    } catch (error: any) {
        console.error("Error deleting material:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
