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
        <li>
          <span class="dropdown">
            <span class="dropdown-toggle">Dịch vụ <i class="fas fa-chevron-down" /></span>
            <div class="dropdown-menu">
              <a href="#" @click.prevent="redirectToBooking"><i class="fas fa-calendar-check" /> Đặt lịch khám</a>
              <a href="#" @click.prevent="redirectToMedicalRecord"><i class="fas fa-file-medical" /> Hồ sơ Bệnh án</a>
              <a href="#" @click.prevent="redirectToPharmacy"><i class="fas fa-pills" /> Tra cứu Hóa đơn & Thuốc</a>
            </div>
          </span>
        </li>
        <li><a :href="APPOINTMENT_URL + '/track'">Tra cứu lịch hẹn</a></li>
        <li><a :href="APPOINTMENT_URL + '/contact'">Liên hệ</a></li>
      </ul>

      <div class="nav-actions">
        <template v-if="authStore.isAuthenticated.value">
          <span class="user-badge-nav">{{ authStore.user.value?.fullName || authStore.user.value?.username }}</span>
          <button v-if="authStore.canAccessDashboard.value" class="btn-outline-nav" @click="$router.push('/dashboard')">
            <i class="fas fa-tachometer-alt" /> Dashboard
          </button>
          <button v-else-if="authStore.canAccessDoctorDashboard.value" class="btn-outline-nav" @click="$router.push('/doctor')">
            <i class="fas fa-user-md" /> Bác sĩ
          </button>
          <button class="btn-logout" @click="authStore.logout()">
            <i class="fas fa-sign-out-alt" /> Đăng xuất
          </button>
        </template>
        <template v-else>
          <button class="btn-outline-nav" @click="$router.push('/login')">
            <i class="fas fa-sign-in-alt" /> Đăng nhập
          </button>
          <button class="btn-outline-nav" @click="$router.push('/register')">
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
      <a href="#" @click.prevent="redirectToBooking(); mobileOpen = false"><i class="fas fa-calendar-check" /> Đặt lịch khám</a>
      <a href="#" @click.prevent="redirectToMedicalRecord(); mobileOpen = false"><i class="fas fa-file-medical" /> Bệnh án điện tử</a>
      <a href="#" @click.prevent="redirectToPharmacy(); mobileOpen = false"><i class="fas fa-pills" /> Hóa đơn & Thuốc</a>
      <a :href="APPOINTMENT_URL + '/track'" @click="mobileOpen = false">Tra cứu lịch hẹn</a>
      <a :href="APPOINTMENT_URL + '/contact'" @click="mobileOpen = false">Liên hệ</a>

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
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'

  const router = useRouter()
  const authStore = useAuthStore()
  const mobileOpen = ref(false)
  const scrolled = ref(false)
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  const APPOINTMENT_URL = currentHost === 'localhost' || currentHost === '127.0.0.1'
    ? 'http://localhost:5173'
    : `http://${currentHost}:3001`
  const MEDICAL_RECORD_URL = currentHost === 'localhost' || currentHost === '127.0.0.1'
    ? 'http://localhost:8001'
    : `http://${currentHost}:8001`
  const PHARMACY_URL = currentHost === 'localhost' || currentHost === '127.0.0.1'
    ? 'http://localhost:8002'
    : `http://${currentHost}:8002`

  function redirectToBooking () {
    if (authStore.isAuthenticated.value) {
      const user = authStore.user.value
      if (user.role === 'Admin' || user.role === 'Receptionist') {
        router.push('/dashboard')
        return
      }
      const redirect = `${APPOINTMENT_URL}/auth-callback?token=${authStore.token.value}&user=${encodeURIComponent(JSON.stringify(user))}&role=${user.role}`
      window.location.href = redirect
    } else {
      window.location.href = `${APPOINTMENT_URL}/patient`
    }
  }

  function redirectToPharmacy () {
    if (authStore.isAuthenticated.value) {
      const user = authStore.user.value
      const redirect = `${PHARMACY_URL}/auth-callback.html?token=${authStore.token.value}&user=${encodeURIComponent(JSON.stringify(user))}&role=${user.role}`
      window.open(redirect, '_blank')
    } else {
      window.open(PHARMACY_URL, '_blank')
    }
  }

  function redirectToMedicalRecord () {
    if (authStore.isAuthenticated.value) {
      const user = authStore.user.value
      const redirect = `${MEDICAL_RECORD_URL}/auth-callback?token=${authStore.token.value}&user=${encodeURIComponent(JSON.stringify(user))}&role=${user.role}`
      window.open(redirect, '_blank')
    } else {
      window.open(MEDICAL_RECORD_URL, '_blank')
    }
  }

  function handleScroll () {
    scrolled.value = window.scrollY > 50
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>

<style scoped>
@import '@/styles/navbar.css';


.btn-outline-nav {
  padding: 0.5rem 1.1rem;
  border: 1.5px solid #0047AB;
  border-radius: 10px;
  color: #0047AB;
  background: transparent;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.btn-outline-nav:hover {
  background: #0047AB;
  color: white;
}

.btn-logout {
  padding: 0.5rem 1.1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  color: #64748b;
  background: transparent;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.btn-logout:hover {
  border-color: #fecaca;
  color: #ef4444;
  background: #fef2f2;
}

.user-badge-nav {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
  padding: 0.4rem 0.8rem;
  background: #f1f5f9;
  border-radius: 8px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
