"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./button";
import { useQuote } from "@/contexts/QuoteContext";

interface ProductCardProps {
    id?: string; // Added ID to link
    image: string;
    tag?: string;
    title: string;
    description: string;
    specs?: {
        length?: string;
        pack: string;
        case: string;
        grade: string;
    };
    badge?: string;
    isAvailable?: boolean;
    onQuoteClick?: () => void;
    variant?: "default" | "catalog";
}

const ProductCard: React.FC<ProductCardProps> = ({
    id,
    image,
    tag,
    title,
    description,
    specs,
    badge,
    isAvailable = true,
    onQuoteClick,
    variant = "default",
}) => {
    const isCatalog = variant === "catalog";
    const { openQuote } = useQuote();

    // If ID is provided, wrap in Link, otherwise div
    const Wrapper = id ? Link : "div";
    const wrapperProps = id ? { href: `/products/${id}` } : {};

    return (
        // @ts-ignore - Dynamic wrapper props issue
        <Wrapper {...wrapperProps} className="block h-full">
            <div className="group bg-white rounded-2xl transition-all duration-300 hover:shadow-xl border border-gray-100 h-full flex flex-col overflow-hidden cursor-pointer">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                    {/* Product Image */}
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                        className={`object-cover transition-transform duration-500 group-hover:scale-110 ${!isAvailable ? "grayscale opacity-70" : ""}`}
                    />

                    {/* Badges */}
                    {tag && !isCatalog && (
                        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            {tag}
                        </span>
                    )}
                    {badge && (
                        <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide ${badge === "Best Seller" ? "bg-green-500 text-white" : // Updated to match single page design
                            badge === "Eco Kit" ? "bg-gray-800 text-white" :
                                "bg-black/50 text-white backdrop-blur-sm"
                            }`}>
                            {badge}
                        </span>
                    )}

                    {/* Coming Soon Overlay */}
                    {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="border-2 border-white text-white px-6 py-2 text-sm font-bold uppercase tracking-wider backdrop-blur-sm">
                                Coming Soon
                            </span>
                        </div>
                    )}
                </div>

                <div className={`flex-grow flex flex-col ${isCatalog ? "p-6" : "px-8 pb-8 pt-2"}`}>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-1">
                        {title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-4">
                        {description}
                    </p>

                    {/* Specs Grid for Catalog */}
                    {isCatalog && specs && (
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[10px] text-gray-500 mb-6 font-medium items-start content-start">
                            {specs.length && (
                                <div className="flex justify-between border-b border-gray-100 pb-1">
                                    <span>Length:</span> <span className="text-gray-900">{specs.length}</span>
                                </div>
                            )}
                            {specs.pack && (
                                <div className="flex justify-between border-b border-gray-100 pb-1">
                                    <span>Pack:</span> <span className="text-gray-900">{specs.pack}</span>
                                </div>
                            )}
                            {specs.case && (
                                <div className="flex justify-between border-b border-gray-100 pb-1">
                                    <span>Case:</span> <span className="text-gray-900">{specs.case}</span>
                                </div>
                            )}
                            {specs.grade && (
                                <div className="flex justify-between border-b border-gray-100 pb-1">
                                    <span>Grade:</span> <span className="text-gray-900">{specs.grade}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Fallback for Default View */}
                    {!isCatalog && (
                        <p className="text-gray-500 text-sm leading-relaxed flex-grow mb-4">
                            {description}
                        </p>
                    )}

                    <div className="mt-auto">
                        {isAvailable ? (
                            <Button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent navigation when clicking button
                                    e.stopPropagation();
                                    openQuote('product', title);
                                    onQuoteClick && onQuoteClick();
                                }}
                                className={`w-full font-bold transition-all duration-300 rounded-lg ${isCatalog
                                    ? "bg-green-700 hover:bg-green-800 text-white py-2 text-xs uppercase tracking-wide"
                                    : "bg-gray-50 text-green-700 hover:bg-green-600 hover:text-white py-6"
                                    }`}
                            >
                                {isCatalog ? "Request Quote" : "Get Quote"}
                            </Button>
                        ) : (
                            <Button disabled className="w-full bg-gray-200 text-gray-400 font-bold py-2 rounded-lg text-xs uppercase tracking-wide">
                                Unavailable
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default ProductCard;
