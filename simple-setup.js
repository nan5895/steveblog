#!/usr/bin/env node
/**
 * Simple setup script for Korean Travel Blog
 */

const fs = require('fs').promises;
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setup() {
    console.log('🇰🇷 Korean Travel Blog Setup\n');
    
    const claudeKey = await question('Enter your Claude API key: ');
    const adsenseId = await question('Enter your Google AdSense ID (or press Enter to skip): ') || 'ca-pub-your-adsense-id-here';
    
    const envContent = `# Korean Travel Blog Configuration

# Claude API key for AI post generation  
CLAUDE_API_KEY=${claudeKey}

# Google AdSense Publisher ID
NEXT_PUBLIC_ADSENSE_ID=${adsenseId}

# Photo processing settings
PHOTOS_DIR=photos/test-location
LOCATION_NAME=Korean Adventure
POST_TYPE=travel-guide
`;

    await fs.writeFile('.env.local', envContent);
    console.log('\n✅ Configuration saved to .env.local');
    console.log('🚀 Ready to generate your first AI blog post!');
    console.log('\nNext steps:');
    console.log('1. Create photos directory: mkdir photos/your-location');
    console.log('2. Add your Korean travel photos');
    console.log('3. Run: PHOTOS_DIR=photos/your-location LOCATION_NAME="Your Location" python scripts/generate-post.py');
    
    rl.close();
}

setup().catch(console.error);