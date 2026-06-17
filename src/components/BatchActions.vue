<script setup lang="ts">
import { useSachetStore } from '@/stores/sachet'
import type { Status } from '@/types'
import { CheckSquare, Trash2, X } from 'lucide-vue-next'
import { computed } from 'vue'

const store = useSachetStore()

const selectedCount = computed(() => store.selectedIds.size)

const statusButtons: { label: string; status: Status; color: string }[] = [
  { label: '待准备', status: '待准备', color: 'bg-amber-100 text-amber-800 hover:bg-amber-200' },
  { label: '可分发', status: '可分发', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  { label: '需补料', status: '需补料', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  { label: '改为演示', status: '改为演示', color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
]

function batchUpdate(status: Status) {
  if (selectedCount.value === 0) return
  store.batchUpdateStatus([...store.selectedIds], status)
  store.deselectAll()
}

function batchDelete() {
  if (selectedCount.value === 0) return
  store.deleteRecords([...store.selectedIds])
}
</script>

<template>
  <div
    v-if="selectedCount > 0"
    class="card p-3 flex items-center gap-3 animate-slide-up"
    style="border-color: var(--color-warm-brown); background-color: var(--color-pale-cream)"
  >
    <div class="flex items-center gap-2">
      <CheckSquare class="w-4 h-4" style="color: var(--color-warm-brown)" />
      <span class="text-sm font-medium" style="color: var(--color-dark-brown)">
        已选择 <strong>{{ selectedCount }}</strong> 条记录
      </span>
    </div>
    <div class="h-5 w-px" style="background-color: var(--color-light-brown)"></div>
    <div class="flex items-center gap-2 flex-wrap">
      <span class="text-xs" style="color: var(--color-medium-brown)">批量标记为：</span>
      <button
        v-for="btn in statusButtons"
        :key="btn.status"
        class="px-3 py-1 rounded-md text-xs font-medium transition-colors"
        :class="btn.color"
        @click="batchUpdate(btn.status)"
      >
        {{ btn.label }}
      </button>
    </div>
    <div class="h-5 w-px" style="background-color: var(--color-light-brown)"></div>
    <button
      class="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
      @click="batchDelete()"
    >
      <Trash2 class="w-3 h-3" />
      删除
    </button>
    <div class="flex-1"></div>
    <button
      class="p-1 rounded-md hover:bg-white/60 transition-colors"
      @click="store.deselectAll()"
    >
      <X class="w-4 h-4" style="color: var(--color-medium-brown)" />
    </button>
  </div>
</template>
