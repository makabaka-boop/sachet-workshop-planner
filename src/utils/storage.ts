const STORAGE_KEY = 'sachet-workshop-data'

export function saveToStorage<T>(data: T): void {
  try {
    const json = JSON.stringify(data)
    localStorage.setItem(STORAGE_KEY, json)
  } catch (e) {
    console.error('保存数据到 localStorage 失败:', e)
  }
}

export function loadFromStorage<T>(defaultValue: T): T {
  try {
    const json = localStorage.getItem(STORAGE_KEY)
    if (json === null) {
      return defaultValue
    }
    return JSON.parse(json) as T
  } catch (e) {
    console.error('从 localStorage 读取数据失败:', e)
    return defaultValue
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}
