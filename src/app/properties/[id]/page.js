import { Suspense } from 'react';
import PropertyDetailsContent from './PropertyDetailsContent';
import { getApiBase } from '../../../utils/config';
import { PropertyJsonLd, BreadcrumbJsonLd } from '../../../components/JsonLd';

// Helper to fetch property data
async function getProperty(id) {
    if (!id) return null;
    try {
        const res = await fetch(`${getApiBase()}/api/properties/${id}`, {
            next: { revalidate: 60 }, // ISR: Cache for 60 seconds
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            console.error(`Failed to fetch property: ${res.status}`);
            return null;
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching property for metadata:', error);
        return null;
    }
}

export async function generateMetadata(props) {
    const params = await props.params;
    const id = params?.id;

    if (!id) return {};

    const property = await getProperty(id);

    if (!property) {
        return {
            title: 'Property Not Found',
            description: 'The requested property could not be found.',
        };
    }

    const title = property.title || `${property.bhk || ''} ${property.category?.name || 'Property'} for ${property.listingType} in ${property.city}`;
    const description = property.description?.substring(0, 160) || `Check out this ${property.category?.name} in ${property.city} on DealDirect.`;

    const images = property.images && property.images.length > 0
        ? property.images.map(img => img.startsWith('http') ? img : `${getApiBase()}/uploads/${img}`)
        : [];

    return {
        title: title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            images: images.length > 0 ? images.map(url => ({ url, width: 1200, height: 630 })) : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: images.length > 0 ? [images[0]] : undefined,
        },
        alternates: {
            canonical: `https://dealdirect.in/properties/${id}`,
        },
    };
}

export default async function PropertyDetailsPage(props) {
    const params = await props.params;
    const id = params?.id;

    const property = await getProperty(id);

    // Build breadcrumb items
    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'Properties', href: '/properties' },
    ];
    if (property) {
        const propertyTitle = property.title || `${property.bhk || ''} ${property.category?.name || 'Property'} in ${property.city || ''}`;
        breadcrumbItems.push({
            name: propertyTitle,
            href: `/properties/${id}`,
        });
    }

    return (
        <>
            {property && <PropertyJsonLd property={property} />}
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading property details...</div>}>
                <PropertyDetailsContent initialProperty={property} />
            </Suspense>
        </>
    );
}
