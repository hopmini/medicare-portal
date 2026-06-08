<template>
  <div class="header-container">
    <!-- Left Section -->
    <div class="header-left">
      <!-- Hamburger collapse trigger if integrated -->
      <div class="sidebar-toggle-btn" v-if="showToggleButton" @click="onToggle">
        <i class="fas fa-bars" />
      </div>
      <div class="header-title-box">
        <h2 class="main-title">{{ title || activeMenuTitle }}</h2>
        <span class="sub-welcome" v-if="welcome !== '' && (welcome || welcomeMessage)">{{ welcome !== undefined ? welcome : welcomeMessage }}</span>
      </div>
    </div>

    <!-- Right Section: Compact modern design -->
    <div class="header-right">
      <!-- Search Box -->
      <div class="search-wrapper" v-if="showSearch">
        <i class="fas fa-search search-icon" />
        <input type="text" placeholder="Tìm kiếm nhanh..." class="search-input" />
      </div>

      <!-- Notification Bell with Dropdown -->
      <div class="notif-wrapper" ref="notifWrapperRef">
        <div class="icon-action-btn" @click="toggleNotifPanel" :class="{ 'notif-active': showNotifPanel }">
          <a-badge :count="unreadCount" :overflow-count="99">
            <div class="badge-icon-box">
              <i class="far fa-bell" :class="{ 'bell-shake': bellShake }" />
            </div>
          </a-badge>
        </div>

        <!-- Notification Dropdown Panel -->
        <transition name="notif-drop">
          <div class="notif-panel" v-if="showNotifPanel">
            <!-- Panel Header -->
            <div class="notif-header">
              <span class="notif-title">
                <i class="fas fa-bell" style="color: #0047AB; margin-right: 6px;" />
                Thông báo
                <span v-if="unreadCount > 0" class="notif-unread-badge">{{ unreadCount }} mới</span>
              </span>
              <button class="notif-mark-all" @click="markAllRead" v-if="unreadCount > 0">
                <i class="fas fa-check-double" /> Đọc tất cả
              </button>
            </div>

            <!-- Notification List -->
            <div class="notif-list">
              <div
                v-for="notif in notifications"
                :key="notif.id"
                class="notif-item"
                :class="{ 'notif-unread': !notif.read }"
                @click="markRead(notif)"
              >
                <div class="notif-icon-wrap" :style="{ background: notif.bgColor, color: notif.color }">
                  <i :class="notif.icon" />
                </div>
                <div class="notif-content">
                  <div class="notif-msg">{{ notif.message }}</div>
                  <div class="notif-time">
                    <i class="far fa-clock" style="margin-right: 4px;" />{{ notif.time }}
                  </div>
                </div>
                <div class="notif-dot" v-if="!notif.read"></div>
              </div>

              <!-- Empty State -->
              <div class="notif-empty" v-if="notifications.length === 0">
                <i class="far fa-bell-slash" />
                <p>Không có thông báo nào</p>
              </div>
            </div>

            <!-- Panel Footer -->
            <div class="notif-footer">
              <span>Hiển thị {{ notifications.length }} thông báo gần nhất</span>
            </div>
          </div>
        </transition>
      </div>

      <!-- Help Question mark pill -->
      <div class="icon-action-btn help-btn">
        <i class="far fa-question-circle" />
      </div>

      <!-- Divider line -->
      <span class="divider-line"></span>

      <!-- User Info Pill with Dropdown for Logout & Profile -->
      <a-dropdown :trigger="['click']" placement="bottomRight">
        <div class="user-pill-container">
          <div class="user-avatar-circle">
            <i class="fas fa-user-md" v-if="userRole === 'doctor' || userRole === 'pharmacist'" />
            <i class="fas fa-user" v-else />
          </div>
          <div class="user-meta">
            <div class="username-txt">{{ authStore.user.value?.fullName || authStore.user.value?.username || 'Medicare User' }}</div>
            <div class="role-txt">{{ displayRole }}</div>
          </div>
          <i class="fas fa-chevron-down arrow-down" />
        </div>
        <template #overlay>
          <a-menu style="min-width: 150px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); padding: 4px 0;">
            <a-menu-item key="profile" @click="goProfile" style="padding: 10px 16px;">
              <i class="far fa-user" style="margin-right: 8px; color: #596780;" /> Trang cá nhân
            </a-menu-item>
            <a-menu-divider style="margin: 4px 0;" />
            <a-menu-item key="logout" @click="authStore.logout" style="padding: 10px 16px; color: #ef4444;">
              <i class="fas fa-sign-out-alt" style="margin-right: 8px; color: #ef4444;" /> Đăng xuất
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { pharmacyApi } from '@/services/api'

const props = defineProps({
  title: { type: String, default: '' },
  welcome: { type: String, default: undefined },
  showSearch: { type: Boolean, default: false },
  showToggleButton: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const userRole = computed(() => (authStore.user.value?.role || 'pharmacist').toLowerCase())

const displayRole = computed(() => {
  const role = userRole.value
  if (role === 'admin') return 'Administrator'
  if (role === 'pharmacist' || role === 'doctor') return 'Pharmacist'
  if (role === 'receptionist' || role === 'cashier') return 'Cashier'
  if (role === 'patient') return 'Patient'
  return 'Guest'
})

const welcomeMessage = computed(() => {
  const role = userRole.value
  if (role === 'admin') return 'Chào mừng quản trị viên! Dưới đây là hoạt động hôm nay.'
  if (role === 'pharmacist' || role === 'doctor') return 'Chào mừng dược sĩ! Dưới đây là tình hình hoạt động của nhà thuốc hôm nay.'
  if (role === 'receptionist' || role === 'cashier') return 'Chào mừng bạn, Cashier! Dưới đây là tổng quan hoạt động quầy thu ngân.'
  if (role === 'patient') return 'Theo dõi và quản lý tất cả hóa đơn khám chữa bệnh và mua thuốc của bạn.'
  return ''
})

const activeMenuTitle = computed(() => {
  const path = route.path
  if (path.includes('dashboard')) return 'Tổng quan'
  if (path.includes('medicines')) return 'Quản lý thuốc'
  if (path.includes('import-bill')) return 'Hóa đơn nhập thuốc'
  if (path.includes('inventory')) return 'Quản lý kho'
  if (path.includes('prescriptions')) return 'Quản lý đơn thuốc'
  if (path.includes('create-bill')) return 'Lập hóa đơn'
  if (path.includes('payments')) return 'Thanh toán'
  if (path.includes('billing')) return 'Quản lý hóa đơn'
  return 'Trang Dashboard'
})

// ─── Notification System ────────────────────────────────────────────────────
interface Notification {
  id: number
  icon: string
  message: string
  time: string
  read: boolean
  color: string
  bgColor: string
}

const showNotifPanel = ref(false)
const bellShake = ref(false)
const notifWrapperRef = ref<HTMLElement | null>(null)

// Build role-based notification list
const notifications = ref<Notification[]>([])

function formatTimeAgo(date: Date) {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Vừa xong'
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  return `${diffDays} ngày trước`
}

const getStorageKey = () => {
  const username = authStore.user.value?.username || 'guest'
  return `medicare_read_notifications_${username}`
}

const getReadNotificationMessages = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey()) || '[]')
  } catch {
    return []
  }
}

const saveReadNotificationMessage = (message: string) => {
  const readMsgs = getReadNotificationMessages()
  if (!readMsgs.includes(message)) {
    readMsgs.push(message)
    localStorage.setItem(getStorageKey(), JSON.stringify(readMsgs))
  }
}

const saveAllReadNotificationMessages = (messages: string[]) => {
  const readMsgs = getReadNotificationMessages()
  messages.forEach(msg => {
    if (!readMsgs.includes(msg)) {
      readMsgs.push(msg)
    }
  })
  localStorage.setItem(getStorageKey(), JSON.stringify(readMsgs))
}

async function buildNotifications() {
  const role = userRole.value
  const all: Notification[] = []

  if (role === 'admin') {
    all.push(
      { id: 1, icon: 'fas fa-exclamation-triangle', message: '5 loại thuốc sắp hết hạn trong 30 ngày tới', time: '2 phút trước', read: false, color: '#dc2626', bgColor: '#fef2f2' },
      { id: 2, icon: 'fas fa-boxes', message: 'Amoxicillin 500mg: tồn kho chỉ còn 8 hộp (dưới mức tối thiểu)', time: '15 phút trước', read: false, color: '#f59e0b', bgColor: '#fffbeb' },
      { id: 3, icon: 'fas fa-file-invoice-dollar', message: '3 hóa đơn tổng hợp trị giá 8.5M đ chưa được xác nhận', time: '1 giờ trước', read: false, color: '#0047AB', bgColor: '#eff6ff' },
      { id: 4, icon: 'fas fa-chart-line', message: 'Doanh thu hôm nay đạt 12.5M đ (+12% so với hôm qua)', time: '2 giờ trước', read: true, color: '#10b981', bgColor: '#ecfdf5' },
      { id: 5, icon: 'fas fa-user-plus', message: 'Có 12 đơn thuốc mới từ bác sĩ chờ duyệt cấp phát', time: '3 giờ trước', read: true, color: '#0284c7', bgColor: '#f0f9ff' },
      { id: 6, icon: 'fas fa-truck', message: 'Phiếu nhập IMP-250525-003 từ Công ty Dược Hà Nội đã hoàn tất', time: '5 giờ trước', read: true, color: '#7c3aed', bgColor: '#f5f3ff' },
    )
  } else if (role === 'pharmacist' || role === 'doctor') {
    all.push(
      { id: 1, icon: 'fas fa-file-prescription', message: '8 đơn thuốc mới cần cấp phát ngay hôm nay', time: '5 phút trước', read: false, color: '#0047AB', bgColor: '#eff6ff' },
      { id: 2, icon: 'fas fa-boxes', message: 'Paracetamol 500mg: tồn kho thấp, cần đặt nhập hàng', time: '20 phút trước', read: false, color: '#dc2626', bgColor: '#fef2f2' },
      { id: 3, icon: 'fas fa-hourglass-end', message: 'Vitamin C 500mg lô VIT240301 sắp hết hạn (18/06/2025)', time: '1 giờ trước', read: false, color: '#f59e0b', bgColor: '#fffbeb' },
      { id: 4, icon: 'fas fa-check-circle', message: 'Phiếu nhập IMP-250525-002 đã được xác nhận thành công', time: '2 giờ trước', read: true, color: '#10b981', bgColor: '#ecfdf5' },
      { id: 5, icon: 'fas fa-truck', message: 'Đơn hàng từ nhà cung cấp Medipharco dự kiến giao hôm nay', time: '4 giờ trước', read: true, color: '#0284c7', bgColor: '#f0f9ff' },
    )
  } else if (role === 'receptionist' || role === 'cashier') {
    all.push(
      { id: 1, icon: 'fas fa-file-invoice', message: '4 hóa đơn mới đang chờ thanh toán tại quầy', time: '3 phút trước', read: false, color: '#0047AB', bgColor: '#eff6ff' },
      { id: 2, icon: 'fas fa-clock', message: 'Bệnh nhân Trần Văn A đang chờ thanh toán (HD250524-0156)', time: '10 phút trước', read: false, color: '#f59e0b', bgColor: '#fffbeb' },
      { id: 3, icon: 'fas fa-check-circle', message: 'Hóa đơn HD250524-0154 đã thanh toán thành công (760.000đ)', time: '25 phút trước', read: false, color: '#10b981', bgColor: '#ecfdf5' },
      { id: 4, icon: 'fas fa-wallet', message: 'Tổng thu trong ca: 4.860.000 đ (5 hóa đơn)', time: '1 giờ trước', read: true, color: '#0284c7', bgColor: '#f0f9ff' },
      { id: 5, icon: 'fas fa-exclamation-circle', message: 'Hóa đơn HD250524-0152 bị hủy theo yêu cầu của Admin', time: '2 giờ trước', read: true, color: '#dc2626', bgColor: '#fef2f2' },
    )
  } else if (role === 'patient') {
    try {
      const billsRes = await pharmacyApi.get('/Bills')
      const bills = billsRes.data || []
      
      let prescriptions = []
      try {
        const presRes = await pharmacyApi.get('/Prescription')
        prescriptions = presRes.data || []
      } catch (err) {
        console.error('Failed to load prescriptions for notifications:', err)
      }

      let idCounter = 1

      // Map bills to notifications
      bills.forEach((b: any) => {
        const code = `HD${new Date(b.createdAt).getFullYear().toString().substr(-2)}${(new Date(b.createdAt).getMonth()+1).toString().padStart(2, '0')}${new Date(b.createdAt).getDate().toString().padStart(2, '0')}-${b.id.toString().padStart(4, '0')}`
        const timeStr = formatTimeAgo(new Date(b.createdAt))
        
        if (b.status === 'Paid') {
          all.push({
            id: idCounter++,
            icon: 'fas fa-file-invoice-dollar',
            message: `Hóa đơn ${code} trị giá ${b.totalAmount.toLocaleString('vi-VN')}đ đã thanh toán thành công`,
            time: timeStr,
            read: true,
            color: '#10b981',
            bgColor: '#ecfdf5'
          })
        } else {
          all.push({
            id: idCounter++,
            icon: 'fas fa-clock',
            message: `Hóa đơn ${code} trị giá ${b.totalAmount.toLocaleString('vi-VN')}đ chưa thanh toán, vui lòng thanh toán`,
            time: timeStr,
            read: false,
            color: '#f59e0b',
            bgColor: '#fffbeb'
          })
        }
      })

      // Map prescriptions to notifications
      prescriptions.forEach((p: any) => {
        let presCode = `PRES-${p.id}`
        let desc = 'Đơn thuốc mới được tạo từ khám bệnh'
        try {
          const payload = typeof p.payload === 'string' ? JSON.parse(p.payload) : p.payload
          if (payload && payload.prescriptionId) {
            presCode = `PRES-${payload.prescriptionId}`
          }
          if (payload && payload.doctorName) {
            desc = `Đơn thuốc được kê bởi BS. ${payload.doctorName}`
          }
        } catch {}
        
        const timeStr = formatTimeAgo(new Date(p.timestamp || p.createdAt))
        all.push({
          id: idCounter++,
          icon: 'fas fa-prescription-bottle',
          message: `${desc} (${presCode})`,
          time: timeStr,
          read: p.status === 'Processed',
          color: '#0047AB',
          bgColor: '#eff6ff'
        })
      })
    } catch (err) {
      console.error('Failed to load patient notifications:', err)
      all.push(
        { id: 1, icon: 'fas fa-file-invoice-dollar', message: 'Hóa đơn HD250524-0123 đã được xác nhận thanh toán', time: '30 phút trước', read: false, color: '#10b981', bgColor: '#ecfdf5' },
        { id: 2, icon: 'fas fa-clock', message: 'Hóa đơn HD250522-0105 vẫn chưa thanh toán, vui lòng đến quầy', time: '2 giờ trước', read: false, color: '#f59e0b', bgColor: '#fffbeb' },
        { id: 3, icon: 'fas fa-prescription-bottle', message: 'Đơn thuốc PRES-250524-001 đã được dược sĩ cấp phát', time: '3 giờ trước', read: true, color: '#0047AB', bgColor: '#eff6ff' },
      )
    }
  }

  // Apply persistent read status from localStorage
  const readMessages = getReadNotificationMessages()
  all.forEach(n => {
    if (readMessages.includes(n.message)) {
      n.read = true
    }
  })

  // Assign to notifications.value
  if (role === 'patient') {
    notifications.value = all.slice(0, 10)
  } else {
    notifications.value = all
  }
}

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function toggleNotifPanel() {
  showNotifPanel.value = !showNotifPanel.value
}

function markRead(notif: Notification) {
  notif.read = true
  saveReadNotificationMessage(notif.message)
}

function markAllRead() {
  notifications.value.forEach(n => (n.read = true))
  saveAllReadNotificationMessages(notifications.value.map(n => n.message))
}

// Close panel when clicking outside
function handleClickOutside(e: MouseEvent) {
  if (notifWrapperRef.value && !notifWrapperRef.value.contains(e.target as Node)) {
    showNotifPanel.value = false
  }
}

watch(userRole, () => {
  buildNotifications()
}, { immediate: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Shake bell on load to draw attention if there are unread
  setTimeout(() => {
    if (unreadCount.value > 0) {
      bellShake.value = true
      setTimeout(() => { bellShake.value = false }, 800)
    }
  }, 1000)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
// ─────────────────────────────────────────────────────────────────────────────

const onToggle = () => {
  emit('toggle')
}

const goProfile = () => {
  router.push('/profile')
}
</script>


<style scoped>
.header-container {
  height: 70px;
  background: #ffffff;
  border-bottom: 1px solid #f0f4f9;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sidebar-toggle-btn {
  font-size: 1.25rem;
  color: #596780;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.sidebar-toggle-btn:hover {
  background: #f1f5f9;
  color: #0047AB;
}

.header-title-box {
  display: flex;
  flex-direction: column;
}

.main-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.5px;
}

.sub-welcome {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 600;
  margin-top: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-wrapper {
  position: relative;
  width: 240px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  height: 38px;
  padding: 0 16px 0 38px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  outline: none;
  font-size: 0.88rem;
  font-weight: 500;
  background: #f8fafc;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #0047AB;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.08);
}

.icon-action-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #596780;
  background: #f8fafc;
  transition: all 0.2s;
}

.icon-action-btn:hover {
  background: #e8f0fe;
  color: #0047AB;
}

.badge-icon-box {
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-btn {
  font-size: 1.15rem;
}

.divider-line {
  height: 24px;
  width: 1px;
  background: #e2e8f0;
}

.user-pill-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 12px 4px 4px;
  border-radius: 24px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.user-pill-container:hover {
  background: #ffffff;
  border-color: #0047AB;
  box-shadow: 0 4px 12px rgba(0, 71, 171, 0.04);
}

.user-avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e8f0fe;
  color: #0047AB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: 700;
  flex-shrink: 0;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.username-txt {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1e293b;
  max-width: 110px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role-txt {
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
}

.arrow-down {
  font-size: 0.7rem;
  color: #94a3b8;
  margin-left: 2px;
}

/* ────────────────────────────────────────
   Notification Panel
   ──────────────────────────────────────── */
.notif-wrapper {
  position: relative;
}

.notif-active {
  background: #e8f0fe !important;
  color: #0047AB !important;
}

/* Bell shake animation */
@keyframes bellShake {
  0%   { transform: rotate(0deg); }
  15%  { transform: rotate(12deg); }
  30%  { transform: rotate(-10deg); }
  45%  { transform: rotate(8deg); }
  60%  { transform: rotate(-6deg); }
  75%  { transform: rotate(4deg); }
  100% { transform: rotate(0deg); }
}

.bell-shake {
  animation: bellShake 0.8s ease;
}

/* Dropdown card */
.notif-panel {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 360px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 71, 171, 0.12), 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #e8f0fe;
  z-index: 999;
  overflow: hidden;
}

/* Panel Header */
.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafcff;
}

.notif-title {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  gap: 4px;
}

.notif-unread-badge {
  background: #0047AB;
  color: #ffffff;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
  margin-left: 6px;
}

.notif-mark-all {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0047AB;
  cursor: pointer;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}

.notif-mark-all:hover {
  background: #eff6ff;
  border-color: #0047AB;
}

/* List */
.notif-list {
  max-height: 380px;
  overflow-y: auto;
  padding: 6px 0;
}

.notif-list::-webkit-scrollbar {
  width: 4px;
}

.notif-list::-webkit-scrollbar-track {
  background: #f8fafc;
}

.notif-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

/* Notification item */
.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 18px;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
  border-bottom: 1px solid #f8fafc;
}

.notif-item:last-child {
  border-bottom: none;
}

.notif-item:hover {
  background: #f8fafc;
}

.notif-unread {
  background: #fafcff;
}

.notif-unread:hover {
  background: #eff6ff;
}

/* Icon */
.notif-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Content */
.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-msg {
  font-size: 0.82rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  word-break: break-word;
}

.notif-unread .notif-msg {
  color: #0f172a;
  font-weight: 700;
}

.notif-time {
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 4px;
}

/* Unread dot */
.notif-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0047AB;
  flex-shrink: 0;
  margin-top: 6px;
}

/* Empty state */
.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #94a3b8;
  font-size: 0.85rem;
}

.notif-empty i {
  font-size: 2rem;
  margin-bottom: 10px;
  opacity: 0.5;
}

.notif-empty p {
  margin: 0;
  font-weight: 600;
}

/* Footer */
.notif-footer {
  padding: 10px 18px;
  border-top: 1px solid #f1f5f9;
  text-align: center;
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
  background: #fafcff;
}

/* Dropdown animation */
.notif-drop-enter-active {
  animation: notifDropIn 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.notif-drop-leave-active {
  animation: notifDropOut 0.15s ease;
}

@keyframes notifDropIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes notifDropOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
  }
}
</style>

