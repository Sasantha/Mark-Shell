import React from "react";
import { Button } from "./button";

interface ProductCardProps {
    image: string;
    tag: string;
    title: string;
    description: string;
    onQuoteClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    image,
    tag,
    title,
    description,
    onQuoteClick,
}) => {
    return (
        <div className="group bg-white rounded-2xl transition-all duration-300 hover:shadow-xl border border-gray-100 h-full flex flex-col">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
                {/* Product Image */}
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {tag}
                </span>
            </div>

            <div className="space-y-3 px-8 pb-8 pt-2 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                    {description}
                </p>

                <Button
                    onClick={onQuoteClick}
                    className="w-full mt-2 bg-gray-50 text-green-700 font-semibold hover:bg-green-600 hover:text-white border border-transparent hover:border-green-600 transition-all duration-300 rounded-xl py-6"
                >
                    Get Quote
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;
