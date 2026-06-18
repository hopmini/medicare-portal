<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </transition>
    </router-view>
    <AIConsultant v-if="showAIConsultant" />
    <GlobalNotification />
    <CommandPalette :visible="showCommandPalette" @close="showCommandPalette = false" @navigate="handleCommandNavigate" @open="showCommandPalette = true" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AIConsultant from '@/components/AIConsultant.vue'
import GlobalNotification from '@/components/GlobalNotification.vue'
import CommandPalette from '@/components/CommandPalette.vue'

const router = useRouter()
const route = useRoute()
const showCommandPalette = ref(false)

const showAIConsultant = computed(() => {
  const path = route.path || ''
  return !path.startsWith('/dashboard') && !path.startsWith('/pharmacy')
})

function handleCommandNavigate(routePath) {
  showCommandPalette.value = false
  if (routePath === '/logout') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
    return
  }
  router.push(routePath)
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}
</style>
