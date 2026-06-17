<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSachetStore } from '../composables/useSachetStore'
import type { SachetItem, Difficulty, SachetStatus } from '../types'
import WarningPanel from './WarningPanel.vue'
import SachetForm from './SachetForm.vue'

const store = useSachetStore()

const selectedIds = ref<string[]>([])
const showForm = ref(false)
const editingItem = ref<SachetItem | null>(null)

watch(
  () => store.filteredItems.value.map(i => i.id),
  (visibleIds) => {
    const visibleSet = new Set(visibleIds)
    const before = selectedIds.value.length
    selectedIds.value = selectedIds.value.filter(id => visibleSet.has(id))
    const after = selectedIds.value.length
    if (before !== after && before > 0) {
      console.log(`筛选变化，已清除 ${before - after} 条不可见记录的选中状态`)
    }
  }
)

const allSelected = computed({
  get() {
    const visible = store.filteredItems.value
    if (visible.length === 0) return false
    return visible.every(item => selectedIds.value.includes(item.id))
  },
  set(val: boolean) {
    const visibleIds = store.filteredItems.value.map(i => i.id)
    if (val) {
      const merged = new Set([...selectedIds.value, ...visibleIds])
      selectedIds.value = Array.from(merged)
    } else {
      const visibleSet = new Set(visibleIds)
      selectedIds.value = selectedIds.value.filter(id => !visibleSet.has(id))
    }
  }
})

const visibleSelectedCount = computed(() => {
  const visibleIds = new Set(store.filteredItems.value.map(i => i.id))
  return selectedIds.value.filter(id => visibleIds.has(id)).length
})

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

function toggleSelect(id: string) {
  const idx = selectedIds.value.indexOf(id)
  if (idx === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(idx, 1)
  }
}

function openAddForm() {
  editingItem.value = null
  showForm.value = true
}

function openEditForm(item: SachetItem) {
  editingItem.value = { ...item }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingItem.value = null
}

function handleSave(data: Omit<SachetItem, 'id'>) {
  if (editingItem.value) {
    store.updateItem(editingItem.value.id, data)
  } else {
    store.addItem(data)
  }
  closeForm()
}

function handleDelete(id: string) {
  if (confirm('确定删除这条记录吗？')) {
    store.removeItem(id)
    const idx = selectedIds.value.indexOf(id)
    if (idx !== -1) selectedIds.value.splice(idx, 1)
  }
}

function handleBatchStatus(status: SachetStatus) {
  const visibleIds = new Set(store.filteredItems.value.map(i => i.id))
  const visibleSelected = selectedIds.value.filter(id => visibleIds.has(id))
  if (visibleSelected.length === 0) {
    alert('请先选择要操作的记录')
    return
  }
  if (!confirm(`确定将当前可见的 ${visibleSelected.length} 条选中记录标记为「${status}」吗？`)) {
    return
  }
  store.batchUpdateStatus(visibleSelected, status)
}
</script>

<template>
  <div class="sachet-list">
    <WarningPanel />

    <div class="card">
      <div class="filter-bar">
        <div class="filter-title">
          <span class="filter-icon">🔍</span>
          <span>筛选条件</span>
        </div>
        <div class="filter-fields">
          <div class="filter-item">
            <label>款式</label>
            <input v-model="store.filter.value.style" placeholder="搜索款式名称" type="text" />
          </div>
          <div class="filter-item">
            <label>难度</label>
            <select v-model="store.filter.value.difficulty">
              <option value="">全部</option>
              <option value="入门">入门</option>
              <option value="初级">初级</option>
              <option value="中级">中级</option>
              <option value="高级">高级</option>
            </select>
          </div>
          <div class="filter-item">
            <label>责任人</label>
            <input v-model="store.filter.value.personInCharge" placeholder="搜索责任人" type="text" />
          </div>
          <div class="filter-item">
            <label>状态</label>
            <select v-model="store.filter.value.status">
              <option value="">全部</option>
              <option value="待准备">待准备</option>
              <option value="可分发">可分发</option>
              <option value="需补料">需补料</option>
              <option value="改为演示">改为演示</option>
            </select>
          </div>
          <div class="filter-item">
            <label>小组</label>
            <input v-model="store.filter.value.group" placeholder="搜索小组" type="text" />
          </div>
          <div class="filter-actions">
            <button class="btn-secondary" @click="store.resetFilter()">重置</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="toolbar">
        <div class="toolbar-left">
          <button class="btn-primary" @click="openAddForm()">
            + 新增配料
          </button>
          <span class="count-info">
            共 {{ store.filteredItems.value.length }} 条记录
            <span v-if="visibleSelectedCount > 0">
              （已选可见 {{ visibleSelectedCount }} 条）
            </span>
          </span>
        </div>
        <div class="toolbar-right">
          <span class="batch-label">批量操作：</span>
          <button class="btn-secondary" :disabled="visibleSelectedCount === 0" @click="handleBatchStatus('待准备')">
            待准备
          </button>
          <button class="btn-success" :disabled="visibleSelectedCount === 0" @click="handleBatchStatus('可分发')">
            可分发
          </button>
          <button class="btn-danger" :disabled="visibleSelectedCount === 0" @click="handleBatchStatus('需补料')">
            需补料
          </button>
          <button class="btn-warning" :disabled="visibleSelectedCount === 0" @click="handleBatchStatus('改为演示')">
            改为演示
          </button>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="col-check">
                <input type="checkbox" v-model="allSelected" />
              </th>
              <th>香囊款式</th>
              <th>材料包编号</th>
              <th>数量</th>
              <th>缺口数</th>
              <th>适合人数</th>
              <th>难度</th>
              <th>预计时长</th>
              <th>小组</th>
              <th>责任人</th>
              <th>状态</th>
              <th>示范要点</th>
              <th>缺料说明</th>
              <th class="col-actions">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in store.filteredItems.value" :key="item.id">
              <td>
                <input type="checkbox" :checked="selectedIds.includes(item.id)" @change="toggleSelect(item.id)" />
              </td>
              <td class="col-style">{{ item.style }}</td>
              <td><code>{{ item.packageNo }}</code></td>
              <td>{{ item.quantity }}</td>
              <td :class="{ 'text-danger': item.shortageQuantity > 0 }">
                {{ item.shortageQuantity > 0 ? item.shortageQuantity : '—' }}
              </td>
              <td>{{ item.suitablePeople }}人</td>
              <td>
                <span :class="['tag', difficultyClass(item.difficulty)]">
                  {{ item.difficulty }}
                </span>
              </td>
              <td>{{ item.estimatedDuration }} 分钟</td>
              <td>{{ item.group }}</td>
              <td :class="{ 'text-warning': !item.personInCharge.trim() }">
                {{ item.personInCharge || '—' }}
              </td>
              <td>
                <span :class="['tag', statusClass(item.status)]">
                  {{ item.status }}
                </span>
              </td>
              <td class="col-demo">{{ item.demoPoints || '—' }}</td>
              <td class="col-shortage" :class="{ 'text-warning': item.status === '需补料' && !item.shortageNote.trim() }">
                {{ item.shortageNote || '—' }}
              </td>
              <td class="col-actions">
                <button class="btn-link-edit" @click="openEditForm(item)">编辑</button>
                <button class="btn-link-delete" @click="handleDelete(item.id)">删除</button>
              </td>
            </tr>
            <tr v-if="store.filteredItems.value.length === 0">
              <td colspan="14" class="empty-row">
                暂无数据，点击「新增配料」添加第一条记录
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <SachetForm
      v-if="showForm"
      :initial-data="editingItem"
      @close="closeForm"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #5c4033;
  font-size: 15px;
}

.filter-icon {
  font-size: 18px;
}

.filter-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-item label {
  font-size: 13px;
  color: #7a5c4a;
  font-weight: 500;
}

.filter-item input,
.filter-item select {
  width: 100%;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.count-info {
  font-size: 14px;
  color: #7a5c4a;
}

.batch-label {
  font-size: 14px;
  color: #7a5c4a;
  margin-right: 4px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  min-width: 1400px;
}

.col-check {
  width: 40px;
}

.col-style {
  font-weight: 500;
  color: #5c4033;
}

.col-demo,
.col-shortage {
  max-width: 180px;
  font-size: 13px;
  color: #6b5344;
}

.col-actions {
  width: 100px;
  white-space: nowrap;
}

.btn-link-edit {
  background: none;
  color: #a67c52;
  padding: 4px 8px;
  font-size: 13px;
}

.btn-link-edit:hover {
  text-decoration: underline;
}

.btn-link-delete {
  background: none;
  color: #c96658;
  padding: 4px 8px;
  font-size: 13px;
}

.btn-link-delete:hover {
  text-decoration: underline;
}

.text-warning {
  color: #c96658 !important;
}

.text-danger {
  color: #c96658 !important;
  font-weight: 600;
}

code {
  background: #f5ebe0;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 13px;
  color: #5c4033;
}

.empty-row {
  text-align: center;
  padding: 40px 20px;
  color: #a08878;
}
</style>
