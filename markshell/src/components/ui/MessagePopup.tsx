"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X, Send, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import { useQuote } from "@/contexts/QuoteContext";

const MessagePopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isQuoteOpen, quoteData, closeQuote } = useQuote();

    // Form State
    const [name, setName] = useState("");
    const [contactMethod, setContactMethod] = useState("email");
    const [contactValue, setContactValue] = useState("");
    const [contextType, setContextType] = useState("general");
    const [contextValue, setContextValue] = useState("");
    const [messageType, setMessageType] = useState("inquiry");
    const [customMessage, setCustomMessage] = useState("");

    const handleOpen = () => setIsOpen(!isOpen);

    const handleClose = () => {
        if (isQuoteOpen) {
            closeQuote();
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isQuoteOpen && quoteData) {
            setContextType(quoteData.type);
            setContextValue(quoteData.name);
            setMessageType("quote");
            setIsOpen(false); // Close floating popup if quote modal opens
        }
    }, [isQuoteOpen, quoteData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending
        alert("Message sent! We'll get back to you soon.");
        handleClose();
        // Reset form (optional)
        setName("");
        setContactValue("");
        setCustomMessage("");
    };

    const presetMessages = [
        { value: "inquiry", label: "I'd like to know more about this product." },
        { value: "quote", label: "Request a quote for bulk order." },
        { value: "availability", label: "Check availability/stock status." },
        { value: "custom", label: "Write a custom message..." },
    ];

    const showCentered = isQuoteOpen;
    const showFloating = isOpen && !isQuoteOpen;

    const renderFormContent = () => (
        <>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Send us a message</h3>
                <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="Your name"
                    />
                </div>

                {/* Contact Method */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Contact via</label>
                        <select
                            value={contactMethod}
                            onChange={(e) => setContactMethod(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            {contactMethod === 'email' ? 'Email Address' : 'Phone Number'}
                        </label>
                        <input
                            type={contactMethod === 'email' ? 'email' : 'tel'}
                            required
                            value={contactValue}
                            onChange={(e) => setContactValue(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            placeholder={contactMethod === 'email' ? 'you@example.com' : '+1 (555) 000-0000'}
                        />
                    </div>
                </div>

                {/* Context / Product Selection */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Regarding</label>
                    <div className="flex gap-2 mb-2">
                        <select
                            value={contextType}
                            onChange={(e) => setContextType(e.target.value)}
                            className="w-1/3 rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="general">General</option>
                            <option value="product">Product</option>
                            <option value="category">Category</option>
                        </select>

                        {contextType !== 'general' && (
                            <select
                                value={contextValue}
                                onChange={(e) => setContextValue(e.target.value)}
                                className="w-2/3 rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                                <option value="">Select {contextType}...</option>
                                {contextType === 'product'
                                    ? products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)
                                    : categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                                }
                            </select>
                        )}
                    </div>
                </div>

                {/* Message Type */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
                    <select
                        value={messageType}
                        onChange={(e) => setMessageType(e.target.value)}
                        className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                        {presetMessages.map((msg) => (
                            <option key={msg.value} value={msg.value}>{msg.label}</option>
                        ))}
                    </select>

                    {/* Custom Message Textarea */}
                    <div className={cn("overflow-hidden transition-all duration-300", messageType === 'custom' ? "max-h-40 opacity-100" : "max-h-0 opacity-0")}>
                        <textarea
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            placeholder="Type your message here..."
                            required={messageType === 'custom'}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    <Send size={16} className="mr-2" />
                    Send Message
                </Button>
            </form>
        </>
    );

    return (
        <>
            {/* Toggle Button */}
            <button
                type="button"
                onClick={handleOpen}
                className={cn(
                    "fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/30",
                    isOpen ? "rotate-45 bg-red-500 hover:bg-red-600" : ""
                )}
                aria-label="Open message form"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>

            {/* Floating Form Container */}
            <div
                className={cn(
                    "fixed bottom-24 right-8 z-40 w-[350px] origin-bottom-right rounded-2xl border-2 border-green-800 bg-white p-6 shadow-2xl transition-all duration-300 ease-out sm:w-[400px]",
                    showFloating
                        ? "scale-100 opacity-100"
                        : "pointer-events-none scale-95 opacity-0 translate-y-4"
                )}
            >
                {renderFormContent()}
            </div>

            {/* Centered Modal Container */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300",
                    showCentered ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                    onClick={handleClose}
                />

                {/* Modal Form */}
                <div
                    className={cn(
                        "relative w-full max-w-[400px] rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-transform duration-300 ease-out",
                        showCentered ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
                    )}
                >
                    {renderFormContent()}
                </div>
            </div>
        </>
    );
};

export default MessagePopup;

