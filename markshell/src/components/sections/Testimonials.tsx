import React from "react";
import Section from "../ui/section";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Regular Buyer",
        text: "The quality of the wooden spoons is unmatched. I love that they are sustainable and look beautiful in my kitchen!",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop"
    },
    {
        name: "Michael Chen",
        role: "Chef",
        text: "Using these eco-friendly products has changed how I view kitchenware. Durable, stylish, and good for the planet.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
    },
    {
        name: "Emma Davis",
        role: "Food Blogger",
        text: "I highly recommend EcoFood. Their commitment to sustainability is genuine and their customer service is excellent.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop"
    },
];

const Testimonials = () => {
    return (
        <Section className="bg-white">
            <div className="text-center mb-16">
                <span className="text-green-600 font-semibold tracking-wider text-sm uppercase">Testimonials</span>
                <h2 className="text-4xl font-bold text-gray-900 mt-2">What Our Customers Say</h2>
                <div className="w-20 h-1 bg-yellow-400 mt-4 rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, idx) => (
                    <div key={idx} className="bg-[#fcfbf9] p-8 rounded-2xl relative pt-12">
                        <div className="absolute top-8 right-8 opacity-10">
                            <Quote size={40} className="text-green-900" />
                        </div>

                        <div className="flex gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>

                        <p className="text-gray-600 mb-8 italic relative z-10">"{testimonial.text}"</p>

                        <div className="flex items-center gap-4">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                            />
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                                <span className="text-green-600 text-xs">{testimonial.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Testimonials;
