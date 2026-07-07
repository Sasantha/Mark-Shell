"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Image from "next/image";
import { Menu, X, Leaf, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuote } from "@/contexts/QuoteContext";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const router = useRouter();
    const { openQuote } = useQuote();

    // Close suggestions if clicked outside (simplified by onblur/submission)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.search-container')) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Debounced Search
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length === 0) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsSearching(true);
            try {
                const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}&limit=5`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data);
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Products", href: "/products" },
        { name: "Categories", href: "/categories" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    const isNavSolid = isScrolled || isMobileMenuOpen;

    const renderSearchBar = (isMobile: boolean = false) => {
        const solid = isMobile ? true : isNavSolid;
        return (
            <div className={cn("relative search-container", isMobile ? "w-full mb-2" : "")}>
                <form onSubmit={handleSearchSubmit} className={`flex items-center rounded-full px-3 py-2 transition-colors border ${solid ? 'bg-gray-50 border-gray-200 focus-within:ring-2 focus-within:ring-green-500/20' : 'bg-black/20 border-white/20 focus-within:bg-black/40'}`}>
                    <Search size={16} className={cn("flex-shrink-0", solid ? 'text-gray-400' : 'text-white/70')} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => { if (searchQuery.trim()) setShowSuggestions(true); }}
                        className={cn(
                            "ml-2 bg-transparent text-sm w-full focus:outline-none transition-all",
                            !isMobile ? "w-36 lg:w-48 focus:w-48 lg:focus:w-64" : "",
                            solid ? "text-gray-900 placeholder:text-gray-400" : "text-white placeholder:text-white/60"
                        )}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setSearchQuery("");
                                setShowSuggestions(false);
                            }}
                            onMouseDown={(e) => e.preventDefault()} // Prevent losing focus on the input before onClick fires
                            className={cn(
                                "flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors",
                                solid ? "text-gray-400 hover:text-gray-600" : "text-white/70 hover:text-white"
                            )}
                            aria-label="Clear search"
                        >
                            <X size={14} />
                        </button>
                    )}
                </form>

                {/* Dropdown Suggestions */}
                {showSuggestions && searchQuery.trim() !== "" && (
                    <div className={cn(
                        "absolute top-full mt-2 rounded-2xl shadow-2xl border overflow-hidden z-[60] animate-in slide-in-from-top-2 backdrop-blur-xl transition-colors duration-300",
                        isMobile ? "w-full left-0" : "w-80 right-0",
                        solid
                            ? "bg-white/95 border-gray-200"
                            : "bg-black/20 border-white/20"
                    )}>
                        {isSearching ? (
                            <div className="p-6 text-center flex justify-center">
                                <Loader2 size={24} className={cn("animate-spin", solid ? "text-green-600" : "text-white")} />
                            </div>
                        ) : suggestions.length > 0 ? (
                            <>
                                <div className="max-h-96 overflow-y-auto">
                                    {suggestions.map((item) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "flex items-center justify-between gap-3 p-3 transition-colors border-b last:border-0 cursor-pointer",
                                                solid
                                                    ? "hover:bg-black/5 border-gray-100"
                                                    : "hover:bg-white/10 border-white/10"
                                            )}
                                            onClick={() => { setShowSuggestions(false); setIsMobileMenuOpen(false); router.push(`/products/${item.id}`); setSearchQuery(""); }}
                                        >
                                            <div className="flex gap-3 items-center flex-1 min-w-0">
                                                <div className={cn("relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border", solid ? "bg-gray-100 border-gray-200" : "bg-white/10 border-white/20")}>
                                                    <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn("text-sm font-bold truncate", solid ? "text-gray-900" : "text-white")}>{item.name}</p>
                                                    <p className={cn("text-xs truncate", solid ? "text-gray-500" : "text-white/60")}>{item.category}</p>
                                                </div>
                                            </div>

                                            <Button
                                                size="sm"
                                                className={cn(
                                                    "h-8 text-[11px] px-3 backdrop-blur-sm font-bold whitespace-nowrap border transition-all active:scale-95",
                                                    solid
                                                        ? "bg-green-600 hover:bg-green-700 text-white border-transparent shadow-sm"
                                                        : "bg-green-500/40 hover:bg-green-500/60 text-white border-green-400/50"
                                                )}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowSuggestions(false);
                                                    setIsMobileMenuOpen(false);
                                                    openQuote('product', item.name);
                                                }}
                                            >
                                                Get Quote
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <div className={cn("p-3 border-t", solid ? "border-gray-200 bg-gray-50/50" : "border-white/10 bg-white/5")}>
                                    <button
                                        type="button"
                                        onClick={() => { setShowSuggestions(false); setIsMobileMenuOpen(false); router.push(`/products?search=${encodeURIComponent(searchQuery)}`); setSearchQuery(""); }}
                                        className={cn(
                                            "w-full py-2.5 px-4 text-xs font-bold border rounded-lg backdrop-blur-md transition-all active:scale-95 flex items-center justify-center gap-2",
                                            solid
                                                ? "bg-green-600 hover:bg-green-700 text-white border-transparent shadow-sm"
                                                : "bg-green-500/40 hover:bg-green-500/60 text-white border-green-400/50"
                                        )}
                                    >
                                        See all results for "{searchQuery}" <span className="text-white/70">→</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className={cn("p-6 text-center text-sm", solid ? "text-gray-500" : "text-white/60")}>
                                No products match "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isNavSolid ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
            )}
        >
            <div className="w-[90%] md:w-[80%] mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="bg-green-600 p-1.5 rounded-full text-white group-hover:scale-110 transition-transform">
                        <Leaf size={20} fill="currentColor" />
                    </div>
                    <span className={cn("text-xl font-bold tracking-tight", isNavSolid ? "text-green-900" : "text-white")}>
                        MarkShell
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium hover:text-green-500 transition-colors",
                                isNavSolid ? "text-gray-700" : "text-white/90"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Desktop Search Bar */}
                    {renderSearchBar(false)}
                </div>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <Link href="/contact">
                        <Button
                            className="rounded-full px-6"
                            variant={isNavSolid ? "default" : "white"}
                        >
                            Get Quote / contact →
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 -mr-2 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <X className={isNavSolid ? "text-gray-900" : "text-white"} />
                    ) : (
                        <Menu className={isNavSolid ? "text-gray-900" : "text-white"} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 pb-6 flex flex-col gap-2 animate-in slide-in-from-top-1 border-t border-gray-100">
                    {/* Mobile Search Bar */}
                    {renderSearchBar(true)}

                    <div className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-700 font-medium hover:text-green-600 hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <Button
                        className="w-full mt-2 rounded-full py-6 text-base"
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push('/contact');
                        }}
                    >
                        Get Quote / contact →
                    </Button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
