<script setup lang="ts">
import { ref } from 'vue'
import { AlertTriangle, AlertCircle, ChevronDown, ChevronUp, X } from 'lucide-vue-next'
import { useAlertCheck } from '@/composables/useAlertCheck'

const emit = defineEmits<{
  (e: 'locate', ids: string[]): void
}>()

const { alertList, alertCount, errorCount, warningCount } = useAlertCheck()

const expanded = ref(true)
</script>

<template>
  <div
    v-if="alertCount > 0"
    class="bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl border border-rose-200/50 overflow-hidden
           animate-fade-in"
  >
    <button
      @click="expanded = !expanded"
      class="w-full px-5 py-4 flex items-center justify-between hover:bg-white/30 transition-colors"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600"
        >
          <AlertTriangle class="w-5 h-5" />
        </div>
        <div class="text-left">
          <h3 class="font-medium text-gray-800">自动检查发现 {{ alertCount }} 个问题</h3>
          <p class="text-sm text-gray-500">
            <span class="text-rose-600">{{ errorCount }} 个错误</span>
            ·
            <span class="text-amber-600">{{ warningCount }} 个警告</span>
          </p>
        </div>
      </div>
      <ChevronDown v-if="!expanded" class="w-5 h-5 text-gray-400" />
      <ChevronUp v-else class="w-5 h-5 text-gray-400" />
    </button>

    <Transition name="expand">
      <div v-if="expanded" class="px-5 pb-4 space-y-2">
        <div
          v-for="alert in alertList"
          :key="alert.id"
          :class="[
            'flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all',
            'hover:bg-white/60 hover:shadow-sm',
            alert.severity === 'error' ? 'bg-rose-50/80' : 'bg-amber-50/80',
          ]"
          @click="emit('locate', alert.relatedIds)"
        >
          <AlertCircle
            :class="[
              'w-5 h-5 flex-shrink-0 mt-0.5',
              alert.severity === 'error' ? 'text-rose-500' : 'text-amber-500',
            ]"
          />
          <div class="flex-1">
            <p
              :class="[
                'text-sm font-medium',
                alert.severity === 'error' ? 'text-rose-700' : 'text-amber-700',
              ]"
            >
              {{ alert.message }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              涉及 {{ alert.relatedIds.length }} 个材料包，点击定位
            </p>
          </div>
          <X
            class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100"
            @click.stop
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
}
</style>
