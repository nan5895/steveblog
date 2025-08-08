#!/usr/bin/env node
/**
 * Korean Travel Blog CLI Tool
 * Easy command-line interface for generating blog posts from photos
 */

const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

const program = new Command();

class BlogCLI {
    constructor() {
        this.setupCommands();
    }

    setupCommands() {
        program
            .name('blog-cli')
            .description('Korean Travel Blog automation CLI')
            .version('1.0.0');

        // Generate post command
        program
            .command('generate')
            .alias('gen')
            .description('Generate a blog post from photos')
            .option('-d, --dir <directory>', 'Photos directory')
            .option('-n, --name <name>', 'Location name')
            .option('-t, --type <type>', 'Post type (travel-guide, food-experience, cultural-experience, hiking-adventure)')
            .option('-i, --interactive', 'Interactive mode')
            .action(this.generatePost.bind(this));

        // List posts command
        program
            .command('list')
            .alias('ls')
            .description('List all blog posts')
            .action(this.listPosts.bind(this));

        // Preview command
        program
            .command('preview')
            .description('Start development server to preview blog')
            .action(this.preview.bind(this));

        // Deploy command
        program
            .command('deploy')
            .description('Deploy blog to production')
            .action(this.deploy.bind(this));

        // Setup command
        program
            .command('setup')
            .description('Setup API keys and configuration')
            .action(this.setup.bind(this));
    }

    async generatePost(options) {
        try {
            let config = {};

            if (options.interactive) {
                config = await this.interactiveGeneration();
            } else {
                config = {
                    directory: options.dir,
                    locationName: options.name,
                    postType: options.type || 'travel-guide'
                };
            }

            // Validate inputs
            if (!config.directory) {
                throw new Error('Photos directory is required');
            }
            if (!config.locationName) {
                throw new Error('Location name is required');
            }

            console.log('🤖 Starting AI blog post generation...');
            console.log(`📁 Photos: ${config.directory}`);
            console.log(`📍 Location: ${config.locationName}`);
            console.log(`📝 Type: ${config.postType}\n`);

            // Set environment variables
            process.env.PHOTOS_DIR = config.directory;
            process.env.LOCATION_NAME = config.locationName;
            process.env.POST_TYPE = config.postType;

            // Run Python script
            await this.runPythonScript('scripts/generate-post.py');

            console.log('\n✅ Blog post generated successfully!');
            console.log('🔗 Run "npm run dev" to preview your blog');

        } catch (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    }

    async interactiveGeneration() {
        const questions = [
            {
                type: 'input',
                name: 'directory',
                message: 'Enter the path to your photos directory:',
                validate: async (input) => {
                    try {
                        await fs.access(input);
                        return true;
                    } catch {
                        return 'Directory does not exist';
                    }
                }
            },
            {
                type: 'input',
                name: 'locationName',
                message: 'What is the name of the location?',
                validate: (input) => input.trim().length > 0 || 'Location name is required'
            },
            {
                type: 'list',
                name: 'postType',
                message: 'What type of post is this?',
                choices: [
                    { name: '🗺️  Travel Guide', value: 'travel-guide' },
                    { name: '🍜 Food Experience', value: 'food-experience' },
                    { name: '🏛️  Cultural Experience', value: 'cultural-experience' },
                    { name: '🥾 Hiking Adventure', value: 'hiking-adventure' }
                ]
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Generate blog post with these settings?',
                default: true
            }
        ];

        const answers = await inquirer.prompt(questions);
        
        if (!answers.confirm) {
            console.log('❌ Generation cancelled');
            process.exit(0);
        }

        return answers;
    }

    async listPosts() {
        try {
            const postsDir = 'posts';
            const files = await fs.readdir(postsDir);
            const mdFiles = files.filter(file => file.endsWith('.md'));

            if (mdFiles.length === 0) {
                console.log('📝 No blog posts found in posts/ directory');
                return;
            }

            console.log(`📚 Found ${mdFiles.length} blog posts:\n`);

            for (const file of mdFiles) {
                const filePath = path.join(postsDir, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const titleMatch = content.match(/^title:\s*["'](.+)["']/m);
                const dateMatch = content.match(/^date:\s*["'](.+)["']/m);
                
                const title = titleMatch ? titleMatch[1] : file;
                const date = dateMatch ? dateMatch[1] : 'Unknown date';
                
                console.log(`📄 ${title}`);
                console.log(`   📅 ${date}`);
                console.log(`   📁 ${file}\n`);
            }
        } catch (error) {
            console.error('❌ Error listing posts:', error.message);
        }
    }

    async preview() {
        console.log('🚀 Starting development server...');
        
        // Check if dependencies are installed
        try {
            await fs.access('node_modules');
        } catch {
            console.log('📦 Installing dependencies...');
            await this.runCommand('npm', ['install']);
        }

        // Start development server
        await this.runCommand('npm', ['run', 'dev']);
    }

    async deploy() {
        try {
            console.log('🚀 Deploying to production...');
            
            // Build the project
            console.log('🔨 Building project...');
            await this.runCommand('npm', ['run', 'build']);
            
            console.log('✅ Build successful!');
            console.log('📋 Push to your GitHub repository to trigger automatic deployment');
            
        } catch (error) {
            console.error('❌ Deployment failed:', error.message);
            process.exit(1);
        }
    }

    async setup() {
        console.log('⚙️  Blog Setup\n');

        const questions = [
            {
                type: 'input',
                name: 'openaiKey',
                message: 'Enter your OpenAI API key:',
                validate: (input) => input.trim().length > 0 || 'API key is required'
            },
            {
                type: 'input',
                name: 'adsenseId',
                message: 'Enter your Google AdSense Publisher ID (ca-pub-xxxxxxxxx):',
                validate: (input) => {
                    if (!input.trim()) return 'AdSense ID is required';
                    if (!input.startsWith('ca-pub-')) return 'AdSense ID should start with ca-pub-';
                    return true;
                }
            }
        ];

        const answers = await inquirer.prompt(questions);

        // Create .env file
        const envContent = `# Korean Travel Blog Configuration
OPENAI_API_KEY=${answers.openaiKey}
NEXT_PUBLIC_ADSENSE_ID=${answers.adsenseId}
`;

        await fs.writeFile('.env.local', envContent);
        console.log('✅ Configuration saved to .env.local');

        // Update AdSense IDs in components
        await this.updateAdsenseIds(answers.adsenseId);
        
        console.log('✅ Setup complete!');
        console.log('🔗 Run "blog-cli generate" to create your first post');
    }

    async updateAdsenseIds(adsenseId) {
        const files = [
            'components/GoogleAds.tsx',
            'components/AdBanner.tsx'
        ];

        for (const file of files) {
            try {
                let content = await fs.readFile(file, 'utf-8');
                content = content.replace(/ca-pub-XXXXXXXXXXXXXXXX/g, adsenseId);
                await fs.writeFile(file, content);
                console.log(`✅ Updated ${file}`);
            } catch (error) {
                console.log(`⚠️  Could not update ${file}: ${error.message}`);
            }
        }
    }

    async runPythonScript(scriptPath) {
        return new Promise((resolve, reject) => {
            const python = spawn('python3', [scriptPath], {
                stdio: 'inherit',
                env: { ...process.env }
            });

            python.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Python script exited with code ${code}`));
                }
            });

            python.on('error', (error) => {
                reject(error);
            });
        });
    }

    async runCommand(command, args) {
        return new Promise((resolve, reject) => {
            const process = spawn(command, args, { stdio: 'inherit' });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`${command} exited with code ${code}`));
                }
            });

            process.on('error', (error) => {
                reject(error);
            });
        });
    }

    run() {
        program.parse();
    }
}

// Run CLI
if (require.main === module) {
    const cli = new BlogCLI();
    cli.run();
}

module.exports = BlogCLI;