<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { SachetItem, FilterOptions, SachetStatus } from './types'
import { loadItems, saveItems } from './utils/storage'
import { validateItems, getGroupSummaries, getUniqueStyles, getUniqueGroups, getUniqueResponsiblePersons } from './utils/validation'
import SachetForm from './components/SachetForm.vue'
import FilterBar from './components/FilterBar.vue'
import SachetList from './components/SachetList.vue'
import GroupSummary from './components/GroupSummary.vue'
import IssuePanel from './components/IssuePanel.vue'

const items = ref<SachetItem[]>([])
const currentView = ref<'list' | 'groups'>('list')
const showForm = ref(false)
const editingItem = ref<SachetItem | null>(null)

const filters = ref<FilterOptions>({
  style: '',
  difficulty: '',
  responsiblePerson: '',
  status: '',
  group: ''
})

onMounted(() => {
  items.value = loadItems()
})

watch(items, (newItems) => {
  saveItems(newItems)
}, { deep: true })

const filteredItems = computed(() => {
  return items.value.filter(item => {
    if (filters.value.style && item.style !== filters.value.style) return false
    if (filters.value.difficulty && item.difficulty !== filters.value.difficulty) return false
    if (filters.value.responsiblePerson && item.responsiblePerson !== filters.value.responsiblePerson) return false
    if (filters.value.status && item.status !== filters.value.status) return false
    if (filters.value.group && item.group !== filters.value.group) return false
    return true
  })
})

const issues = computed(() => validateItems(items.value))
const groupSummaries = computed(() => getGroupSummaries(items.value))
const styles = computed(() => getUniqueStyles(items.value))
const groups = computed(() => getUniqueGroups(items.value))
const responsiblePersons = computed(() => getUniqueResponsiblePersons(items.value))

function resetFilters() {
  filters.value = {
    style: '',
    difficulty: '',
    responsiblePerson: '',
    status: '',
    group: ''
  }
}

function openAddForm() {
  editingItem.value = null
  showForm.value = true
}

function openEditForm(item: SachetItem) {
  editingItem.value = item
  showForm.value = true
}

function handleSave(item: SachetItem) {
  const index = items.value.findIndex(i => i.id === item.id)
  if (index > -1) {
    items.value[index] = item
  } else {
    items.value.push(item)
  }
  showForm.value = false
}

function handleDelete(id: string) {
  if (confirm('确定要删除这条记录吗？')) {
    items.value = items.value.filter(i => i.id !== id)
  }
}

function handleBatchUpdate(ids: string[], status: SachetStatus) {
  items.value = items.value.map(item => {
    if (ids.includes(item.id)) {
      return { ...item, status }
    }
    return item
  })
}

function exportData() {
  const dataStr = JSON.stringify(items.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sachet-workshop-data.json'
  a.click()
  URL.revokeObjectURL(url)
}

function clearAllData() {
  if (confirm('确定要清空所有数据吗？此操作不可撤销。')) {
    items.value = []
  }
}
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1>🧵 香囊手作活动配料清单</h1>
        <p class="subtitle">面向手作活动组织者，核对布袋、填充物、绳结和小组任务</p>
      </div>
    </header>

    <main class="app-main">
      <div class="view-toggle">
        <button
          class="toggle-btn"
          :class="{ active: currentView === 'list' }"
          @click="currentView = 'list'"
        >
          📋 配料清单
        </button>
        <button
          class="toggle-btn"
          :class="{ active: currentView === 'groups' }"
          @click="currentView = 'groups'"
        >
          👥 分组执行清单
        </button>
      </div>

      <IssuePanel :issues="issues" />

      <div v-if="currentView === 'list'" class="list-view">
        <div class="action-bar">
          <button class="btn-primary" @click="openAddForm">+ 新增记录</button>
          <div class="action-right">
            <button class="btn-secondary" @click="exportData">📤 导出数据</button>
            <button class="btn-danger" @click="clearAllData">🗑️ 清空数据</button>
          </div>
        </div>

        <FilterBar
          :filters="filters"
          :styles="styles"
          :groups="groups"
          :responsible-persons="responsiblePersons"
          @update:filters="filters = $event"
          @reset="resetFilters"
        />

        <div class="result-count">
          共 {{ filteredItems.length }} 条记录
          <span v-if="filteredItems.length !== items.length">
            （全部 {{ items.length }} 条）
          </span>
        </div>

        <SachetList
          :items="filteredItems"
          :issues="issues"
          @edit="openEditForm"
          @delete="handleDelete"
          @batch-update="handleBatchUpdate"
        />
      </div>

      <div v-else class="groups-view">
        <GroupSummary :summaries="groupSummaries" />
      </div>
    </main>

    <SachetForm
      :visible="showForm"
      :edit-item="editingItem"
      @close="showForm = false"
      @save="handleSave"
    />
  </div>
</template>
