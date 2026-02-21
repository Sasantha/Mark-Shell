import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Product from '@/models/Product';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const pObj = product.toObject();
        return NextResponse.json({ ...pObj, id: pObj._id.toString() });
    } catch (error: any) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();

        const body = await request.json();

        // Clean up empty strings in nested objects to prevent type errors
        if (body.specs) {
            Object.keys(body.specs).forEach(key => {
                if (body.specs[key] === "") {
                    delete body.specs[key];
                }
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
        });

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const pObj = updatedProduct.toObject();
        return NextResponse.json({ ...pObj, id: pObj._id.toString() });
    } catch (error: any) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
