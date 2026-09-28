"use client";

import React from "react";
import Section from "../ui/section";
import ProductCard from "../ui/ProductCard";
import { useQuote } from "@/contexts/QuoteContext";
import type { Product } from "@/types";

/** Featured products, loaded on the server by the home page and passed in. */
const FeaturedProducts = ({ products }: { products: Product[] }) => {
    const { openQuote } = useQuote();

    return (
        <Section className="bg-white py-24">
            <div className="flex flex-col items-center mb-16 text-center">
                <span className="text-green-600 font-semibold tracking-wider text-sm uppercase mb-3">Our Collection</span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Featured Products</h2>
                <div className="w-24 h-1.5 bg-yellow-400 rounded-full"></div>
                <p className="mt-6 text-gray-600 max-w-2xl text-lg">
                    Browse our selection of premium eco-friendly products designed to help you live a more sustainable lifestyle without compromising on quality.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.name}
                        description={product.subname || product.category}
                        image={product.image}
                        tag={product.category}
                        badge={product.badge}
                        isAvailable={product.isAvailable}
                        onQuoteClick={() => openQuote('product', product.name)}
                    />
                ))}
            </div>
        </Section>
    );
};

export default FeaturedProducts;
