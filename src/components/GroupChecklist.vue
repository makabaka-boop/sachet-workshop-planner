<script setup lang="ts">
import { useSachetStore } from '../composables/useSachetStore'
import type { Difficulty, SachetStatus } from '../types'

const store = useSachetStore()

const difficultyClass = (d: Difficulty) => {
  const map: Record<Difficulty, string> = {
    '入门': 'tag-entry',
    '初级': 'tag-basic',
    '中级': 'tag-intermediate',
    '高级': 'tag-advanced'
  }
  return map[d]
}

const statusClass = (s: SachetStatus) => {
  const map: Record<SachetStatus, string> = {
    '待准备': 'tag-pending',
    '可分发': 'tag-ready',
    '需补料': 'tag-shortage',
    '改为演示': 'tag-demo'
  }
  return map[s]
}

function printChecklist() {
  window.print()
}
</script>

<template>
  <div class="group-checklist">
    <div class="card toolbar-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <h2 class="section-title">
            <span class="title-icon">📦</span>
            分组执行清单
          </h2>
          <span class="desc">按小组汇总需准备的物料、数量缺口与提醒事项</span>
        </div>
        <div class="toolbar-right">
          <button class="btn-primary" @click="printChecklist">
            🖨️ 打印清单
          </button>
        </div>
      </div>
    </div>

    <div class="checklist-grid">
      <div v-for="group in store.groupChecklists.value" :key="group.groupName" class="group-card card">
        <div class="group-header">
          <div class="group-title">
            <span class="group-badge">{{ group.groupName }}</span>
            <span :class="['tag', difficultyClass(group.maxDifficulty)]">
              最高难度：{{ group.maxDifficulty }}
            </span>
          </div>
          <div class="group-stats">
            <div class="stat">
              <span class="stat-label">款式数</span>
              <span class="stat-value">{{ group.items.length }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">总数量</span>
              <span class="stat-value">{{ group.totalQuantity }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">总时长</span>
              <span class="stat-value">{{ group.totalDuration }}min</span>
            </div>
            <div v-if="group.shortageTotal > 0" class="stat stat-danger">
              <span class="stat-label">缺料数</span>
              <span class="stat-value">{{ group.shortageTotal }}</span>
            </div>
          </div>
        </div>

        <div class="reminders-section">
          <div class="section-label">📌 提醒事项</div>
          <ul class="reminders-list">
            <li v-for="(reminder, idx) in group.reminders" :key="idx">
              {{ reminder }}
            </li>
          </ul>
        </div>

        <div class="items-section">
          <div class="section-label">🧵 配料清单</div>
          <div class="items-table-wrapper">
            <table class="items-table">
              <thead>
                <tr>
                  <th>款式</th>
                  <th>编号</th>
                  <th>数量</th>
                  <th>状态</th>
                  <th>责任人</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in group.items" :key="item.packageNo + item.style" :class="{ 'row-shortage': item.status === '需补料' }">
                  <td class="item-style">{{ item.style }}</td>
                  <td><code>{{ item.packageNo }}</code></td>
                  <td>
                    <span v-if="item.shortage > 0" class="shortage-badge">
                      {{ item.quantity }}（缺{{ item.shortage }}）
                    </span>
                    <span v-else>{{ item.quantity }}</span>
                  </td>
                  <td>
                    <span :class="['tag', statusClass(item.status)]">
                      {{ item.status }}
                    </span>
                  </td>
                  <td>{{ item.personInCharge }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="group.items.some(i => i.demoPoints)" class="demo-section">
          <div class="section-label">💡 示范要点</div>
          <ul class="demo-list">
            <li v-for="item in group.items.filter(i => i.demoPoints)" :key="item.style">
              <strong>{{ item.style }}：</strong>{{ item.demoPoints }}
            </li>
          </ul>
        </div>

        <div v-if="group.items.some(i => i.shortageNote)" class="shortage-section">
          <div class="section-label">📝 缺料说明</div>
          <ul class="shortage-list">
            <li v-for="item in group.items.filter(i => i.shortageNote)" :key="item.style">
              <strong>{{ item.style }}：</strong>{{ item.shortageNote }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolbar-card {
  margin-bottom: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 20px;
  color: #5c4033;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 24px;
}

.desc {
  font-size: 13px;
  color: #7a5c4a;
}

.checklist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 16px;
}

.group-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.group-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0e6d8;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-badge {
  background: linear-gradient(135deg, #a67c52 0%, #8b6642 100%);
  color: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 15px;
}

.group-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 12px;
  color: #9a8070;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #5c4033;
}

.stat-danger .stat-value {
  color: #c96658;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: #7a5c4a;
  margin-bottom: 8px;
}

.reminders-section {
  background: #fdfaf5;
  border-radius: 8px;
  padding: 12px 16px;
}

.reminders-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.reminders-list li {
  font-size: 13px;
  color: #6b5344;
  padding-left: 16px;
  position: relative;
}

.reminders-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #a67c52;
  font-weight: bold;
}

.items-table-wrapper {
  overflow-x: auto;
}

.items-table {
  width: 100%;
  font-size: 13px;
}

.items-table th {
  background: #faf6f0;
  padding: 8px 10px;
  font-weight: 500;
  font-size: 12px;
}

.items-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #f5ebe0;
}

.row-shortage {
  background: #fff5f5;
}

.item-style {
  font-weight: 500;
  color: #5c4033;
}

.shortage-badge {
  color: #c96658;
  font-weight: 600;
}

code {
  background: #f5ebe0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 12px;
}

.demo-section,
.shortage-section {
  background: #faf8f5;
  border-radius: 8px;
  padding: 12px 16px;
}

.demo-list,
.shortage-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-list li,
.shortage-list li {
  font-size: 13px;
  color: #6b5344;
}

.demo-list strong,
.shortage-list strong {
  color: #5c4033;
}

@media print {
  .toolbar-card {
    display: none;
  }
  .group-card {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
</style>
