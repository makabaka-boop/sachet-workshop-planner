export type DifficultyLevel = '入门' | '简单' | '中等' | '较难' | '进阶'

export type SachetStatus = '待准备' | '可分发' | '需补料' | '改为演示'

export interface SachetItem {
  id: string
  style: string
  packageNo: string
  suitablePeople: number
  difficulty: DifficultyLevel
  duration: number
  demoPoints: string
  shortageNote: string
  responsible: string
  status: SachetStatus
  group: string
  createdAt: number
  updatedAt: number
}

export interface FilterOptions {
  style: string
  difficulty: DifficultyLevel | ''
  responsible: string
  status: SachetStatus | ''
  group: string
}

export type AlertType = 
  | 'group_high_difficulty'
  | 'duplicate_package_no'
  | 'empty_responsible'
  | 'group_long_duration'
  | 'empty_shortage_note'

export interface AlertItem {
  id: string
  type: AlertType
  message: string
  relatedIds: string[]
  severity: 'warning' | 'error'
}

export type ViewMode = 'list' | 'group'
