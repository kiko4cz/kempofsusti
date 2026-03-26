'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
    const { signIn } = useAuthActions();

    // Reactive redirect: Wait for isAuthenticated to become true before pushing the route
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            console.log("Authenticated! Redirecting to dashboard...");
            toast.success("Přihlášení úspěšné!");
            router.push('/admin/dashboard');
        }
    }, [isAuthenticated, authLoading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Attempting signIn with:", email);
            await signIn("password", { email, password, flow: "signIn" });
            // Redirection is handled by the useEffect above
        } catch (err) {
            console.error("Login failed:", err);
            toast.error("Nesprávný email nebo heslo");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-md relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                            <Lock className="text-primary" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Administrace</h1>
                        <p className="text-gray-400">Přihlaste se pro správu webu</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="admin@kempofsusti.cz"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Heslo</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>


                        <button
                            type="submit"
                            disabled={loading || (isAuthenticated && !authLoading)}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {(loading || (isAuthenticated && !authLoading)) ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    {isAuthenticated ? 'Přesměrování...' : 'Přihlašování...'}
                                </>
                            ) : (
                                'Přihlásit se'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
