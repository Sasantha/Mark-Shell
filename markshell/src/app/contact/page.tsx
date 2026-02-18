"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, MapPin, Send } from "lucide-react";

const ContactPage = () => {
    return (
        <main className="min-h-screen font-sans bg-[#f9fafb]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[400px] flex items-center justify-center text-center px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#dfae76] to-[#d68e54] z-0"></div>
                <div className="relative z-10 max-w-3xl mx-auto space-y-4 pt-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#1a2e1a] leading-tight">
                        Partner with <span className="text-green-500">Markshell</span>
                    </h1>
                    <p className="text-lg text-[#3f4f3f] max-w-2xl mx-auto">
                        Sustainable wooden cutlery solutions for your global business. Quality craftsmanship meets eco-friendly manufacturing.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <Section className="relative -mt-20 z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Get in Touch */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
                            <p className="text-green-600">Direct channels for urgent business inquiries.</p>
                        </div>

                        <div className="space-y-4">
                            {/* WhatsApp Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="bg-green-50 p-3 rounded-xl text-green-600">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">WhatsApp Business</h3>
                                    <p className="text-green-600 font-medium">+1 (555) 012-3456</p>
                                    <p className="text-gray-400 text-xs mt-1">Response time: &lt; 2 hours</p>
                                </div>
                            </div>

                            {/* Email Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="bg-green-50 p-3 rounded-xl text-green-600">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Email Our Sales Team</h3>
                                    <p className="text-green-600 font-medium">sales@markshell.com</p>
                                    <p className="text-gray-400 text-xs mt-1">For bulk orders and global export inquiries.</p>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="bg-green-50 p-3 rounded-xl text-green-600">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Global Headquarters</h3>
                                    <p className="text-gray-600 text-sm">Manufacturing Unit 1, Industrial Zone North, Bangalore, India</p>
                                    <p className="text-gray-400 text-xs mt-1">Monday - Friday, 9AM - 6PM IST</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Inquiry Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send an Inquiry</h2>
                            <p className="text-green-600 text-sm mb-8">
                                Fill out the form and our procurement specialists will contact you within 24 hours.
                            </p>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-900 uppercase">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-900 uppercase">Company Name</label>
                                        <input
                                            type="text"
                                            placeholder="Acme Logistics Ltd"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-900 uppercase">Product Interest</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none cursor-pointer">
                                        <option>Select a category</option>
                                        <option>Wooden Cutlery</option>
                                        <option>Bamboo Products</option>
                                        <option>Areca Plates</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-900 uppercase">Message</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Tell us about your requirements..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
                                    ></textarea>
                                </div>

                                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-full text-lg shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2">
                                    Send Inquiry via WhatsApp <Send size={18} className="fill-current" />
                                </Button>
                                <p className="text-center text-[10px] text-gray-400 mt-4">
                                    By submitting, you agree to our privacy policy and business terms.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Map Section */}
            <div className="h-[400px] w-full bg-gray-200 relative grayscale opacity-80">
                <img
                    src="https://imgs.search.brave.com/aCgtC3sfpQOpqC0C8J2XoH0M3r_yJkGqz-y4wXq6j8E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi83Lzc2L0Jh/bmdhbG9yZV9tYXBf/b3BxcS5wbmcvNTEy/cHgtQmFuZ2Fsb3Jl/X21hcF9vcHFxLnBu/Zw" // Placeholder Map Image
                    alt="Map Location"
                    className="w-full h-full object-cover"
                />
                {/* Map Pin Overlay */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
                        <MapPin className="text-green-600 fill-green-600" size={20} />
                        <span className="text-xs font-bold text-gray-900">Markshell Manufacturing Unit 1</span>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
};

export default ContactPage;
