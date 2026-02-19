import { Suspense } from 'react';
import ClientPropertyList from './ClientPropertyList';
import { BreadcrumbJsonLd } from '../../components/JsonLd';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:9000';

export const metadata = {
    title: 'Properties for Sale & Rent',
    description: 'Browse thousands of verified properties for sale and rent directly from owners. No brokerage, full transparency.',
    openGraph: {
        title: 'Properties for Sale & Rent | DealDirect',
        description: 'Browse thousands of verified properties for sale and rent directly from owners. No brokerage, full transparency.',
    },
    twitter: {
        card: 'summary',
        title: 'Properties for Sale & Rent | DealDirect',
        description: 'Browse verified properties directly from owners.',
    },
    alternates: {
        canonical: 'https://dealdirect.in/properties',
    },
};

// Server-side data fetching for properties listing
async function getInitialProperties() {
    const results = { properties: [], categories: [] };
    try {
        const [propsRes, catsRes] = await Promise.allSettled([
            fetch(`${API_BASE}/api/properties/list?limit=50`, { next: { revalidate: 120 } }),
            fetch(`${API_BASE}/api/categories/list-category`, { next: { revalidate: 3600 } }),
        ]);

        if (propsRes.status === 'fulfilled' && propsRes.value.ok) {
            const d = await propsRes.value.json();
            results.properties = d?.data || d?.properties || d || [];
        }
        if (catsRes.status === 'fulfilled' && catsRes.value.ok) {
            const d = await catsRes.value.json();
            results.categories = d.data || d || [];
        }
    } catch (error) {
        console.error('Error fetching properties for SSR:', error.message);
    }
    return results;
}

export default async function PropertiesPage() {
    const { properties, categories } = await getInitialProperties();

    return (
        <>
            <BreadcrumbJsonLd items={[
                { name: 'Home', href: '/' },
                { name: 'Properties', href: '/properties' },
            ]} />

            {/* Hidden SEO content that crawlers can read */}
            <div className="sr-only" aria-hidden="true">
                <h1>Properties for Sale and Rent on DealDirect</h1>
                <p>Browse {properties.length} verified properties directly from owners. No brokerage fees.</p>
                <ul>
                    {properties.slice(0, 20).map((p) => (
                        <li key={p._id}>
                            {p.title || `Property in ${p.address?.city || p.city || 'India'}`} —
                            ₹{p.price?.toLocaleString()} {p.priceUnit} —
                            {p.address?.city || p.city}, {p.address?.state || p.state}
                        </li>
                    ))}
                </ul>
            </div>

            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading properties map...</div>}>
                <ClientPropertyList initialProperties={properties} initialCategories={categories} />
            </Suspense>
        </>
    );
}
