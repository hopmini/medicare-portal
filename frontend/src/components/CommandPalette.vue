<template>
  <teleport to="body">
    <div v-if="visible" class="cp-overlay" @click.self="close">
      <div class="cp-modal" ref="modalRef">
        <div class="cp-input-wrapper">
          <i class="fas fa-search cp-search-icon" />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            class="cp-input"
            placeholder="Tìm kiếm chức năng..."
            @keydown="onKeydown"
          />
          <kbd class="cp-shortcut">ESC</kbd>
        </div>
        <div class="cp-results" v-if="filteredItems.length > 0">
          <div
            v-for="(item, idx) in filteredItems"
            :key="idx"
            :class="['cp-item', { 'cp-item--active': idx === activeIndex }]"
            @click="selectItem(item)"
            @mouseenter="activeIndex = idx"
          >
            <span class="cp-item-icon" :style="{ color: item.color }"><i :class="item.icon" /></span>
            <div class="cp-item-info">
              <span class="cp-item-name">{{ item.label }}</span>
              <span class="cp-item-section">{{ item.section }}</span>
            </div>
            <span v-if="item.shortcut" class="cp-item-shortcut"><kbd>{{ item.shortcut }}</kbd></span>
          </div>
        </div>
        <div v-else-if="query && filteredItems.length === 0" class="cp-empty">
          <i class="fas fa-search" style="font-size: 1.5rem; color: #cbd5e1; margin-bottom: 8px;" />
          <p>Không tìm thấy kết quả</p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['close', 'navigate'])

const query = ref('')
const activeIndex = ref(0)
const inputRef = ref(null)
const modalRef = ref(null)

const menuItems = [
  { label: 'Dashboard', icon: 'fas fa-cubes', color: '#0047AB', section: 'QUẢN TRỊ CHIẾN LƯỢC', tab: 'overview', shortcut: 'Ctrl+1' },
  { label: 'Lịch hẹn chờ duyệt', icon: 'fas fa-calendar-check', color: '#2563eb', section: 'PHÂN HỆ LỊCH KHÁM', tab: 'appointments', shortcut: null },
  { label: 'Quản lý Lịch trực', icon: 'fas fa-clock', color: '#2563eb', section: 'PHÂN HỆ LỊCH KHÁM', tab: 'schedule', shortcut: null },
  { label: 'Danh mục Bác sĩ', icon: 'fas fa-user-md', color: '#2563eb', section: 'PHÂN HỆ LỊCH KHÁM', tab: 'doctors', shortcut: null },
  { label: 'Dịch vụ y khoa', icon: 'fas fa-concierge-bell', color: '#2563eb', section: 'PHÂN HỆ LỊCH KHÁM', tab: 'services', shortcut: null },
  { label: 'Danh mục Phòng khám', icon: 'fas fa-door-open', color: '#2563eb', section: 'PHÂN HỆ LỊCH KHÁM', tab: 'rooms', shortcut: null },
  { label: 'Bệnh án điện tử', icon: 'fas fa-notes-medical', color: '#dc2626', section: 'PHÂN HỆ BỆNH ÁN ĐIỆN TỬ', tab: 'medical-records', shortcut: null },
  { label: 'Hồ sơ Bệnh nhân', icon: 'fas fa-id-card', color: '#dc2626', section: 'PHÂN HỆ BỆNH ÁN ĐIỆN TỬ', tab: 'patient-registry', shortcut: null },
  { label: 'Quản lý thuốc', icon: 'fas fa-prescription-bottle-alt', color: '#16a34a', section: 'PHÂN HỆ DƯỢC & HÓA ĐƠN', tab: 'pharmacy-medicines', shortcut: null },
  { label: 'Nhà cung cấp', icon: 'fas fa-truck', color: '#16a34a', section: 'PHÂN HỆ DƯỢC & HÓA ĐƠN', tab: 'pharmacy-suppliers', shortcut: null },
  { label: 'Phiếu nhập thuốc', icon: 'fas fa-file-import', color: '#16a34a', section: 'PHÂN HỆ DƯỢC & HÓA ĐƠN', tab: 'pharmacy-import-bills', shortcut: null },
  { label: 'Tồn kho theo lô', icon: 'fas fa-boxes', color: '#16a34a', section: 'PHÂN HỆ DƯỢC & HÓA ĐƠN', tab: 'pharmacy-batches', shortcut: null },
  { label: 'Đơn thuốc & Bán lẻ', icon: 'fas fa-file-prescription', color: '#16a34a', section: 'PHÂN HỆ DƯỢC & HÓA ĐƠN', tab: 'pharmacy-prescriptions', shortcut: null },
  { label: 'Hóa đơn bán thuốc', icon: 'fas fa-receipt', color: '#16a34a', section: 'PHÂN HỆ DƯỢC & HÓA ĐƠN', tab: 'pharmacy-billing', shortcut: null },
  { label: 'Quản lý thanh toán', icon: 'fas fa-credit-card', color: '#16a34a', section: 'PHÂN HỆ DƯỢC & HÓA ĐƠN', tab: 'pharmacy-payments', shortcut: null },
  { label: 'Lịch sử kho thuốc', icon: 'fas fa-history', color: '#16a34a', section: 'PHÂN HỆ DƯỢC & HÓA ĐƠN', tab: 'pharmacy-stock-history', shortcut: null }
]

const filteredItems = computed(() => {
  if (!query.value) return menuItems
  const q = query.value.toLowerCase().trim()
  return menuItems.filter(item =>
    item.label.toLowerCase().includes(q) ||
    item.section.toLowerCase().includes(q)
  )
})

watch(() => props.visible, (val) => {
  if (val) {
    query.value = ''
    activeIndex.value = 0
    nextTick(() => inputRef.value?.focus())
  }
})

function onKeydown(e) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, filteredItems.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (filteredItems.value[activeIndex.value]) {
      selectItem(filteredItems.value[activeIndex.value])
    }
  }
}

function selectItem(item) {
  emit('navigate', item.tab)
  close()
}

function close() {
  emit('close')
}

function handleGlobalKeydown(e) {
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault()
    if (!props.visible) {
      emit('open')
    } else {
      close()
    }
  }
  if (e.key === 'Escape' && props.visible) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style scoped>
.cp-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 99999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  animation: cpFadeIn 0.15s ease;
}

.cp-modal {
  width: 520px;
  max-width: 90vw;
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: cpSlideDown 0.15s ease;
}

.cp-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid #f1f5f9;
}

.cp-search-icon {
  color: #94a3b8;
  font-size: 0.95rem;
}

.cp-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 500;
  color: #0f172a;
  background: transparent;
  font-family: inherit;
}

.cp-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.cp-shortcut {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  line-height: 1.4;
}

.cp-results {
  max-height: 360px;
  overflow-y: auto;
  padding: 6px 0;
}

.cp-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  cursor: pointer;
  transition: background 0.1s;
}

.cp-item--active,
.cp-item:hover {
  background: #f1f5f9;
}

.cp-item-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.cp-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.cp-item-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
}

.cp-item-section {
  font-size: 0.7rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.cp-item-shortcut kbd {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
}

.cp-empty {
  padding: 32px 18px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
}

@keyframes cpFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes cpSlideDown {
  from { opacity: 0; transform: translateY(-20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
