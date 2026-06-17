<script setup lang="ts">
import type { GroupSummary } from '../types'
import { STATUS_LABELS, DIFFICULTY_LABELS, STATUS_COLORS, DIFFICULTY_COLORS } from '../types'

defineProps<{
  summaries: GroupSummary[]
}>()
</script>

<template>
  <div class="group-summary">
    <div v-for="summary in summaries" :key="summary.groupName" class="group-card">
      <div class="group-card-header">
        <h3>{{ summary.groupName }}</h3>
        <div class="group-meta">
          <span class="meta-item">共 {{ summary.items.length }} 个款式</span>
          <span class="meta-item">总时长 {{ summary.totalDuration }} 分钟</span>
        </div>
      </div>

      <div class="group-card-body">
        <div class="section">
          <h4>需准备条目</h4>
          <div class="items-list">
            <div v-for="item in summary.items" :key="item.id" class="item-row">
              <div class="item-name">
                <span class="item-style">{{ item.style }}</span>
                <span class="item-pkg">({{ item.packageNo }})</span>
              </div>
              <div class="item-tags">
                <span
                  class="mini-tag"
                  :style="{ color: DIFFICULTY_COLORS[item.difficulty], borderColor: DIFFICULTY_COLORS[item.difficulty] }"
                >
                  {{ DIFFICULTY_LABELS[item.difficulty] }}
                </span>
                <span
                  class="mini-tag"
                  :style="{ backgroundColor: STATUS_COLORS[item.status] + '20', color: STATUS_COLORS[item.status] }"
                >
                  {{ STATUS_LABELS[item.status] }}
                </span>
              </div>
              <div class="item-info">
                <span>{{ item.suitablePeople }}人</span>
                <span>{{ item.estimatedDuration }}分钟</span>
                <span v-if="item.responsiblePerson">责任人：{{ item.responsiblePerson }}</span>
                <span v-else class="warning-text">未指定责任人</span>
              </div>
              <div v-if="item.demoKeyPoints" class="item-demo">
                <strong>示范要点：</strong>{{ item.demoKeyPoints }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="summary.shortageItems.length > 0" class="section shortage">
          <h4>数量缺口 / 缺料</h4>
          <div class="shortage-list">
            <div v-for="item in summary.shortageItems" :key="item.id" class="shortage-item">
              <span class="shortage-style">{{ item.style }}</span>
              <span class="shortage-note">
                {{ item.shortageNote || '缺料说明未填写' }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="summary.reminders.length > 0" class="section reminders">
          <h4>提醒事项</h4>
          <ul class="reminder-list">
            <li v-for="(reminder, index) in summary.reminders" :key="index">
              ⚠️ {{ reminder }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="summaries.length === 0" class="empty-state">
      暂无分组数据
    </div>
  </div>
</template>
