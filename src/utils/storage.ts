import type { SachetItem } from '../types'

const STORAGE_KEY = 'sachet-workshop-items'

export function loadItems(): SachetItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : getDefaultItems()
  } catch {
    return getDefaultItems()
  }
}

export function saveItems(items: SachetItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function getDefaultItems(): SachetItem[] {
  return [
    {
      id: generateId(),
      style: '锦鲤香囊',
      packageNo: 'KL-001',
      suitablePeople: 4,
      difficulty: 'medium',
      estimatedDuration: 45,
      demoKeyPoints: '鱼身缝合、填充棉絮、鱼鳍造型',
      shortageNote: '金色绣线缺2卷',
      responsiblePerson: '李老师',
      status: 'pending',
      group: '第一组'
    },
    {
      id: generateId(),
      style: '艾草香囊',
      packageNo: 'KL-002',
      suitablePeople: 6,
      difficulty: 'easy',
      estimatedDuration: 30,
      demoKeyPoints: '布袋封口、艾草填充、绳结打法',
      shortageNote: '',
      responsiblePerson: '王助教',
      status: 'ready',
      group: '第二组'
    },
    {
      id: generateId(),
      style: '梅花香囊',
      packageNo: 'KL-003',
      suitablePeople: 3,
      difficulty: 'hard',
      estimatedDuration: 60,
      demoKeyPoints: '花瓣刺绣、立体造型、挂绳编织',
      shortageNote: '粉色绣线缺1卷',
      responsiblePerson: '',
      status: 'shortage',
      group: '第一组'
    },
    {
      id: generateId(),
      style: '莲花香囊',
      packageNo: 'KL-001',
      suitablePeople: 5,
      difficulty: 'medium',
      estimatedDuration: 50,
      demoKeyPoints: '花瓣层叠、莲蓬造型、流苏安装',
      shortageNote: '莲蓬填充物不足',
      responsiblePerson: '张老师',
      status: 'pending',
      group: '第三组'
    },
    {
      id: generateId(),
      style: '平安香囊',
      packageNo: 'KL-004',
      suitablePeople: 8,
      difficulty: 'easy',
      estimatedDuration: 25,
      demoKeyPoints: '方形缝制、香料混合、平安结',
      shortageNote: '',
      responsiblePerson: '李老师',
      status: 'ready',
      group: '第二组'
    }
  ]
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
