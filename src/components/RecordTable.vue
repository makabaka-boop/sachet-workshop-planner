<script setup lang="ts">
import { computed } from 'vue'
import { useSachetStore } from '@/stores/sachet'
import { STATUS_CLASS_MAP, DIFFICULTY_CLASS_MAP } from '@/types'
import type { SachetRecord } from '@/types'
import { Pencil, Trash2 } from 'lucide-vue-next'

const store = useSachetStore()

const emit = defineEmits<{
  edit: [record: SachetRecord]
}>()

const allSelected = computed(() => {
  if (store.filteredRecords.length === 0) return false
  return store.filteredRecords.every((r) => store.selectedIds.has(r.id))
})

function toggleAll() {
  if (allSelected.value) {
    store.deselectAll()
  } else {
    store.selectAll()
  }
}
</script>

<template>
  <div class="card overflow-hidden animate-fade-in">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr style="background-color: var(--color-pale-cream)">
            <th class="w-10 px-3 py-3 text-center">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleAll()"
                class="w-4 h-4 rounded accent-[#8B6F47] cursor-pointer"
              />
            </th>
            <th class="px-3 py-3 text-left font-semibold text-xs" style="color: var(--color-dark-brown)">款式</th>
            <th class="px-3 py-3 text-left font-semibold text-xs" style="color: var(--color-dark-brown)">材料包编号</th>
            <th class="px-3 py-3 text-center font-semibold text-xs" style="color: var(--color-dark-brown)">人数</th>
            <th class="px-3 py-3 text-center font-semibold text-xs" style="color: var(--color-dark-brown)">难度</th>
            <th class="px-3 py-3 text-center font-semibold text-xs" style="color: var(--color-dark-brown)">时长</th>
            <th class="px-3 py-3 text-left font-semibold text-xs" style="color: var(--color-dark-brown)">示范要点</th>
            <th class="px-3 py-3 text-left font-semibold text-xs" style="color: var(--color-dark-brown)">缺料说明</th>
            <th class="px-3 py-3 text-left font-semibold text-xs" style="color: var(--color-dark-brown)">责任人</th>
            <th class="px-3 py-3 text-center font-semibold text-xs" style="color: var(--color-dark-brown)">状态</th>
            <th class="px-3 py-3 text-center font-semibold text-xs" style="color: var(--color-dark-brown)">小组</th>
            <th class="px-3 py-3 text-center font-semibold text-xs" style="color: var(--color-dark-brown)">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in store.filteredRecords"
            :key="record.id"
            class="border-t transition-colors hover:bg-white/80"
            :class="{ 'bg-amber-50/40': store.selectedIds.has(record.id) }"
            style="border-color: var(--color-light-brown)"
          >
            <td class="px-3 py-3 text-center">
              <input
                type="checkbox"
                :checked="store.selectedIds.has(record.id)"
                @change="store.toggleSelect(record.id)"
                class="w-4 h-4 rounded accent-[#8B6F47] cursor-pointer"
              />
            </td>
            <td class="px-3 py-3 font-medium" style="color: var(--color-dark-brown)">{{ record.style }}</td>
            <td class="px-3 py-3 font-mono text-xs" style="color: var(--color-medium-brown)">{{ record.materialPackNo }}</td>
            <td class="px-3 py-3 text-center">{{ record.suitablePeople }}人</td>
            <td class="px-3 py-3 text-center">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="DIFFICULTY_CLASS_MAP[record.difficulty]">
                {{ record.difficulty }}
              </span>
            </td>
            <td class="px-3 py-3 text-center">{{ record.estimatedDuration }}分钟</td>
            <td class="px-3 py-3 max-w-[160px] truncate" :title="record.demoPoints">{{ record.demoPoints || '-' }}</td>
            <td class="px-3 py-3 max-w-[120px] truncate" :title="record.missingDesc">
              <span v-if="record.missingDesc">{{ record.missingDesc }}</span>
              <span v-else-if="record.status === '需补料'" class="text-red-500 text-xs">⚠ 未填写</span>
              <span v-else class="text-gray-300">-</span>
            </td>
            <td class="px-3 py-3">
              <span v-if="record.responsiblePerson">{{ record.responsiblePerson }}</span>
              <span v-else class="text-red-500 text-xs">⚠ 空缺</span>
            </td>
            <td class="px-3 py-3 text-center">
              <span :class="STATUS_CLASS_MAP[record.status]">{{ record.status }}</span>
            </td>
            <td class="px-3 py-3 text-center">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium" style="background-color: var(--color-pale-cream); color: var(--color-warm-brown)">
                {{ record.group }}
              </span>
            </td>
            <td class="px-3 py-3 text-center">
              <div class="flex items-center justify-center gap-1">
                <button
                  class="p-1.5 rounded-md transition-colors hover:bg-amber-100"
                  style="color: var(--color-warm-brown)"
                  @click="emit('edit', record)"
                  title="编辑"
                >
                  <Pencil class="w-3.5 h-3.5" />
                </button>
                <button
                  class="p-1.5 rounded-md transition-colors hover:bg-red-100 text-red-500"
                  @click="store.deleteRecords([record.id])"
                  title="删除"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="store.filteredRecords.length === 0">
            <td colspan="12" class="px-3 py-12 text-center text-gray-400">
              <div class="flex flex-col items-center gap-2">
                <span class="text-4xl">📦</span>
                <span>暂无配料记录，点击"新增记录"开始添加</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
