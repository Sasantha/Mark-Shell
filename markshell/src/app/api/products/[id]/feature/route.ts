import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Product from '@/models/Product';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { revalidatePublicPages } from '@/lib/revalidate';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        const { id } = await params;
        await dbConnect();

        const body = await request.json();
        const { isFeatured } = body;

        if (typeof isFeatured !== 'boolean') {
            return NextResponse.json({ error: 'Invalid isFeatured status' }, { status: 400 });
        }

        // Check if we are trying to feature a product
        if (isFeatured) {
            // Check the current count of featured products
            const featuredCount = await Product.countDocuments({ isFeatured: true });

            // Allow if less than 6
            if (featuredCount >= 6) {
                // Return an error stating max featured products reached
                return NextResponse.json({ error: 'Maximum 6 products can be featured' }, { status: 400 });
            }
        }

        // Update the product's featured status
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { isFeatured },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const pObj = updatedProduct.toObject();
        revalidatePublicPages();
        return NextResponse.json({ ...pObj, id: pObj._id.toString() });
    } catch (error) {
        return apiError(error, "Error toggling product feature status");
    }
}
