<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { LayoutList, ClipboardList } from 'lucide-vue-next'

const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-cream)">
    <header class="sticky top-0 z-40 border-b backdrop-blur-md" style="background-color: rgba(253,248,240,0.9); border-color: var(--color-light-brown)">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center" style="background-color: var(--color-warm-brown)">
              <span class="text-white text-lg">囊</span>
            </div>
            <h1 class="font-serif-cn text-xl font-semibold" style="color: var(--color-dark-brown)">香囊配料清单</h1>
          </div>
          <nav class="flex items-center gap-1">
            <router-link
              to="/"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="isHome ? 'text-white shadow-sm' : 'hover:bg-white/50'"
              :style="isHome ? 'background-color: var(--color-warm-brown)' : 'color: var(--color-dark-brown)'"
            >
              <LayoutList class="w-4 h-4" />
              <span class="hidden sm:inline">配料清单</span>
            </router-link>
            <router-link
              to="/group-checklist"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="!isHome ? 'text-white shadow-sm' : 'hover:bg-white/50'"
              :style="!isHome ? 'background-color: var(--color-warm-brown)' : 'color: var(--color-dark-brown)'"
            >
              <ClipboardList class="w-4 h-4" />
              <span class="hidden sm:inline">分组执行清单</span>
            </router-link>
          </nav>
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <router-view />
    </main>
  </div>
</template>
