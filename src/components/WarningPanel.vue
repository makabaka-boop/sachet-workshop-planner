<script setup lang="ts">
import { computed } from 'vue'
import { useSachetStore } from '../composables/useSachetStore'

const store = useSachetStore()

const iconMap: Record<string, string> = {
  difficulty: '⚠️',
  duplicate: '❌',
  noOwner: '👤',
  duration: '⏰',
  shortageEmpty: '📝'
}

const errorCount = computed(() =>
  store.warnings.value.filter(w => w.level === 'error').length
)

const warningCount = computed(() =>
  store.warnings.value.filter(w => w.level === 'warning').length
)
</script>

<template>
  <div v-if="store.warnings.value.length > 0" class="warning-panel card">
    <div class="warning-header">
      <span class="warning-title-icon">🚨</span>
      <div class="warning-title">
        <strong>异常检查提醒</strong>
        <span class="warning-counts">
          <span v-if="errorCount > 0" class="count-error">
            {{ errorCount }} 个错误
          </span>
          <span v-if="warningCount > 0" class="count-warning">
            {{ warningCount }} 个警告
          </span>
        </span>
      </div>
    </div>
    <div class="warning-list">
      <div
        v-for="(warn, idx) in store.warnings.value"
        :key="idx"
        :class="['warning-item', warn.level]"
      >
        <span class="warn-icon">{{ iconMap[warn.type] }}</span>
        <span class="warn-message">{{ warn.message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.warning-panel {
  background: linear-gradient(135deg, #fff8f0 0%, #ffeed8 100%);
  border-left: 4px solid #d4a853;
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.warning-title-icon {
  font-size: 24px;
}

.warning-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.warning-title strong {
  font-size: 16px;
  color: #8b6642;
}

.warning-counts {
  display: flex;
  gap: 12px;
  font-size: 13px;
}

.count-error {
  color: #c96658;
  font-weight: 500;
}

.count-warning {
  color: #d4a853;
  font-weight: 500;
}

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.warning-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
}

.warning-item.error {
  background: rgba(201, 102, 88, 0.12);
  color: #b05448;
}

.warning-item.warning {
  background: rgba(212, 168, 83, 0.12);
  color: #a07b3d;
}

.warn-icon {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}

.warn-message {
  flex: 1;
}
</style>
