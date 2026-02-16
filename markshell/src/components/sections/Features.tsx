import React from "react";
import Section from "../ui/section";
import { Leaf, Award, DollarSign, Users } from "lucide-react";

const featureList = [
    {
        icon: Leaf,
        title: "Eco-Friendly",
        description: "100% biodegradable materials used in all our products.",
    },
    {
        icon: Award,
        title: "High Quality",
        description: "Premium grade materials ensuring durability and style.",
    },
    {
        icon: DollarSign,
        title: "Affordable",
        description: "Sustainable living shouldn't cost the earth.",
    },
    {
        icon: Users,
        title: "Community",
        description: "Join a growing community of eco-conscious changemakers.",
    },
];

const Features = () => {
    return (
        <Section className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featureList.map((feature, index) => (
                    <div
                        key={index}
                        className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-green-100 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300"
                    >
                        <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                            <feature.icon className="text-green-600 group-hover:text-white transition-colors duration-300" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Features;
