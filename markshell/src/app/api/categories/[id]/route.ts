import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Category from '@/models/Category';
import Product from '@/models/Product';

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
    } catch (error: any) {
        console.error("Error fetching category:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();

        const body = await request.json();

        const updatedCategory = await Category.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
        });

        if (!updatedCategory) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        const catObj = updatedCategory.toObject();
        return NextResponse.json({ ...catObj, id: catObj._id.toString() });
    } catch (error: any) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
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
    } catch (error: any) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
