'use client';

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loader2, ShieldAlert, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

export default function AdminUsersPage() {
    const users = useQuery(api.user.getAllUsers);
    const updateRole = useMutation(api.user.updateRole);

    if (users === undefined) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
            </div>
        );
    }

    const handleRoleChange = async (userId: Id<"users">, newRole: "admin" | "coach" | "parent") => {
        try {
            await updateRole({ userId, role: newRole });
            toast.success("Role úspěšně změněna");
        } catch (error) {
            console.error(error);
            toast.error("Chyba při změně role");
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
                <h1 className="text-2xl font-black text-slate-900 mb-2">Správa uživatelů</h1>
                <p className="text-slate-500 mb-8">Přehled všech uživatelů a nastavení jejich oprávnění.</p>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-slate-200 text-sm uppercase tracking-wider text-slate-500">
                                <th className="pb-4 font-bold">Uživatel</th>
                                <th className="pb-4 font-bold">E-mail</th>
                                <th className="pb-4 font-bold">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(u => (
                                <tr key={u._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                                {u.name ? u.name.charAt(0).toUpperCase() : <User size={18} />}
                                            </div>
                                            <span className="font-bold text-slate-900">{u.name || 'Nepojmenovaný'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-slate-600">
                                        {u.email}
                                    </td>
                                    <td className="py-4">
                                        <select 
                                            value={u.role || "parent"}
                                            onChange={(e) => handleRoleChange(u._id, e.target.value as any)}
                                            className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:border-primary transition-colors cursor-pointer"
                                        >
                                            <option value="parent">Rodič</option>
                                            <option value="coach">Trenér</option>
                                            <option value="admin">Administrátor</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            Žádní uživatelé k zobrazení.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
