import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { SachetRecord, ValidationIssue, GroupChecklist, FilterState, Status } from '@/types'

const STORAGE_KEY = 'sachet-records'
const GROUPS_KEY = 'sachet-groups'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // ignore storage errors
  }
}

export const useSachetStore = defineStore('sachet', () => {
  const records = ref<SachetRecord[]>(loadFromStorage<SachetRecord[]>(STORAGE_KEY, []))
  const groups = ref<string[]>(loadFromStorage<string[]>(GROUPS_KEY, ['第一组', '第二组', '第三组', '第四组']))
  const selectedIds = ref<Set<string>>(new Set())
  const filters = ref<FilterState>({
    style: '',
    difficulty: '',
    responsiblePerson: '',
    status: '',
    group: '',
  })

  watch(records, (val) => saveToStorage(STORAGE_KEY, val), { deep: true })
  watch(groups, (val) => saveToStorage(GROUPS_KEY, val), { deep: true })

  const allStyles = computed(() => [...new Set(records.value.map((r) => r.style))].filter(Boolean))
  const allResponsiblePersons = computed(() => [...new Set(records.value.map((r) => r.responsiblePerson))].filter(Boolean))

  const filteredRecords = computed(() => {
    return records.value.filter((r) => {
      if (filters.value.style && r.style !== filters.value.style) return false
      if (filters.value.difficulty && r.difficulty !== filters.value.difficulty) return false
      if (filters.value.responsiblePerson && r.responsiblePerson !== filters.value.responsiblePerson) return false
      if (filters.value.status && r.status !== filters.value.status) return false
      if (filters.value.group && r.group !== filters.value.group) return false
      return true
    })
  })

  const validationIssues = computed<ValidationIssue[]>(() => {
    const issues: ValidationIssue[] = []

    const noResponsible = records.value.filter((r) => !r.responsiblePerson.trim())
    if (noResponsible.length > 0) {
      issues.push({
        type: 'no_responsible',
        recordIds: noResponsible.map((r) => r.id),
        message: `存在 ${noResponsible.length} 条未分配责任人的记录`,
        severity: 'error',
      })
    }

    const missingDescEmpty = records.value.filter((r) => r.status === '需补料' && !r.missingDesc.trim())
    if (missingDescEmpty.length > 0) {
      issues.push({
        type: 'missing_desc_empty',
        recordIds: missingDescEmpty.map((r) => r.id),
        message: `${missingDescEmpty.length} 条"需补料"记录未填写缺料说明`,
        severity: 'error',
      })
    }

    const packNoMap = new Map<string, string[]>()
    records.value.forEach((r) => {
      const trimmed = r.materialPackNo.trim()
      if (trimmed) {
        const existing = packNoMap.get(trimmed) || []
        existing.push(r.id)
        packNoMap.set(trimmed, existing)
      }
    })
    packNoMap.forEach((ids, packNo) => {
      if (ids.length > 1) {
        issues.push({
          type: 'duplicate_pack_no',
          recordIds: ids,
          message: `材料包编号"${packNo}"存在 ${ids.length} 次重复`,
          severity: 'warning',
        })
      }
    })

    const groupMap = new Map<string, SachetRecord[]>()
    records.value.forEach((r) => {
      if (r.group) {
        const existing = groupMap.get(r.group) || []
        existing.push(r)
        groupMap.set(r.group, existing)
      }
    })

    groupMap.forEach((groupRecords, groupName) => {
      const hasHard = groupRecords.some((r) => r.difficulty === '困难')
      if (hasHard) {
        const hardIds = groupRecords.filter((r) => r.difficulty === '困难').map((r) => r.id)
        issues.push({
          type: 'difficulty_too_high',
          recordIds: hardIds,
          message: `${groupName}包含困难级别项目，请确认是否有足够指导人员`,
          severity: 'warning',
        })
      }

      const totalDuration = groupRecords.reduce((sum, r) => sum + r.estimatedDuration, 0)
      if (totalDuration > 120) {
        issues.push({
          type: 'duration_too_long',
          recordIds: groupRecords.map((r) => r.id),
          message: `${groupName}累计时长 ${totalDuration} 分钟，超过120分钟，建议拆分`,
          severity: 'warning',
        })
      }
    })

    return issues
  })

  const groupChecklists = computed<GroupChecklist[]>(() => {
    return groups.value.map((groupName) => {
      const items = records.value.filter((r) => r.group === groupName)
      const totalDuration = items.reduce((sum, r) => sum + r.estimatedDuration, 0)
      const shortageCount = items.filter((r) => r.status === '需补料').length

      const reminders: string[] = []
      if (items.length === 0) {
        reminders.push('该小组暂无分配记录')
      } else {
        if (items.some((r) => r.difficulty === '困难')) {
          reminders.push('包含困难级别项目，请安排经验丰富的指导人员')
        }
        if (totalDuration > 120) {
          reminders.push(`累计时长 ${totalDuration} 分钟，建议拆分为两次活动`)
        }
        if (shortageCount > 0) {
          reminders.push(`${shortageCount} 条记录标记为"需补料"，请及时补充材料`)
        }
        const noResponsible = items.filter((r) => !r.responsiblePerson.trim())
        if (noResponsible.length > 0) {
          reminders.push(`${noResponsible.length} 条记录未分配责任人`)
        }
        const pendingCount = items.filter((r) => r.status === '待准备').length
        if (pendingCount > 0) {
          reminders.push(`${pendingCount} 条记录尚未开始准备`)
        }
      }

      return { groupName, items, totalDuration, shortageCount, reminders }
    })
  })

  function addRecord(record: Omit<SachetRecord, 'id'>): SachetRecord {
    const newRecord: SachetRecord = { ...record, id: generateId() }
    records.value.push(newRecord)
    return newRecord
  }

  function updateRecord(id: string, updates: Partial<SachetRecord>): void {
    const index = records.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      records.value[index] = { ...records.value[index], ...updates }
    }
  }

  function deleteRecords(ids: string[]): void {
    records.value = records.value.filter((r) => !ids.includes(r.id))
    ids.forEach((id) => selectedIds.value.delete(id))
  }

  function batchUpdateStatus(ids: string[], status: Status): void {
    records.value.forEach((r) => {
      if (ids.includes(r.id)) {
        r.status = status
      }
    })
  }

  function toggleSelect(id: string): void {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }
  }

  function selectAll(): void {
    filteredRecords.value.forEach((r) => selectedIds.value.add(r.id))
  }

  function deselectAll(): void {
    selectedIds.value.clear()
  }

  function clearFilters(): void {
    filters.value = { style: '', difficulty: '', responsiblePerson: '', status: '', group: '' }
  }

  function addGroup(name: string): void {
    if (!groups.value.includes(name)) {
      groups.value.push(name)
    }
  }

  function removeGroup(name: string): void {
    groups.value = groups.value.filter((g) => g !== name)
  }

  return {
    records,
    groups,
    selectedIds,
    filters,
    allStyles,
    allResponsiblePersons,
    filteredRecords,
    validationIssues,
    groupChecklists,
    addRecord,
    updateRecord,
    deleteRecords,
    batchUpdateStatus,
    toggleSelect,
    selectAll,
    deselectAll,
    clearFilters,
    addGroup,
    removeGroup,
  }
})
