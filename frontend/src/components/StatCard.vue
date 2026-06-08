<template>
  <div class="stat-card-wrapper">
    <div class="stat-icon-box" :style="{ backgroundColor: lightColor, color: color }">
      <i :class="icon" />
    </div>
    <div class="stat-info">
      <div class="stat-label">{{ title }}</div>
      <div class="stat-value-row">
        <span class="stat-value">{{ value }}</span>
        <span class="stat-unit" v-if="unit">{{ unit }}</span>
      </div>
      <div class="stat-trend" v-if="trend">
        <span :class="trendClass">
          <i :class="trendIcon" />
          {{ trend }}
        </span>
        <span class="trend-text" v-if="trendText"> {{ trendText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  unit: { type: String, default: '' },
  icon: { type: String, required: true },
  color: { type: String, default: '#0047AB' },
  lightColor: { type: String, default: '#e8f0fe' },
  trend: { type: String, default: '' },
  trendType: { type: String, default: 'up' }, // 'up' | 'down' | 'neutral'
  trendText: { type: String, default: '' }
})

const trendClass = computed(() => {
  if (props.trendType === 'up') return 'trend-up'
  if (props.trendType === 'down') return 'trend-down'
  return 'trend-neutral'
})

const trendIcon = computed(() => {
  if (props.trendType === 'up') return 'fas fa-arrow-trend-up'
  if (props.trendType === 'down') return 'fas fa-arrow-trend-down'
  return 'fas fa-minus'
})
</script>

<style scoped>
.stat-card-wrapper {
  background: #ffffff;
  border: 1px solid #f0f4f9;
  border-radius: 16px;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 100%;
  text-align: center;
}

.stat-card-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 71, 171, 0.06);
  border-color: #e8f0fe;
}

.stat-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.stat-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: 0.82rem;
  color: #7a828a;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-value-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.45rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
}

.stat-unit {
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
}

.stat-trend {
  font-size: 0.72rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.trend-up {
  color: #10b981;
  font-weight: 700;
}

.trend-down {
  color: #ef4444;
  font-weight: 700;
}

.trend-neutral {
  color: #64748b;
  font-weight: 700;
}

.trend-text {
  color: #94a3b8;
}
</style>
