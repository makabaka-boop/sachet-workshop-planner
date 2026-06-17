<script setup lang="ts">
import { ref } from 'vue'
import { useSachetStore } from '@/stores/sachet'
import FilterBar from '@/components/FilterBar.vue'
import RecordTable from '@/components/RecordTable.vue'
import BatchActions from '@/components/BatchActions.vue'
import EditModal from '@/components/EditModal.vue'
import ValidationPanel from '@/components/ValidationPanel.vue'
import { Plus, Download, Upload } from 'lucide-vue-next'
import type { SachetRecord } from '@/types'

const store = useSachetStore()

const modalVisible = ref(false)
const editingRecord = ref<SachetRecord | null>(null)

function openAddModal() {
  editingRecord.value = null
  modalVisible.value = true
}

function openEditModal(record: SachetRecord) {
  editingRecord.value = record
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
  editingRecord.value = null
}

function exportData() {
  const data = JSON.stringify(store.records, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `香囊配料清单_${new Date().toLocaleDateString('zh-CN')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importData() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (Array.isArray(data)) {
          data.forEach((r: SachetRecord) => {
            if (!store.records.find((existing) => existing.id === r.id)) {
              store.addRecord(r)
            }
          })
        }
      } catch {
        // ignore parse errors
      }
    }
    reader.readAsText(file)
  }
  input.click()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="font-serif-cn text-2xl font-bold" style="color: var(--color-dark-brown)">配料清单</h2>
        <p class="text-sm mt-1" style="color: var(--color-medium-brown)">
          共 {{ store.records.length }} 条记录，当前显示 {{ store.filteredRecords.length }} 条
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-ghost text-sm flex items-center gap-1.5" @click="importData()">
          <Upload class="w-4 h-4" />
          <span class="hidden sm:inline">导入</span>
        </button>
        <button class="btn-ghost text-sm flex items-center gap-1.5" @click="exportData()">
          <Download class="w-4 h-4" />
          <span class="hidden sm:inline">导出</span>
        </button>
        <button class="btn-primary text-sm flex items-center gap-1.5" @click="openAddModal()">
          <Plus class="w-4 h-4" />
          新增记录
        </button>
      </div>
    </div>

    <FilterBar />
    <BatchActions />
    <RecordTable @edit="openEditModal" />
    <ValidationPanel />

    <EditModal
      :visible="modalVisible"
      :record="editingRecord"
      @close="closeModal"
      @saved="closeModal"
    />
  </div>
</template>
