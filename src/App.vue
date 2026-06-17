<script setup lang="ts">
import { ref } from 'vue'
import SachetList from './components/SachetList.vue'
import GroupChecklist from './components/GroupChecklist.vue'

type ViewMode = 'list' | 'checklist'

const currentView = ref<ViewMode>('list')
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-title">
        <span class="header-icon">🧵</span>
        <div>
          <h1>香囊手作活动配料清单</h1>
          <p class="subtitle">材料包登记 · 状态跟踪 · 分组管理</p>
        </div>
      </div>
      <nav class="nav-tabs">
        <button
          :class="['nav-btn', { active: currentView === 'list' }]"
          @click="currentView = 'list'"
        >
          📋 配料清单
        </button>
        <button
          :class="['nav-btn', { active: currentView === 'checklist' }]"
          @click="currentView = 'checklist'"
        >
          📦 分组执行清单
        </button>
      </nav>
    </header>

    <main>
      <SachetList v-if="currentView === 'list'" />
      <GroupChecklist v-else />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-header {
  background: linear-gradient(135deg, #a67c52 0%, #8b6642 100%);
  color: #fff;
  padding: 24px 30px;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(166, 124, 82, 0.3);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.header-icon {
  font-size: 48px;
}

.header-title h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
}

.nav-tabs {
  display: flex;
  gap: 8px;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-btn.active {
  background: #fff;
  color: #a67c52;
}
</style>
