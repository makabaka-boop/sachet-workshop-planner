<script setup lang="ts">
import { useSachetStore } from '@/stores/sachet'
import { AlertTriangle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { ref } from 'vue'

const store = useSachetStore()
const expanded = ref(true)
</script>

<template>
  <div v-if="store.validationIssues.length > 0" class="card overflow-hidden animate-fade-in" style="border-color: #F59E0B">
    <div
      class="flex items-center justify-between px-4 py-3 cursor-pointer"
      style="background-color: #FFFBEB"
      @click="expanded = !expanded"
    >
      <div class="flex items-center gap-2">
        <AlertTriangle class="w-4 h-4 text-amber-500" />
        <span class="text-sm font-semibold text-amber-800">
          发现 {{ store.validationIssues.length }} 项校验问题
        </span>
      </div>
      <component :is="expanded ? ChevronUp : ChevronDown" class="w-4 h-4 text-amber-500" />
    </div>
    <div v-if="expanded" class="px-4 py-3 space-y-2">
      <div
        v-for="(issue, i) in store.validationIssues"
        :key="i"
        class="flex items-start gap-2 p-2 rounded-lg text-sm"
        :class="issue.severity === 'error' ? 'bg-red-50' : 'bg-amber-50'"
      >
        <component
          :is="issue.severity === 'error' ? AlertCircle : AlertTriangle"
          class="w-4 h-4 mt-0.5 flex-shrink-0"
          :class="issue.severity === 'error' ? 'text-red-500' : 'text-amber-500'"
        />
        <span :class="issue.severity === 'error' ? 'text-red-700' : 'text-amber-700'">
          {{ issue.message }}
        </span>
        <span class="ml-auto text-xs flex-shrink-0" :class="issue.severity === 'error' ? 'text-red-400' : 'text-amber-400'">
          {{ issue.recordIds.length }}条记录
        </span>
      </div>
    </div>
  </div>
</template>
