/**
 * Dynamic Sitemap for DealDirect
 * Fetches all published property IDs from the backend and generates a comprehensive sitemap.
 * Next.js automatically serves this at /sitemap.xml
 */

const SITE_URL = 'https://dealdirect.in';

export default async function sitemap() {
    // Static pages with their priorities and change frequencies
    const staticPages = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/properties`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/why-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/login`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${SITE_URL}/register`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.2,
        },
    ];

    // Fetch all published properties from the backend
    let propertyPages = [];
    try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:9000';
        const res = await fetch(`${apiBase}/api/properties/list?limit=5000`, {
            next: { revalidate: 3600 }, // Revalidate sitemap data every 1 hour
        });

        if (res.ok) {
            const data = await res.json();
            const properties = data?.data || data?.properties || data || [];

            if (Array.isArray(properties)) {
                propertyPages = properties.map((property) => ({
                    url: `${SITE_URL}/properties/${property._id}`,
                    lastModified: property.updatedAt
                        ? new Date(property.updatedAt)
                        : new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                }));
            }
        }
    } catch (error) {
        console.error('Error fetching properties for sitemap:', error.message);
        // Return static pages even if property fetch fails
    }

    return [...staticPages, ...propertyPages];
}
