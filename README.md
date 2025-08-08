# Korean Travel Blog

A Next.js blog showcasing travel adventures in South Korea, with Google AdSense integration, markdown support, and responsive design.

## Features

- 🚀 **Next.js 14** with TypeScript
- 📝 **Markdown blog posts** with frontmatter
- 🖼️ **Image optimization** with Next.js Image component  
- 💰 **Google AdSense integration** ready for monetization
- 🎨 **Responsive design** with Tailwind CSS
- 🏷️ **Tag system** for post categorization
- 📱 **Mobile-friendly** layout

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Google AdSense:**
   - Replace `ca-pub-XXXXXXXXXXXXXXXX` with your AdSense publisher ID in:
     - `components/GoogleAds.tsx`
     - `components/AdBanner.tsx`
   - Replace `XXXXXXXXXX` with your ad slot IDs

3. **Add your images:**
   - Place images in `/public/images/`
   - Reference them in markdown as `/images/filename.jpg`

4. **Create blog posts:**
   - Add `.md` files to `/posts/` directory
   - Use the frontmatter format shown in example posts

5. **Run development server:**
   ```bash
   npm run dev
   ```

## Writing Blog Posts

Create markdown files in `/posts/` with this frontmatter:

```markdown
---
title: "Your Post Title"
date: "2025-01-15"
excerpt: "Brief description of your post"
coverImage: "/images/your-cover.jpg"
tags: ["Tag1", "Tag2", "Tag3"]
---

Your markdown content here...
```

## Deployment

This blog is ready to deploy on Vercel, Netlify, or any platform that supports Next.js:

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                 # Next.js app directory
├── components/          # Reusable React components
├── lib/                # Utility functions
├── posts/              # Markdown blog posts
├── public/             # Static assets
└── styles/             # Global styles
```

## Customization

- **Colors**: Edit Korean theme colors in `tailwind.config.js`
- **Fonts**: Modify font settings in `app/layout.tsx`
- **Layout**: Update components in `/components/`
- **Styling**: Customize with Tailwind classes

## AdSense Setup Tips

1. Apply for Google AdSense approval
2. Add your site to AdSense
3. Create ad units and get the codes
4. Replace placeholder IDs in the code
5. Test ads in production (they won't show in development)

Happy blogging! 🇰🇷