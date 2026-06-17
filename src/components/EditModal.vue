<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSachetStore } from '@/stores/sachet'
import { DIFFICULTY_OPTIONS, STATUS_OPTIONS } from '@/types'
import type { SachetRecord, Difficulty, Status } from '@/types'
import { X, Save } from 'lucide-vue-next'

const store = useSachetStore()

const props = defineProps<{
  visible: boolean
  record: SachetRecord | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const form = ref({
  style: '',
  materialPackNo: '',
  suitablePeople: 4,
  difficulty: '中等' as Difficulty,
  estimatedDuration: 30,
  demoPoints: '',
  missingDesc: '',
  responsiblePerson: '',
  status: '待准备' as Status,
  group: '',
})

const styleError = ref('')

watch(() => props.visible, (val) => {
  if (val && props.record) {
    form.value = { ...props.record }
    styleError.value = ''
  } else if (val) {
    form.value = {
      style: '',
      materialPackNo: '',
      suitablePeople: 4,
      difficulty: '中等',
      estimatedDuration: 30,
      demoPoints: '',
      missingDesc: '',
      responsiblePerson: '',
      status: '待准备',
      group: store.groups[0] || '',
    }
    styleError.value = ''
  }
})

function handleSave() {
  if (!form.value.style.trim()) {
    styleError.value = '请填写香囊款式'
    return
  }
  styleError.value = ''
  if (props.record) {
    store.updateRecord(props.record.id, { ...form.value })
  } else {
    store.addRecord({ ...form.value })
  }
  emit('saved')
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="emit('close')"></div>
        <div class="relative w-full max-w-lg card p-0 animate-scale-in max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 flex items-center justify-between px-6 py-4 border-b" style="background-color: white; border-color: var(--color-light-brown)">
            <h2 class="font-serif-cn text-lg font-semibold" style="color: var(--color-dark-brown)">
              {{ record ? '编辑记录' : '新增记录' }}
            </h2>
            <button class="p-1 rounded-md hover:bg-gray-100 transition-colors" @click="emit('close')">
              <X class="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div class="px-6 py-5 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color: var(--color-medium-brown)">香囊款式 <span class="text-red-500">*</span></label>
                <input
                  v-model="form.style"
                  class="input-field"
                  :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-200': styleError }"
                  placeholder="如：莲花款"
                  @input="styleError = ''"
                />
                <p v-if="styleError" class="text-xs text-red-500 mt-1">{{ styleError }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color: var(--color-medium-brown)">材料包编号</label>
                <input v-model="form.materialPackNo" class="input-field" placeholder="如：CL-001" />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color: var(--color-medium-brown)">适合人数</label>
                <input v-model.number="form.suitablePeople" type="number" min="1" class="input-field" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color: var(--color-medium-brown)">难度</label>
                <select v-model="form.difficulty" class="select-field">
                  <option v-for="d in DIFFICULTY_OPTIONS" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color: var(--color-medium-brown)">预计时长(分钟)</label>
                <input v-model.number="form.estimatedDuration" type="number" min="5" step="5" class="input-field" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: var(--color-medium-brown)">示范要点</label>
              <textarea v-model="form.demoPoints" class="input-field resize-none" rows="2" placeholder="填写制作示范的关键步骤和注意事项"></textarea>
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: var(--color-medium-brown)">缺料说明</label>
              <textarea v-model="form.missingDesc" class="input-field resize-none" rows="2" placeholder="如缺少特定材料请在此说明"></textarea>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color: var(--color-medium-brown)">责任人</label>
                <input v-model="form.responsiblePerson" class="input-field" placeholder="姓名" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color: var(--color-medium-brown)">状态</label>
                <select v-model="form.status" class="select-field">
                  <option v-for="s in STATUS_OPTIONS" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color: var(--color-medium-brown)">所属小组</label>
                <select v-model="form.group" class="select-field">
                  <option value="">未分组</option>
                  <option v-for="g in store.groups" :key="g" :value="g">{{ g }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t" style="background-color: white; border-color: var(--color-light-brown)">
            <button class="btn-outline text-sm" @click="emit('close')">取消</button>
            <button class="btn-primary text-sm flex items-center gap-2" @click="handleSave()">
              <Save class="w-4 h-4" />
              {{ record ? '保存修改' : '添加记录' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
