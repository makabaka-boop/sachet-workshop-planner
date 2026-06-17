import { computed } from 'vue'
import type { AlertItem, SachetItem } from '@/types/sachet'
import { useSachetData } from './useSachetData'
import { generateId } from '@/utils/storage'

export function useAlertCheck() {
  const { sachetList } = useSachetData()

  const alertList = computed<AlertItem[]>(() => {
    const alerts: AlertItem[] = []

    alerts.push(...checkDuplicatePackageNo())
    alerts.push(...checkEmptyResponsible())
    alerts.push(...checkEmptyShortageNote())
    alerts.push(...checkGroupHighDifficulty())
    alerts.push(...checkGroupLongDuration())

    return alerts
  })

  const alertCount = computed(() => alertList.value.length)

  const errorCount = computed(() =>
    alertList.value.filter((a) => a.severity === 'error').length
  )

  const warningCount = computed(() =>
    alertList.value.filter((a) => a.severity === 'warning').length
  )

  function checkDuplicatePackageNo(): AlertItem[] {
    const map = new Map<string, string[]>()
    sachetList.value.forEach((item) => {
      if (!item.packageNo) return
      if (!map.has(item.packageNo)) {
        map.set(item.packageNo, [])
      }
      map.get(item.packageNo)!.push(item.id)
    })

    const alerts: AlertItem[] = []
    map.forEach((ids, packageNo) => {
      if (ids.length > 1) {
        alerts.push({
          id: generateId(),
          type: 'duplicate_package_no',
          message: `材料包编号 "${packageNo}" 出现了 ${ids.length} 次，请确认是否重复`,
          relatedIds: ids,
          severity: 'error',
        })
      }
    })
    return alerts
  }

  function checkEmptyResponsible(): AlertItem[] {
    const ids = sachetList.value
      .filter((item) => !item.responsible || item.responsible.trim() === '')
      .map((item) => item.id)

    if (ids.length === 0) return []

    return [
      {
        id: generateId(),
        type: 'empty_responsible',
        message: `有 ${ids.length} 个材料包未指定责任人`,
        relatedIds: ids,
        severity: 'warning',
      },
    ]
  }

  function checkEmptyShortageNote(): AlertItem[] {
    const ids = sachetList.value
      .filter(
        (item) =>
          item.status === '需补料' &&
          (!item.shortageNote || item.shortageNote.trim() === '')
      )
      .map((item) => item.id)

    if (ids.length === 0) return []

    return [
      {
        id: generateId(),
        type: 'empty_shortage_note',
        message: `有 ${ids.length} 个"需补料"状态的材料包缺少缺料说明`,
        relatedIds: ids,
        severity: 'error',
      },
    ]
  }

  function checkGroupHighDifficulty(): AlertItem[] {
    const alerts: AlertItem[] = []
    const groups = groupBy(sachetList.value, 'group')

    Object.entries(groups).forEach(([groupName, items]) => {
      const highDiffItems = items.filter(
        (item) => item.difficulty === '较难' || item.difficulty === '进阶'
      )
      if (highDiffItems.length > 2) {
        alerts.push({
          id: generateId(),
          type: 'group_high_difficulty',
          message: `「${groupName}」包含 ${highDiffItems.length} 个高难度材料包，建议降低难度或拆分小组`,
          relatedIds: highDiffItems.map((item) => item.id),
          severity: 'warning',
        })
      }
    })

    return alerts
  }

  function checkGroupLongDuration(): AlertItem[] {
    const alerts: AlertItem[] = []
    const groups = groupBy(sachetList.value, 'group')
    const MAX_DURATION = 180

    Object.entries(groups).forEach(([groupName, items]) => {
      const totalDuration = items.reduce((sum, item) => sum + item.duration, 0)
      if (totalDuration > MAX_DURATION) {
        alerts.push({
          id: generateId(),
          type: 'group_long_duration',
          message: `「${groupName}」预计总时长 ${totalDuration} 分钟，超过建议的 ${MAX_DURATION} 分钟`,
          relatedIds: items.map((item) => item.id),
          severity: 'warning',
        })
      }
    })

    return alerts
  }

  function groupBy<T extends Record<string, any>>(arr: T[], key: keyof T): Record<string, T[]> {
    const result: Record<string, T[]> = {}
    arr.forEach((item) => {
      const groupKey = String(item[key])
      if (!result[groupKey]) {
        result[groupKey] = []
      }
      result[groupKey].push(item)
    })
    return result
  }

  return {
    alertList,
    alertCount,
    errorCount,
    warningCount,
  }
}
