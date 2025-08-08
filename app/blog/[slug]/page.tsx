import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPostBySlug, getAllPosts, markdownToHtml } from '@/lib/posts'
import AdBanner from '@/components/AdBanner'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  return {
    title: `${post.title} | Korean Travel Adventures`,
    description: post.excerpt,
  }
}

export default async function BlogPost({ params }: Props) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  const contentHtml = await markdownToHtml(post.content)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdBanner />
      
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {post.coverImage && (
          <div className="relative h-64 md:h-96">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <time className="text-sm">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs bg-korean-red text-white rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>
          
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>
        </div>
      </article>

      <div className="mt-8">
        <AdBanner />
      </div>
      
      <div className="mt-12 text-center">
        <a
          href="/blog"
          className="inline-block bg-korean-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to Blog
        </a>
      </div>
    </div>
  )
}