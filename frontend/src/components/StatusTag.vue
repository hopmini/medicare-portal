<template>
  <span class="custom-badge" :class="badgeClass" :style="customStyle">
    <span class="badge-dot" v-if="showDot"></span>
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  type: { type: String, default: 'default' }, // 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'default'
  showDot: { type: Boolean, default: false },
  customStyle: { type: Object, default: () => ({}) }
})

const badgeClass = computed(() => {
  return `badge-${props.type}`
})
</script>

<style scoped>
.custom-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

/* Success - Completed */
.badge-success {
  background-color: #ecfdf5;
  color: #10b981;
}
.badge-success .badge-dot {
  background-color: #10b981;
}

/* Warning - Pending */
.badge-warning {
  background-color: #fffbeb;
  color: #d97706;
}
.badge-warning .badge-dot {
  background-color: #d97706;
}

/* Danger - High alert / expired */
.badge-danger {
  background-color: #fef2f2;
  color: #ef4444;
}
.badge-danger .badge-dot {
  background-color: #ef4444;
}

/* Primary - Medicare Cobalt */
.badge-primary {
  background-color: #eff6ff;
  color: #0047AB;
}
.badge-primary .badge-dot {
  background-color: #0047AB;
}

/* Info - Processing */
.badge-info {
  background-color: #f0fdfa;
  color: #0d9488;
}
.badge-info .badge-dot {
  background-color: #0d9488;
}

/* Default */
.badge-default {
  background-color: #f8fafc;
  color: #64748b;
}
.badge-default .badge-dot {
  background-color: #64748b;
}
</style>
