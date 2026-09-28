import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Category, { CATEGORY_FIELDS } from '@/models/Category';
import Product from '@/models/Product';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { pick } from '@/lib/pick';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();

        const category = await Category.findById(id);

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        const catObj = category.toObject();
        return NextResponse.json({ ...catObj, id: catObj._id.toString() });
    } catch (error) {
        return apiError(error, "Error fetching category");
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

        const updatedCategory = await Category.findByIdAndUpdate(id, pick(body, CATEGORY_FIELDS), {
            returnDocument: 'after',
            runValidators: true
        });

        if (!updatedCategory) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        const catObj = updatedCategory.toObject();
        return NextResponse.json({ ...catObj, id: catObj._id.toString() });
    } catch (error) {
        return apiError(error, "Error updating category");
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        const { id } = await params;
        await dbConnect();

        const url = new URL(request.url);
        const transferToId = url.searchParams.get('transferTo');

        const deletedCategory = await Category.findById(id);

        if (!deletedCategory) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        if (transferToId) {
            const transferCategory = await Category.findById(transferToId);
            if (!transferCategory) {
                return NextResponse.json({ error: 'Target transfer category not found' }, { status: 404 });
            }

            // Update products to the new category
            await Product.updateMany(
                { category: deletedCategory.name },
                { $set: { category: transferCategory.name } }
            );
        }

        await Category.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        return apiError(error, "Error deleting category");
    }
}
