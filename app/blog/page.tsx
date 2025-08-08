import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import AdBanner from '@/components/AdBanner'

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdBanner />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Travel Adventures
        </h1>
        <p className="text-lg text-gray-600">
          Exploring the beauty and culture of South Korea
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {post.coverImage && (
              <div className="relative h-48">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {post.excerpt}
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-korean-red text-white rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-korean-red hover:text-red-700 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No blog posts yet. Create your first post in the /posts directory!
          </p>
        </div>
      )}
    </div>
  )
}