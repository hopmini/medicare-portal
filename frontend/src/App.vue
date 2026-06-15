<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </transition>
    </router-view>
    <AIConsultant v-if="showAIConsultant" />
    <GlobalNotification />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AIConsultant from '@/components/AIConsultant.vue'
import GlobalNotification from '@/components/GlobalNotification.vue'

const route = useRoute()
const showAIConsultant = computed(() => {
  const path = route.path || ''
  return !path.startsWith('/dashboard') && !path.startsWith('/pharmacy')
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}
</style>
