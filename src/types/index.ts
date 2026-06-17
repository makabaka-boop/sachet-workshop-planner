export type Difficulty = '入门' | '初级' | '中级' | '高级'

export type SachetStatus = '待准备' | '可分发' | '需补料' | '改为演示'

export interface SachetItem {
  id: string
  style: string
  packageNo: string
  suitablePeople: number
  difficulty: Difficulty
  estimatedDuration: number
  demoPoints: string
  shortageNote: string
  personInCharge: string
  status: SachetStatus
  group: string
  quantity: number
  shortageQuantity: number
}

export interface FilterState {
  style: string
  difficulty: Difficulty | ''
  personInCharge: string
  status: SachetStatus | ''
  group: string
}

export interface WarningItem {
  type: 'difficulty' | 'duplicate' | 'noOwner' | 'duration' | 'shortageEmpty'
  level: 'warning' | 'error'
  message: string
  itemIds: string[]
}

export interface GroupChecklistItem {
  style: string
  packageNo: string
  quantity: number
  shortage: number
  status: SachetStatus
  personInCharge: string
  demoPoints: string
  shortageNote: string
}

export interface GroupChecklist {
  groupName: string
  totalDuration: number
  maxDifficulty: Difficulty
  items: GroupChecklistItem[]
  reminders: string[]
  totalQuantity: number
  shortageTotal: number
}
