export type SachetStatus = 'pending' | 'ready' | 'shortage' | 'demo'

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface SachetItem {
  id: string
  style: string
  packageNo: string
  suitablePeople: number
  difficulty: DifficultyLevel
  estimatedDuration: number
  demoKeyPoints: string
  shortageNote: string
  responsiblePerson: string
  status: SachetStatus
  group: string
}

export interface FilterOptions {
  style: string
  difficulty: DifficultyLevel | ''
  responsiblePerson: string
  status: SachetStatus | ''
  group: string
}

export interface ValidationIssue {
  type: 'difficulty' | 'duplicate' | 'noResponsible' | 'duration' | 'noShortage'
  severity: 'warning' | 'error'
  message: string
  itemIds: string[]
}

export interface GroupSummary {
  groupName: string
  items: SachetItem[]
  totalDuration: number
  shortageItems: SachetItem[]
  reminders: string[]
}

export const STATUS_LABELS: Record<SachetStatus, string> = {
  pending: '待准备',
  ready: '可分发',
  shortage: '需补料',
  demo: '改为演示'
}

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难'
}

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  easy: '#52c41a',
  medium: '#faad14',
  hard: '#ff4d4f'
}

export const STATUS_COLORS: Record<SachetStatus, string> = {
  pending: '#8c8c8c',
  ready: '#52c41a',
  shortage: '#ff4d4f',
  demo: '#1890ff'
}
