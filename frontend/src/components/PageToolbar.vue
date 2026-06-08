<template>
  <div class="toolbar-container">
    <!-- Title / Left Info -->
    <div class="toolbar-left">
      <h3 class="toolbar-title" v-if="title">{{ title }}</h3>
      <slot name="left"></slot>
    </div>

    <!-- Actions / Right Tools -->
    <div class="toolbar-right">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: '' }
})
</script>

<style scoped>
.toolbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f4f9;
  margin-bottom: 20px;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

:deep(.ant-btn) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  border-radius: 6px;
  height: 38px;
  padding: 0 16px;
}

:deep(.ant-btn-primary) {
  background-color: #0047AB;
  border-color: #0047AB;
}
:deep(.ant-btn-primary:hover) {
  background-color: #003380;
  border-color: #003380;
}

:deep(.ant-btn-danger) {
  background-color: #ef4444;
  border-color: #ef4444;
}
</style>
