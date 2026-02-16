import { Suspense } from 'react';
import ClientPropertyList from './ClientPropertyList';
import { BreadcrumbJsonLd } from '../../components/JsonLd';

export const metadata = {
    title: 'Properties for Sale & Rent',
    description: 'Browse thousands of verified properties for sale and rent directly from owners. No brokerage, full transparency.',
    openGraph: {
        title: 'Properties for Sale & Rent',
        description: 'Browse thousands of verified properties for sale and rent directly from owners. No brokerage, full transparency.',
    },
    twitter: {
        card: 'summary',
        title: 'Properties for Sale & Rent',
        description: 'Browse verified properties directly from owners.',
    },
    alternates: {
        canonical: 'https://dealdirect.in/properties',
    },
};

export default function PropertiesPage() {
    return (
        <>
            <BreadcrumbJsonLd items={[
                { name: 'Home', href: '/' },
                { name: 'Properties', href: '/properties' },
            ]} />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading properties map...</div>}>
                <ClientPropertyList />
            </Suspense>
        </>
    );
}
