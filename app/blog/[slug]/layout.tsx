import type { Metadata } from "next";
import { ReactNode } from "react";
import JsonLd from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/seo/base-url";
import { getBlogPostBySlug } from "@/lib/seo/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const baseUrl = getBaseUrl();

  if (!post) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = post.title || "Acquity Blog";
  const description =
    post.excerpt ||
    "Insights for buying, selling, and investing in businesses.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${baseUrl}/blog/${post.slug}`,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  };
}

export default async function BlogPostLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const baseUrl = getBaseUrl();
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  return (
    <>
      {post && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt || undefined,
            image: post.cover_image || undefined,
            datePublished: post.created_at || undefined,
            author: {
              "@type": "Organization",
              name: "Acquity",
            },
            publisher: {
              "@type": "Organization",
              name: "Acquity",
              logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/logo.svg`,
              },
            },
            mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
          }}
        />
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: baseUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: `${baseUrl}/blog`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post?.title || "Article",
              item: post ? `${baseUrl}/blog/${post.slug}` : `${baseUrl}/blog`,
            },
          ],
        }}
      />
      {children}
    </>
  );
}
