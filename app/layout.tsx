import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GoogleAds from '@/components/GoogleAds'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Korean Travel Adventures',
  description: 'Discover beautiful places in Korea through my travel experiences',
  keywords: 'Korea travel, Korean destinations, travel blog, Seoul, Busan, Jeju',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAds />
      </head>
      <body className={inter.className}>
        <header className="bg-white shadow-sm border-b border-gray-200">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🇰🇷</span>
                <h1 className="text-xl font-bold text-gray-900">
                  Korean Travel Adventures
                </h1>
              </div>
              <div className="flex space-x-8">
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </a>
                <a href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Blog
                </a>
                <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </a>
              </div>
            </div>
          </nav>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2025 Korean Travel Adventures. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}