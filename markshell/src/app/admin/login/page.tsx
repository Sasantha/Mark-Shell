"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Lock, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (email === "admin@markshell.com" && password === "admin123") {
                // Generate detailed mock token
                const mockToken = btoa(JSON.stringify({
                    id: "user_123",
                    role: "admin",
                    email: email,
                    exp: Date.now() + 3600000 // 1 hour
                }));
                localStorage.setItem("admin_token", mockToken);
                router.push("/admin/dashboard");
            } else {
                setError("Invalid credentials. Use admin@markshell.com / admin123");
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Leaf className="h-6 w-6 text-green-600" fill="currentColor" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Admin Login
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to manage your dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-green-500 sm:text-sm transition-all"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-green-500 sm:text-sm transition-all"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-100 animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 shadow-lg shadow-green-900/20"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                </form>

                <div className="text-center text-xs text-gray-400">
                    Protected by mock-JWT authentication
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
