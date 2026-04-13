export const DOMAINS = {
  relationships: {
    label: 'Relationships',
    color: '#c9a227',              // gold
    bgColor: 'rgba(201,162,39,0.15)',
  },
  system: {
    label: 'System',
    color: '#4a7c8c',              // teal
    bgColor: 'rgba(74,124,140,0.15)',
  },
  self: {
    label: 'Self',
    color: '#b87a5e',              // terracotta
    bgColor: 'rgba(184,122,94,0.15)',
  },
};

export const CATEGORIES = [
  { key: 'kids',          label: 'Kids',          emoji: '👶', domain: 'relationships' },
  { key: 'partner',       label: 'Partner',        emoji: '💕', domain: 'relationships' },
  { key: 'inner_circle',  label: 'Inner Circle',   emoji: '👥', domain: 'relationships' },
  { key: 'work',          label: 'Work',           emoji: '💼', domain: 'system' },
  { key: 'business',      label: 'Business',       emoji: '🚀', domain: 'system' },
  { key: 'administration',label: 'Administration', emoji: '⚙️', domain: 'system' },
  { key: 'home',          label: 'Home',           emoji: '🏠', domain: 'system' },
  { key: 'body',          label: 'Body',           emoji: '💪', domain: 'self' },
  { key: 'mind',          label: 'Mind',           emoji: '🧠', domain: 'self' },
  { key: 'emotion',       label: 'Emotion',        emoji: '🎭', domain: 'self' },
  { key: 'sleep',         label: 'Sleep',          emoji: '😴', domain: 'self' },
];

export const CATEGORY_KEYS = CATEGORIES.map(c => c.key);

export const DOMAIN_CATEGORIES = {
  relationships: CATEGORIES.filter(c => c.domain === 'relationships'),
  system:        CATEGORIES.filter(c => c.domain === 'system'),
  self:          CATEGORIES.filter(c => c.domain === 'self'),
};

export const MAX_SCORE = CATEGORIES.length * 5; // 55

export const EMPTY_RATINGS = Object.fromEntries(CATEGORY_KEYS.map(k => [k, 0]));

export const PB_URL = import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090';
