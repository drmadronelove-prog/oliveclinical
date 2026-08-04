import { ToolPageLayout } from "@/components/tool-page-layout"
import { BlogHeroCard } from "@/components/blog/blog-hero-card"
import { posts } from "./posts"

export const metadata = {
  title: "Blog | Olive Clinical",
  description: "Thoughts on neurodivergent-affirming therapy, mental wellness, and living differently.",
}

export default function BlogPage() {
  return (
    <ToolPageLayout title="Blog" color="text-ink">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {posts.map((post, i) => (
          <BlogHeroCard
            key={post.slug}
            post={{
              slug: post.slug,
              title: post.title,
              category: post.category,
              date: post.date,
            }}
            index={i}
          />
        ))}
      </div>
    </ToolPageLayout>
  )
}
