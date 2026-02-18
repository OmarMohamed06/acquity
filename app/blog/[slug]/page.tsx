"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase/client";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  created_at: string;
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);

      const { data: postData, error: postError } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (postError || !postData) {
        console.error("Error fetching blog post:", postError);
        router.push("/blog");
        return;
      }

      setPost(postData);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/blog"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Blog
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium truncate">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {formatDate(post.created_at)}
            </p>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed border-l-4 border-blue-600 pl-6 py-2">
            {post.excerpt}
          </p>
        </header>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content - Markdown Rendering */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none
          
          /* Headings - Clean hierarchy with spacing */
          prose-headings:font-black prose-headings:tracking-tight prose-headings:scroll-mt-20
          
          /* H1 - Major section divider */
          prose-h1:text-4xl prose-h1:mt-20 prose-h1:mb-10 prose-h1:pb-6
          prose-h1:text-gray-900 dark:prose-h1:text-white
          prose-h1:border-b-2 prose-h1:border-gray-200 dark:prose-h1:border-gray-700
          
          /* H2 - Section headers with background card */
          prose-h2:text-3xl prose-h2:mt-20 prose-h2:mb-8 prose-h2:-mx-6 prose-h2:px-6 prose-h2:py-5
          prose-h2:bg-gradient-to-r prose-h2:from-blue-50 prose-h2:to-transparent 
          dark:prose-h2:from-blue-950/30 dark:prose-h2:to-transparent
          prose-h2:text-gray-900 dark:prose-h2:text-white
          prose-h2:border-l-4 prose-h2:border-blue-600 dark:prose-h2:border-blue-500
          prose-h2:rounded-r
          
          /* H3 - Subsection headers - BIGGER AND BOLDER */
          prose-h3:text-[1.75rem] prose-h3:font-black prose-h3:mt-12 prose-h3:mb-6
          prose-h3:text-gray-900 dark:prose-h3:text-white
          prose-h3:flex prose-h3:items-center prose-h3:gap-3
          prose-h3:before:content-['▸'] prose-h3:before:text-blue-600 dark:prose-h3:before:text-blue-400
          
          /* Paragraphs - More breathing room */
          prose-p:text-[1.125rem] prose-p:leading-[2] 
          prose-p:text-gray-700 dark:prose-p:text-gray-300
          prose-p:mb-8 prose-p:tracking-normal
          
          /* Links - NO UNDERLINE, just color change */
          prose-a:text-blue-600 dark:prose-a:text-blue-400 
          prose-a:font-semibold prose-a:no-underline 
          prose-a:transition-all prose-a:duration-200
          hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-300
          
          /* Strong/Bold - Highlighted emphasis */
          prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white
          prose-strong:bg-yellow-100/50 dark:prose-strong:bg-yellow-900/20
          prose-strong:px-1.5 prose-strong:py-0.5 prose-strong:rounded prose-strong:mx-0.5
          
          /* Lists - Well spaced with custom markers */
          prose-ul:my-10 prose-ul:space-y-4 prose-ul:pl-6
          prose-ol:my-10 prose-ol:space-y-4 prose-ol:pl-6
          
          /* List items - Readable with breathing room */
          prose-li:text-[1.125rem] prose-li:leading-[2]
          prose-li:text-gray-700 dark:prose-li:text-gray-300
          prose-li:pl-2 prose-li:mb-3
          prose-li:marker:text-blue-600 dark:prose-li:marker:text-blue-400 
          prose-li:marker:font-bold prose-li:marker:text-lg
          
          /* Inline code - Subtle highlight */
          prose-code:bg-gray-100 dark:prose-code:bg-gray-800
          prose-code:text-pink-600 dark:prose-code:text-pink-400
          prose-code:px-2 prose-code:py-0.5 prose-code:rounded
          prose-code:text-[0.9em] prose-code:font-mono prose-code:font-semibold
          prose-code:before:content-none prose-code:after:content-none
          
          /* Code blocks */
          prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950
          prose-pre:text-gray-100 prose-pre:rounded-xl 
          prose-pre:shadow-2xl prose-pre:border prose-pre:border-gray-700
          prose-pre:p-6 prose-pre:my-8 prose-pre:overflow-x-auto
          
          /* Blockquotes - Info cards */
          prose-blockquote:border-l-4 prose-blockquote:border-blue-600 dark:prose-blockquote:border-blue-500
          prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/20
          prose-blockquote:rounded-r-xl prose-blockquote:shadow-sm
          prose-blockquote:py-5 prose-blockquote:px-6 prose-blockquote:my-8
          prose-blockquote:not-italic prose-blockquote:font-normal
          prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
          
          /* Horizontal rules - Section dividers */
          prose-hr:border-0 prose-hr:h-px 
          prose-hr:bg-gradient-to-r prose-hr:from-transparent prose-hr:via-gray-300 prose-hr:to-transparent
          dark:prose-hr:via-gray-600
          prose-hr:my-16
          
          /* Tables - Clean data presentation */
          prose-table:border-collapse prose-table:w-full prose-table:my-10
          prose-table:shadow-lg prose-table:rounded-lg prose-table:overflow-hidden
          
          prose-thead:bg-gradient-to-r prose-thead:from-blue-600 prose-thead:to-blue-700
          dark:prose-thead:from-blue-700 dark:prose-thead:to-blue-800
          prose-thead:border-b-0
          
          prose-th:px-6 prose-th:py-4 prose-th:text-left 
          prose-th:font-bold prose-th:text-white prose-th:text-base
          
          prose-td:px-6 prose-td:py-4 prose-td:border-b 
          prose-td:border-gray-200 dark:prose-td:border-gray-700
          prose-td:text-gray-700 dark:prose-td:text-gray-300
          prose-td:bg-white dark:prose-td:bg-gray-800
          
          prose-tr:hover:bg-blue-50 dark:prose-tr:hover:bg-blue-950/10 
          prose-tr:transition-colors prose-tr:duration-150
          
          /* Images */
          prose-img:rounded-xl prose-img:shadow-xl 
          prose-img:my-10 prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-700"
        >
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            Ready to Take Action?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Browse verified business opportunities today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/businesses-for-sale"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Browse Businesses
            </Link>
            <Link
              href="/franchises-for-sale"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              Explore Franchises
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
