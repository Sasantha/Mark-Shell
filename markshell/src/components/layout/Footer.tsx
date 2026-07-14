import React from "react";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Button } from "../ui/button";

const Footer = () => {
    return (
        <footer className="bg-[#0f172a] text-white pt-20 pb-10">
            <div className="w-[90%] md:w-[80%] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/MarkShell_logo_banner.png"
                                alt="MarkShell"
                                width={220}
                                height={32}
                            />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Ecomark is the sustainability-driven product line of Mark-Shell Pvt Ltd, delivering high-performance wooden cutlery solutions for corporate buyers across Sri Lanka and beyond.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: "#" },
                                { Icon: Twitter, href: "#" },
                                { Icon: Instagram, href: "https://www.instagram.com/markshell.lk/" },
                                { Icon: Linkedin, href: "#" },
                            ].map(({ Icon, href }, idx) => (
                                <a
                                    key={idx}
                                    href={href}
                                    target={href !== "#" ? "_blank" : undefined}
                                    rel={href !== "#" ? "noopener noreferrer" : undefined}
                                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors text-gray-400 hover:text-white"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
                        {/* Mirrors the main nav links in Navbar.tsx — keep in sync */}
                        <ul className="space-y-4 text-gray-400 text-sm">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Products', href: '/products' },
                                { name: 'Categories', href: '/categories' },
                                { name: 'About', href: '/about' },
                                { name: 'Contact', href: '/contact' },
                            ].map(link => (
                                <li key={link.name}><a href={link.href} className="hover:text-green-500 transition-colors">{link.name}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Contact Info</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            {/* HARDCODED - client contact info, update manually if changed */}
                            <li className="flex gap-3">
                                <span>87/3A, Ernest Place, Lakshapathiya, Moratuwa, Sri Lanka</span>
                            </li>
                            {/* HARDCODED - client contact info, update manually if changed */}
                            <li>
                                <a href="tel:+94714263412" className="hover:text-green-500">+94 71 426 3412</a>
                            </li>
                            {/* HARDCODED - client contact info, update manually if changed */}
                            <li>
                                <a href="tel:+94112649551" className="hover:text-green-500">+94 11 264 9551</a>
                            </li>
                            {/* HARDCODED - client contact info, update manually if changed */}
                            <li>
                                <a href="mailto:support@markshell.lk" className="hover:text-green-500">support@markshell.lk</a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to get updates on our latest products and offers.</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 text-white px-4 py-2 rounded-md outline-none focus:ring-1 focus:ring-green-500 text-sm flex-1"
                            />
                            <Button size="icon" className="bg-green-600 hover:bg-green-700">
                                <Send size={16} />
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Mark-Shell Pvt Ltd. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                    <p>
                        Design by{" "}
                        <a href="https://acmevia.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            Acmevia.com
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
