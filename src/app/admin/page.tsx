'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function AdminIndex() {
    const router = useRouter();
    const user = useQuery(api.whoami.whoAmI);

    useEffect(() => {
        if (user === undefined) return;
        
        if (user?.role === 'coach') {
            router.push('/admin/my-group');
        } else {
            router.push('/admin/dashboard');
        }
    }, [router, user]);

    return null;
}
