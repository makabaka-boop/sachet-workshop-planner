<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SachetItem, Difficulty, SachetStatus } from '../types'

const props = defineProps<{
  initialData: SachetItem | null
}>()

const emit = defineEmits<{
  close: []
  save: [data: Omit<SachetItem, 'id'>]
}>()

const form = ref({
  style: '',
  packageNo: '',
  quantity: 1,
  shortageQuantity: 0,
  suitablePeople: 1,
  difficulty: '入门' as Difficulty,
  estimatedDuration: 30,
  demoPoints: '',
  shortageNote: '',
  personInCharge: '',
  status: '待准备' as SachetStatus,
  group: ''
})

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      form.value = {
        style: val.style,
        packageNo: val.packageNo,
        quantity: val.quantity,
        shortageQuantity: val.shortageQuantity ?? 0,
        suitablePeople: val.suitablePeople,
        difficulty: val.difficulty,
        estimatedDuration: val.estimatedDuration,
        demoPoints: val.demoPoints,
        shortageNote: val.shortageNote,
        personInCharge: val.personInCharge,
        status: val.status,
        group: val.group
      }
    } else {
      form.value = {
        style: '',
        packageNo: '',
        quantity: 1,
        shortageQuantity: 0,
        suitablePeople: 1,
        difficulty: '入门',
        estimatedDuration: 30,
        demoPoints: '',
        shortageNote: '',
        personInCharge: '',
        status: '待准备',
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
  if (!form.value.group.trim()) {
    alert('请填写小组名称')
    return
  }
  emit('save', { ...form.value })
}

function handleOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ initialData ? '编辑配料' : '新增配料' }}</h3>
        <button class="close-btn" @click="emit('close')">×</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="form-grid">
          <div class="form-item col-2">
            <label>香囊款式 <span class="required">*</span></label>
            <input v-model="form.style" placeholder="如：艾草平安香囊" type="text" />
          </div>
          <div class="form-item">
            <label>材料包编号 <span class="required">*</span></label>
            <input v-model="form.packageNo" placeholder="如：A-001" type="text" />
          </div>
          <div class="form-item">
            <label>小组 <span class="required">*</span></label>
            <input v-model="form.group" placeholder="如：第一组" type="text" />
          </div>
          <div class="form-item">
            <label>数量</label>
            <input v-model.number="form.quantity" min="1" type="number" />
          </div>
          <div class="form-item">
            <label>缺口数量</label>
            <input v-model.number="form.shortageQuantity" min="0" type="number" />
          </div>
          <div class="form-item">
            <label>适合人数</label>
            <input v-model.number="form.suitablePeople" min="1" type="number" />
          </div>
          <div class="form-item">
            <label>难度</label>
            <select v-model="form.difficulty">
              <option value="入门">入门</option>
              <option value="初级">初级</option>
              <option value="中级">中级</option>
              <option value="高级">高级</option>
            </select>
          </div>
          <div class="form-item">
            <label>预计时长（分钟）</label>
            <input v-model.number="form.estimatedDuration" min="5" type="number" />
          </div>
          <div class="form-item">
            <label>状态</label>
            <select v-model="form.status">
              <option value="待准备">待准备</option>
              <option value="可分发">可分发</option>
              <option value="需补料">需补料</option>
              <option value="改为演示">改为演示</option>
            </select>
          </div>
          <div class="form-item">
            <label>责任人</label>
            <input v-model="form.personInCharge" placeholder="如：李老师" type="text" />
          </div>
          <div class="form-item col-2">
            <label>示范要点</label>
            <textarea v-model="form.demoPoints" placeholder="如：示范平针法、塞棉手法" rows="2"></textarea>
          </div>
          <div class="form-item col-2">
            <label>缺料说明</label>
            <textarea v-model="form.shortageNote" placeholder="如：缺少五彩绳，预计明日到货" rows="2"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" @click="emit('close')">取消</button>
        <button class="btn-primary" @click="handleSubmit">
          {{ initialData ? '保存修改' : '新增' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 24, 16, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px rgba(92, 64, 51, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0e6d8;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #5c4033;
}

.close-btn {
  background: none;
  color: #7a5c4a;
  font-size: 24px;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background: #f5ebe0;
}

.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-item.col-2 {
  grid-column: span 2;
}

.form-item label {
  font-size: 13px;
  font-weight: 500;
  color: #5c4033;
}

.required {
  color: #c96658;
}

.form-item input,
.form-item select,
.form-item textarea {
  width: 100%;
}

.form-item textarea {
  resize: vertical;
  min-height: 60px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #f0e6d8;
}
</style>
