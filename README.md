# Steve's Korean Travel Blog

AI-powered blog showcasing Steve's travel adventures in South Korea, with automated post generation, Google AdSense integration, and responsive design.

## 🚀 Features

- 🤖 **AI-powered post generation** from photos
- 🚀 **Next.js 14** with TypeScript
- 📝 **Markdown blog posts** with frontmatter
- 🖼️ **Automatic image optimization** and processing
- 💰 **Google AdSense integration** ready for monetization
- 🎨 **Responsive design** with Tailwind CSS
- 🏷️ **Tag system** for post categorization
- 📱 **Mobile-friendly** layout
- 🔄 **GitHub Actions automation**

## 🎯 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   pip install -r requirements.txt
   ```

2. **Setup configuration:**
   ```bash
   npm run blog setup
   ```

3. **Generate your first post:**
   ```bash
   npm run blog generate --interactive
   ```

4. **Preview your blog:**
   ```bash
   npm run dev
   ```

## 🤖 AI Post Generation

Simply provide a directory with your travel photos and let AI create a complete blog post:

```bash
# Interactive mode
npm run blog generate -i

# Command line mode  
npm run blog generate --dir photos/seoul --name "Seoul Adventure" --type travel-guide
```

## 🌐 Deployment

Automatic deployment to Vercel when you push to GitHub. See [DEPLOYMENT.md](DEPLOYMENT.md) for full setup instructions.

## 📁 Project Structure

```
├── app/                 # Next.js app directory
├── components/          # React components with AdSense
├── lib/                # Blog post utilities
├── posts/              # Generated markdown posts
├── scripts/            # AI generation and automation
├── photos/             # Your travel photos
└── public/images/      # Processed blog images
```

Happy blogging! 🇰🇷
