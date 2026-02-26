"use client";

import React, { useState } from "react";
import { Lock, Loader2, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AdminProfilePage = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Password visibility states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: "error", text: "New password must be at least 6 characters" });
            return;
        }

        setIsLoading(true);

        const token = localStorage.getItem("admin_token");

        try {
            const res = await fetch("/api/admin/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (res.status === 401) {
                // Token is invalid or expired
                localStorage.removeItem("admin_token");
                router.push("/admin/login?expired=true");
                return;
            }

            if (res.ok) {
                setMessage({ type: "success", text: "Password updated successfully" });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setMessage({ type: "error", text: data.message || "Failed to update password" });
            }
        } catch (error) {
            console.error("Update password failed", error);
            setMessage({ type: "error", text: "Something went wrong. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Profile</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Manage your admin account settings and update your password.
                </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-5">
                    <h3 className="text-base font-semibold text-gray-900">Change Password</h3>
                </div>

                <div className="px-6 py-6">
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        {message.text && (
                            <div className={`rounded-lg p-4 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                {message.text}
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Current Password
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="relative mb-4">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700 font-medium"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProfilePage;
