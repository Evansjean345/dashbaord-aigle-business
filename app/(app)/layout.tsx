'use client';

import {Layout} from '@/components/layout/layout';
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'
import {TransactionsListener} from "@/components/transactionsListener";

export default function RootLayout({children}: {
    children: React.ReactNode;
}) {
    const router = useRouter()

    useEffect(() => {
        // Prefetch common routes
        router.prefetch('/login')
        router.prefetch('/register')
        router.prefetch('/forgot-password')
        router.prefetch('/dashboard')
        router.prefetch('/users')
        router.prefetch('/organisations')
        router.prefetch('/qr-codes')
        router.prefetch('/reports')
        router.prefetch('/payments')
        router.prefetch('/mobile-money')
        router.prefetch('/profile')
        router.prefetch('/transactions')
        router.prefetch('/airtimes')
        router.prefetch('/bank-transfers')
        router.prefetch('/accounts')
        router.prefetch('/transfert')
    }, [router])

    return <Layout>
        {children}
        <TransactionsListener/>
    </Layout>;
}
