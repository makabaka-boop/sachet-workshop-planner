<script setup lang="ts">
import { useSachetStore } from '@/stores/sachet'
import GroupCard from '@/components/GroupCard.vue'
import { Plus, Printer, BarChart3 } from 'lucide-vue-next'
import { ref, computed } from 'vue'

const store = useSachetStore()
const newGroupName = ref('')

function addGroup() {
  const name = newGroupName.value.trim()
  if (name) {
    store.addGroup(name)
    newGroupName.value = ''
  }
}

function printPage() {
  window.print()
}

const totalRecords = computed(() => store.records.length)
const totalDuration = computed(() => store.records.reduce((s, r) => s + r.estimatedDuration, 0))
const totalPeople = computed(() => store.records.reduce((s, r) => s + r.suitablePeople, 0))
const shortageCount = computed(() => store.records.filter((r) => r.status === '需补料').length)
const readyCount = computed(() => store.records.filter((r) => r.status === '可分发').length)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="font-serif-cn text-2xl font-bold" style="color: var(--color-dark-brown)">分组执行清单</h2>
        <p class="text-sm mt-1" style="color: var(--color-medium-brown)">按小组汇总准备条目、数量缺口和提醒语</p>
      </div>
      <button class="btn-outline text-sm flex items-center gap-1.5" @click="printPage()">
        <Printer class="w-4 h-4" />
        打印清单
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div class="card p-4 text-center">
        <div class="text-2xl font-bold" style="color: var(--color-warm-brown)">{{ totalRecords }}</div>
        <div class="text-xs mt-1" style="color: var(--color-medium-brown)">总记录数</div>
      </div>
      <div class="card p-4 text-center">
        <div class="text-2xl font-bold" style="color: var(--color-warm-brown)">{{ store.groups.length }}</div>
        <div class="text-xs mt-1" style="color: var(--color-medium-brown)">活动小组</div>
      </div>
      <div class="card p-4 text-center">
        <div class="text-2xl font-bold" style="color: var(--color-warm-brown)">{{ totalDuration }}</div>
        <div class="text-xs mt-1" style="color: var(--color-medium-brown)">总时长(分钟)</div>
      </div>
      <div class="card p-4 text-center">
        <div class="text-2xl font-bold" :class="shortageCount > 0 ? 'text-red-500' : ''" style="color: var(--color-jade)">{{ shortageCount || 0 }}</div>
        <div class="text-xs mt-1" style="color: var(--color-medium-brown)">缺料项</div>
      </div>
      <div class="card p-4 text-center">
        <div class="text-2xl font-bold" style="color: var(--color-jade)">{{ readyCount }}</div>
        <div class="text-xs mt-1" style="color: var(--color-medium-brown)">可分发</div>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <input
        v-model="newGroupName"
        class="input-field max-w-xs"
        placeholder="输入新小组名称"
        @keyup.enter="addGroup()"
      />
      <button class="btn-outline text-sm flex items-center gap-1.5" @click="addGroup()">
        <Plus class="w-4 h-4" />
        添加小组
      </button>
    </div>

    <div class="space-y-4">
      <GroupCard
        v-for="checklist in store.groupChecklists"
        :key="checklist.groupName"
        :checklist="checklist"
      />
    </div>

    <div v-if="store.groupChecklists.length === 0" class="card p-12 text-center">
      <BarChart3 class="w-12 h-12 mx-auto mb-3" style="color: var(--color-light-brown)" />
      <p style="color: var(--color-medium-brown)">暂无分组数据，请先在配料清单中添加记录并分配小组</p>
    </div>
  </div>
</template>
