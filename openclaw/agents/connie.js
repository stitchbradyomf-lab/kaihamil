#!/usr/bin/env node
/**
 * Connie - Content Publisher Agent
 * Transforms research/content into production-ready HTML/CSS
 * 
 * Usage: node connie.js <source-file> <output-path> [options]
 */

const fs = require('fs');
const path = require('path');

// Identity token for audit trail
const AGENT_IDENTITY = `khai-content-pub-${process.env.NODE_ENV || 'prod'}-${Date.now()}`;

// Site-standard design tokens
const DESIGN_TOKENS = {
  fonts: {
    heading: "'Cormorant Garamond', serif",
    body: "'Inter', -apple-system, sans-serif"
  },
  colors: {
    bgWarm: '#f8f5f0',
    bgPaper: '#fdfcfa',
    inkDark: '#2c2420',
    inkMedium: '#5a5048',
    clay: '#c4a484',
    terracotta: '#b87a5e',
    sand: '#e8ddd3',
    goldWarm: '#c9a86c'
  },
  spacing: {
    contentMaxWidth: '700px',
    sectionMargin: '50px',
    mobilePadding: '20px',
    desktopPadding: '40px'
  }
};

// Templates
const TEMPLATES = {
  research: {
    name: 'Research Article',
    navLinks: [
      { text: 'Home', url: 'https://content.kaihamil.com/' },
      { text: 'System', url: 'https://content.kaihamil.com/frameworks/' },
      { text: 'Self', url: 'https://content.kaihamil.com/wisdom/' }
    ]
  },
  post: {
    name: 'Blog Post',
    navLinks: [
      { text: 'Home', url: '/' },
      { text: 'Posts', url: '/posts/' },
      { text: 'Research', url: '/research/' },
      { text: 'Frameworks', url: '/frameworks/' }
    ]
  },
  framework: {
    name: 'Framework Page',
    navLinks: [
      { text: 'Home', url: '/' },
      { text: 'System', url: '/frameworks/' },
      { text: 'Self', url: '/wisdom/' }
    ]
  }
};

/**
 * Parse markdown-like content to HTML
 */
function parseContent(content) {
  let html = content;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  
  // Highlight boxes (blockquotes)
  html = html.replace(/^> (.*$)/gim, '<div class="highlight-box"><p>$1</p></div>');
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><\/p>/g, '');
  
  // Clean up
  html = html.replace(/\n/g, ' ');
  html = html.replace(/\s+/g, ' ');
  
  return html.trim();
}

/**
 * Extract metadata from content
 */
function extractMetadata(content, sourcePath) {
  const metadata = {
    title: 'Untitled',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min',
    category: 'Research',
    template: 'research'
  };
  
  // Extract title from first h1
  const titleMatch = content.match(/^# (.*$)/m);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  }
  
  // Detect template from content
  if (content.includes('framework') || content.includes('Framework')) {
    metadata.template = 'framework';
    metadata.category = 'Framework';
  } else if (sourcePath.includes('post') || content.includes('essay') || content.includes('blog')) {
    metadata.template = 'post';
    metadata.category = 'Essay';
  }
  
  // Estimate read time (rough: 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));
  metadata.readTime = `${readMinutes} min`;
  
  return metadata;
}

/**
 * Generate HTML document
 */
function generateHTML(content, metadata, template) {
  const parsedContent = parseContent(content);
  const nav = TEMPLATES[template].navLinks.map(link => 
    `<a href="${link.url}">${link.text}</a>`
  ).join('\n            ');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title} | Kai Hamil</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-warm: ${DESIGN_TOKENS.colors.bgWarm};
            --bg-paper: ${DESIGN_TOKENS.colors.bgPaper};
            --ink-dark: ${DESIGN_TOKENS.colors.inkDark};
            --ink-medium: ${DESIGN_TOKENS.colors.inkMedium};
            --clay: ${DESIGN_TOKENS.colors.clay};
            --terracotta: ${DESIGN_TOKENS.colors.terracotta};
            --sand: ${DESIGN_TOKENS.colors.sand};
            --gold-warm: ${DESIGN_TOKENS.colors.goldWarm};
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: ${DESIGN_TOKENS.fonts.body};
            background: var(--bg-warm);
            color: var(--ink-dark);
            line-height: 1.8;
        }
        
        .nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(to bottom, var(--bg-warm), transparent);
            z-index: 100;
        }
        
        .logo { 
            font-family: ${DESIGN_TOKENS.fonts.heading};
            font-size: 1.5rem; 
            font-weight: 500; 
            color: var(--ink-dark); 
            text-decoration: none; 
        }
        
        .nav-links a {
            color: var(--ink-medium);
            text-decoration: none;
            margin-left: 30px;
            font-size: 0.9rem;
        }
        
        .nav-links a:hover { color: var(--terracotta); }
        
        .article-header {
            padding: 140px 40px 60px;
            max-width: 700px;
            margin: 0 auto;
        }
        
        .article-meta {
            color: var(--ink-medium);
            font-size: 0.9rem;
            margin-bottom: 20px;
        }
        
        .article-header h1 {
            font-family: ${DESIGN_TOKENS.fonts.heading};
            font-size: clamp(2rem, 5vw, 2.8rem);
            font-weight: 400;
            line-height: 1.3;
            margin-bottom: 20px;
        }
        
        .article-subtitle {
            font-size: 1.2rem;
            color: var(--ink-medium);
            font-weight: 300;
            line-height: 1.6;
        }
        
        .article-content {
            max-width: 700px;
            margin: 0 auto;
            padding: 0 40px 80px;
        }
        
        .article-content p {
            margin-bottom: 25px;
            font-size: 1.1rem;
            line-height: 1.9;
        }
        
        .article-content h2 {
            font-family: ${DESIGN_TOKENS.fonts.heading};
            font-size: 1.8rem;
            font-weight: 500;
            margin: 50px 0 25px;
            color: var(--ink-dark);
        }
        
        .article-content h3 {
            font-family: ${DESIGN_TOKENS.fonts.heading};
            font-size: 1.4rem;
            font-weight: 500;
            margin: 40px 0 20px;
            color: var(--terracotta);
        }
        
        .article-content strong {
            font-weight: 600;
            color: var(--ink-dark);
        }
        
        .article-content ul, .article-content ol {
            margin: 20px 0 25px 30px;
        }
        
        .article-content li {
            margin-bottom: 12px;
            font-size: 1.1rem;
            line-height: 1.7;
        }
        
        .highlight-box {
            background: var(--bg-paper);
            border-left: 4px solid var(--terracotta);
            padding: 25px 30px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .highlight-box p {
            margin: 0;
            font-size: 1.1rem;
        }
        
        .article-footer {
            max-width: 700px;
            margin: 0 auto;
            padding: 40px;
            border-top: 1px solid var(--sand);
            text-align: center;
        }
        
        .article-footer a {
            color: var(--terracotta);
            text-decoration: none;
        }
        
        .article-footer a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 768px) {
            .article-header { padding: 100px 20px 40px; }
            .article-content { padding: 0 20px 60px; }
            .nav { padding: 15px 20px; }
        }
        
        /* Agent identity marker for audit trail */
        .agent-meta {
            display: none;
        }
    </style>
</head>
<body>
    <nav class="nav">
        <a href="https://content.kaihamil.com/" class="logo">kai hamil</a>
        <div class="nav-links">
            ${nav}
        </div>
    </nav>
    
    <header class="article-header">
        <div class="article-meta">${metadata.date} · ${metadata.readTime} · ${metadata.category}</div>
        <h1>${metadata.title}</h1>
    </header>
    
    <article class="article-content">
        ${parsedContent}
    </article>
    
    <footer class="article-footer">
        <p><a href="https://content.kaihamil.com/research/">← Back to Research</a></p>
    </footer>
    
    <!-- Agent identity for audit: ${AGENT_IDENTITY} -->
    <meta name="generator" content="${AGENT_IDENTITY}" class="agent-meta">
</body>
</html>`;
}

/**
 * Log activity for audit trail
 */
function logActivity(action, source, output, status) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    agent: AGENT_IDENTITY,
    action,
    source,
    output,
    status
  };
  
  const logPath = '/Users/openclaw-stitch/.openclaw/workspace/openclaw/logs/connie-activity.jsonl';
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
  console.log(`[Connie] Logged: ${action} - ${status}`);
}

/**
 * Main transformation function
 */
async function transform(sourcePath, outputPath) {
  try {
    console.log(`[Connie] Starting transformation: ${sourcePath} → ${outputPath}`);
    
    // Read source
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Source file not found: ${sourcePath}`);
    }
    
    const content = fs.readFileSync(sourcePath, 'utf-8');
    console.log(`[Connie] Read ${content.length} characters from source`);
    
    // Extract metadata
    const metadata = extractMetadata(content, sourcePath);
    console.log(`[Connie] Detected template: ${metadata.template}`);
    console.log(`[Connie] Title: ${metadata.title}`);
    
    // Generate HTML
    const html = generateHTML(content, metadata, metadata.template);
    
    // Write output
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`[Connie] Written ${html.length} characters to ${outputPath}`);
    
    // Log success
    logActivity('TRANSFORM', sourcePath, outputPath, 'SUCCESS');
    
    return {
      success: true,
      identity: AGENT_IDENTITY,
      source: sourcePath,
      output: outputPath,
      metadata
    };
    
  } catch (error) {
    console.error(`[Connie] Error: ${error.message}`);
    logActivity('TRANSFORM', sourcePath, outputPath, `ERROR: ${error.message}`);
    throw error;
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node connie.js <source-file> <output-path>');
    console.log('Example: node connie.js content-pipeline/research.md posts/research-article.html');
    process.exit(1);
  }
  
  const [sourcePath, outputPath] = args;
  
  transform(sourcePath, outputPath)
    .then(result => {
      console.log('\n[Connie] Transformation complete!');
      console.log(`Identity: ${result.identity}`);
      console.log(`Output: ${result.output}`);
      console.log(`\nNext: Review staged content, then deploy.`);
    })
    .catch(error => {
      console.error('\n[Connie] Transformation failed:', error.message);
      process.exit(1);
    });
}

module.exports = { transform, parseContent, extractMetadata, generateHTML };
