"use client";

import React, { useState, useEffect } from "react";
import Section from "../ui/section";
import ProductCard from "../ui/ProductCard";
import { useQuote } from "@/contexts/QuoteContext";
import { Loader2 } from "lucide-react";

const FeaturedProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { openQuote } = useQuote();

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                // Fetch up to 6 products for the featured section
                const response = await fetch('/api/products?featured=true');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch featured products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);
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

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-10 w-10 animate-spin text-green-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id || product._id}
                            id={product.id || product._id}
                            title={product.name}
                            description={product.subname || product.category || product.description}
                            image={product.image}
                            tag={product.category}
                            badge={product.badge}
                            isAvailable={product.isAvailable}
                            onQuoteClick={() => openQuote('product', product.name)}
                        />
                    ))}
                </div>
            )}
        </Section>
    );
};

export default FeaturedProducts;
