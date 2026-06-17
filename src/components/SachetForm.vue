<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SachetItem, DifficultyLevel, SachetStatus } from '../types'
import { DIFFICULTY_LABELS, STATUS_LABELS } from '../types'
import { generateId } from '../utils/storage'

const props = defineProps<{
  visible: boolean
  editItem?: SachetItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', item: SachetItem): void
}>()

const form = ref<Omit<SachetItem, 'id'>>({
  style: '',
  packageNo: '',
  suitablePeople: 4,
  difficulty: 'medium',
  estimatedDuration: 30,
  demoKeyPoints: '',
  shortageNote: '',
  responsiblePerson: '',
  status: 'pending',
  group: ''
})

const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard']
const statuses: SachetStatus[] = ['pending', 'ready', 'shortage', 'demo']

watch(
  () => props.editItem,
  (item) => {
    if (item) {
      form.value = { ...item }
    } else {
      form.value = {
        style: '',
        packageNo: '',
        suitablePeople: 4,
        difficulty: 'medium',
        estimatedDuration: 30,
        demoKeyPoints: '',
        shortageNote: '',
        responsiblePerson: '',
        status: 'pending',
        group: ''
      }
    }
  },
  { immediate: true }
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

  const item: SachetItem = {
    id: props.editItem?.id || generateId(),
    ...form.value
  }
  emit('save', item)
}
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ editItem ? '编辑香囊记录' : '新增香囊记录' }}</h3>
        <button class="close-btn" @click="emit('close')">×</button>
      </div>
      <form class="modal-body" @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-item">
            <label>香囊款式 <span class="required">*</span></label>
            <input v-model="form.style" type="text" placeholder="如：锦鲤香囊" />
          </div>
          <div class="form-item">
            <label>材料包编号 <span class="required">*</span></label>
            <input v-model="form.packageNo" type="text" placeholder="如：KL-001" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-item">
            <label>适合人数</label>
            <input v-model.number="form.suitablePeople" type="number" min="1" />
          </div>
          <div class="form-item">
            <label>难度</label>
            <select v-model="form.difficulty">
              <option v-for="d in difficulties" :key="d" :value="d">
                {{ DIFFICULTY_LABELS[d] }}
              </option>
            </select>
          </div>
          <div class="form-item">
            <label>预计时长(分钟)</label>
            <input v-model.number="form.estimatedDuration" type="number" min="5" step="5" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-item">
            <label>责任小组</label>
            <input v-model="form.group" type="text" placeholder="如：第一组" />
          </div>
          <div class="form-item">
            <label>责任人</label>
            <input v-model="form.responsiblePerson" type="text" placeholder="如：李老师" />
          </div>
          <div class="form-item">
            <label>状态</label>
            <select v-model="form.status">
              <option v-for="s in statuses" :key="s" :value="s">
                {{ STATUS_LABELS[s] }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-item">
          <label>示范要点</label>
          <textarea v-model="form.demoKeyPoints" rows="2" placeholder="制作过程中需要重点示范的步骤"></textarea>
        </div>

        <div class="form-item">
          <label>缺料说明</label>
          <textarea v-model="form.shortageNote" rows="2" placeholder="如有缺料请填写具体缺什么"></textarea>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="emit('close')">取消</button>
          <button type="submit" class="btn-primary">保存</button>
        </div>
      </form>
    </div>
  </div>
</template>
