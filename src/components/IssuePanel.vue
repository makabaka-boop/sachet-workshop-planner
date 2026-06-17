<script setup lang="ts">
import type { ValidationIssue } from '../types'

defineProps<{
  issues: ValidationIssue[]
}>()
</script>

<template>
  <div class="issue-panel" v-if="issues.length > 0">
    <div class="issue-header">
      <h4>🔍 自动检查结果</h4>
      <span class="issue-count">{{ issues.length }} 个问题</span>
    </div>
    <div class="issue-list">
      <div
        v-for="(issue, index) in issues"
        :key="index"
        class="issue-item"
        :class="issue.severity"
      >
        <span class="issue-icon">{{ issue.severity === 'error' ? '✕' : '!' }}</span>
        <span class="issue-message">{{ issue.message }}</span>
      </div>
    </div>
  </div>
</template>
