import { ref, computed, watch } from 'vue'
import type { SachetItem, FilterState, WarningItem, GroupChecklist, Difficulty } from '../types'

const STORAGE_KEY = 'sachet-workshop-data'

const difficultyOrder: Record<Difficulty, number> = {
  '入门': 1,
  '初级': 2,
  '中级': 3,
  '高级': 4
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

function migrateItem(item: any): SachetItem {
  return {
    ...item,
    shortageQuantity: item.shortageQuantity ?? 0
  }
}

function loadFromStorage(): SachetItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data)) {
        return data.map(migrateItem)
      }
    }
  } catch {
    // ignore
  }
  return getDefaultData()
}

function getDefaultData(): SachetItem[] {
  return [
    {
      id: generateId(),
      style: '艾草平安香囊',
      packageNo: 'A-001',
      suitablePeople: 2,
      difficulty: '入门',
      estimatedDuration: 30,
      demoPoints: '示范平针法、塞棉手法',
      shortageNote: '艾草填充物充足',
      personInCharge: '李老师',
      status: '可分发',
      group: '第一组',
      quantity: 10,
      shortageQuantity: 0
    },
    {
      id: generateId(),
      style: '朱砂开运香囊',
      packageNo: 'B-002',
      suitablePeople: 2,
      difficulty: '初级',
      estimatedDuration: 45,
      demoPoints: '示范藏针法、绳结编织',
      shortageNote: '朱砂粉剩余不多',
      personInCharge: '王老师',
      status: '需补料',
      group: '第一组',
      quantity: 8,
      shortageQuantity: 3
    },
    {
      id: generateId(),
      style: '桂花玫瑰香包',
      packageNo: 'C-003',
      suitablePeople: 3,
      difficulty: '中级',
      estimatedDuration: 60,
      demoPoints: '示范刺绣基础、流苏制作',
      shortageNote: '',
      personInCharge: '',
      status: '待准备',
      group: '第二组',
      quantity: 12,
      shortageQuantity: 0
    },
    {
      id: generateId(),
      style: '端午粽子香囊',
      packageNo: 'A-001',
      suitablePeople: 1,
      difficulty: '高级',
      estimatedDuration: 90,
      demoPoints: '示范立体缝制、串珠技巧',
      shortageNote: '缺少五彩绳',
      personInCharge: '张老师',
      status: '需补料',
      group: '第二组',
      quantity: 5,
      shortageQuantity: 2
    },
    {
      id: generateId(),
      style: '薰衣草助眠香囊',
      packageNo: 'D-004',
      suitablePeople: 2,
      difficulty: '入门',
      estimatedDuration: 25,
      demoPoints: '示范回针法、蝴蝶结系法',
      shortageNote: '材料齐全',
      personInCharge: '李老师',
      status: '可分发',
      group: '第三组',
      quantity: 15,
      shortageQuantity: 0
    }
  ]
}

const items = ref<SachetItem[]>(loadFromStorage())

watch(items, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function useSachetStore() {
  const filter = ref<FilterState>({
    style: '',
    difficulty: '',
    personInCharge: '',
    status: '',
    group: ''
  })

  const filteredItems = computed(() => {
    return items.value.filter(item => {
      if (filter.value.style && !item.style.includes(filter.value.style)) return false
      if (filter.value.difficulty && item.difficulty !== filter.value.difficulty) return false
      if (filter.value.personInCharge && !item.personInCharge.includes(filter.value.personInCharge)) return false
      if (filter.value.status && item.status !== filter.value.status) return false
      if (filter.value.group && !item.group.includes(filter.value.group)) return false
      return true
    })
  })

  const allStyles = computed(() => [...new Set(items.value.map(i => i.style))].sort())
  const allGroups = computed(() => [...new Set(items.value.map(i => i.group))].sort())
  const allPersons = computed(() => [...new Set(items.value.map(i => i.personInCharge).filter(Boolean))].sort())

  function addItem(partial: Omit<SachetItem, 'id'>) {
    items.value.push({ ...partial, id: generateId() })
  }

  function updateItem(id: string, patch: Partial<SachetItem>) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) {
      items.value[idx] = { ...items.value[idx], ...patch }
    }
  }

  function removeItem(id: string) {
    items.value = items.value.filter(i => i.id !== id)
  }

  function batchUpdateStatus(ids: string[], status: SachetItem['status']) {
    items.value.forEach(item => {
      if (ids.includes(item.id)) {
        item.status = status
      }
    })
  }

  const warnings = computed<WarningItem[]>(() => {
    const result: WarningItem[] = []

    const groupMap = new Map<string, SachetItem[]>()
    items.value.forEach(item => {
      if (!groupMap.has(item.group)) groupMap.set(item.group, [])
      groupMap.get(item.group)!.push(item)
    })

    groupMap.forEach((groupItems, groupName) => {
      const hasHighDifficulty = groupItems.some(i => difficultyOrder[i.difficulty] >= 3)
      const totalDuration = groupItems.reduce((sum, i) => sum + i.estimatedDuration, 0)

      if (hasHighDifficulty && groupItems.length > 2) {
        result.push({
          type: 'difficulty',
          level: 'warning',
          message: `「${groupName}」包含中高级难度款式且数量较多，建议安排有经验的责任人`,
          itemIds: groupItems.filter(i => difficultyOrder[i.difficulty] >= 3).map(i => i.id)
        })
      }

      if (totalDuration > 120) {
        result.push({
          type: 'duration',
          level: 'warning',
          message: `「${groupName}」累计预计时长 ${totalDuration} 分钟，超过 2 小时，注意时间安排`,
          itemIds: groupItems.map(i => i.id)
        })
      }
    })

    const packageMap = new Map<string, string[]>()
    items.value.forEach(item => {
      if (!packageMap.has(item.packageNo)) packageMap.set(item.packageNo, [])
      packageMap.get(item.packageNo)!.push(item.id)
    })
    packageMap.forEach((ids, pkgNo) => {
      if (ids.length > 1) {
        result.push({
          type: 'duplicate',
          level: 'error',
          message: `材料包编号「${pkgNo}」出现了 ${ids.length} 次重复`,
          itemIds: ids
        })
      }
    })

    const noOwnerItems = items.value.filter(i => !i.personInCharge.trim())
    if (noOwnerItems.length > 0) {
      result.push({
        type: 'noOwner',
        level: 'error',
        message: `有 ${noOwnerItems.length} 条记录缺少责任人`,
        itemIds: noOwnerItems.map(i => i.id)
      })
    }

    const shortageEmptyItems = items.value.filter(i => i.status === '需补料' && !i.shortageNote.trim())
    if (shortageEmptyItems.length > 0) {
      result.push({
        type: 'shortageEmpty',
        level: 'warning',
        message: `有 ${shortageEmptyItems.length} 条「需补料」记录未填写缺料说明`,
        itemIds: shortageEmptyItems.map(i => i.id)
      })
    }

    const shortageQtyMismatch = items.value.filter(
      i => i.status === '需补料' && i.shortageQuantity <= 0
    )
    if (shortageQtyMismatch.length > 0) {
      result.push({
        type: 'shortageEmpty',
        level: 'warning',
        message: `有 ${shortageQtyMismatch.length} 条「需补料」记录缺口数量为 0，请确认`,
        itemIds: shortageQtyMismatch.map(i => i.id)
      })
    }

    return result
  })

  const groupChecklists = computed<GroupChecklist[]>(() => {
    const groupMap = new Map<string, SachetItem[]>()
    items.value.forEach(item => {
      if (!groupMap.has(item.group)) groupMap.set(item.group, [])
      groupMap.get(item.group)!.push(item)
    })

    const checklists: GroupChecklist[] = []
    groupMap.forEach((groupItems, groupName) => {
      const totalDuration = groupItems.reduce((sum, i) => sum + i.estimatedDuration, 0)
      const maxDiff = groupItems.reduce(
        (max, i) => (difficultyOrder[i.difficulty] > difficultyOrder[max] ? i.difficulty : max),
        '入门' as Difficulty
      )
      const totalQuantity = groupItems.reduce((sum, i) => sum + i.quantity, 0)
      const shortageTotal = groupItems.reduce((sum, i) => sum + (i.shortageQuantity || 0), 0)
      const shortageItems = groupItems.filter(i => i.shortageQuantity > 0)

      const reminders: string[] = []
      if (difficultyOrder[maxDiff] >= 3) {
        reminders.push(`本组最高难度为「${maxDiff}」，请确认指导老师到位`)
      }
      if (totalDuration > 120) {
        reminders.push(`总时长约 ${totalDuration} 分钟，建议分阶段进行并安排中场休息`)
      }
      if (shortageItems.length > 0) {
        reminders.push(`有 ${shortageItems.length} 款材料缺料，共缺 ${shortageTotal} 份，请在活动前确认到位`)
      }
      const noOwner = groupItems.filter(i => !i.personInCharge.trim())
      if (noOwner.length > 0) {
        reminders.push(`有 ${noOwner.length} 款未指定责任人，请尽快分配`)
      }
      if (reminders.length === 0) {
        reminders.push('本组材料与人员安排就绪，可按计划开展活动')
      }

      checklists.push({
        groupName,
        totalDuration,
        maxDifficulty: maxDiff,
        totalQuantity,
        shortageTotal,
        items: groupItems.map(i => ({
          style: i.style,
          packageNo: i.packageNo,
          quantity: i.quantity,
          shortage: i.shortageQuantity || 0,
          status: i.status,
          personInCharge: i.personInCharge || '未指定',
          demoPoints: i.demoPoints,
          shortageNote: i.shortageNote
        })),
        reminders
      })
    })

    return checklists.sort((a, b) => a.groupName.localeCompare(b.groupName))
  })

  function resetFilter() {
    filter.value = {
      style: '',
      difficulty: '',
      personInCharge: '',
      status: '',
      group: ''
    }
  }

  function resetData() {
    items.value = getDefaultData()
  }

  return {
    items,
    filter,
    filteredItems,
    allStyles,
    allGroups,
    allPersons,
    warnings,
    groupChecklists,
    addItem,
    updateItem,
    removeItem,
    batchUpdateStatus,
    resetFilter,
    resetData
  }
}
