<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <div class="nav-container">
      <div class="logo" @click="$router.push('/')">
        <div class="logo__icon">
          <svg fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="height: 32px; width: 32px;">
            <rect fill="#0047AB" height="32" rx="8" width="32" />
            <path d="M16 6v20M6 16h20" stroke="white" stroke-linecap="round" stroke-width="4" />
          </svg>
        </div>
        <div class="logo__text">Medicare<span class="logo__dot">.</span></div>
      </div>

      <ul class="nav-links">
        <li><router-link to="/">Trang chủ</router-link></li>
        <li v-if="!authStore.isAuthenticated.value || ['patient', 'admin'].includes((authStore.user.value?.role || '').toLowerCase())">
          <span class="dropdown">
            <span class="dropdown-toggle">Dịch vụ <i class="fas fa-chevron-down" /></span>
            <div class="dropdown-menu">
              <a href="#" @click.prevent="redirectToBooking"><i class="fas fa-calendar-check" /> Đặt lịch khám</a>
              <a href="#" @click.prevent="redirectToMedicalRecord"><i class="fas fa-file-medical" /> Hồ sơ Bệnh án</a>
              <a href="#" @click.prevent="redirectToPharmacy"><i class="fas fa-pills" /> Tra cứu Hóa đơn & Thuốc</a>
            </div>
          </span>
        </li>
        <li v-if="!authStore.isAuthenticated.value || ['patient', 'admin'].includes((authStore.user.value?.role || '').toLowerCase())">
          <router-link to="/my-appointments">Lịch sử đặt hẹn</router-link>
        </li>
        <li><router-link to="/contact">Liên hệ</router-link></li>
      </ul>

      <div class="nav-actions">
        <template v-if="authStore.isAuthenticated.value">
          <button v-if="authStore.canAccessDashboard.value" class="btn-outline-nav" @click="$router.push('/dashboard')">
            <i class="fas fa-tachometer-alt" /> Dashboard
          </button>
          <button v-else-if="authStore.canAccessDoctorDashboard.value" class="btn-outline-nav" @click="$router.push('/doctor')">
            <i class="fas fa-user-md" /> Bác sĩ
          </button>
          
          <!-- Modern compact User Pill -->
          <div class="user-pill">
            <div class="user-pill__main-info" @click="$router.push('/profile')" style="display: inline-flex; align-items: center; gap: 10px; cursor: pointer;">
              <div class="user-pill__avatar">
                <i class="fas fa-user-md" v-if="authStore.user.value?.role?.toLowerCase() === 'doctor'" />
                <i class="fas fa-user-shield" v-else-if="authStore.user.value?.role?.toLowerCase() === 'admin'" />
                <i class="fas fa-file-prescription" v-else-if="authStore.user.value?.role?.toLowerCase() === 'pharmacist'" />
                <i class="fas fa-cash-register" v-else-if="authStore.user.value?.role?.toLowerCase() === 'cashier'" />
                <i class="fas fa-concierge-bell" v-else-if="authStore.user.value?.role?.toLowerCase() === 'receptionist'" />
                <i class="fas fa-user" v-else />
              </div>
              <span class="user-pill__name" :title="authStore.user.value?.fullName || authStore.user.value?.username">
                {{ authStore.user.value?.fullName || authStore.user.value?.username }}
              </span>
            </div>
            <button class="user-pill__logout" title="Đăng xuất" @click="authStore.logout()">
              <i class="fas fa-sign-out-alt" />
            </button>
          </div>
        </template>
        <template v-else>
          <button class="btn-outline-nav" @click="$router.push('/login')">
            <i class="fas fa-sign-in-alt" /> Đăng nhập
          </button>
          <button class="btn-outline-nav btn-register-nav" @click="$router.push('/register')">
            <i class="fas fa-user-plus" /> Đăng ký
          </button>
        </template>
      </div>

      <button class="hamburger" :class="{ 'hamburger--open': mobileOpen }" @click="mobileOpen = !mobileOpen">
        <span /><span /><span />
      </button>
    </div>

    <div class="mobile-menu" :class="{ 'mobile-menu--open': mobileOpen }">
      <router-link to="/" @click="mobileOpen = false">Trang chủ</router-link>
      <template v-if="!authStore.isAuthenticated.value || ['patient', 'admin'].includes((authStore.user.value?.role || '').toLowerCase())">
        <a href="#" @click.prevent="redirectToBooking(); mobileOpen = false"><i class="fas fa-calendar-check" /> Đặt lịch khám</a>
        <a href="#" @click.prevent="redirectToMedicalRecord(); mobileOpen = false"><i class="fas fa-file-medical" /> Bệnh án điện tử</a>
        <a href="#" @click.prevent="redirectToPharmacy(); mobileOpen = false"><i class="fas fa-pills" /> Hóa đơn & Thuốc</a>
        <router-link to="/my-appointments" @click="mobileOpen = false">Lịch sử đặt hẹn</router-link>
      </template>
      <router-link to="/contact" @click="mobileOpen = false">Liên hệ</router-link>

      <div class="mobile-menu__actions">
        <template v-if="authStore.isAuthenticated.value">
          <span class="mobile-user-name">{{ authStore.user.value?.fullName }}</span>
          <button v-if="authStore.canAccessDashboard.value" class="btn-mobile-login" @click="$router.push('/dashboard'); mobileOpen = false">
            <i class="fas fa-tachometer-alt" /> Dashboard
          </button>
          <button v-else-if="authStore.canAccessDoctorDashboard.value" class="btn-mobile-login" @click="$router.push('/doctor'); mobileOpen = false">
            <i class="fas fa-user-md" /> Bác sĩ
          </button>
          <button class="btn-logout mobile-logout" @click="authStore.logout(); mobileOpen = false">
            <i class="fas fa-sign-out-alt" /> Đăng xuất
          </button>
        </template>
        <template v-else>
          <button class="btn-mobile-login" @click="$router.push('/login'); mobileOpen = false">
            <i class="fas fa-sign-in-alt" /> Đăng nhập
          </button>
          <button class="btn-mobile-register" @click="$router.push('/register'); mobileOpen = false">
            <i class="fas fa-user-plus" /> Đăng ký
          </button>
        </template>
      </div>
    </div>
  </nav>

  <!-- Notification Bell Button (Placed OUTSIDE the navbar to avoid backdrop-filter constraints) -->
  <div v-if="authStore.isAuthenticated.value" class="notification-wrapper" :style="notifStyle"
    @mousedown.prevent="onDragStart"
    @touchstart.prevent="onTouchStart">

    <button class="notification-btn" @click.stop="toggleNotif" title="Thông báo">
      <i class="fas fa-bell" />
      <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
    </button>
    
    <!-- Toast Notification Popup -->
    <transition name="toast-slide">
      <div v-if="toastVisible && toastNotif" class="notif-toast" @click="handleToastClick">
        <div class="notif-toast__icon" :class="toastNotif.type || 'info'">
          <i class="fas" :class="toastNotif.type === 'success' ? 'fa-check-circle' : toastNotif.type === 'medical' ? 'fa-file-medical-alt' : 'fa-bell'" />
        </div>
        <div class="notif-toast__body">
          <strong>{{ toastNotif.title }}</strong>
          <p>{{ toastNotif.message }}</p>
        </div>
        <button class="notif-toast__close" @click.stop="toastVisible = false" title="Đóng">
          <i class="fas fa-times" />
        </button>
      </div>
    </transition>

    <div v-if="showNotifDropdown" class="notif-dropdown">
      <div class="notif-header">
        <span>Thông báo của bạn</span>
        <button v-if="unreadCount > 0" @click="markAllAsRead">Đánh dấu tất cả đã đọc</button>
      </div>
      <div class="notif-list">
        <div v-if="notifications.length === 0" class="notif-empty">
          <i class="fas fa-bell-slash" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block; color: #cbd5e1;" />
          Không có thông báo mới
        </div>
        <template v-for="notif in notifications" :key="notif.id">
          <div class="notif-item" 
            :class="{ 'notif-item--unread': notif.unread }"
            @click="readNotif(notif)"
          >
          <div class="notif-item__icon" :class="notif.type || 'info'">
            <i class="fas" :class="getNotifIcon(notif.type)" />
          </div>
          <div class="notif-item__body">
            <b>{{ notif.title }}</b>
            <p>{{ notif.message }}</p>
            <small>{{ notif.time }}</small>
          </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  import api from '@/services/api'

  const router = useRouter()
  const authStore = useAuthStore()
  const mobileOpen = ref(false)
  const scrolled = ref(false)

  function redirectToBooking () {
    if (authStore.isAuthenticated.value) {
      const user = authStore.user.value
      const role = (user?.role || '').toLowerCase()
      if (role === 'admin' || role === 'receptionist') {
        router.push('/dashboard')
        return
      }
      if (role === 'doctor') {
        router.push('/doctor')
        return
      }
      if (role === 'pharmacist' || role === 'cashier') {
        router.push('/pharmacy/dashboard')
        return
      }
      router.push('/patient')
    } else {
      router.push('/login')
    }
  }

  function redirectToPharmacy () {
    if (authStore.isAuthenticated.value) {
      const user = authStore.user.value
      const role = (user?.role || '').toLowerCase()
      if (role === 'patient') {
        router.push('/pharmacy/my-invoices')
        return
      }
      router.push('/dashboard')
      return
    }
    router.push('/login?redirect=/pharmacy/my-invoices')
  }

  function redirectToMedicalRecord () {
    if (authStore.isAuthenticated.value) {
      const user = authStore.user.value
      const role = (user?.role || '').toLowerCase()
      if (role === 'doctor') {
        router.push('/doctor')
        return
      }
      if (role === 'admin') {
        router.push('/medical-records')
        return
      }
      if (role === 'patient') {
        router.push('/medical-records')
        return
      }
    }
    router.push('/login')
  }

  function handleScroll () {
    scrolled.value = window.scrollY > 50
  }

  // User Notifications Feature
  const notifications = ref(JSON.parse(localStorage.getItem('medicare_notifications') || '[]'))
  const showNotifDropdown = ref(false)
  const knownStatuses = ref({})
  const knownNotifIds = ref(new Set(JSON.parse(localStorage.getItem('medicare_known_notif_ids') || '[]')))
  let pollInterval = null

  // Toast popup state
  const toastVisible = ref(false)
  const toastNotif = ref(null)
  let toastTimeout = null

  const unreadCount = computed(() => notifications.value.filter(n => n.unread).length)

  watch(notifications, (newVal) => {
    localStorage.setItem('medicare_notifications', JSON.stringify(newVal))
  }, { deep: true })

  watch(authStore.isAuthenticated, (newVal) => {
    if (newVal) {
      seedStatuses()
    } else {
      knownStatuses.value = {}
      knownNotifIds.value = new Set()
      notifications.value = []
    }
  })

  function showToast(notif) {
    toastNotif.value = notif
    toastVisible.value = true
    if (toastTimeout) clearTimeout(toastTimeout)
    toastTimeout = setTimeout(() => {
      toastVisible.value = false
    }, 8000)
  }

  function handleToastClick() {
    toastVisible.value = false
    showNotifDropdown.value = true
  }

  function getNotifIcon(type) {
    switch (type) {
      case 'success': return 'fa-check-circle'
      case 'medical': return 'fa-file-medical-alt'
      case 'warning': return 'fa-exclamation-triangle'
      default: return 'fa-bell'
    }
  }

  function playSuccessSound () {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const playNote = (frequency, startTime, duration) => {
        const osc = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(frequency, startTime)
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
        osc.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        osc.start(startTime)
        osc.stop(startTime + duration)
      }
      const now = audioCtx.currentTime
      playNote(523.25, now, 0.4) // C5
      playNote(659.25, now + 0.12, 0.5) // E5
    } catch (error) {
      console.error('Failed to play notification sound:', error)
    }
  }

  async function checkAppointments () {
    if (!authStore.isAuthenticated.value) return
    const role = (authStore.user.value?.role || '').toLowerCase()
    if (role !== 'patient') return

    try {
      const res = await api.get('/Appointments/my')
      const apps = res.data

      apps.forEach(app => {
        const prev = knownStatuses.value[app.id]
        if (prev === 0 && app.status === 1) {
          const newNotif = {
            id: Date.now() + Math.random(),
            title: 'Lịch hẹn đã được duyệt',
            message: `Lịch hẹn khám #${String(app.id).substring(0, 8).toUpperCase()} với BS. ${app.doctorName} đã được phê duyệt thành công!`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            unread: true,
            type: 'success'
          }
          notifications.value.unshift(newNotif)
          showToast(newNotif)
          playSuccessSound()
        }
        knownStatuses.value[app.id] = app.status
      })
    } catch (e) {
      console.error('Lỗi khi kiểm tra lịch hẹn từ Navbar:', e)
    }
  }

  async function checkSystemNotifications () {
    if (!authStore.isAuthenticated.value) return
    const role = (authStore.user.value?.role || '').toLowerCase()
    if (role !== 'patient') return

    try {
      const res = await api.get('/Notifications/my')
      const sysNotifs = res.data || []

      sysNotifs.forEach(sn => {
        const snKey = `sys_${sn.id}`
        if (!knownNotifIds.value.has(snKey)) {
          knownNotifIds.value.add(snKey)
          const newNotif = {
            id: snKey,
            title: sn.title || 'Thông báo hệ thống',
            message: sn.message || sn.content || '',
            time: sn.createdAt ? new Date(sn.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            unread: true,
            type: sn.type || 'medical'
          }
          notifications.value.unshift(newNotif)
          showToast(newNotif)
          playSuccessSound()
        }
      })

      // Persist known IDs
      localStorage.setItem('medicare_known_notif_ids', JSON.stringify([...knownNotifIds.value]))
    } catch (e) {
      // API might not exist yet, silently fail
    }
  }

  async function seedStatuses () {
    if (!authStore.isAuthenticated.value) return
    const role = (authStore.user.value?.role || '').toLowerCase()
    if (role !== 'patient') return
    try {
      const res = await api.get('/Appointments/my')
      res.data.forEach(app => {
        knownStatuses.value[app.id] = app.status
      })
    } catch (e) {
      console.error('Lỗi khởi tạo trạng thái lịch hẹn:', e)
    }
  }

  function markAllAsRead () {
    notifications.value.forEach(n => n.unread = false)
  }

  function readNotif (notif) {
    notif.unread = false
    const role = (authStore.user.value?.role || '').toLowerCase()
    if (role === 'patient') {
      router.push('/my-appointments')
    }
    showNotifDropdown.value = false
  }

  function handleDocumentClick (e) {
    const wrapper = document.querySelector('.notification-wrapper')
    if (wrapper && !wrapper.contains(e.target)) {
      showNotifDropdown.value = false
    }
  }

  // Draggable notification FAB
  const STORAGE_KEY = 'medicare_notif_pos'
  const defaultPos = { top: 100, right: 30 }
  const notifPos = ref(loadPos())
  const notifStyle = computed(() => {
    const p = notifPos.value
    const s: Record<string, string> = {}
    if (p.top != null) s.top = p.top + 'px'
    if (p.bottom != null) s.bottom = p.bottom + 'px'
    if (p.left != null) s.left = p.left + 'px'
    if (p.right != null) s.right = p.right + 'px'
    return s
  })

  function loadPos () {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return { ...defaultPos }
  }
  function savePos () {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifPos.value))
  }

  function toggleNotif () {
    if (wasDragged) { wasDragged = false; return }
    showNotifDropdown.value = !showNotifDropdown.value
    toastVisible.value = false
  }

  let dragStartX = 0, dragStartY = 0
  let dragOrigPos = { ...defaultPos }
  let wasDragged = false

  function onDragStart (e: MouseEvent) {
    dragStartX = e.clientX
    dragStartY = e.clientY
    wasDragged = false
    dragOrigPos = { ...notifPos.value }
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', onDragEnd)
  }
  function onTouchStart (e: TouchEvent) {
    const t = e.touches[0]
    dragStartX = t.clientX
    dragStartY = t.clientY
    wasDragged = false
    dragOrigPos = { ...notifPos.value }
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: false })
  }
  function onDragMove (e: MouseEvent) {
    if (Math.abs(e.clientX - dragStartX) > 5 || Math.abs(e.clientY - dragStartY) > 5) wasDragged = true
    updatePos(e.clientX, e.clientY)
  }
  function onTouchMove (e: TouchEvent) {
    e.preventDefault()
    const t = e.touches[0]
    if (Math.abs(t.clientX - dragStartX) > 5 || Math.abs(t.clientY - dragStartY) > 5) wasDragged = true
    updatePos(t.clientX, t.clientY)
  }
  function updatePos (cx: number, cy: number) {
    const dx = cx - dragStartX
    const dy = cy - dragStartY
    const pos = notifPos.value
    if (pos.right != null) pos.right = Math.max(10, dragOrigPos.right! - dx)
    if (pos.left != null) pos.left = Math.max(10, dragOrigPos.left! + dx)
    if (pos.top != null) pos.top = Math.max(10, dragOrigPos.top! + dy)
    if (pos.bottom != null) pos.bottom = Math.max(10, dragOrigPos.bottom! - dy)
  }
  function snapToEdge () {
    const pos = notifPos.value
    const vw = window.innerWidth
    const vh = window.innerHeight
    const btnW = 54, btnH = 54
    const cx = pos.left != null ? pos.left + btnW / 2 : vw - (pos.right ?? 30) - btnW / 2
    const cy = pos.top != null ? pos.top + btnH / 2 : vh - (pos.bottom ?? 100) - btnH / 2

    // Snap: prefer right/left edges, keep vertical
    if (cx < vw / 2) {
      pos.left = Math.max(10, Math.min(vw - btnW - 10, cx - btnW / 2))
      pos.right = undefined
    } else {
      pos.right = Math.max(10, Math.min(vw - btnW - 10, vw - cx - btnW / 2))
      pos.left = undefined
    }
    pos.top = Math.max(10, Math.min(vh - btnH - 10, cy - btnH / 2))
    pos.bottom = undefined
    notifPos.value = pos
    savePos()
  }
  function onDragEnd () {
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', onDragEnd)
    snapToEdge()
  }
  function onTouchEnd () {
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
    snapToEdge()
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('click', handleDocumentClick)
    
    if (authStore.isAuthenticated.value) {
      seedStatuses()
      checkSystemNotifications()
      pollInterval = setInterval(() => {
        checkAppointments()
        checkSystemNotifications()
      }, 8000)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('click', handleDocumentClick)
    if (pollInterval) {
      clearInterval(pollInterval)
    }
  })
</script>

<style scoped>
@import '../styles/navbar.css';

.btn-outline-nav {
  padding: 0.45rem 1rem;
  border: 1.5px solid var(--cobalt, #0047AB);
  border-radius: 20px;
  color: var(--cobalt, #0047AB);
  background: transparent;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.btn-outline-nav:hover {
  background: var(--cobalt, #0047AB);
  color: white;
}

.btn-register-nav {
  background: var(--cobalt, #0047AB) !important;
  color: white !important;
}

.btn-register-nav:hover {
  background: var(--cobalt-dark, #003380) !important;
  border-color: var(--cobalt-dark, #003380) !important;
}

/* User Pill Modern Design */
.user-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--gray-50, #f8fafc);
  border: 1px solid var(--gray-200, #e2e8f0);
  padding: 4px 6px 4px 12px;
  border-radius: 30px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-pill:hover {
  background: white;
  box-shadow: 0 4px 15px rgba(0, 71, 171, 0.06);
  border-color: var(--cobalt, #0047ab);
}

.user-pill__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--cobalt-pale, #e8f0fe);
  color: var(--cobalt, #0047ab);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
}

.user-pill__name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gray-800, #1e293b);
  white-space: nowrap;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-pill__logout {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--gray-500, #64748b);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.user-pill__logout:hover {
  background: var(--red-light, #ffebee);
  color: var(--red, #e53935);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.50rem;
}

.mobile-user-name {
  font-weight: 700;
  color: #0f172a;
  padding: 0.5rem 0;
  display: block;
}

.mobile-logout {
  width: 100%;
  justify-content: center;
  padding: 0.8rem;
}

.btn-mobile-login,
.btn-mobile-register {
  width: 100%;
  padding: 0.8rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
}

.btn-mobile-login {
  background: #0047AB;
  color: white;
}

.btn-mobile-register {
  border: 1.5px solid #0047AB;
  color: #0047AB;
  background: transparent;
}
</style>

<style>
@import '../styles/notif.css';
</style>
