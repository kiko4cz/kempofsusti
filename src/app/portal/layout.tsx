'use client';

import { useConvexAuth } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Loader2, LayoutDashboard, Users, FileText, LogOut, Menu, X, User, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { signOut } = useAuthActions();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated && pathname !== '/portal/login') {
            router.push('/portal/login');
        }
    }, [isLoading, isAuthenticated, router, pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated && pathname !== '/portal/login') {
        return null;
    }

    // Pro login stránku nepotřebujeme layout portálu
    if (pathname === '/portal/login') {
        return <>{children}</>;
    }

    const navItems = [
        { name: 'Přehled', href: '/portal', icon: <LayoutDashboard size={20} /> },
        { name: 'Moje děti', href: '/portal/children', icon: <Users size={20} /> },
        { name: 'Přihlášky', href: '/portal/registrations', icon: <FileText size={20} /> },
        { name: 'Můj profil', href: '/portal/profile', icon: <User size={20} /> },
    ];

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] text-slate-900 dark:text-white flex flex-col md:flex-row font-sans transition-colors duration-300">
            {/* Mobile Header */}
            <div className="md:hidden relative z-50 flex items-center justify-between p-4 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
                <Link href="/portal" className="font-black text-xl uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                    Klientská zóna
                </Link>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-900 dark:text-white p-2">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed md:relative z-40 w-64 h-[calc(100vh-65px)] md:h-screen bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-white/5 flex flex-col pt-6 transition-transform duration-300 ease-in-out top-[65px] md:top-0 left-0 ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                <div className="hidden md:flex items-center justify-between px-6 mb-10">
                    <Link href="/portal" className="font-black text-2xl uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                        Portál
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
                    <Link 
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all font-bold text-sm mb-2"
                    >
                        <ChevronLeft size={20} />
                        Zpět na web
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-xl transition-all font-bold text-sm"
                    >
                        <LogOut size={20} />
                        Odhlásit se
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto h-[calc(100vh-65px)] md:h-screen relative">
                {/* Background effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="p-6 md:p-10 max-w-7xl mx-auto relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
