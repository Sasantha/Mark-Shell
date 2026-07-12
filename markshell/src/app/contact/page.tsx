"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/ui/section";
import MessagePopup from "@/components/ui/MessagePopup";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, MapPin, Phone, Send } from "lucide-react";

const PRODUCT_INTERESTS = ["Wooden Cutlery", "Bamboo Products", "Areca Plates", "Other"];

const ContactPage = () => {
    const [fullName, setFullName] = useState("");
    const [company, setCompany] = useState("");
    const [contactValue, setContactValue] = useState("");
    const [productInterest, setProductInterest] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fullName,
                    company: company || undefined,
                    contactMethod: contactValue.includes('@') ? 'email' : 'phone',
                    contactValue,
                    contextType: productInterest ? 'category' : 'general',
                    contextValue: productInterest || undefined,
                    source: 'contact_page',
                    message,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to send inquiry');
            }

            setSubmitSuccess(true);
            setFullName("");
            setCompany("");
            setContactValue("");
            setProductInterest("");
            setMessage("");
        } catch (err) {
            console.error("Failed to submit contact inquiry:", err);
            setSubmitError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen font-sans bg-[#f9fafb]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative flex items-center justify-center text-center px-4 overflow-hidden bg-[#dfae76] pt-32 pb-16">
                {/* We can remove the absolute gradient since the image shows a solid/flat earthy color */}
                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a2e1a] leading-tight">
                        Partner with <span className="text-[#007c40]">Mark-Shell</span>
                    </h1>
                    <p className="text-base md:text-lg text-[#3f4f3f] max-w-2xl mx-auto font-medium px-4">
                        Sustainable wooden cutlery solutions for your global business. Quality you can trust, sourced responsibly — let's talk about your order.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            {/* Removed -mt-20 so it sets directly below the header like in the image */}
            <Section className="relative z-20 py-12 md:py-20 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                    {/* Left Column: Get in Touch */}
                    <div className="lg:col-span-5 space-y-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-[#1a2e1a]">Get in Touch</h2>
                            <p className="text-[#00d084] font-medium text-sm md:text-base mt-2">Direct channels for urgent business inquiries.</p>
                        </div>

                        <div className="space-y-4">
                            {/* WhatsApp Card */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-[#e8f8f2] p-3 rounded-xl text-[#00d084]">
                                    <MessageSquare size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base">WhatsApp Business</h3>
                                    {/* HARDCODED - client contact info, update manually if changed */}
                                    <a href="https://wa.me/94714263412" target="_blank" rel="noopener noreferrer" className="block text-[#00d084] font-bold text-sm md:text-base hover:underline">+94 71 426 3412</a>
                                    <p className="text-gray-400 text-[11px] md:text-xs mt-1">Response time: &lt; 2 hours</p>
                                </div>
                            </div>

                            {/* Office Phone Card */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-[#e8f8f2] p-3 rounded-xl text-[#00d084]">
                                    <Phone size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base">Office Phone</h3>
                                    {/* HARDCODED - client contact info, update manually if changed */}
                                    <a href="tel:+94112649551" className="block text-[#00d084] font-bold text-sm md:text-base hover:underline">+94 11 264 9551</a>
                                </div>
                            </div>

                            {/* Email Card */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-[#e8f8f2] p-3 rounded-xl text-[#00d084]">
                                    <Mail size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base">Email Our Sales Team</h3>
                                    {/* HARDCODED - client contact info, update manually if changed */}
                                    <p className="text-[#00d084] font-bold text-sm md:text-base">support@markshell.lk</p>
                                    <p className="text-gray-400 text-[11px] md:text-xs mt-1">For bulk orders and global export inquiries.</p>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-[#e8f8f2] p-3 rounded-xl text-[#00d084]">
                                    <MapPin size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base">Global Headquarters</h3>
                                    {/* HARDCODED - client contact info, update manually if changed */}
                                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">87/3A, Ernest Place, Lakshapathiya, Moratuwa, Sri Lanka</p>
                                    <p className="text-gray-400 text-[11px] md:text-xs mt-2">Monday - Friday, 9AM - 6PM IST</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Inquiry Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send an Inquiry</h2>
                            <p className="text-[#00d084] font-medium text-sm mb-8">
                                Fill out the form and our procurement specialists will contact you within 24 hours.
                            </p>
                            <p className="text-gray-500 text-xs md:text-sm -mt-6 mb-8">
                                For custom-sourced orders, we secure your request with a deposit and import on your behalf —
                                balance due on delivery confirmation.{" "}
                                <Link href="/about#how-it-works" className="text-[#00d084] font-semibold hover:underline">Learn how it works →</Link>
                            </p>

                            {submitSuccess ? (
                                <div className="text-center py-10">
                                    <p className="text-lg font-bold text-gray-900 mb-2">Thanks, {fullName || "there"}!</p>
                                    <p className="text-gray-600 mb-6">Your inquiry has been received. Our procurement specialists will contact you within 24 hours.</p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSubmitSuccess(false)}
                                        className="border-[#00d084] text-[#00d084] hover:bg-[#e8f8f2]"
                                    >
                                        Send another inquiry
                                    </Button>
                                </div>
                            ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00d084]/20 focus:border-[#00d084] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Company Name</label>
                                        <input
                                            type="text"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            placeholder="Acme Logistics Ltd"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00d084]/20 focus:border-[#00d084] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email or Phone</label>
                                    <input
                                        type="text"
                                        required
                                        value={contactValue}
                                        onChange={(e) => setContactValue(e.target.value)}
                                        placeholder="you@company.com or +1 555 000 0000"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00d084]/20 focus:border-[#00d084] transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Product Interest</label>
                                    <div className="relative">
                                        <select
                                            value={productInterest}
                                            onChange={(e) => setProductInterest(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00d084]/20 focus:border-[#00d084] transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select a category</option>
                                            {PRODUCT_INTERESTS.map((interest) => (
                                                <option key={interest} value={interest}>{interest}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Message</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Tell us about your requirements..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00d084]/20 focus:border-[#00d084] transition-all resize-none"
                                    ></textarea>
                                </div>

                                {submitError && (
                                    <p className="text-sm text-red-600">{submitError}</p>
                                )}

                                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#00d084] hover:bg-[#00b070] text-white font-bold py-4 rounded-full text-base md:text-lg shadow-lg hover:shadow-[#00d084]/25 transition-all flex items-center justify-center gap-2 h-auto">
                                    {isSubmitting ? "Sending..." : "Send Inquiry"} <Send size={18} className="fill-current" />
                                </Button>
                                <p className="text-center text-[10px] md:text-xs text-gray-400 mt-4">
                                    By submitting, you agree to our privacy policy and business terms.
                                </p>
                            </form>
                            )}
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
                        <span className="text-xs font-bold text-gray-900">MarkShell Office</span>
                    </div>
                </div>
            </div>

            <Footer />
            <MessagePopup />
        </main>
    );
};

export default ContactPage;
