import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import AdBanner from '@/components/AdBanner'

export default function Home() {
  const posts = getAllPosts()
  const featuredPosts = posts.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdBanner />
      
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Discover Beautiful Places in Korea
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join me on my journey exploring hidden gems and popular destinations across South Korea
        </p>
        <Link
          href="/blog"
          className="inline-block bg-korean-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Explore My Adventures
        </Link>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Latest Adventures
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <div key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
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
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}