<template>
  <div class="sidebar-wrapper" :class="{ 'collapsed': isCollapsed }">
    <!-- Brand / Logo Area -->
    <div class="brand-container" @click="goHome">
      <div class="logo-box">
        <svg fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
          <rect fill="#ffffff" height="32" rx="8" width="32" />
          <path d="M16 6v20M6 16h20" stroke="#0047AB" stroke-linecap="round" stroke-width="4" />
        </svg>
      </div>
      <div class="brand-text" v-if="!isCollapsed">Medicare<span class="brand-dot">.</span></div>
    </div>

    <!-- Scrollable Menu -->
    <div class="menu-container">
      <a-menu
        mode="inline"
        theme="light"
        v-model:selectedKeys="selectedKeys"
        class="custom-nav-menu"
      >
        <!-- RENDER MENU BASED ON ROLE -->

        <!-- 1. ADMIN MENU -->
        <template v-if="userRole === 'admin'">
          <a-menu-item key="pharmacy-dashboard">
            <router-link to="/pharmacy/dashboard">
              <span class="menu-icon"><i class="fas fa-th-large" /></span>
              <span v-if="!isCollapsed">Tổng quan</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="pharmacy-medicines">
            <router-link to="/pharmacy/medicines">
              <span class="menu-icon"><i class="fas fa-capsules" /></span>
              <span v-if="!isCollapsed">Quản lý thuốc</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="admin-suppliers">
            <router-link to="/pharmacy/suppliers">
              <span class="menu-icon"><i class="fas fa-truck-loading" /></span>
              <span v-if="!isCollapsed">Nhà cung cấp</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="admin-import-invoice">
            <router-link to="/pharmacy/import-bill">
              <span class="menu-icon"><i class="fas fa-file-import" /></span>
              <span v-if="!isCollapsed">Hóa đơn nhập thuốc</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="admin-inventory-batches">
            <router-link to="/pharmacy/batches">
              <span class="menu-icon"><i class="fas fa-boxes" /></span>
              <span v-if="!isCollapsed">Tồn kho theo lô</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="pharmacy-prescriptions">
            <router-link to="/pharmacy/prescriptions">
              <span class="menu-icon"><i class="fas fa-file-prescription" /></span>
              <span v-if="!isCollapsed">Đơn thuốc</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="pharmacy-billing">
            <router-link to="/pharmacy/billing">
              <span class="menu-icon"><i class="fas fa-receipt" /></span>
              <span v-if="!isCollapsed">Hóa đơn bán thuốc</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="admin-payments">
            <router-link to="/pharmacy/payments">
              <span class="menu-icon"><i class="fas fa-credit-card" /></span>
              <span v-if="!isCollapsed">Thanh toán</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="admin-stock-history">
            <router-link to="/pharmacy/inventory?tab=history">
              <span class="menu-icon"><i class="fas fa-history" /></span>
              <span v-if="!isCollapsed">Lịch sử kho</span>
            </router-link>
          </a-menu-item>
        </template>

        <!-- 2. PHARMACIST MENU -->
        <template v-else-if="userRole === 'pharmacist' || userRole === 'doctor'">
          <a-menu-item key="pharmacy-dashboard">
            <router-link to="/pharmacy/dashboard">
              <span class="menu-icon"><i class="fas fa-clinic-medical" /></span>
              <span v-if="!isCollapsed">Tổng quan nhà thuốc</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="pharmacy-medicines">
            <router-link to="/pharmacy/medicines">
              <span class="menu-icon"><i class="fas fa-capsules" /></span>
              <span v-if="!isCollapsed">Quản lý thuốc</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="ph-suppliers">
            <router-link to="/pharmacy/suppliers">
              <span class="menu-icon"><i class="fas fa-truck" /></span>
              <span v-if="!isCollapsed">Nhà cung cấp</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="ph-import-invoice">
            <router-link to="/pharmacy/import-bill">
              <span class="menu-icon"><i class="fas fa-file-import" /></span>
              <span v-if="!isCollapsed">Hóa đơn nhập thuốc</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="ph-inventory-batches">
            <router-link to="/pharmacy/batches">
              <span class="menu-icon"><i class="fas fa-boxes" /></span>
              <span v-if="!isCollapsed">Tồn kho theo lô</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="pharmacy-prescriptions">
            <router-link to="/pharmacy/prescriptions">
              <span class="menu-icon"><i class="fas fa-file-prescription" /></span>
              <span v-if="!isCollapsed">Đơn thuốc đã nhận</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="ph-sell-prescription">
            <router-link to="/pharmacy/create-bill?type=prescription">
              <span class="menu-icon"><i class="fas fa-file-invoice-dollar" /></span>
              <span v-if="!isCollapsed">Bán thuốc theo đơn</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="ph-sell-nonprescription">
            <router-link to="/pharmacy/create-bill?type=free">
              <span class="menu-icon"><i class="fas fa-cart-plus" /></span>
              <span v-if="!isCollapsed">Bán thuốc ngoài đơn</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="ph-stock-history">
            <router-link to="/pharmacy/inventory?tab=history">
              <span class="menu-icon"><i class="fas fa-exchange-alt" /></span>
              <span v-if="!isCollapsed">Lịch sử nhập/xuất kho</span>
            </router-link>
          </a-menu-item>
        </template>

        <!-- 3. CASHIER MENU -->
        <template v-else-if="userRole === 'receptionist' || userRole === 'cashier'">
          <a-menu-item key="pharmacy-dashboard">
            <router-link to="/pharmacy/dashboard">
              <span class="menu-icon"><i class="fas fa-cash-register" /></span>
              <span v-if="!isCollapsed">Tổng quan thanh toán</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="pharmacy-billing">
            <router-link to="/pharmacy/billing">
              <span class="menu-icon"><i class="fas fa-list-alt" /></span>
              <span v-if="!isCollapsed">Danh sách hóa đơn</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="cashier-pay">
            <router-link to="/pharmacy/payments/list">
              <span class="menu-icon"><i class="fas fa-check-circle" /></span>
              <span v-if="!isCollapsed">Xác nhận thanh toán</span>
            </router-link>
          </a-menu-item>
        </template>

        <!-- 4. PATIENT MENU -->
        <template v-else-if="userRole === 'patient'">
          <a-menu-item key="patient-billing">
            <router-link to="/pharmacy/my-invoices">
              <span class="menu-icon"><i class="fas fa-file-invoice-dollar" /></span>
              <span v-if="!isCollapsed">Hóa đơn của tôi</span>
            </router-link>
          </a-menu-item>

          <a-menu-item key="patient-prescriptions">
            <router-link to="/my-medical-records">
              <span class="menu-icon"><i class="fas fa-prescription-bottle" /></span>
              <span v-if="!isCollapsed">Đơn thuốc của tôi</span>
            </router-link>
          </a-menu-item>

          <a-menu-item key="patient-billing-status">
            <router-link to="/pharmacy/payment-status">
              <span class="menu-icon"><i class="fas fa-info-circle" /></span>
              <span v-if="!isCollapsed">Trạng thái thanh toán</span>
            </router-link>
          </a-menu-item>
        </template>
      </a-menu>
    </div>

    <!-- Collapsible Switcher -->
    <div class="sidebar-collapser" @click="toggleCollapse">
      <i class="fas" :class="isCollapsed ? 'fa-angle-double-right' : 'fa-angle-double-left'" />
    </div>

    <!-- Active System Indicator Card at bottom -->
    <div class="system-status-container" v-if="!isCollapsed">
      <div class="status-indicator">
        <span class="pulse-dot"></span>
        <span class="status-label">Hệ thống hoạt động tốt</span>
      </div>
      <div class="status-desc">Tất cả dịch vụ đang vận hành</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isCollapsed = ref(false)
const selectedKeys = ref<string[]>([])

const userRole = computed(() => {
  const role = (authStore.user.value?.role || 'pharmacist').toLowerCase()
  // receptionist acts as cashier, doctor acts as pharmacist
  if (role === 'receptionist') return 'receptionist'
  if (role === 'doctor') return 'pharmacist'
  return role
})

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const goHome = () => {
  const role = (authStore.user.value?.role || '').toLowerCase()
  if (role === 'patient') {
    router.push('/')
  } else if (role === 'receptionist') {
    router.push('/receptionist')
  } else if (role === 'doctor') {
    router.push('/doctor')
  } else {
    router.push('/dashboard')
  }
}

const updateActiveKeys = () => {
  const path = route.path
  if (path.includes('dashboard')) {
    selectedKeys.value = ['pharmacy-dashboard']
  } else if (path.includes('users')) {
    selectedKeys.value = ['admin-users']
  } else if (path.includes('medicines')) {
    selectedKeys.value = ['pharmacy-medicines']
  } else if (path.includes('suppliers')) {
    selectedKeys.value = ['admin-suppliers', 'ph-suppliers']
  } else if (path.includes('import-bill')) {
    selectedKeys.value = ['admin-import-invoice', 'ph-import-invoice']
  } else if (path.includes('batches')) {
    selectedKeys.value = ['admin-inventory-batches', 'ph-inventory-batches']
  } else if (path.includes('inventory')) {
    selectedKeys.value = []
  } else if (path.includes('prescriptions')) {
    selectedKeys.value = ['pharmacy-prescriptions', 'patient-prescriptions']
  } else if (path.includes('create-bill')) {
    selectedKeys.value = ['ph-sell-prescription', 'cashier-create-bill-pres']
  } else if (path.includes('payments')) {
    selectedKeys.value = ['admin-payments', 'cashier-pay']
  } else if (path.includes('billing')) {
    selectedKeys.value = ['pharmacy-billing', 'patient-billing']
  } else if (path.includes('my-invoices')) {
    selectedKeys.value = ['patient-billing']
  }
}

watch(() => route.path, updateActiveKeys)
onMounted(updateActiveKeys)
</script>

<style scoped>
.sidebar-wrapper {
  background: #ffffff;
  height: 100vh;
  border-right: 1px solid #f0f4f9;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 260px;
  position: relative;
}

.sidebar-wrapper.collapsed {
  width: 80px;
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f5f8fc;
}

.logo-box {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #0047AB;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 71, 171, 0.25);
  flex-shrink: 0;
}

.logo-svg {
  width: 20px;
  height: 20px;
}

.brand-text {
  font-size: 1.3rem;
  font-weight: 800;
  color: #001529;
  letter-spacing: -0.5px;
}

.brand-dot {
  color: #e53935;
}

.menu-container {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 8px;
}

.custom-nav-menu {
  border-right: none;
  background: transparent;
}

.custom-nav-menu :deep(.ant-menu-item) {
  height: 48px;
  line-height: 48px;
  margin: 4px 0 !important;
  border-radius: 8px;
  color: #596780;
  font-weight: 500;
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-nav-menu :deep(.ant-menu-item a) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.custom-nav-menu :deep(.ant-menu-item-selected) {
  background-color: #e8f0fe !important;
  color: #0047AB !important;
  font-weight: 600;
}

.custom-nav-menu :deep(.ant-menu-item-selected a) {
  color: #0047AB !important;
}

.menu-icon {
  margin-right: 12px;
  font-size: 1.1rem;
  width: 20px;
  display: inline-block;
  text-align: center;
  transition: transform 0.2s;
}

.custom-nav-menu :deep(.ant-menu-item:hover .menu-icon) {
  transform: scale(1.15);
}

.sidebar-collapser {
  padding: 16px;
  text-align: center;
  cursor: pointer;
  color: #8c9ba5;
  border-top: 1px solid #f0f4f9;
  transition: background 0.2s;
}

.sidebar-collapser:hover {
  background: #f7fafc;
  color: #0047AB;
}

.system-status-container {
  background: #f8fafc;
  border: 1px solid #e8f0fe;
  border-radius: 12px;
  padding: 14px;
  margin: 16px;
  margin-top: 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #52c41a;
  box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.4);
  animation: pulse 1.6s infinite;
}

.status-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #262626;
}

.status-desc {
  font-size: 0.72rem;
  color: #8c8c8c;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(82, 196, 26, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(82, 196, 26, 0);
  }
}
</style>
