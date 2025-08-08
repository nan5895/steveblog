'use client'

import Script from 'next/script'

export default function GoogleAds() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}