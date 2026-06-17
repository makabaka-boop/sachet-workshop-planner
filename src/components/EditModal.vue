<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { X, Save } from 'lucide-vue-next'
import type { SachetItem, DifficultyLevel, SachetStatus } from '@/types/sachet'
import { useSachetData } from '@/composables/useSachetData'

const props = defineProps<{
  visible: boolean
  editItem?: SachetItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const { allDifficulties, allStatuses, addSachet, updateSachet, allGroups, allStyles } = useSachetData()

const form = ref({
  style: '',
  packageNo: '',
  suitablePeople: 1,
  difficulty: '入门' as DifficultyLevel,
  duration: 30,
  demoPoints: '',
  shortageNote: '',
  responsible: '',
  status: '待准备' as SachetStatus,
  group: '',
})

const isEdit = computed(() => !!props.editItem)
const title = computed(() => (isEdit.value ? '编辑材料包' : '新增材料包'))

watch(
  () => props.visible,
  (val) => {
    if (val && props.editItem) {
      form.value = {
        style: props.editItem.style,
        packageNo: props.editItem.packageNo,
        suitablePeople: props.editItem.suitablePeople,
        difficulty: props.editItem.difficulty,
        duration: props.editItem.duration,
        demoPoints: props.editItem.demoPoints,
        shortageNote: props.editItem.shortageNote,
        responsible: props.editItem.responsible,
        status: props.editItem.status,
        group: props.editItem.group,
      }
    } else if (val) {
      form.value = {
        style: '',
        packageNo: '',
        suitablePeople: 1,
        difficulty: '入门',
        duration: 30,
        demoPoints: '',
        shortageNote: '',
        responsible: '',
        status: '待准备',
        group: '',
      }
    }
  }
)

function handleSubmit() {
  if (!form.value.style.trim()) {
    alert('请填写香囊款式')
    return
  }
  if (!form.value.packageNo.trim()) {
    alert('请填写材料包编号')
    return
  }

  if (isEdit.value && props.editItem) {
    updateSachet(props.editItem.id, form.value)
  } else {
    addSachet(form.value)
  }
  emit('saved')
  emit('close')
}

function handleOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        @click="handleOverlayClick"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden
                 animate-slide-up"
        >
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 class="font-serif text-xl font-semibold text-gray-800">{{ title }}</h2>
            <button
              @click="emit('close')"
              class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">
                  香囊款式 <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="form.style"
                  type="text"
                  list="style-list"
                  placeholder="如：艾草驱蚊香囊"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                         focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
                />
                <datalist id="style-list">
                  <option v-for="s in allStyles" :key="s" :value="s"></option>
                </datalist>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">
                  材料包编号 <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="form.packageNo"
                  type="text"
                  placeholder="如：A-001"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                         focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all
                         font-mono"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">适合人数</label>
                <input
                  v-model.number="form.suitablePeople"
                  type="number"
                  min="1"
                  max="10"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                         focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">难度等级</label>
                <select
                  v-model="form.difficulty"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                         focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all
                         bg-white cursor-pointer"
                >
                  <option v-for="d in allDifficulties" :key="d" :value="d">
                    {{ d }}
                  </option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">预计时长（分钟）</label>
                <input
                  v-model.number="form.duration"
                  type="number"
                  min="5"
                  step="5"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                         focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">状态</label>
                <select
                  v-model="form.status"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                         focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all
                         bg-white cursor-pointer"
                >
                  <option v-for="s in allStatuses" :key="s" :value="s">
                    {{ s }}
                  </option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">责任人</label>
                <input
                  v-model="form.responsible"
                  type="text"
                  list="responsible-list"
                  placeholder="请输入责任人姓名"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                         focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
                />
                <datalist id="responsible-list">
                  <option v-for="r in allResponsibles" :key="r" :value="r"></option>
                </datalist>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">所属小组</label>
                <input
                  v-model="form.group"
                  type="text"
                  list="group-list"
                  placeholder="如：第一组"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                         focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
                />
                <datalist id="group-list">
                  <option v-for="g in allGroups" :key="g" :value="g"></option>
                </datalist>
              </div>

              <div class="space-y-2 md:col-span-2">
                <label class="text-sm font-medium text-gray-700">示范要点</label>
                <textarea
                  v-model="form.demoPoints"
                  rows="2"
                  placeholder="请描述该材料包需要示范的要点..."
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                         focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all
                         resize-none"
                ></textarea>
              </div>

              <div class="space-y-2 md:col-span-2">
                <label class="text-sm font-medium text-gray-700">缺料说明</label>
                <textarea
                  v-model="form.shortageNote"
                  rows="2"
                  placeholder="如有缺料，请在此说明..."
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                         focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all
                         resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              @click="emit('close')"
              class="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium
                     transition-all"
            >
              取消
            </button>
            <button
              @click="handleSubmit"
              class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white
                     font-medium flex items-center gap-2 transition-all shadow-sm
                     hover:shadow active:scale-95"
            >
              <Save class="w-4 h-4" />
              保存
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
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .animate-slide-up,
.modal-leave-to .animate-slide-up {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}
</style>
