import React from "react";
import Section from "../ui/section";

const stats = [
    { value: "25+", label: "Years of Experience", color: "text-green-600" },
    { value: "300+", label: "Happy Customers", color: "text-green-600" },
    { value: "50k+", label: "Products Sold", color: "text-green-600" },
    { value: "100%", label: "Eco-Friendly Certification", color: "text-green-600" },
];

const Stats = () => {
    return (
        <Section className="bg-[#fcfbf9] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="space-y-12">
                    <div>
                        <span className="text-green-600 font-semibold tracking-wider text-sm uppercase">Who We Are</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
                            Committed to a Greener <br /> Future for Everyone
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <span className={`text-4xl font-bold ${stat.color} block mb-2`}>{stat.value}</span>
                                <span className="text-gray-600 font-medium">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image Content */}
                <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
                    {/* Using a placeholder image of someone playing sax or similar artistic vibe as requested/designed */}
                    <img
                        src="https://images.unsplash.com/photo-1573871666457-7c7329118cf9?q=80&w=2670&auto=format&fit=crop"
                        alt="Artistic Lifestyle"
                        className="w-full h-full object-cover"
                    />

                    {/* Floating badge */}
                    <div className="absolute bottom-10 right-10 bg-green-800 text-white p-6 rounded-2xl shadow-xl max-w-[150px] text-center">
                        <span className="text-3xl font-bold block">100%</span>
                        <span className="text-xs uppercase tracking-wider opacity-80">Organic & Pure</span>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Stats;
