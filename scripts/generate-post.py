#!/usr/bin/env python3
"""
AI-powered blog post generator for Korean travel blog.
Analyzes photos and generates markdown blog posts automatically.
"""

import os
import json
import base64
import shutil
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any
from PIL import Image
from PIL.ExifTags import TAGS
import exifread
import anthropic
from dotenv import load_dotenv

load_dotenv()

class BlogPostGenerator:
    def __init__(self):
        self.claude_client = anthropic.Anthropic(api_key=os.getenv('CLAUDE_API_KEY'))
        self.photos_dir = os.getenv('PHOTOS_DIR', 'photos/new-location')
        self.location_name = os.getenv('LOCATION_NAME', 'Korean Adventure')
        self.post_type = os.getenv('POST_TYPE', 'travel-guide')
        
    def extract_photo_metadata(self, photo_path: str) -> Dict[str, Any]:
        """Extract metadata from photo including EXIF data."""
        metadata = {
            'filename': os.path.basename(photo_path),
            'path': photo_path,
            'size': None,
            'date_taken': None,
            'gps_location': None,
            'camera_info': None
        }
        
        try:
            # Get file size
            metadata['size'] = os.path.getsize(photo_path)
            
            # Extract EXIF data
            with open(photo_path, 'rb') as f:
                tags = exifread.process_file(f)
                
                if 'EXIF DateTimeOriginal' in tags:
                    metadata['date_taken'] = str(tags['EXIF DateTimeOriginal'])
                
                # GPS coordinates
                if 'GPS GPSLatitude' in tags and 'GPS GPSLongitude' in tags:
                    metadata['gps_location'] = {
                        'latitude': tags['GPS GPSLatitude'],
                        'longitude': tags['GPS GPSLongitude']
                    }
                
                # Camera info
                if 'Image Make' in tags or 'Image Model' in tags:
                    metadata['camera_info'] = {
                        'make': str(tags.get('Image Make', '')),
                        'model': str(tags.get('Image Model', ''))
                    }
                    
        except Exception as e:
            print(f"Error extracting metadata from {photo_path}: {e}")
            
        return metadata
    
    def analyze_photos_with_ai(self, photo_paths: List[str]) -> Dict[str, Any]:
        """Analyze photos using Claude Vision API to understand content."""
        
        # Prepare images for analysis
        image_content = []
        for photo_path in photo_paths[:8]:  # Claude handles more images efficiently
            try:
                with open(photo_path, "rb") as image_file:
                    base64_image = base64.b64encode(image_file.read()).decode('utf-8')
                    
                    # Determine image format
                    image_format = "jpeg"
                    if photo_path.lower().endswith('.png'):
                        image_format = "png"
                    elif photo_path.lower().endswith('.webp'):
                        image_format = "webp"
                    
                    image_content.append({
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": f"image/{image_format}",
                            "data": base64_image
                        }
                    })
            except Exception as e:
                print(f"Error processing image {photo_path}: {e}")
        
        # Create AI analysis prompt
        prompt = f"""
        Analyze these photos from a trip to {self.location_name} in South Korea.
        
        Please provide a detailed analysis in JSON format with the following structure:
        {{
            "location_analysis": {{
                "primary_location": "specific location name",
                "location_type": "city/nature/cultural site/etc",
                "notable_landmarks": ["landmark1", "landmark2"],
                "activities_shown": ["activity1", "activity2"],
                "time_of_day": "morning/afternoon/evening/night",
                "season": "spring/summer/autumn/winter"
            }},
            "content_suggestions": {{
                "main_highlights": ["highlight1", "highlight2", "highlight3"],
                "story_narrative": "brief story flow suggestion",
                "recommended_sections": ["section1", "section2", "section3"],
                "cultural_elements": ["element1", "element2"]
            }},
            "image_descriptions": [
                {{
                    "image_index": 0,
                    "description": "detailed description",
                    "suggested_caption": "caption for blog",
                    "is_cover_worthy": true/false
                }}
            ],
            "seo_keywords": ["keyword1", "keyword2", "keyword3"],
            "estimated_visit_duration": "duration suggestion"
        }}
        
        Focus on Korean travel context, cultural significance, and practical travel tips.
        Provide authentic insights about Korean culture, food, customs, and travel logistics.
        """
        
        try:
            message = self.claude_client.messages.create(
                model="claude-3-5-sonnet-20241022",  # Latest vision-capable model
                max_tokens=4000,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt}
                        ] + image_content
                    }
                ]
            )
            
            return json.loads(message.content[0].text)
        except Exception as e:
            print(f"Error analyzing photos with Claude: {e}")
            return self._get_fallback_analysis()
    
    def _get_fallback_analysis(self) -> Dict[str, Any]:
        """Fallback analysis if AI fails."""
        return {
            "location_analysis": {
                "primary_location": self.location_name,
                "location_type": "travel destination",
                "notable_landmarks": [],
                "activities_shown": ["sightseeing"],
                "time_of_day": "day",
                "season": "unknown"
            },
            "content_suggestions": {
                "main_highlights": ["Beautiful scenery", "Cultural experience", "Local cuisine"],
                "story_narrative": "A wonderful journey exploring Korean culture and landscapes",
                "recommended_sections": ["Introduction", "Main Attractions", "Food & Culture", "Tips"],
                "cultural_elements": ["Korean culture", "Traditional architecture", "Local customs"]
            },
            "image_descriptions": [],
            "seo_keywords": ["Korea travel", self.location_name, "Korean culture"],
            "estimated_visit_duration": "1-2 days"
        }
    
    def generate_blog_content(self, analysis: Dict[str, Any], metadata_list: List[Dict]) -> str:
        """Generate the actual blog post content."""
        
        prompt = f"""
        You are an experienced Korean travel blogger who creates authentic, engaging, and highly informative travel content. Write a detailed travel blog post about {self.location_name} in South Korea.
        
        Use this detailed analysis from my photos: {json.dumps(analysis, indent=2)}
        
        Post type: {self.post_type}
        
        WRITING STYLE REQUIREMENTS:
        • Write in first person with authentic, personal experiences
        • Use storytelling techniques to make it engaging and memorable  
        • Include sensory descriptions (what I saw, heard, smelled, tasted)
        • Add genuine emotions and personal reactions to create connection
        • Balance practical information with inspiring narrative
        • Use varied sentence structures and compelling transitions
        
        CONTENT REQUIREMENTS:
        • Korean names with proper romanization and English translations (한글/Hangul)
        • Specific transportation details (subway lines, bus numbers, walking times)
        • Real cost estimates in KRW and USD 
        • Best times to visit (season, time of day, avoiding crowds)
        • Cultural context explaining WHY things are significant
        • Historical background that adds depth
        • Local etiquette and customs visitors should know
        • Food recommendations with descriptions and where to find them
        • Photography tips for each location
        • Hidden gems and local secrets
        • Common mistakes to avoid
        
        STRUCTURE:
        • Engaging introduction with a hook
        • Clear section headings with emojis
        • Logical flow from arrival to departure
        • Photo placement suggestions as HTML comments
        • Practical "Planning Your Visit" section
        • Call-to-action ending encouraging engagement
        
        FORMAT: Markdown with frontmatter including:
        • Compelling, SEO-optimized title
        • Meta description excerpt (150-160 characters)
        • Relevant tags for Korean travel, location, activities
        • Current date
        • Cover image suggestion
        
        TARGET: 1800-2500 words of high-value, shareable travel content that helps readers plan an amazing Korean adventure while building trust and authority.
        
        Make this the kind of blog post that travel enthusiasts bookmark and share!
        """
        
        try:
            # Try latest model first, fallback to stable version
            try:
                message = self.claude_client.messages.create(
                    model="claude-3-5-sonnet-20250108",  # Latest model for best writing
                    max_tokens=4000,
                    temperature=0.8,  # Slightly higher for more creative writing
                    messages=[{"role": "user", "content": prompt}]
                )
            except:
                # Fallback to proven stable model
                message = self.claude_client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=4000,
                    temperature=0.8,
                    messages=[{"role": "user", "content": prompt}]
                )
            
            return message.content[0].text
        except Exception as e:
            print(f"Error generating blog content with Claude: {e}")
            return self._get_fallback_content()
    
    def _get_fallback_content(self) -> str:
        """Fallback content if AI generation fails."""
        date = datetime.now().strftime("%Y-%m-%d")
        slug = self.location_name.lower().replace(' ', '-')
        
        return f"""---
title: "Exploring {self.location_name}: A Korean Adventure"
date: "{date}"
excerpt: "Discover the beauty and culture of {self.location_name} through my latest Korean travel adventure."
coverImage: "/images/posts/{slug}/cover.jpg"
tags: ["Korea", "Travel", "{self.location_name}", "Culture"]
---

# Exploring {self.location_name}: A Korean Adventure

My recent trip to {self.location_name} was an incredible journey through South Korea's rich culture and stunning landscapes. Here's everything you need to know about visiting this amazing destination.

## Getting There

[Transportation details to be added based on location]

## What to See and Do

[Main attractions and activities to be added]

## Local Food and Culture

[Cultural experiences and food recommendations to be added]

## Practical Tips

- Best time to visit: [Season recommendation]
- Estimated cost: [Budget information]
- Duration: [Recommended stay length]

## Final Thoughts

{self.location_name} exceeded all my expectations and provided an authentic glimpse into Korean culture. I can't wait to return and explore more of this beautiful country.

---

*Have you visited {self.location_name}? Share your experiences in the comments below!*
"""
    
    def process_images(self) -> List[str]:
        """Process and optimize images for web use."""
        photo_paths = []
        photos_dir = Path(self.photos_dir)
        
        if not photos_dir.exists():
            print(f"Photos directory {self.photos_dir} does not exist!")
            return []
        
        # Create output directory
        slug = self.location_name.lower().replace(' ', '-').replace(':', '')
        output_dir = Path(f"public/images/posts/{slug}")
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Process each image
        for i, photo_path in enumerate(photos_dir.glob("*.{jpg,jpeg,png,JPG,JPEG,PNG}")):
            try:
                # Open and optimize image
                with Image.open(photo_path) as img:
                    # Convert to RGB if necessary
                    if img.mode in ('RGBA', 'LA', 'P'):
                        img = img.convert('RGB')
                    
                    # Resize if too large
                    max_width = 1920
                    if img.width > max_width:
                        ratio = max_width / img.width
                        new_height = int(img.height * ratio)
                        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                    
                    # Save optimized image
                    if i == 0:  # First image as cover
                        output_path = output_dir / "cover.jpg"
                    else:
                        output_path = output_dir / f"image-{i:02d}.jpg"
                    
                    img.save(output_path, 'JPEG', quality=85, optimize=True)
                    photo_paths.append(str(photo_path))
                    
                    print(f"Processed: {photo_path} -> {output_path}")
                    
            except Exception as e:
                print(f"Error processing image {photo_path}: {e}")
        
        return photo_paths
    
    def save_blog_post(self, content: str) -> str:
        """Save the generated blog post to the posts directory."""
        # Create slug from location name
        slug = self.location_name.lower().replace(' ', '-').replace(':', '').replace(',', '')
        date_str = datetime.now().strftime("%Y-%m-%d")
        filename = f"{date_str}-{slug}.md"
        
        posts_dir = Path("posts")
        posts_dir.mkdir(exist_ok=True)
        
        post_path = posts_dir / filename
        
        with open(post_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Blog post saved: {post_path}")
        return str(post_path)
    
    def generate(self) -> Dict[str, str]:
        """Main method to generate blog post from photos."""
        print(f"🤖 Generating blog post for {self.location_name}")
        print(f"📁 Photos directory: {self.photos_dir}")
        print(f"📝 Post type: {self.post_type}")
        
        # Process images first
        print("\n📸 Processing images...")
        photo_paths = self.process_images()
        
        if not photo_paths:
            print("❌ No photos found to process!")
            return {"error": "No photos found"}
        
        print(f"✅ Processed {len(photo_paths)} images")
        
        # Extract metadata
        print("\n🔍 Extracting photo metadata...")
        metadata_list = [self.extract_photo_metadata(path) for path in photo_paths]
        
        # Analyze photos with AI
        print("\n🧠 Analyzing photos with AI...")
        analysis = self.analyze_photos_with_ai(photo_paths)
        
        # Generate blog content
        print("\n✍️ Generating blog content...")
        blog_content = self.generate_blog_content(analysis, metadata_list)
        
        # Save blog post
        print("\n💾 Saving blog post...")
        post_path = self.save_blog_post(blog_content)
        
        print("\n🎉 Blog post generation complete!")
        
        return {
            "success": True,
            "post_path": post_path,
            "images_processed": len(photo_paths),
            "analysis": analysis
        }

def main():
    """Main function to run the blog post generator."""
    generator = BlogPostGenerator()
    result = generator.generate()
    
    if result.get("success"):
        print(f"\n✅ SUCCESS!")
        print(f"📄 Post saved to: {result['post_path']}")
        print(f"🖼️ Images processed: {result['images_processed']}")
    else:
        print(f"\n❌ FAILED: {result.get('error', 'Unknown error')}")
        exit(1)

if __name__ == "__main__":
    main()