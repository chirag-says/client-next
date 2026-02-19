import HomeContent from "./HomeContent";
import { OrganizationJsonLd, WebsiteJsonLd } from "../components/JsonLd";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:9000';

export const metadata = {
  title: {
    absolute: "DealDirect — Buy & Sell Properties Without Middlemen",
  },
  description:
    "DealDirect is India's #1 platform for buying, selling, and renting properties directly from owners — no brokerage, no middlemen. Browse apartments, villas, plots across Mumbai, Delhi, Bangalore and more.",
  keywords: ["real estate", "property", "buy property", "sell property", "rent property", "no brokerage", "India"],
  alternates: {
    canonical: 'https://dealdirect.in',
  },
};

// Server-side data fetching for homepage
async function getHomeData() {
  const results = { properties: [], categories: [], propertyTypes: [], latestPosts: [] };

  try {
    const [propsRes, catsRes, ptRes, blogRes] = await Promise.allSettled([
      fetch(`${API_BASE}/api/properties/property-list`, { next: { revalidate: 120 } }),
      fetch(`${API_BASE}/api/categories/list-category`, { next: { revalidate: 3600 } }),
      fetch(`${API_BASE}/api/propertyTypes/list-propertytype`, { next: { revalidate: 3600 } }),
      fetch(`${API_BASE}/api/blogs?limit=3`, { next: { revalidate: 600 } }),
    ]);

    if (propsRes.status === 'fulfilled' && propsRes.value.ok) {
      const d = await propsRes.value.json();
      results.properties = d.data || [];
    }
    if (catsRes.status === 'fulfilled' && catsRes.value.ok) {
      const d = await catsRes.value.json();
      results.categories = d.data || d || [];
    }
    if (ptRes.status === 'fulfilled' && ptRes.value.ok) {
      const d = await ptRes.value.json();
      results.propertyTypes = d.data || d || [];
    }
    if (blogRes.status === 'fulfilled' && blogRes.value.ok) {
      const d = await blogRes.value.json();
      results.latestPosts = d.success ? (d.data || []) : [];
    }
  } catch (error) {
    console.error('Error fetching homepage data:', error.message);
  }

  return results;
}

export default async function HomePage() {
  const { properties, categories, propertyTypes, latestPosts } = await getHomeData();

  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <HomeContent
        initialProperties={properties}
        initialCategories={categories}
        initialPropertyTypes={propertyTypes}
        initialLatestPosts={latestPosts}
      />
    </>
  );
}
