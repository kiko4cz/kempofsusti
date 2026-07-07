'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Users, Calendar, LayoutDashboard, Settings, LogOut, X, Menu, BarChart, FileText, Loader2, Newspaper, Image as ImageIcon, Heart, History } from 'lucide-react';
import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { signOut } = useAuthActions();
    const user = useQuery(api.whoami.whoAmI);

    console.log("AdminLayout state:", { isAuthenticated, isLoading, pathname, user });

    // If on login page, render without sidebar
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (!isLoading && !isAuthenticated && !isLoginPage) {
            router.push('/admin/login');
        }
    }, [isLoading, isAuthenticated, isLoginPage, router]);

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Načítání administrace...</p>
            </div>
        </div>
    );

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success("Odhlášení úspěšné!");
            router.push('/admin/login');
        } catch (error) {
            toast.error("Chyba při odhlašování");
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const menuItems = [
        { name: 'Přehled', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Tým', href: '/admin/team', icon: Users },
        { name: 'Obsah webu', href: '/admin/content', icon: FileText },
        { name: 'Turnusy', href: '/admin/camps', icon: Calendar },
        { name: 'Sponzoři', href: '/admin/sponsors', icon: Heart },
        { name: 'Statistiky', href: '/admin/stats', icon: BarChart },
        { name: 'Pro rodiče', href: '/admin/news', icon: Newspaper },
        { name: 'Galerie', href: '/admin/gallery', icon: ImageIcon },
        { name: 'Historie', href: '/admin/history', icon: History },
        { name: 'Nastavení', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="admin-mesh-bg min-h-screen text-slate-900 font-sans selection:bg-primary/10">
            <Toaster position="top-right" richColors theme="light" closeButton />

            {isLoginPage ? (
                <div className="min-h-screen w-full">
                    {children}
                </div>
            ) : isAuthenticated ? (
                <div className="flex h-screen overflow-hidden">
                    {/* Mobile Sidebar Overlay */}
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm"
                                onClick={() => setIsSidebarOpen(false)}
                            />
                        )}
                    </AnimatePresence>

                    {/* Sidebar */}
                    <aside
                        className={`fixed md:relative z-50 w-80 h-full bg-white/70 backdrop-blur-2xl border-r border-slate-200 flex flex-col transition-all duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                            }`}
                    >
                        {/* Header */}
                        <div className="h-24 flex items-center px-8 border-b border-slate-100 relative bg-gradient-to-b from-slate-50/50 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-tr from-primary to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transform rotate-3">
                                    <Settings className="text-white animate-spin-slow" size={24} />
                                </div>
                                <span className="text-2xl font-black bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tight">
                                    Kemp<span className="text-primary">OS</span>
                                </span>
                            </div>
                            <button
                                onClick={toggleSidebar}
                                className="md:hidden absolute right-6 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto py-8 px-6 space-y-2 scrollbar-none">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 px-4">Hlavní menu</div>
                            {menuItems.map((item, idx) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${isActive
                                            ? 'bg-primary/5 text-primary font-bold'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                                            }`}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-nav"
                                                className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        {(() => {
                                            const Icon = item.icon;
                                            return <Icon size={22} className={`transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-110'}`} />;
                                        })()}
                                        <span className="text-[15px]">{item.name}</span>
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(220,38,38,0.4)]" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer / Profile */}
                        <div className="p-6 mt-auto">
                            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-primary font-bold text-lg ring-1 ring-slate-300 shadow-sm">
                                            {user?.name?.slice(0, 1).toUpperCase() || 'A'}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white z-10"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate leading-tight">{user?.name || 'Administrátor'}</p>
                                        <p className="text-xs text-slate-500 truncate mt-1">{user?.email || 'admin@kempofsusti.cz'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl transition-all duration-300 text-sm font-bold border border-red-100 active:scale-[0.98]"
                                >
                                    <LogOut size={18} />
                                    Odhlásit se
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                        {/* Top Bar for Mobile */}
                        <header className="md:hidden h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200 flex items-center px-6 justify-between shrink-0 z-30">
                            <button
                                onClick={toggleSidebar}
                                className="text-slate-900 p-2.5 bg-slate-100 rounded-xl active:scale-95 transition-all"
                            >
                                <Menu size={24} />
                            </button>
                            <span className="font-black text-xl tracking-tight text-slate-900">Kemp<span className="text-primary">OS</span></span>
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {user?.name?.slice(0, 1).toUpperCase() || 'A'}
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto bg-transparent scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                            <div className="p-4 md:p-12 lg:p-16 max-w-[1600px] mx-auto pb-32">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {children}
                                </motion.div>
                            </div>
                        </div>

                        {/* Decoration / Floating mesh circles */}
                        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>
                    </main>
                </div>
            ) : null}
        </div>
    );
}
