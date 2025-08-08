#!/usr/bin/env node
/**
 * Image processing script for Korean travel blog
 * Optimizes images for web use and generates responsive variants
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

class ImageProcessor {
    constructor(sourceDir) {
        this.sourceDir = sourceDir;
        this.supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.tiff'];
    }

    async processDirectory() {
        try {
            console.log(`🖼️  Processing images from: ${this.sourceDir}`);
            
            // Check if source directory exists
            await fs.access(this.sourceDir);
            
            const files = await fs.readdir(this.sourceDir);
            const imageFiles = files.filter(file => 
                this.supportedFormats.includes(path.extname(file).toLowerCase())
            );

            if (imageFiles.length === 0) {
                console.log('❌ No supported image files found');
                return;
            }

            console.log(`📸 Found ${imageFiles.length} images to process`);

            // Create output directory structure
            const locationName = path.basename(this.sourceDir);
            const slug = this.createSlug(locationName);
            const outputDir = path.join('public', 'images', 'posts', slug);
            
            await fs.mkdir(outputDir, { recursive: true });
            
            // Process each image
            let processedCount = 0;
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                const inputPath = path.join(this.sourceDir, file);
                
                try {
                    await this.processImage(inputPath, outputDir, i);
                    processedCount++;
                    console.log(`✅ Processed: ${file}`);
                } catch (error) {
                    console.error(`❌ Error processing ${file}:`, error.message);
                }
            }

            console.log(`\n🎉 Processing complete! ${processedCount}/${imageFiles.length} images processed`);
            console.log(`📁 Images saved to: ${outputDir}`);

        } catch (error) {
            console.error('❌ Error processing directory:', error.message);
            process.exit(1);
        }
    }

    async processImage(inputPath, outputDir, index) {
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        
        // Generate filenames
        const baseName = index === 0 ? 'cover' : `image-${String(index).padStart(2, '0')}`;
        
        // Create multiple sizes for responsive images
        const sizes = [
            { suffix: '', width: 1920, quality: 85 },    // Full size
            { suffix: '-lg', width: 1200, quality: 85 }, // Large
            { suffix: '-md', width: 800, quality: 80 },  // Medium  
            { suffix: '-sm', width: 400, quality: 75 },  // Small/thumbnail
        ];

        for (const size of sizes) {
            const outputPath = path.join(outputDir, `${baseName}${size.suffix}.jpg`);
            
            let pipeline = image.clone();

            // Resize if image is larger than target width
            if (metadata.width > size.width) {
                pipeline = pipeline.resize(size.width, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                });
            }

            // Apply optimizations and save
            await pipeline
                .jpeg({ 
                    quality: size.quality, 
                    progressive: true,
                    mozjpeg: true 
                })
                .toFile(outputPath);
        }

        // Generate WebP versions for better compression
        const webpPath = path.join(outputDir, `${baseName}.webp`);
        await image
            .resize(1920, null, { withoutEnlargement: true, fit: 'inside' })
            .webp({ quality: 80 })
            .toFile(webpPath);

        // Generate AVIF for even better compression (modern browsers)
        try {
            const avifPath = path.join(outputDir, `${baseName}.avif`);
            await image
                .resize(1920, null, { withoutEnlargement: true, fit: 'inside' })
                .avif({ quality: 70 })
                .toFile(avifPath);
        } catch (error) {
            // AVIF might not be supported on all systems
            console.log(`ℹ️  AVIF not generated for ${baseName} (not supported)`);
        }
    }

    createSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}

// Main execution
async function main() {
    const sourceDir = process.argv[2];
    
    if (!sourceDir) {
        console.error('❌ Usage: node process-images.js <source-directory>');
        process.exit(1);
    }

    const processor = new ImageProcessor(sourceDir);
    await processor.processDirectory();
}

// Check if sharp is installed
async function checkDependencies() {
    try {
        require('sharp');
    } catch (error) {
        console.error('❌ Sharp is required but not installed.');
        console.error('📦 Install it with: npm install sharp');
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    checkDependencies().then(() => main());
}