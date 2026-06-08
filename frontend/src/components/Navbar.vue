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
        <li><router-link to="/my-appointments">Lịch sử đặt hẹn</router-link></li>
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
      <a href="#" @click.prevent="redirectToBooking(); mobileOpen = false"><i class="fas fa-calendar-check" /> Đặt lịch khám</a>
      <a href="#" @click.prevent="redirectToMedicalRecord(); mobileOpen = false"><i class="fas fa-file-medical" /> Bệnh án điện tử</a>
      <a href="#" @click.prevent="redirectToPharmacy(); mobileOpen = false"><i class="fas fa-pills" /> Hóa đơn & Thuốc</a>
      <router-link to="/my-appointments" @click="mobileOpen = false">Lịch sử đặt hẹn</router-link>
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
</template>

<script setup>
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'

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
        router.push('/pharmacy/billing')
        return
      }
      router.push('/pharmacy/dashboard')
      return
    }
    router.push('/pharmacy/dashboard')
  }

  function redirectToMedicalRecord () {
    router.push('/medical-records')
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
