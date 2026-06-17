import type { SachetItem, ValidationIssue, GroupSummary } from '../types'

const MAX_GROUP_DURATION = 120

export function validateItems(items: SachetItem[]): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  checkDuplicatePackageNo(items, issues)
  checkNoResponsiblePerson(items, issues)
  checkGroupDifficulty(items, issues)
  checkGroupDuration(items, issues)
  checkShortageNote(items, issues)

  return issues
}

function checkDuplicatePackageNo(items: SachetItem[], issues: ValidationIssue[]): void {
  const packageMap = new Map<string, string[]>()

  items.forEach(item => {
    if (item.packageNo) {
      const existing = packageMap.get(item.packageNo) || []
      packageMap.set(item.packageNo, [...existing, item.id])
    }
  })

  packageMap.forEach((ids, packageNo) => {
    if (ids.length > 1) {
      issues.push({
        type: 'duplicate',
        severity: 'error',
        message: `材料包编号「${packageNo}」重复出现 ${ids.length} 次`,
        itemIds: ids
      })
    }
  })
}

function checkNoResponsiblePerson(items: SachetItem[], issues: ValidationIssue[]): void {
  const noResponsibleIds = items
    .filter(item => !item.responsiblePerson.trim())
    .map(item => item.id)

  if (noResponsibleIds.length > 0) {
    issues.push({
      type: 'noResponsible',
      severity: 'warning',
      message: `有 ${noResponsibleIds.length} 条记录未指定责任人`,
      itemIds: noResponsibleIds
    })
  }
}

function checkGroupDifficulty(items: SachetItem[], issues: ValidationIssue[]): void {
  const groupItems = new Map<string, SachetItem[]>()

  items.forEach(item => {
    if (item.group) {
      const existing = groupItems.get(item.group) || []
      groupItems.set(item.group, [...existing, item])
    }
  })

  groupItems.forEach((groupItemsList, groupName) => {
    const hardItems = groupItemsList.filter(item => item.difficulty === 'hard')
    if (hardItems.length >= 2) {
      issues.push({
        type: 'difficulty',
        severity: 'warning',
        message: `「${groupName}」有 ${hardItems.length} 个困难款式，建议调整`,
        itemIds: hardItems.map(i => i.id)
      })
    }
  })
}

function checkGroupDuration(items: SachetItem[], issues: ValidationIssue[]): void {
  const groupDuration = new Map<string, { total: number; itemIds: string[] }>()

  items.forEach(item => {
    if (item.group) {
      const existing = groupDuration.get(item.group) || { total: 0, itemIds: [] }
      groupDuration.set(item.group, {
        total: existing.total + item.estimatedDuration,
        itemIds: [...existing.itemIds, item.id]
      })
    }
  })

  groupDuration.forEach((data, groupName) => {
    if (data.total > MAX_GROUP_DURATION) {
      issues.push({
        type: 'duration',
        severity: 'error',
        message: `「${groupName}」预计总时长 ${data.total} 分钟，超过建议上限 ${MAX_GROUP_DURATION} 分钟`,
        itemIds: data.itemIds
      })
    }
  })
}

function checkShortageNote(items: SachetItem[], issues: ValidationIssue[]): void {
  const shortageItems = items.filter(
    item => item.status === 'shortage' && !item.shortageNote.trim()
  )

  if (shortageItems.length > 0) {
    issues.push({
      type: 'noShortage',
      severity: 'error',
      message: `有 ${shortageItems.length} 个「需补料」状态的记录未填写缺料说明`,
      itemIds: shortageItems.map(i => i.id)
    })
  }
}

export function getGroupSummaries(items: SachetItem[]): GroupSummary[] {
  const groupMap = new Map<string, SachetItem[]>()

  items.forEach(item => {
    const group = item.group || '未分组'
    const existing = groupMap.get(group) || []
    groupMap.set(group, [...existing, item])
  })

  const summaries: GroupSummary[] = []

  groupMap.forEach((groupItems, groupName) => {
    const totalDuration = groupItems.reduce((sum, item) => sum + item.estimatedDuration, 0)
    const shortageItems = groupItems.filter(item => item.status === 'shortage')

    const reminders: string[] = []

    const noResponsible = groupItems.filter(i => !i.responsiblePerson.trim())
    if (noResponsible.length > 0) {
      reminders.push(`${noResponsible.length} 个项目未指定责任人`)
    }

    const pendingItems = groupItems.filter(i => i.status === 'pending')
    if (pendingItems.length > 0) {
      reminders.push(`${pendingItems.length} 个项目待准备`)
    }

    if (shortageItems.length > 0) {
      reminders.push(`${shortageItems.length} 个项目需补料`)
    }

    const hardItems = groupItems.filter(i => i.difficulty === 'hard')
    if (hardItems.length >= 2) {
      reminders.push('困难款式较多，建议增加指导人手')
    }

    if (totalDuration > MAX_GROUP_DURATION) {
      reminders.push(`总时长 ${totalDuration} 分钟，可能超时`)
    }

    summaries.push({
      groupName,
      items: groupItems,
      totalDuration,
      shortageItems,
      reminders
    })
  })

  return summaries.sort((a, b) => a.groupName.localeCompare(b.groupName, 'zh-CN'))
}

export function getUniqueStyles(items: SachetItem[]): string[] {
  return [...new Set(items.map(i => i.style))].sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

export function getUniqueGroups(items: SachetItem[]): string[] {
  return [...new Set(items.map(i => i.group).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'zh-CN')
  )
}

export function getUniqueResponsiblePersons(items: SachetItem[]): string[] {
  return [...new Set(items.map(i => i.responsiblePerson).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'zh-CN')
  )
}
