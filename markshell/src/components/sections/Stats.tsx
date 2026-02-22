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
                {/* Image Content */}
                <div className="relative h-[500px] w-full">
                    {/* Main Image with rotation and rounded corners */}
                    <div className="absolute inset-0 bg-gray-200 rounded-[2.5rem] overflow-hidden rotate-3 shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1573871666457-7c7329118cf9?q=80&w=2670&auto=format&fit=crop"
                            alt="Artistic Lifestyle"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Floating badge - Overlapping */}
                    <div className="absolute -bottom-6 -right-6 bg-green-700 text-white p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center rotate-3 z-10">
                        <span className="text-4xl font-bold leading-none">70%</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Plastic Free</span>
                    </div>

                    {/* Decorative Elements (Optional based on "exact" request) */}
                    {/* <div className="absolute top-1/2 left-0 -translate-x-1/2 w-12 h-24 bg-white/80 backdrop-blur-sm rounded-r-xl border border-gray-100 shadow-lg hidden lg:block"></div> */}
                </div>
            </div>
        </Section>
    );
};

export default Stats;
