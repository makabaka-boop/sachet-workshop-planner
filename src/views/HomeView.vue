<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, List, LayoutGrid, Sparkles } from 'lucide-vue-next'
import FilterBar from '@/components/FilterBar.vue'
import BatchToolbar from '@/components/BatchToolbar.vue'
import SachetCard from '@/components/SachetCard.vue'
import EditModal from '@/components/EditModal.vue'
import AlertPanel from '@/components/AlertPanel.vue'
import GroupCard from '@/components/GroupCard.vue'
import type { SachetItem, SachetStatus, ViewMode } from '@/types/sachet'
import { useSachetData } from '@/composables/useSachetData'

const { filteredList, sachetList, batchUpdateStatus, deleteSachet } = useSachetData()

const viewMode = ref<ViewMode>('list')
const selectedIds = ref<string[]>([])
const showEditModal = ref(false)
const editingItem = ref<SachetItem | null>(null)

const allSelected = computed(() => {
  if (filteredList.value.length === 0) return false
  return filteredList.value.every((item) => selectedIds.value.includes(item.id))
})

const groupData = computed(() => {
  const groups: Record<string, SachetItem[]> = {}
  filteredList.value.forEach((item) => {
    const groupName = item.group || '未分组'
    if (!groups[groupName]) {
      groups[groupName] = []
    }
    groups[groupName].push(item)
  })
  return groups
})

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = filteredList.value.map((item) => item.id)
  }
}

function toggleSelect(id: string) {
  const index = selectedIds.value.indexOf(id)
  if (index === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(index, 1)
  }
}

function handleBatchStatus(status: SachetStatus) {
  if (selectedIds.value.length === 0) return
  batchUpdateStatus(selectedIds.value, status)
}

function handleAdd() {
  editingItem.value = null
  showEditModal.value = true
}

function handleEdit(item: SachetItem) {
  editingItem.value = item
  showEditModal.value = true
}

function handleDelete(id: string) {
  if (confirm('确定要删除这个材料包吗？')) {
    deleteSachet(id)
    const idx = selectedIds.value.indexOf(id)
    if (idx !== -1) {
      selectedIds.value.splice(idx, 1)
    }
  }
}

function handleLocate(ids: string[]) {
  viewMode.value = 'list'
  selectedIds.value = ids
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-cream-50 via-amber-50/30 to-orange-50/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500
                       flex items-center justify-center text-white shadow-lg shadow-amber-200"
              >
                <Sparkles class="w-6 h-6" />
              </div>
              <div>
                <h1 class="font-serif text-3xl font-bold text-gray-800">
                  香囊配料清单
                </h1>
                <p class="text-sm text-gray-500">手作活动分组管理 · 材料核对与准备进度追踪</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div
              class="flex items-center bg-white rounded-xl p-1 shadow-sm border border-gray-100"
            >
              <button
                @click="viewMode = 'list'"
                :class="[
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  viewMode === 'list'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                <List class="w-4 h-4" />
                清单模式
              </button>
              <button
                @click="viewMode = 'group'"
                :class="[
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  viewMode === 'group'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                <LayoutGrid class="w-4 h-4" />
                分组执行
              </button>
            </div>

            <button
              @click="handleAdd"
              class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500
                     hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-xl
                     shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300
                     transition-all active:scale-95"
            >
              <Plus class="w-5 h-5" />
              新增材料包
            </button>
          </div>
        </div>
      </header>

      <div class="mb-6">
        <AlertPanel @locate="handleLocate" />
      </div>

      <template v-if="viewMode === 'list'">
        <div class="mb-4">
          <FilterBar />
        </div>

        <div class="mb-4">
          <BatchToolbar
            :selected-count="selectedIds.length"
            :total-count="filteredList.length"
            :all-selected="allSelected"
            @toggle-all="toggleSelectAll"
            @batch-status="handleBatchStatus"
          />
        </div>

        <div
          v-if="filteredList.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <SachetCard
            v-for="item in filteredList"
            :key="item.id"
            :item="item"
            :selected="selectedIds.includes(item.id)"
            @toggle-select="toggleSelect(item.id)"
            @edit="handleEdit(item)"
            @delete="handleDelete(item.id)"
          />
        </div>

        <div
          v-else
          class="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-gray-200"
        >
          <p class="text-gray-400 mb-4">暂无匹配的材料包</p>
          <button
            @click="handleAdd"
            class="text-amber-500 hover:text-amber-600 font-medium"
          >
            + 立即添加
          </button>
        </div>
      </template>

      <template v-else>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <GroupCard
            v-for="(items, groupName) in groupData"
            :key="groupName"
            :group-name="groupName"
            :items="items"
          />
        </div>

        <div
          v-if="sachetList.length === 0"
          class="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-gray-200"
        >
          <p class="text-gray-400 mb-4">暂无材料包数据</p>
          <button
            @click="handleAdd"
            class="text-amber-500 hover:text-amber-600 font-medium"
          >
            + 立即添加
          </button>
        </div>
      </template>
    </div>

    <EditModal
      :visible="showEditModal"
      :edit-item="editingItem"
      @close="showEditModal = false"
      @saved="selectedIds = []"
    />
  </div>
</template>
