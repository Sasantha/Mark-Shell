import React from "react";
import { Leaf, Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Button } from "../ui/button";

const Footer = () => {
    return (
        <footer className="bg-[#0f172a] text-white pt-20 pb-10">
            <div className="w-[90%] md:w-[80%] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-green-600 p-1.5 rounded-full text-white">
                                <Leaf size={20} fill="currentColor" />
                            </div>
                            <span className="text-xl font-bold">MarkShell</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            We are committed to providing the freshest, organic produce directly from our sustainable farms to your table. Join the revolution.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors text-gray-400 hover:text-white">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            {['Home', 'About Us', 'Using Categories', 'Our Farms', 'Sustainability', 'Contact'].map(item => (
                                <li key={item}><a href={item === 'Home' ? '/' : item === 'About Us' ? '/about' : item === 'Contact' ? '/contact' : item === 'Using Categories' ? '/categories' : '#'} className="hover:text-green-500 transition-colors">{item === 'Using Categories' ? 'Categories' : item}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Contact Info</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="flex gap-3">
                                <span>123 Green Street, Eco City, Earth 10101</span>
                            </li>
                            <li>
                                <a href="tel:+94714263412" className="hover:text-green-500">+94 71 426 3412</a>
                            </li>
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
                    <p>&copy; {new Date().getFullYear()} EcoFood. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
