"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageSquare } from "lucide-react";
import { useQuote } from "@/contexts/QuoteContext";

interface CategoryCardProps {
    name: string;
    description: string;
    image: string;
    itemCount: number;
    slug: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    name,
    description,
    image,
    itemCount,
    slug,
}) => {
    const { openQuote } = useQuote();

    return (
        <Link href={`/products?category=${encodeURIComponent(name)}`} className="group block h-full">
            <div className="relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Image Section */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>

                    <div className="absolute bottom-4 left-4 right-4">
                        <span className="mb-2 inline-block rounded-full bg-green-600/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                            {itemCount} Products
                        </span>
                        <h3 className="text-2xl font-bold text-white">{name}</h3>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-grow flex flex-col p-6">
                    <p className="mb-6 line-clamp-2 text-sm text-gray-500">{description}</p>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-green-700 transition-colors group-hover:text-green-800">
                            View Products <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openQuote('category', name);
                            }}
                            className="bg-green-50 hover:bg-green-600 text-green-700 hover:text-white transition-colors p-2 rounded-full cursor-pointer z-10 relative"
                            title="Request Quote"
                        >
                            <MessageSquare size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;
