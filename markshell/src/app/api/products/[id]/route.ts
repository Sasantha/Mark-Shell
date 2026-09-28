import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Product, { PRODUCT_FIELDS } from '@/models/Product';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { pick } from '@/lib/pick';

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
    } catch (error) {
        return apiError(error, "Error fetching product");
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

        // Clean up empty strings in nested objects to prevent type errors
        if (body.specs) {
            Object.keys(body.specs).forEach(key => {
                if (body.specs[key] === "") {
                    delete body.specs[key];
                }
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, pick(body, PRODUCT_FIELDS), {
            returnDocument: 'after',
            runValidators: true
        });

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const pObj = updatedProduct.toObject();
        return NextResponse.json({ ...pObj, id: pObj._id.toString() });
    } catch (error) {
        return apiError(error, "Error updating product");
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        const { id } = await params;
        await dbConnect();

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        return apiError(error, "Error deleting product");
    }
}
