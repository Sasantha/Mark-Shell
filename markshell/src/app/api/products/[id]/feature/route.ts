import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Product from '@/models/Product';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
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
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const pObj = updatedProduct.toObject();
        return NextResponse.json({ ...pObj, id: pObj._id.toString() });
    } catch (error: any) {
        console.error("Error toggling product feature status:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
