"use client";

import React from "react";
import Section from "../ui/section";
import ProductCard from "../ui/ProductCard";

const products = [
    {
        name: "Wooden Spoons",
        description: "Hand-crafted from sustainable teak wood defined for durability and elegance.",
        image: "https://th.bing.com/th/id/OIP.cReDVrYrRmr1FfSbtumvcAHaE8?w=296&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        tag: "Kitchen"
    },
    {
        name: "Reusable Forks",
        description: "Premium bamboo forks designed for daily use, lightweight and sturdy.",
        image: "https://th.bing.com/th/id/OIP.cReDVrYrRmr1FfSbtumvcAHaE8?w=296&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        tag: "Dining"
    },
    {
        name: "Wooden Combs",
        description: "Gentle neem wood combs that reduce static and promote scalp health.",
        image: "https://th.bing.com/th/id/OIP.cReDVrYrRmr1FfSbtumvcAHaE8?w=296&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        tag: "Personal Care"
    },
    {
        name: "Bamboo Skewers",
        description: "Biodegradable skewers perfect for grilling, appetizers, or crafts.",
        image: "https://th.bing.com/th/id/OIP.cReDVrYrRmr1FfSbtumvcAHaE8?w=296&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        tag: "Cooking"
    },
    {
        name: "Biodegradable Cup",
        description: "Classic design meets sustainability in these fully compostable cups.",
        image: "https://th.bing.com/th/id/OIP.cReDVrYrRmr1FfSbtumvcAHaE8?w=296&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        tag: "Travel"
    },
    {
        name: "Thermal Tumbler",
        description: "Double-walled insulation keeps your beverages at the perfect temperature.",
        image: "https://th.bing.com/th/id/OIP.cReDVrYrRmr1FfSbtumvcAHaE8?w=296&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        tag: "Lifestyle"
    },
];

const FeaturedProducts = () => {
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
                {products.map((product, idx) => (
                    <ProductCard
                        key={idx}
                        title={product.name}
                        description={product.description}
                        image={product.image}
                        tag={product.tag}
                        onQuoteClick={() => console.log(`Quote requested for ${product.name}`)}
                    />
                ))}
            </div>
        </Section>
    );
};

export default FeaturedProducts;
