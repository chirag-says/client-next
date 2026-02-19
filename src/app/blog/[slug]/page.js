import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import BlogPostContent from './BlogPostContent';
import { BlogJsonLd } from '../../../components/Blog/BlogJsonLd';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:9000';

async function getBlog(slug) {
    try {
        const res = await fetch(`${API_BASE}/api/blogs/${slug}`, {
            next: { revalidate: 600 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.success ? { blog: data.data, related: data.related } : null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const slug = (await params).slug;
    const result = await getBlog(slug);
    if (!result) return { title: 'Blog Post Not Found' };

    const { blog } = result;
    const title = blog.seoTitle || blog.title;
    const description = blog.seoDescription || blog.excerpt;

    return {
        title,
        description,
        openGraph: {
            type: 'article',
            title,
            description,
            publishedTime: blog.publishedAt,
            modifiedTime: blog.updatedAt,
            tags: blog.tags,
            images: blog.coverImage ? [{ url: blog.coverImage, width: 1200, height: 630, alt: title }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: blog.coverImage ? [blog.coverImage] : [],
        },
        alternates: { canonical: `https://dealdirect.in/blog/${blog.slug}` },
    };
}

export default async function BlogPostPage({ params }) {
    const slug = (await params).slug;
    const result = await getBlog(slug);
    if (!result) notFound();

    const { blog, related } = result;

    return (
        <>
            <BlogJsonLd blog={blog} />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
                <BlogPostContent blog={blog} related={related} />
            </Suspense>
        </>
    );
}
