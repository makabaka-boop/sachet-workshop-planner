<script setup lang="ts">
import type { GroupChecklist } from '@/types'
import { STATUS_CLASS_MAP } from '@/types'
import { Clock, Users, AlertTriangle, Package, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { ref, computed } from 'vue'

const props = defineProps<{
  checklist: GroupChecklist
}>()

const expanded = ref(true)

const shortageItems = computed(() => {
  return props.checklist.items.filter((r) => r.status === '需补料')
})

const shortageTotalPeople = computed(() => {
  return shortageItems.value.reduce((s, r) => s + r.suitablePeople, 0)
})
</script>

<template>
  <div class="card overflow-hidden animate-fade-in">
    <div
      class="flex items-center justify-between px-5 py-4 cursor-pointer"
      style="background-color: var(--color-pale-cream)"
      @click="expanded = !expanded"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style="background-color: var(--color-warm-brown)">
          {{ checklist.groupName.replace('第', '').replace('组', '') }}
        </div>
        <div>
          <h3 class="font-serif-cn font-semibold" style="color: var(--color-dark-brown)">{{ checklist.groupName }}</h3>
          <div class="flex items-center gap-3 text-xs mt-0.5" style="color: var(--color-medium-brown)">
            <span class="flex items-center gap-1">
              <Package class="w-3 h-3" />
              {{ checklist.items.length }} 条记录
            </span>
            <span class="flex items-center gap-1">
              <Clock class="w-3 h-3" />
              {{ checklist.totalDuration }} 分钟
            </span>
            <span class="flex items-center gap-1">
              <Users class="w-3 h-3" />
              {{ checklist.items.reduce((s, r) => s + r.suitablePeople, 0) }} 人
            </span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="checklist.shortageCount > 0" class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <AlertTriangle class="w-3 h-3" />
          {{ checklist.shortageCount }} 项缺料 · {{ shortageTotalPeople }}人
        </span>
        <component :is="expanded ? ChevronUp : ChevronDown" class="w-4 h-4" style="color: var(--color-medium-brown)" />
      </div>
    </div>

    <div v-if="expanded" class="px-5 py-4">
      <div v-if="checklist.items.length === 0" class="text-center py-6 text-gray-400 text-sm">
        该小组暂无分配记录
      </div>
      <div v-else class="space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div
            v-for="item in checklist.items"
            :key="item.id"
            class="flex items-center gap-3 p-3 rounded-lg border"
            style="border-color: var(--color-light-brown); background-color: var(--color-cream)"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-medium text-sm" style="color: var(--color-dark-brown)">{{ item.style }}</span>
                <span :class="STATUS_CLASS_MAP[item.status]">{{ item.status }}</span>
              </div>
              <div class="text-xs mt-1" style="color: var(--color-medium-brown)">
                编号: {{ item.materialPackNo || '-' }} · {{ item.difficulty }} · {{ item.estimatedDuration }}分钟 · {{ item.suitablePeople }}人
              </div>
              <div v-if="item.responsiblePerson" class="text-xs mt-0.5" style="color: var(--color-medium-brown)">
                责任人: {{ item.responsiblePerson }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="shortageItems.length > 0" class="mt-4 p-3 rounded-lg border" style="border-color: #FCA5A5; background-color: #FEF2F2">
          <div class="flex items-center gap-1 mb-2">
            <AlertTriangle class="w-4 h-4 text-red-500" />
            <span class="text-sm font-semibold text-red-700">缺料详情</span>
            <span class="text-xs text-red-400 ml-1">共 {{ shortageItems.length }} 项，影响 {{ shortageTotalPeople }} 人</span>
          </div>
          <div class="space-y-2">
            <div
              v-for="item in shortageItems"
              :key="item.id"
              class="flex items-start gap-3 p-2 rounded-md bg-white/80"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-sm text-red-800">{{ item.style }}</span>
                  <span class="text-xs text-red-400">编号: {{ item.materialPackNo || '-' }}</span>
                </div>
                <div class="text-xs text-red-600 mt-0.5">
                  缺口: {{ item.suitablePeople }}人份材料
                </div>
                <div v-if="item.missingDesc" class="text-xs text-red-500 mt-0.5">
                  说明: {{ item.missingDesc }}
                </div>
                <div v-else class="text-xs text-red-400 mt-0.5 italic">
                  ⚠ 未填写缺料说明
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="checklist.reminders.length > 0" class="mt-4 p-3 rounded-lg border-l-4" style="border-color: var(--color-vermillion); background-color: #FEF2F2">
          <div class="flex items-center gap-1 mb-2">
            <AlertTriangle class="w-4 h-4 text-red-500" />
            <span class="text-sm font-semibold text-red-700">提醒事项</span>
          </div>
          <ul class="space-y-1">
            <li v-for="(reminder, i) in checklist.reminders" :key="i" class="text-sm text-red-600 flex items-start gap-2">
              <span class="mt-1 w-1 h-1 rounded-full bg-red-400 flex-shrink-0"></span>
              {{ reminder }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
