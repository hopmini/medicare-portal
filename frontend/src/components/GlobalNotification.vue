<template>
  <div v-if="store.visible" class="notification-overlay" @click.self="store.hide()">
    <div class="notification-card">
      <div class="notification-icon">
        <i :class="iconClass" />
      </div>
      <div v-if="store.title" class="notification-title">{{ store.title }}</div>
      <div class="notification-message">{{ store.message }}</div>
      <button class="notification-close" @click="store.hide()">Đã hiểu</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'

const store = useNotificationStore()

const iconClass = computed(() => {
  switch (store.type) {
    case 'success': return 'fas fa-check-circle'
    case 'error': return 'fas fa-times-circle'
    case 'warning': return 'fas fa-exclamation-triangle'
    default: return 'fas fa-info-circle'
  }
})
</script>

<style scoped>
.notification-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.notification-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 60px rgba(0,0,0,0.2);
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  text-align: center;
  animation: fadeInUp 0.3s ease;
}
.notification-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.notification-icon .fa-check-circle { color: #16a34a; }
.notification-icon .fa-times-circle { color: #dc2626; }
.notification-icon .fa-exclamation-triangle { color: #f59e0b; }
.notification-icon .fa-info-circle { color: #3b82f6; }
.notification-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.5rem;
}
.notification-message {
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 1.25rem;
}
.notification-close {
  width: 100%;
  padding: 0.7rem;
  background: #0047AB;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
}
.notification-close:hover { background: #003380; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
