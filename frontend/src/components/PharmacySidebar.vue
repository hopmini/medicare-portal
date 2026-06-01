<template>
  <div class="sidebar-wrapper">
    <div class="logo-container">
      <div class="logo-text">Pharmacy & Billing Service</div>
    </div>
    
    <a-menu
      mode="inline"
      theme="light"
      :selectedKeys="[selectedKey]"
      class="custom-menu"
    >
      <!-- ADMIN MENU -->
      <template v-if="authStore.isAdmin.value">
        <a-menu-item key="dashboard">
          <router-link to="/pharmacy/dashboard">
            <span class="menu-icon"><i class="fas fa-chart-line" /></span>
            <span>Tổng quan</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="medicines">
          <router-link to="/pharmacy/medicines">
            <span class="menu-icon"><i class="fas fa-capsules" /></span>
            <span>Quản lý thuốc</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="inventory">
          <router-link to="/pharmacy/inventory">
            <span class="menu-icon"><i class="fas fa-boxes" /></span>
            <span>Quản lý kho thuốc</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="prescriptions">
          <router-link to="/pharmacy/prescriptions">
            <span class="menu-icon"><i class="fas fa-file-prescription" /></span>
            <span>Quản lý đơn thuốc</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="billing">
          <router-link to="/pharmacy/billing">
            <span class="menu-icon"><i class="fas fa-file-invoice-dollar" /></span>
            <span>Quản lý hóa đơn</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="reports">
          <router-link to="/pharmacy/billing">
            <span class="menu-icon"><i class="fas fa-chart-bar" /></span>
            <span>Báo cáo doanh thu</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="accounts">
          <router-link to="/profile">
            <span class="menu-icon"><i class="fas fa-users-cog" /></span>
            <span>Quản lý tài khoản</span>
          </router-link>
        </a-menu-item>
      </template>

      <!-- DOCTOR MENU -->
      <template v-else-if="authStore.isDoctor.value">
        <a-menu-item key="dashboard">
          <router-link to="/pharmacy/dashboard">
            <span class="menu-icon"><i class="fas fa-chart-line" /></span>
            <span>Tổng quan</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="medicines">
          <router-link to="/pharmacy/medicines">
            <span class="menu-icon"><i class="fas fa-capsules" /></span>
            <span>Danh sách thuốc</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="prescriptions">
          <router-link to="/pharmacy/prescriptions">
            <span class="menu-icon"><i class="fas fa-file-prescription" /></span>
            <span>Đơn thuốc</span>
          </router-link>
        </a-menu-item>
      </template>

      <!-- RECEPTIONIST MENU -->
      <template v-else-if="authStore.isReceptionist.value">
        <a-menu-item key="dashboard">
          <router-link to="/pharmacy/dashboard">
            <span class="menu-icon"><i class="fas fa-chart-line" /></span>
            <span>Tổng quan</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="billing">
          <router-link to="/pharmacy/billing">
            <span class="menu-icon"><i class="fas fa-file-invoice-dollar" /></span>
            <span>Quản lý hóa đơn</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="create-bill">
          <router-link to="/pharmacy/create-bill">
            <span class="menu-icon"><i class="fas fa-plus-circle" /></span>
            <span>Tạo hóa đơn</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="prescriptions">
          <router-link to="/pharmacy/prescriptions">
            <span class="menu-icon"><i class="fas fa-tasks" /></span>
            <span>Xử lý đơn thuốc</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="billing-pay">
          <router-link to="/pharmacy/billing">
            <span class="menu-icon"><i class="fas fa-credit-card" /></span>
            <span>Thanh toán viện phí</span>
          </router-link>
        </a-menu-item>
      </template>

      <!-- PATIENT MENU -->
      <template v-else-if="authStore.isPatient.value">
        <a-menu-item key="dashboard">
          <router-link to="/pharmacy/dashboard">
            <span class="menu-icon"><i class="fas fa-user" /></span>
            <span>Trang cá nhân</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="prescriptions">
          <router-link to="/pharmacy/prescriptions">
            <span class="menu-icon"><i class="fas fa-file-prescription" /></span>
            <span>Đơn thuốc của tôi</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="billing">
          <router-link to="/pharmacy/billing">
            <span class="menu-icon"><i class="fas fa-file-invoice-dollar" /></span>
            <span>Hóa đơn của tôi</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="payment-history">
          <router-link to="/pharmacy/billing">
            <span class="menu-icon"><i class="fas fa-history" /></span>
            <span>Lịch sử thanh toán</span>
          </router-link>
        </a-menu-item>
      </template>

      <!-- COMMON SYSTEM MENUS (Appears for everyone) -->
      <a-menu-item-group title="HỆ THỐNG">
        <a-menu-item key="portal">
          <router-link to="/">
            <span class="menu-icon"><i class="fas fa-home" style="color: #1890ff;" /></span>
            <span style="font-weight: 600; color: #1890ff;">Về cổng trung tâm</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="logout" @click="authStore.logout()">
          <span class="menu-icon"><i class="fas fa-sign-out-alt" style="color: #ff4d4f;" /></span>
          <span style="font-weight: 600; color: #ff4d4f;">Đăng xuất</span>
        </a-menu-item>
      </a-menu-item-group>
    </a-menu>

      <!-- User Profile Pill in Sidebar Footer -->
      <div class="sidebar-user-footer">
        <div class="user-avatar">
          <i class="fas fa-user-circle" />
        </div>
        <div class="user-info">
          <div class="user-name">{{ authStore.user?.value?.fullName || authStore.user?.value?.username || 'User' }}</div>
          <div class="user-email" style="text-transform: capitalize; font-weight: bold; color: #007d88;">{{ authStore.user?.value?.role || 'Guest' }}</div>

        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const selectedKey = ref('')
const authStore = useAuthStore()

const updateSelectedKey = () => {
  const path = route.path
  if (path.includes('medicines')) {
    selectedKey.value = 'medicines'
  } else if (path.includes('inventory')) {
    selectedKey.value = 'inventory'
  } else if (path.includes('billing')) {
    selectedKey.value = 'billing'
  } else if (path.includes('create-bill')) {
    selectedKey.value = 'billing'
  } else if (path.includes('prescriptions')) {
    selectedKey.value = 'prescriptions'
  } else if (path.includes('dashboard')) {
    selectedKey.value = 'dashboard'
  } else {
    selectedKey.value = 'medicines'
  }
}

watch(() => route.path, updateSelectedKey)
onMounted(updateSelectedKey)
</script>

<style scoped>
.sidebar-wrapper {
  background: #ffffff;
  height: 100vh;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

.logo-container {
  background: #007d88;
  padding: 16px;
  color: #ffffff;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
}

.custom-menu {
  border-right: none;
  flex-grow: 1;
}

.custom-menu :deep(.ant-menu-item) {
  height: 48px;
  line-height: 48px;
  margin: 4px 0 !important;
}

.custom-menu :deep(.ant-menu-item-selected) {
  background-color: #e6f7f9 !important;
  color: #007d88 !important;
}

.custom-menu :deep(.ant-menu-item-selected a) {
  color: #007d88 !important;
}

.menu-icon {
  margin-right: 10px;
  font-size: 1rem;
  width: 20px;
  display: inline-block;
  text-align: center;
}

.sidebar-user-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  font-size: 2.2rem;
  color: #007d88;
}

.user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #262626;
}

.user-email {
  font-size: 0.75rem;
  color: #8c8c8c;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
