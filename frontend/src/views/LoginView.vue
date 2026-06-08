<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header text-center">
        <div class="logo justify-center" @click="$router.push('/')">
          <div class="logo__icon">
            <svg fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="height: 36px; width: 36px;">
              <rect fill="#0047AB" height="32" rx="8" width="32" />
              <path d="M16 6v20M6 16h20" stroke="white" stroke-linecap="round" stroke-width="4" />
            </svg>
          </div>
          <div class="logo__text">Medicare<span>.</span></div>
        </div>
        <h1>Đăng nhập hệ thống</h1>
        <p class="subtitle">Cổng Xác Thực Trung Tâm Medicare</p>
      </div>

      <div v-if="errorMsg" class="error-banner">
        <i class="fas fa-exclamation-circle" /> {{ errorMsg }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username"><i class="fas fa-user" /> Tên đăng nhập</label>
          <input id="username" v-model="form.username" type="text" placeholder="Nhập tên đăng nhập..." required autocomplete="username">
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label for="password" style="margin-bottom: 0;"><i class="fas fa-lock" /> Mật khẩu</label>
            <a href="#" @click.prevent="showForgotPasswordModal = true" style="font-size: 0.8rem; color: #0047AB; text-decoration: none; font-weight: 600;">Quên mật khẩu?</a>
          </div>
          <div style="position: relative;">
            <input 
              id="password" 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Nhập mật khẩu..." 
              required 
              autocomplete="current-password"
              style="padding-right: 40px;"
            >
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0;"
            >
              <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" />
            </button>
          </div>
        </div>

        <button class="btn-submit" type="submit" :disabled="loading">
          <i v-if="loading" class="fas fa-circle-notch fa-spin" />
          <i v-else class="fas fa-sign-in-alt" />
          {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link></p>
        <router-link to="/" class="back-link"><i class="fas fa-arrow-left" /> Quay về trang chủ</router-link>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPasswordModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(2px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 24px; box-sizing: border-box;">
      <div class="auth-card" style="max-width: 400px; padding: 30px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 71, 171, 0.15); background: white; border: 1px solid #e2e8f0; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.25rem; font-weight: 850; color: #0f172a; margin: 0;">Khôi phục mật khẩu</h2>
          <button @click="closeForgotPassword" style="font-size: 1.5rem; background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0; line-height: 1;">&times;</button>
        </div>

        <div v-if="forgotStep === 1">
          <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.25rem; line-height: 1.45;">
            Nhập tên đăng nhập của bạn. Hệ thống sẽ gửi mã xác thực OTP về email đã đăng ký của bạn.
          </p>
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 0.5rem;"><i class="fas fa-user" style="color: #0047AB; margin-right: 6px;" /> Tên đăng nhập</label>
            <input v-model="forgotForm.username" type="text" placeholder="Nhập tên đăng nhập..." required style="width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; background: #f8fafc; box-sizing: border-box;">
          </div>
          <button class="btn-submit" @click="sendOtp" :disabled="sendingOtp" style="width: 100%; padding: 0.85rem; background: #0047AB; color: white; border: none; border-radius: 12px; font-size: 0.95rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i v-if="sendingOtp" class="fas fa-spinner fa-spin" />
            {{ sendingOtp ? 'Đang gửi mã...' : 'Gửi mã OTP' }}
          </button>
        </div>

        <div v-else-if="forgotStep === 2">
          <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.25rem; line-height: 1.45;">
            Mã OTP đã được gửi về email: <strong style="color: #0f172a;">{{ maskEmail(forgotForm.email) }}</strong>. Vui lòng kiểm tra email (hoặc file mock_email_otp.txt) và nhập thông tin dưới đây.
          </p>
          <div class="form-group" style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 0.5rem;"><i class="fas fa-key" style="color: #0047AB; margin-right: 6px;" /> Mã xác thực OTP</label>
            <input v-model="forgotForm.otp" type="text" placeholder="Nhập 6 số OTP..." required style="width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; background: #f8fafc; text-align: center; font-weight: 700; letter-spacing: 4px; box-sizing: border-box;">
          </div>
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 0.5rem;"><i class="fas fa-lock" style="color: #0047AB; margin-right: 6px;" /> Mật khẩu mới</label>
            <input v-model="forgotForm.newPassword" type="password" placeholder="Nhập mật khẩu mới..." required style="width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; background: #f8fafc; box-sizing: border-box;">
          </div>
          <button class="btn-submit" @click="resetPassword" :disabled="resettingPassword" style="width: 100%; padding: 0.85rem; background: #0047AB; color: white; border: none; border-radius: 12px; font-size: 0.95rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i v-if="resettingPassword" class="fas fa-spinner fa-spin" />
            {{ resettingPassword ? 'Đang cập nhật...' : 'Xác nhận đổi mật khẩu' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  import { publicApi } from '@/services/api'

  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  const loading = ref(false)
  const errorMsg = ref('')
  const form = ref({ username: '', password: '' })

  // External redirect URL (from Appointment-Service SSO flow)
  const redirectUrl = ref(route.query.redirect || '')

  // Password visibility
  const showPassword = ref(false)

  // Forgot password flow
  const showForgotPasswordModal = ref(false)
  const forgotStep = ref(1)
  const sendingOtp = ref(false)
  const resettingPassword = ref(false)
  const forgotForm = ref({
    username: '',
    email: '',
    otp: '',
    newPassword: ''
  })

  function maskEmail(email) {
    if (!email) return ''
    const parts = email.split('@')
    if (parts.length !== 2) return email
    const name = parts[0]
    const domain = parts[1]
    if (name.length <= 3) {
      return '***@' + domain
    }
    return name.substring(0, 3) + '***@' + domain
  }

  function closeForgotPassword() {
    showForgotPasswordModal.value = false
    forgotStep.value = 1
    forgotForm.value = { username: '', email: '', otp: '', newPassword: '' }
  }

  async function sendOtp() {
    if (!forgotForm.value.username) {
      alert('Vui lòng nhập tên đăng nhập!')
      return
    }
    sendingOtp.value = true
    try {
      const res = await publicApi.post('/Auth/forgot-password', {
        username: forgotForm.value.username
      })
      forgotForm.value.email = res.data.email
      forgotStep.value = 2
      alert(res.data.message)
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi gửi mã OTP!')
    } finally {
      sendingOtp.value = false
    }
  }

  async function resetPassword() {
    if (!forgotForm.value.otp || !forgotForm.value.newPassword) {
      alert('Vui lòng điền đầy đủ mã OTP và mật khẩu mới!')
      return
    }
    resettingPassword.value = true
    try {
      const res = await publicApi.post('/Auth/reset-password', {
        username: forgotForm.value.username,
        otp: forgotForm.value.otp,
        newPassword: forgotForm.value.newPassword
      })
      alert(res.data.message)
      closeForgotPassword()
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi khôi phục mật khẩu!')
    } finally {
      resettingPassword.value = false
    }
  }

  onMounted(() => {
    if (route.query.logout === 'true') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      authStore.token.value = null
      authStore.user.value = null
    } else if (authStore.isAuthenticated.value) {
      // If already authenticated, redirect appropriately
      redirectAfterLogin()
    }
  })

  async function handleLogin () {
    loading.value = true
    errorMsg.value = ''
    try {
      await authStore.login(form.value)
      redirectAfterLogin()
    } catch (error) {
      errorMsg.value = error?.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng.'
    } finally {
      loading.value = false
    }
  }

  function redirectAfterLogin () {
    const user = authStore.user.value

    // If there's an internal redirect path from our router guard
    if (redirectUrl.value) {
      // Decode and handle either paths or full URLs (if external)
      try {
        const decoded = decodeURIComponent(redirectUrl.value)
        if (decoded.startsWith('/') || decoded.startsWith('#')) {
          router.push(decoded)
          return
        } else {
          // If it is a full external URL, fallback to it
          const callbackUrl = new URL(decoded)
          callbackUrl.searchParams.set('token', authStore.token.value)
          callbackUrl.searchParams.set('user', encodeURIComponent(JSON.stringify(user)))
          callbackUrl.searchParams.set('role', user.role)
          window.location.href = callbackUrl.toString()
          return
        }
      } catch (e) {
        router.push('/')
        return
      }
    }

    // Internal portal redirect based on role
    const role = (user?.role || '').toLowerCase()
    if (role === 'admin') {
      router.push('/dashboard')
    } else if (role === 'doctor') {
      router.push('/doctor')
    } else if (role === 'receptionist') {
      router.push('/receptionist')
    } else if (role === 'pharmacist' || role === 'cashier') {
      router.push('/pharmacy/dashboard')
    } else if (role === 'patient') {
      router.push('/')
    } else {
      // Unknown → go to Home page
      router.push('/')
    }
  }
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 71, 171, 0.08);
}

.auth-header {
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo__text {
  font-size: 1.6rem;
  font-weight: 900;
  color: #1e293b;
}

.logo__text span {
  color: #E53935;
}

h1 {
  font-size: 1.4rem;
  font-weight: 800;
  margin-top: 20px;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 6px;
}

.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.5rem;
}

.form-group label i {
  color: #0047AB;
  margin-right: 6px;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #0f172a;
  background: #f8fafc;
  transition: all 0.2s;
  outline: none;
  font-family: inherit;
}

.form-group input:focus {
  border-color: #0047AB;
  box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.1);
  background: white;
}

.form-group input::placeholder {
  color: #94a3b8;
}

.btn-submit {
  width: 100%;
  padding: 0.85rem;
  background: #0047AB;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-family: inherit;
}

.btn-submit:hover:not(:disabled) {
  background: #003380;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0, 71, 171, 0.25);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
}

.auth-footer p {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.75rem;
}

.auth-footer a {
  color: #0047AB;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.auth-footer a:hover {
  color: #003380;
}

.back-link {
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.justify-center {
  justify-content: center;
}

.text-center {
  text-align: center;
}
</style>
