"use client";

import React from "react";
import { Bell, User } from "lucide-react";

const AdminHeader = () => {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
            <div className="text-sm font-medium text-gray-500">
                Welcome back, Admin
            </div>
            <div className="flex items-center gap-4">
                <button className="relative text-gray-500 hover:text-gray-700">
                    <Bell size={20} />
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <User size={18} />
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
