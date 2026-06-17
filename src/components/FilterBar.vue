<script setup lang="ts">
import { computed } from 'vue'
import { Filter, X } from 'lucide-vue-next'
import { useSachetData } from '@/composables/useSachetData'
import type { DifficultyLevel, SachetStatus } from '@/types/sachet'

const {
  filters,
  allStyles,
  allResponsibles,
  allGroups,
  allDifficulties,
  allStatuses,
  setFilters,
  resetFilters,
} = useSachetData()

const hasActiveFilters = computed(() => {
  return (
    filters.value.style ||
    filters.value.difficulty ||
    filters.value.responsible ||
    filters.value.status ||
    filters.value.group
  )
})

function onStyleChange(e: Event) {
  const target = e.target as HTMLSelectElement
  setFilters({ style: target.value })
}

function onDifficultyChange(e: Event) {
  const target = e.target as HTMLSelectElement
  setFilters({ difficulty: target.value as DifficultyLevel | '' })
}

function onResponsibleChange(e: Event) {
  const target = e.target as HTMLSelectElement
  setFilters({ responsible: target.value })
}

function onStatusChange(e: Event) {
  const target = e.target as HTMLSelectElement
  setFilters({ status: target.value as SachetStatus | '' })
}

function onGroupChange(e: Event) {
  const target = e.target as HTMLSelectElement
  setFilters({ group: target.value })
}
</script>

<template>
  <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-amber-100">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2 text-amber-800">
        <Filter class="w-5 h-5" />
        <span class="font-medium">筛选条件</span>
      </div>
      <button
        v-if="hasActiveFilters"
        @click="resetFilters"
        class="flex items-center gap-1 text-sm text-gray-500 hover:text-amber-600 transition-colors"
      >
        <X class="w-4 h-4" />
        重置
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div class="space-y-1.5">
        <label class="text-xs text-gray-500 font-medium">香囊款式</label>
        <select
          :value="filters.style"
          @change="onStyleChange"
          class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white
                 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400
                 transition-all cursor-pointer"
        >
          <option value="">全部款式</option>
          <option v-for="style in allStyles" :key="style" :value="style">
            {{ style }}
          </option>
        </select>
      </div>

      <div class="space-y-1.5">
        <label class="text-xs text-gray-500 font-medium">难度等级</label>
        <select
          :value="filters.difficulty"
          @change="onDifficultyChange"
          class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white
                 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400
                 transition-all cursor-pointer"
        >
          <option value="">全部难度</option>
          <option v-for="diff in allDifficulties" :key="diff" :value="diff">
            {{ diff }}
          </option>
        </select>
      </div>

      <div class="space-y-1.5">
        <label class="text-xs text-gray-500 font-medium">责任人</label>
        <select
          :value="filters.responsible"
          @change="onResponsibleChange"
          class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white
                 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400
                 transition-all cursor-pointer"
        >
          <option value="">全部责任人</option>
          <option v-for="person in allResponsibles" :key="person" :value="person">
            {{ person }}
          </option>
        </select>
      </div>

      <div class="space-y-1.5">
        <label class="text-xs text-gray-500 font-medium">状态</label>
        <select
          :value="filters.status"
          @change="onStatusChange"
          class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white
                 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400
                 transition-all cursor-pointer"
        >
          <option value="">全部状态</option>
          <option v-for="status in allStatuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>

      <div class="space-y-1.5">
        <label class="text-xs text-gray-500 font-medium">所属小组</label>
        <select
          :value="filters.group"
          @change="onGroupChange"
          class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white
                 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400
                 transition-all cursor-pointer"
        >
          <option value="">全部小组</option>
          <option v-for="group in allGroups" :key="group" :value="group">
            {{ group }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
