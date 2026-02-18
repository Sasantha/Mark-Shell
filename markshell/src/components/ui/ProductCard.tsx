import React from "react";
import { Button } from "./button";

interface ProductCardProps {
    image: string;
    tag?: string; // Made optional
    title: string;
    description: string; // Used as subname in catalog
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

    return (
        <div className="group bg-white rounded-2xl transition-all duration-300 hover:shadow-xl border border-gray-100 h-full flex flex-col overflow-hidden">
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                {/* Product Image */}
                <img
                    src={image}
                    alt={title}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!isAvailable ? "grayscale opacity-70" : ""}`}
                />

                {/* Badges */}
                {tag && !isCatalog && (
                    <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {tag}
                    </span>
                )}
                {badge && (
                    <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide ${badge === "Best Seller" ? "bg-gray-200 text-gray-800" :
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
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[10px] text-gray-500 mb-6 font-medium">
                        {specs.length && (
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span>Length:</span> <span className="text-gray-900">{specs.length}</span>
                            </div>
                        )}
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span>Pack:</span> <span className="text-gray-900">{specs.pack}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span>Case:</span> <span className="text-gray-900">{specs.case}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span>Grade:</span> <span className="text-gray-900">{specs.grade}</span>
                        </div>
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
                            onClick={onQuoteClick}
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
    );
};

export default ProductCard;
