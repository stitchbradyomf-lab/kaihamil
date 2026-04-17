// PocketBase collection record shapes
// Collections: brief_configs, brief_topics, brief_items, brief_daily

export interface BriefConfig {
  id: string
  name: string
  description: string
  email_to: string
  active: boolean
  created: string
  updated: string
}

export interface Topic {
  id: string
  name: string
  type: string // 'keyword' | 'person' | 'topic'
  active: boolean
  brief_config_id: string
  created: string
  updated: string
}

export interface Item {
  id: string
  title: string
  url: string
  source: string // 'github' | 'reddit' | 'youtube' | 'web'
  summary: string
  relevance_score: number
  topic_matches: string[] // stored as JSON field in PocketBase
  raw_content: string
  author: string
  published_at: string
  brief_date: string // YYYY-MM-DD
  brief_config_id: string
  created: string
  updated: string
}

export interface DailyBrief {
  id: string
  date: string // YYYY-MM-DD
  narrative: string
  email_sent: boolean
  item_count: number
  brief_config_id: string
  created: string
  updated: string
}
