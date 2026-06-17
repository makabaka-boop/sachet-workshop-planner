export type Status = '待准备' | '可分发' | '需补料' | '改为演示'
export type Difficulty = '简单' | '中等' | '困难'

export interface SachetRecord {
  id: string
  style: string
  materialPackNo: string
  suitablePeople: number
  difficulty: Difficulty
  estimatedDuration: number
  demoPoints: string
  missingDesc: string
  responsiblePerson: string
  status: Status
  group: string
}

export interface ValidationIssue {
  type: 'difficulty_too_high' | 'duplicate_pack_no' | 'no_responsible' | 'duration_too_long' | 'missing_desc_empty'
  recordIds: string[]
  message: string
  severity: 'warning' | 'error'
}

export interface GroupChecklist {
  groupName: string
  items: SachetRecord[]
  totalDuration: number
  shortageCount: number
  reminders: string[]
}

export interface FilterState {
  style: string
  difficulty: string
  responsiblePerson: string
  status: string
  group: string
}

export const STATUS_OPTIONS: Status[] = ['待准备', '可分发', '需补料', '改为演示']
export const DIFFICULTY_OPTIONS: Difficulty[] = ['简单', '中等', '困难']

export const STATUS_CLASS_MAP: Record<Status, string> = {
  '待准备': 'status-pending',
  '可分发': 'status-ready',
  '需补料': 'status-shortage',
  '改为演示': 'status-demo',
}

export const DIFFICULTY_CLASS_MAP: Record<Difficulty, string> = {
  '简单': 'bg-green-100 text-green-800',
  '中等': 'bg-yellow-100 text-yellow-800',
  '困难': 'bg-red-100 text-red-800',
}
