import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Material, { MATERIAL_FIELDS } from '@/models/Material';
import Product from '@/models/Product';
import { verifyAdmin, unauthorized, escapeRegex } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { pick } from '@/lib/pick';

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
    } catch (error) {
        return apiError(error, "Error fetching material");
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

        if (body?.name !== undefined && (typeof body.name !== 'string' || !body.name.trim())) {
            return NextResponse.json({ error: 'Material name must be text' }, { status: 400 });
        }

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

        const updatedMaterial = await Material.findByIdAndUpdate(id, pick(body, MATERIAL_FIELDS), {
            returnDocument: 'after',
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
    } catch (error) {
        return apiError(error, "Error updating material");
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin(request))) {
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
    } catch (error) {
        return apiError(error, "Error deleting material");
    }
}
