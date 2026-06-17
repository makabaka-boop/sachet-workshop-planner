import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import GroupChecklistPage from '@/pages/GroupChecklistPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/group-checklist',
    name: 'group-checklist',
    component: GroupChecklistPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
