<script setup lang="ts">
import { computed } from 'vue'
import {
  Clock,
  Users,
  Package,
  User,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-vue-next'
import type { SachetItem, SachetStatus } from '@/types/sachet'

const props = defineProps<{
  item: SachetItem
  selected: boolean
  showAlert?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-select'): void
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const statusConfig: Record<SachetStatus, { bg: string; text: string; dot: string }> = {
  待准备: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  可分发: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  需补料: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-400' },
  改为演示: { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-400' },
}

const difficultyColors: Record<string, string> = {
  入门: 'text-emerald-600 bg-emerald-50',
  简单: 'text-green-600 bg-green-50',
  中等: 'text-amber-600 bg-amber-50',
  较难: 'text-orange-600 bg-orange-50',
  进阶: 'text-rose-600 bg-rose-50',
}

const statusStyle = computed(() => statusConfig[props.item.status])
const difficultyStyle = computed(() => difficultyColors[props.item.difficulty] || 'text-gray-600 bg-gray-50')
</script>

<template>
  <div
    :class="[
      'group relative bg-white rounded-2xl p-5 shadow-sm border transition-all duration-300',
      'hover:shadow-md hover:-translate-y-0.5',
      selected
        ? 'border-amber-400 ring-2 ring-amber-200 bg-amber-50/30'
        : 'border-gray-100',
    ]"
  >
    <div class="absolute top-3 left-3">
      <button
        @click="emit('toggle-select')"
        class="text-gray-400 hover:text-amber-500 transition-colors"
      >
        <CheckSquare v-if="selected" class="w-5 h-5 text-amber-500" />
        <Square v-else class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>

    <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
      <button
        @click="emit('edit')"
        class="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
      >
        <Edit2 class="w-4 h-4" />
      </button>
      <button
        @click="emit('delete')"
        class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
      >
        <Trash2 class="w-4 h-4" />
      </button>
    </div>

    <div class="ml-8">
      <div class="flex items-start justify-between mb-3">
        <h3 class="font-serif font-semibold text-gray-800 text-lg leading-tight">
          {{ item.style }}
        </h3>
        <span
          :class="[
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
            statusStyle.bg,
            statusStyle.text,
          ]"
        >
          <span :class="['w-1.5 h-1.5 rounded-full', statusStyle.dot]"></span>
          {{ item.status }}
        </span>
      </div>

      <div class="flex items-center gap-2 mb-3">
        <span
          :class="[
            'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
            difficultyStyle,
          ]"
        >
          {{ item.difficulty }}
        </span>
        <span class="text-xs text-gray-400 flex items-center gap-1">
          <Package class="w-3.5 h-3.5" />
          {{ item.packageNo }}
        </span>
        <span class="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
          {{ item.group }}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
        <div class="flex items-center gap-1.5">
          <Users class="w-4 h-4 text-gray-400" />
          <span>{{ item.suitablePeople }} 人份</span>
        </div>
        <div class="flex items-center gap-1.5">
          <Clock class="w-4 h-4 text-gray-400" />
          <span>{{ item.duration }} 分钟</span>
        </div>
      </div>

      <div class="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
        <User class="w-4 h-4 text-gray-400" />
        <span v-if="item.responsible">{{ item.responsible }}</span>
        <span v-else class="text-rose-500 text-xs">未指定责任人</span>
      </div>

      <div v-if="item.demoPoints" class="mb-2">
        <p class="text-xs text-gray-500 line-clamp-2">
          <span class="font-medium text-gray-600">示范要点：</span>
          {{ item.demoPoints }}
        </p>
      </div>

      <div
        v-if="item.shortageNote"
        class="flex items-start gap-1.5 text-xs text-rose-600 bg-rose-50 rounded-lg p-2"
      >
        <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{{ item.shortageNote }}</span>
      </div>
    </div>
  </div>
</template>
