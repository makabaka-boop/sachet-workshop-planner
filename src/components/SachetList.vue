<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SachetItem, SachetStatus, ValidationIssue } from '../types'
import { STATUS_LABELS, DIFFICULTY_LABELS, STATUS_COLORS, DIFFICULTY_COLORS } from '../types'

const props = defineProps<{
  items: SachetItem[]
  issues: ValidationIssue[]
}>()

const emit = defineEmits<{
  (e: 'edit', item: SachetItem): void
  (e: 'delete', id: string): void
  (e: 'batchUpdate', ids: string[], status: SachetStatus): void
}>()

const selectedIds = ref<string[]>([])
const showBatchMenu = ref(false)

const visibleIds = computed(() => props.items.map(i => i.id))

const visibleSelectedIds = computed(() =>
  selectedIds.value.filter(id => visibleIds.value.includes(id))
)

const allSelected = computed(() => {
  return props.items.length > 0 && visibleSelectedIds.value.length === props.items.length
})

const someSelected = computed(() => {
  return visibleSelectedIds.value.length > 0 && visibleSelectedIds.value.length < props.items.length
})

function toggleAll() {
  if (allSelected.value) {
    selectedIds.value = selectedIds.value.filter(id => !visibleIds.value.includes(id))
  } else {
    const newSelected = new Set(selectedIds.value)
    props.items.forEach(item => newSelected.add(item.id))
    selectedIds.value = [...newSelected]
  }
}

function toggleSelect(id: string) {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

function getItemIssues(itemId: string): ValidationIssue[] {
  return props.issues.filter(issue => issue.itemIds.includes(itemId))
}

function batchUpdate(status: SachetStatus) {
  if (visibleSelectedIds.value.length === 0) return
  emit('batchUpdate', [...visibleSelectedIds.value], status)
  selectedIds.value = selectedIds.value.filter(id => !visibleIds.value.includes(id))
  showBatchMenu.value = false
}

function clearVisibleSelection() {
  selectedIds.value = selectedIds.value.filter(id => !visibleIds.value.includes(id))
}

const statusOptions: SachetStatus[] = ['pending', 'ready', 'shortage', 'demo']
</script>

<template>
  <div class="sachet-list">
    <div class="list-toolbar">
      <div class="batch-actions" v-if="visibleSelectedIds.length > 0">
        <span>已选 {{ visibleSelectedIds.length }} 项</span>
        <div class="batch-menu-wrapper">
          <button class="btn-batch" @click="showBatchMenu = !showBatchMenu">
            批量操作 ▼
          </button>
          <div v-if="showBatchMenu" class="batch-menu">
            <button
              v-for="s in statusOptions"
              :key="s"
              class="batch-menu-item"
              @click="batchUpdate(s)"
            >
              标记为「{{ STATUS_LABELS[s] }}」
            </button>
          </div>
        </div>
        <button class="btn-clear" @click="clearVisibleSelection">取消选择</button>
      </div>
    </div>

    <div class="list-table">
      <div class="table-header">
        <div class="col-checkbox">
          <input
            type="checkbox"
            :checked="allSelected"
            :indeterminate="someSelected"
            @change="toggleAll"
          />
        </div>
        <div class="col-style">款式</div>
        <div class="col-pkg">材料包编号</div>
        <div class="col-people">适合人数</div>
        <div class="col-diff">难度</div>
        <div class="col-duration">时长</div>
        <div class="col-group">小组</div>
        <div class="col-person">责任人</div>
        <div class="col-status">状态</div>
        <div class="col-issues">检查</div>
        <div class="col-actions">操作</div>
      </div>

      <div v-for="item in items" :key="item.id" class="table-row" :class="{ selected: selectedIds.includes(item.id) }">
        <div class="col-checkbox">
          <input
            type="checkbox"
            :checked="selectedIds.includes(item.id)"
            @change="toggleSelect(item.id)"
          />
        </div>
        <div class="col-style">{{ item.style }}</div>
        <div class="col-pkg">{{ item.packageNo }}</div>
        <div class="col-people">{{ item.suitablePeople }}人</div>
        <div class="col-diff">
          <span class="tag" :style="{ color: DIFFICULTY_COLORS[item.difficulty], borderColor: DIFFICULTY_COLORS[item.difficulty] }">
            {{ DIFFICULTY_LABELS[item.difficulty] }}
          </span>
        </div>
        <div class="col-duration">{{ item.estimatedDuration }}分钟</div>
        <div class="col-group">{{ item.group || '-' }}</div>
        <div class="col-person">{{ item.responsiblePerson || '-' }}</div>
        <div class="col-status">
          <span class="status-tag" :style="{ backgroundColor: STATUS_COLORS[item.status] + '20', color: STATUS_COLORS[item.status] }">
            {{ STATUS_LABELS[item.status] }}
          </span>
        </div>
        <div class="col-issues">
          <div v-if="getItemIssues(item.id).length > 0" class="issue-icons">
            <span
              v-for="issue in getItemIssues(item.id)"
              :key="issue.type"
              class="issue-icon"
              :class="issue.severity"
              :title="issue.message"
            >
              {{ issue.severity === 'error' ? '✕' : '!' }}
            </span>
          </div>
          <span v-else class="ok-icon" title="检查通过">✓</span>
        </div>
        <div class="col-actions">
          <button class="btn-link" @click="emit('edit', item)">编辑</button>
          <button class="btn-link delete" @click="emit('delete', item.id)">删除</button>
        </div>
      </div>

      <div v-if="items.length === 0" class="empty-state">
        暂无数据，点击「新增记录」添加香囊配料
      </div>
    </div>
  </div>
</template>
