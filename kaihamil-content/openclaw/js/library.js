// Content Library Data
const libraryData = [
    {
        id: 1,
        filename: "realtor-discovery-framework.md",
        title: "Realtor Discovery Framework",
        description: "Comprehensive 20-question framework for identifying root cause problems in realtor businesses and mapping to AI solutions. Includes 5 phases: Business Model, Client Lifecycle, Documentation Chaos, Time Allocation, and Competitive Positioning.",
        type: "md",
        topic: "discovery",
        date: "2026-02-08",
        path: "../realtor-discovery-framework.md",
        size: "~9KB"
    },
    {
        id: 2,
        filename: "kyle_market_research_report.md",
        title: "Market Research: Untapped Opportunities",
        description: "18-page strategic analysis of 7 high-potential markets: Churches, Nonprofits, Family Tech, Small Business AI, Life Coaching, Creator Economy, and Senior Living. Includes market sizes, entry strategies, and revenue models.",
        type: "md",
        topic: "market-research",
        date: "2026-02-08",
        path: "../kyle_market_research_report.md",
        size: "~18KB"
    },
    {
        id: 3,
        filename: "market-research-untapped-opportunities.md",
        title: "Market Research Summary (Condensed)",
        description: "Condensed version of the market research focusing on key findings, top 7 opportunities, comparative analysis table, and immediate next steps.",
        type: "md",
        topic: "market-research",
        date: "2026-02-08",
        path: "../market-research-untapped-opportunities.md",
        size: "~18KB"
    },
    {
        id: 4,
        filename: "projects-vendor-spend-platform.md",
        title: "Vendor Spend Intelligence Platform",
        description: "Strategic analysis of Kyle's highest-ROI personal project. 4-phase approach (Foundation → Workflow Tools → Intelligence → Productization) with $0-200 investment and 2-5 hrs/week timeline.",
        type: "md",
        topic: "business-frameworks",
        date: "2026-02-06",
        path: "../memory/projects-vendor-spend-platform.md",
        size: "~5KB"
    },
    {
        id: 5,
        filename: "track_daily.sh",
        title: "Daily Token Usage Tracker",
        description: "Enhanced bash script for aggregating token usage across all models and sessions. Calculates costs, Opus projections, and sends Telegram notifications. Runs daily at 5am ET.",
        type: "sh",
        topic: "technical",
        date: "2026-02-08",
        path: "../.openclaw/metrics/track_daily.sh",
        size: "~7KB"
    },
    {
        id: 6,
        filename: "deploy.sh",
        title: "Netlify Deploy Script",
        description: "Simple deployment script for content.kaihamil.com. Uses local Netlify CLI to push changes to the site.",
        type: "sh",
        topic: "technical",
        date: "2026-02-07",
        path: "../kaihamil-content/deploy.sh",
        size: "~300B"
    },
    {
        id: 7,
        filename: "token_usage.jsonl",
        title: "Token Usage Log",
        description: "Historical log of daily token usage with aggregate costs and Opus projections. JSONL format for easy parsing.",
        type: "json",
        topic: "technical",
        date: "2026-02-08",
        path: "../.openclaw/metrics/token_usage.jsonl",
        size: "~1KB"
    },
    {
        id: 8,
        filename: "index.html",
        title: "Content Archive Homepage",
        description: "Main landing page for content.kaihamil.com. Links to diagrams, images, text files, and posts sections.",
        type: "html",
        topic: "technical",
        date: "2026-02-07",
        path: "../kaihamil-content/index.html",
        size: "~1KB"
    },
    {
        id: 9,
        filename: "library.html",
        title: "Stitch Content Library",
        description: "This file — a browsable library interface for discovering all generated content by topic, type, and date.",
        type: "html",
        topic: "technical",
        date: "2026-02-08",
        path: "../kaihamil-content/library/index.html",
        size: "~3KB"
    }
];

// File type icons
const fileIcons = {
    md: "📝",
    html: "🌐",
    json: "📊",
    sh: "⚙️",
    js: "📜",
    css: "🎨",
    default: "📄"
};

// Topic labels
const topicLabels = {
    "market-research": "Market Research",
    "business-frameworks": "Business Frameworks",
    "discovery": "Discovery",
    "strategy": "Strategy",
    "technical": "Technical"
};

// Initialize library
function initLibrary() {
    renderFiles(libraryData);
    setupFilters();
    setupSearch();
    setupViewToggle();
    updateLastUpdated();
}

// Render files
function renderFiles(files) {
    const container = document.getElementById('files-container');
    const countEl = document.getElementById('file-count');
    
    countEl.textContent = `${files.length} file${files.length !== 1 ? 's' : ''}`;
    
    if (files.length === 0) {
        container.innerHTML = '<div class="empty-state">No files match your filters.</div>';
        return;
    }
    
    container.innerHTML = files.map(file => {
        const fullPath = `/Users/openclaw-stitch/.openclaw/workspace/${file.path.replace(/^\.\.\//, '')}`;
        const isTextFile = ['md', 'txt', 'json', 'sh', 'js', 'css', 'html'].includes(file.type);
        
        return `
        <div class="file-card" data-type="${file.type}" data-topic="${file.topic}" data-date="${file.date}">
            <div class="file-header">
                <div class="file-icon">${fileIcons[file.type] || fileIcons.default}</div>
                <div class="file-info">
                    <h4>${file.title}</h4>
                    <p class="file-description">${file.description}</p>
                    <div class="file-meta">
                        <span class="tag type">.${file.type}</span>
                        <span class="tag topic">${topicLabels[file.topic] || file.topic}</span>
                        <span class="tag">${file.date}</span>
                        <span class="tag">${file.size}</span>
                    </div>
                </div>
            </div>
            <div class="file-actions">
                <button class="file-action copy-path" title="Copy full path to clipboard">
                    📋 Copy Path
                </button>
                ${isTextFile ? `<button class="file-action view-raw" title="View file contents">
                    👁️ View
                </button>` : ''}
                <span class="file-path" title="${fullPath}">${fullPath}</span>
            </div>
        </div>
    `}).join('');
    
    // Add click handlers
    document.querySelectorAll('.file-card').forEach((card, index) => {
        const file = files[index];
        
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking buttons
            if (e.target.closest('.file-action')) return;
            
            // Toggle expanded view
            card.classList.toggle('expanded');
        });
    });
    
    // Add action button handlers
    document.querySelectorAll('.file-card').forEach((card, index) => {
        const file = files[index];
        
        // Copy path button
        const copyBtn = card.querySelector('.copy-path');
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const fullPath = `/Users/openclaw-stitch/.openclaw/workspace/${file.path.replace(/^\.\.\//, '')}`;
                navigator.clipboard.writeText(fullPath).then(() => {
                    showToast('Path copied to clipboard!');
                }).catch(() => {
                    // Fallback for older browsers
                    const textarea = document.createElement('textarea');
                    textarea.value = fullPath;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    showToast('Path copied to clipboard!');
                });
            });
        }
        
        // View raw button
        const viewBtn = card.querySelector('.view-raw');
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const relativePath = file.path.replace(/^\.\.\//, '');
                window.open(`../../${relativePath}`, '_blank');
            });
        }
    });
}

// Setup filters
function setupFilters() {
    const filterGroups = ['topic', 'type', 'date'];
    let activeFilters = {
        topic: 'all',
        type: 'all',
        date: 'all'
    };
    
    filterGroups.forEach(group => {
        const buttons = document.querySelectorAll(`#${group}-filters .filter-btn`);
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update filter
                activeFilters[group] = btn.dataset.filter;
                
                // Apply filters
                applyFilters(activeFilters);
            });
        });
    });
}

// Apply filters
function applyFilters(filters) {
    let filtered = libraryData;
    
    if (filters.topic !== 'all') {
        filtered = filtered.filter(f => f.topic === filters.topic);
    }
    
    if (filters.type !== 'all') {
        filtered = filtered.filter(f => f.type === filters.type);
    }
    
    if (filters.date !== 'all') {
        filtered = filtered.filter(f => f.date.startsWith(filters.date));
    }
    
    // Apply search if there's a value
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    if (searchValue) {
        filtered = filtered.filter(f => 
            f.title.toLowerCase().includes(searchValue) ||
            f.description.toLowerCase().includes(searchValue) ||
            f.filename.toLowerCase().includes(searchValue)
        );
    }
    
    renderFiles(filtered);
}

// Setup search
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const activeTopic = document.querySelector('#topic-filters .filter-btn.active').dataset.filter;
            const activeType = document.querySelector('#type-filters .filter-btn.active').dataset.filter;
            const activeDate = document.querySelector('#date-filters .filter-btn.active').dataset.filter;
            
            applyFilters({
                topic: activeTopic,
                type: activeType,
                date: activeDate
            });
        }, 300);
    });
}

// Setup view toggle
function setupViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const container = document.getElementById('files-container');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.view === 'list') {
                container.classList.add('list-view');
            } else {
                container.classList.remove('list-view');
            }
        });
    });
}

// Update last updated timestamp
function updateLastUpdated() {
    const date = new Date();
    document.getElementById('last-updated').textContent = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Toast notification
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initLibrary);
