import { ref, computed, watch } from 'vue'
import type { SachetItem, FilterOptions, DifficultyLevel, SachetStatus } from '@/types/sachet'
import { loadFromStorage, saveToStorage, generateId } from '@/utils/storage'

const sachetList = ref<SachetItem[]>([])
const filters = ref<FilterOptions>({
  style: '',
  difficulty: '',
  responsible: '',
  status: '',
  group: '',
})

const loaded = loadFromStorage<SachetItem[]>([])
if (loaded.length > 0) {
  sachetList.value = loaded
} else {
  sachetList.value = getMockData()
}

function getMockData(): SachetItem[] {
  const now = Date.now()
  return [
    {
      id: generateId(),
      style: '艾草驱蚊香囊',
      packageNo: 'A-001',
      suitablePeople: 2,
      difficulty: '入门',
      duration: 30,
      demoPoints: '演示布料对折缝制、艾草填充、绳结系法',
      shortageNote: '',
      responsible: '李老师',
      status: '可分发',
      group: '第一组',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      style: '薰衣草安神香囊',
      packageNo: 'B-002',
      suitablePeople: 2,
      difficulty: '简单',
      duration: 45,
      demoPoints: '讲解薰衣草功效、展示刺绣针法',
      shortageNote: '',
      responsible: '王老师',
      status: '可分发',
      group: '第一组',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      style: '桂花开运香囊',
      packageNo: 'C-003',
      suitablePeople: 1,
      difficulty: '中等',
      duration: 60,
      demoPoints: '示范盘金绣、流苏制作',
      shortageNote: '缺少金线两卷',
      responsible: '张老师',
      status: '需补料',
      group: '第二组',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      style: '薄荷清凉香囊',
      packageNo: 'A-001',
      suitablePeople: 3,
      difficulty: '入门',
      duration: 25,
      demoPoints: '简易方形缝制演示',
      shortageNote: '',
      responsible: '',
      status: '待准备',
      group: '第二组',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      style: '檀香静心香囊',
      packageNo: 'D-005',
      suitablePeople: 1,
      difficulty: '较难',
      duration: 90,
      demoPoints: '示范立体缝制、香珠制作',
      shortageNote: '',
      responsible: '陈老师',
      status: '待准备',
      group: '第三组',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      style: '玫瑰养颜香囊',
      packageNo: 'E-006',
      suitablePeople: 2,
      difficulty: '进阶',
      duration: 120,
      demoPoints: '讲解香方配伍、示范复杂针法',
      shortageNote: '',
      responsible: '李老师',
      status: '改为演示',
      group: '第三组',
      createdAt: now,
      updatedAt: now,
    },
  ]
}

watch(
  sachetList,
  (newVal) => {
    saveToStorage(newVal)
  },
  { deep: true }
)

export function useSachetData() {
  const filteredList = computed(() => {
    return sachetList.value.filter((item) => {
      if (filters.value.style && !item.style.includes(filters.value.style)) {
        return false
      }
      if (filters.value.difficulty && item.difficulty !== filters.value.difficulty) {
        return false
      }
      if (filters.value.responsible && !item.responsible.includes(filters.value.responsible)) {
        return false
      }
      if (filters.value.status && item.status !== filters.value.status) {
        return false
      }
      if (filters.value.group && !item.group.includes(filters.value.group)) {
        return false
      }
      return true
    })
  })

  const allStyles = computed(() => {
    const set = new Set(sachetList.value.map((item) => item.style))
    return Array.from(set)
  })

  const allResponsibles = computed(() => {
    const set = new Set(sachetList.value.map((item) => item.responsible).filter(Boolean))
    return Array.from(set)
  })

  const allGroups = computed(() => {
    const set = new Set(sachetList.value.map((item) => item.group).filter(Boolean))
    return Array.from(set)
  })

  const allDifficulties: DifficultyLevel[] = ['入门', '简单', '中等', '较难', '进阶']
  const allStatuses: SachetStatus[] = ['待准备', '可分发', '需补料', '改为演示']

  function addSachet(item: Omit<SachetItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Date.now()
    const newItem: SachetItem = {
      ...item,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    sachetList.value.push(newItem)
  }

  function updateSachet(id: string, updates: Partial<SachetItem>) {
    const index = sachetList.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      sachetList.value[index] = {
        ...sachetList.value[index],
        ...updates,
        updatedAt: Date.now(),
      }
    }
  }

  function deleteSachet(id: string) {
    const index = sachetList.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      sachetList.value.splice(index, 1)
    }
  }

  function batchUpdateStatus(ids: string[], status: SachetStatus) {
    ids.forEach((id) => {
      const item = sachetList.value.find((item) => item.id === id)
      if (item) {
        item.status = status
        item.updatedAt = Date.now()
      }
    })
  }

  function setFilters(newFilters: Partial<FilterOptions>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = {
      style: '',
      difficulty: '',
      responsible: '',
      status: '',
      group: '',
    }
  }

  return {
    sachetList,
    filteredList,
    filters,
    allStyles,
    allResponsibles,
    allGroups,
    allDifficulties,
    allStatuses,
    addSachet,
    updateSachet,
    deleteSachet,
    batchUpdateStatus,
    setFilters,
    resetFilters,
  }
}
