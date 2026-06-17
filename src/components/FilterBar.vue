<script setup lang="ts">
import type { FilterOptions, DifficultyLevel, SachetStatus } from '../types'
import { DIFFICULTY_LABELS, STATUS_LABELS } from '../types'

const props = defineProps<{
  filters: FilterOptions
  styles: string[]
  groups: string[]
  responsiblePersons: string[]
}>()

const emit = defineEmits<{
  (e: 'update:filters', filters: FilterOptions): void
  (e: 'reset'): void
}>()

const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard']
const statuses: SachetStatus[] = ['pending', 'ready', 'shortage', 'demo']

function updateFilter<K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) {
  emit('update:filters', { ...props.filters, [key]: value })
}
</script>

<template>
  <div class="filter-bar">
    <div class="filter-item">
      <label>款式</label>
      <select :value="filters.style" @change="updateFilter('style', ($event.target as HTMLSelectElement).value)">
        <option value="">全部款式</option>
        <option v-for="s in styles" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <div class="filter-item">
      <label>难度</label>
      <select :value="filters.difficulty" @change="updateFilter('difficulty', ($event.target as HTMLSelectElement).value as DifficultyLevel | '')">
        <option value="">全部难度</option>
        <option v-for="d in difficulties" :key="d" :value="d">
          {{ DIFFICULTY_LABELS[d] }}
        </option>
      </select>
    </div>

    <div class="filter-item">
      <label>责任人</label>
      <select :value="filters.responsiblePerson" @change="updateFilter('responsiblePerson', ($event.target as HTMLSelectElement).value)">
        <option value="">全部责任人</option>
        <option v-for="p in responsiblePersons" :key="p" :value="p">{{ p }}</option>
      </select>
    </div>

    <div class="filter-item">
      <label>状态</label>
      <select :value="filters.status" @change="updateFilter('status', ($event.target as HTMLSelectElement).value as SachetStatus | '')">
        <option value="">全部状态</option>
        <option v-for="s in statuses" :key="s" :value="s">
          {{ STATUS_LABELS[s] }}
        </option>
      </select>
    </div>

    <div class="filter-item">
      <label>小组</label>
      <select :value="filters.group" @change="updateFilter('group', ($event.target as HTMLSelectElement).value)">
        <option value="">全部小组</option>
        <option v-for="g in groups" :key="g" :value="g">{{ g }}</option>
      </select>
    </div>

    <button class="btn-reset" @click="emit('reset')">重置筛选</button>
  </div>
</template>
