<script setup lang="ts">
import { useSachetStore } from '@/stores/sachet'
import { X, Filter } from 'lucide-vue-next'

const store = useSachetStore()
</script>

<template>
  <div class="card p-4 animate-fade-in">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <Filter class="w-4 h-4" style="color: var(--color-warm-brown)" />
        <span class="text-sm font-semibold" style="color: var(--color-dark-brown)">筛选条件</span>
      </div>
      <button
        class="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors hover:bg-red-50 text-red-600"
        @click="store.clearFilters()"
      >
        <X class="w-3 h-3" />
        重置
      </button>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <div>
        <label class="block text-xs font-medium mb-1" style="color: var(--color-medium-brown)">款式</label>
        <select v-model="store.filters.style" class="select-field text-sm">
          <option value="">全部款式</option>
          <option v-for="s in store.allStyles" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium mb-1" style="color: var(--color-medium-brown)">难度</label>
        <select v-model="store.filters.difficulty" class="select-field text-sm">
          <option value="">全部难度</option>
          <option value="简单">简单</option>
          <option value="中等">中等</option>
          <option value="困难">困难</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium mb-1" style="color: var(--color-medium-brown)">责任人</label>
        <select v-model="store.filters.responsiblePerson" class="select-field text-sm">
          <option value="">全部责任人</option>
          <option v-for="p in store.allResponsiblePersons" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium mb-1" style="color: var(--color-medium-brown)">状态</label>
        <select v-model="store.filters.status" class="select-field text-sm">
          <option value="">全部状态</option>
          <option value="待准备">待准备</option>
          <option value="可分发">可分发</option>
          <option value="需补料">需补料</option>
          <option value="改为演示">改为演示</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium mb-1" style="color: var(--color-medium-brown)">小组</label>
        <select v-model="store.filters.group" class="select-field text-sm">
          <option value="">全部小组</option>
          <option v-for="g in store.groups" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>
    </div>
  </div>
</template>
