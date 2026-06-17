<script setup lang="ts">
import { computed } from 'vue'
import { CheckSquare, Square } from 'lucide-vue-next'
import type { SachetStatus } from '@/types/sachet'

const props = defineProps<{
  selectedCount: number
  totalCount: number
  allSelected: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-all'): void
  (e: 'batch-status', status: SachetStatus): void
}>()

const statusOptions: { value: SachetStatus; color: string; bg: string }[] = [
  { value: '待准备', color: 'text-amber-700', bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200' },
  { value: '可分发', color: 'text-emerald-700', bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
  { value: '需补料', color: 'text-rose-700', bg: 'bg-rose-50 hover:bg-rose-100 border-rose-200' },
  { value: '改为演示', color: 'text-sky-700', bg: 'bg-sky-50 hover:bg-sky-100 border-sky-200' },
]

const hasSelection = computed(() => props.selectedCount > 0)
</script>

<template>
  <div
    class="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-amber-100
           flex flex-wrap items-center gap-4"
  >
    <button
      @click="emit('toggle-all')"
      class="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-colors"
    >
      <CheckSquare v-if="allSelected" class="w-5 h-5 text-amber-500" />
      <Square v-else class="w-5 h-5" />
      <span class="text-sm font-medium">全选</span>
    </button>

    <div class="h-6 w-px bg-gray-200"></div>

    <span class="text-sm text-gray-500">
      已选 <span class="font-semibold text-amber-600">{{ selectedCount }}</span>
      / {{ totalCount }} 项
    </span>

    <div class="flex-1"></div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="opt in statusOptions"
        :key="opt.value"
        :disabled="!hasSelection"
        @click="emit('batch-status', opt.value)"
        :class="[
          'px-3 py-1.5 text-sm font-medium rounded-lg border transition-all',
          opt.bg,
          opt.color,
          hasSelection
            ? 'cursor-pointer hover:scale-105 active:scale-95'
            : 'opacity-40 cursor-not-allowed',
        ]"
      >
        标记为 {{ opt.value }}
      </button>
    </div>
  </div>
</template>
