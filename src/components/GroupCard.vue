<script setup lang="ts">
import { computed } from 'vue'
import { Users, Clock, Package, AlertTriangle, CheckCircle2, AlertCircle, ListTodo, Inbox } from 'lucide-vue-next'
import type { SachetItem, SachetStatus } from '@/types/sachet'

const props = defineProps<{
  groupName: string
  items: SachetItem[]
}>()

const totalPeople = computed(() =>
  props.items.reduce((sum, item) => sum + item.suitablePeople, 0)
)

const totalDuration = computed(() =>
  props.items.reduce((sum, item) => sum + item.duration, 0)
)

const statusCounts = computed(() => {
  const counts: Record<SachetStatus, number> = {
    待准备: 0,
    可分发: 0,
    需补料: 0,
    改为演示: 0,
  }
  props.items.forEach((item) => {
    counts[item.status]++
  })
  return counts
})

const shortageItems = computed(() =>
  props.items.filter((item) => item.status === '需补料')
)

const pendingItems = computed(() =>
  props.items.filter((item) => item.status === '待准备')
)

const demoItems = computed(() =>
  props.items.filter((item) => item.status === '改为演示')
)

const readyCount = computed(() => statusCounts.value['可分发'])
const totalCount = computed(() => props.items.length)
const readyPercent = computed(() =>
  totalCount.value > 0 ? Math.round((readyCount.value / totalCount.value) * 100) : 0
)

const notReadyCount = computed(() =>
  statusCounts.value['待准备'] + statusCounts.value['需补料']
)

const shortagePeople = computed(() =>
  shortageItems.value.reduce((sum, item) => sum + item.suitablePeople, 0)
)

const pendingPeople = computed(() =>
  pendingItems.value.reduce((sum, item) => sum + item.suitablePeople, 0)
)

const reminders = computed(() => {
  const list: string[] = []
  if (shortageItems.value.length > 0) {
    list.push(`有 ${shortageItems.value.length} 个材料包（${shortagePeople.value}人份）需要补料，请优先处理`)
  }
  if (pendingItems.value.length > 0) {
    list.push(`${pendingItems.value.length} 个材料包（${pendingPeople.value}人份）待准备`)
  }
  if (totalDuration.value > 180) {
    list.push('预计总时长超过3小时，建议拆分或简化流程')
  }
  const noResponsible = props.items.filter((item) => !item.responsible).length
  if (noResponsible > 0) {
    list.push(`${noResponsible} 个材料包未指定责任人`)
  }
  if (readyPercent.value === 100) {
    list.push('🎉 全部准备就绪，可以开始分发！')
  }
  return list
})

const statusColors: Record<SachetStatus, string> = {
  待准备: 'bg-amber-400',
  可分发: 'bg-emerald-400',
  需补料: 'bg-rose-400',
  改为演示: 'bg-sky-400',
}

const statusBgColors: Record<SachetStatus, string> = {
  待准备: 'bg-amber-50',
  可分发: 'bg-emerald-50',
  需补料: 'bg-rose-50',
  改为演示: 'bg-sky-50',
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
    <div class="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
      <div class="flex items-center justify-between text-white">
        <h3 class="font-serif text-xl font-semibold">{{ groupName }}</h3>
        <div class="flex items-center gap-2 text-sm">
          <CheckCircle2 v-if="readyPercent === 100" class="w-5 h-5" />
          <span class="font-medium">{{ readyPercent }}% 就绪</span>
        </div>
      </div>
      <div class="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          class="h-full bg-white rounded-full transition-all duration-500"
          :style="{ width: `${readyPercent}%` }"
        ></div>
      </div>
      <div class="flex justify-between mt-2 text-xs text-white/80">
        <span>已就绪 {{ readyCount }} / {{ totalCount }}</span>
        <span v-if="notReadyCount > 0">还差 {{ notReadyCount }} 个</span>
        <span v-else>全部完成</span>
      </div>
    </div>

    <div class="p-5">
      <div class="grid grid-cols-4 gap-3 mb-5">
        <div class="text-center p-2.5 bg-gray-50 rounded-xl">
          <div class="flex justify-center mb-1">
            <Package class="w-4 h-4 text-gray-500" />
          </div>
          <p class="text-lg font-bold text-gray-800">{{ totalCount }}</p>
          <p class="text-xs text-gray-500">总数</p>
        </div>
        <div class="text-center p-2.5 bg-emerald-50 rounded-xl">
          <div class="flex justify-center mb-1">
            <CheckCircle2 class="w-4 h-4 text-emerald-500" />
          </div>
          <p class="text-lg font-bold text-emerald-600">{{ readyCount }}</p>
          <p class="text-xs text-emerald-600">已就绪</p>
        </div>
        <div class="text-center p-2.5 bg-amber-50 rounded-xl">
          <div class="flex justify-center mb-1">
            <ListTodo class="w-4 h-4 text-amber-500" />
          </div>
          <p class="text-lg font-bold text-amber-600">{{ statusCounts.待准备 }}</p>
          <p class="text-xs text-amber-600">待准备</p>
        </div>
        <div class="text-center p-2.5 bg-rose-50 rounded-xl">
          <div class="flex justify-center mb-1">
            <AlertCircle class="w-4 h-4 text-rose-500" />
          </div>
          <p class="text-lg font-bold text-rose-600">{{ statusCounts.需补料 }}</p>
          <p class="text-xs text-rose-600">需补料</p>
        </div>
      </div>

      <div class="flex gap-1.5 mb-5">
        <div
          v-for="(count, status) in statusCounts"
          :key="status"
          :class="[
            'flex-1 text-center py-2 rounded-lg text-xs font-medium',
            statusColors[status as SachetStatus],
            count > 0 ? 'text-white' : 'text-gray-400 bg-gray-100',
          ]"
        >
          {{ status }} {{ count }}
        </div>
      </div>

      <div v-if="reminders.length > 0" class="mb-4">
        <div class="flex items-center gap-2 text-amber-600 mb-2">
          <AlertTriangle class="w-4 h-4" />
          <span class="text-sm font-medium">准备提醒</span>
        </div>
        <ul class="space-y-1.5">
          <li
            v-for="(reminder, index) in reminders"
            :key="index"
            class="text-sm text-gray-600 flex items-start gap-2"
          >
            <span class="text-amber-400 mt-1">•</span>
            <span>{{ reminder }}</span>
          </li>
        </ul>
      </div>

      <div v-if="pendingItems.length > 0" class="mb-4">
        <div class="flex items-center gap-2 text-amber-600 mb-2">
          <Inbox class="w-4 h-4" />
          <span class="text-sm font-medium">待准备清单</span>
          <span class="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
            {{ pendingItems.length }} 项
          </span>
        </div>
        <div class="space-y-1.5">
          <div
            v-for="item in pendingItems"
            :key="item.id"
            class="flex items-center gap-2 p-2 bg-amber-50 rounded-lg"
          >
            <div class="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">{{ item.style }}</p>
              <p class="text-xs text-gray-500">
                {{ item.packageNo }} · {{ item.suitablePeople }}人份
                <span v-if="item.responsible"> · {{ item.responsible }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="shortageItems.length > 0" class="mb-4 p-3 bg-rose-50 rounded-xl">
        <div class="flex items-center gap-2 text-rose-700 mb-2">
          <AlertCircle class="w-4 h-4" />
          <span class="text-sm font-medium">缺料明细</span>
          <span class="text-xs bg-rose-200 text-rose-700 px-1.5 py-0.5 rounded-full">
            {{ shortageItems.length }} 项
          </span>
        </div>
        <ul class="space-y-2">
          <li
            v-for="item in shortageItems"
            :key="item.id"
            class="text-sm text-rose-700"
          >
            <div class="font-medium">{{ item.style }}</div>
            <div class="text-xs text-rose-600 mt-0.5">
              {{ item.shortageNote || '未说明缺料内容' }}
            </div>
          </li>
        </ul>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-700 mb-2">全部清单</p>
        <div class="space-y-1.5 max-h-48 overflow-y-auto">
          <div
            v-for="item in items"
            :key="item.id"
            :class="[
              'flex items-center gap-2.5 p-2 rounded-lg transition-all',
              statusBgColors[item.status],
            ]"
          >
            <div
              :class="[
                'w-2.5 h-2.5 rounded-full flex-shrink-0',
                statusColors[item.status],
              ]"
            ></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">{{ item.style }}</p>
              <p class="text-xs text-gray-500">
                {{ item.packageNo }} · {{ item.difficulty }}
                <span v-if="item.responsible"> · {{ item.responsible }}</span>
              </p>
            </div>
            <span class="text-xs text-gray-400 flex-shrink-0">{{ item.duration }}分</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
