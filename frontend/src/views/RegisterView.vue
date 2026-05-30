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
        <h1>Tạo tài khoản mới</h1>
        <p class="subtitle">Đăng ký để sử dụng các dịch vụ Medicare</p>
      </div>

      <div v-if="errorMsg" class="error-banner">
        <i class="fas fa-exclamation-circle" /> {{ errorMsg }}
      </div>

      <div v-if="successMsg" class="success-banner">
        <i class="fas fa-check-circle" /> {{ successMsg }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="fullName"><i class="fas fa-id-card" /> Họ và tên</label>
          <input id="fullName" v-model="form.fullName" type="text" placeholder="Nhập họ và tên..." required>
        </div>

        <div class="form-group">
          <label for="username"><i class="fas fa-user" /> Tên đăng nhập</label>
          <input id="username" v-model="form.username" type="text" placeholder="Nhập tên đăng nhập..." required autocomplete="username">
        </div>

        <div class="form-group">
          <label for="email"><i class="fas fa-envelope" /> Email</label>
          <input id="email" v-model="form.email" type="email" placeholder="Nhập email..." required>
        </div>

        <div class="form-group">
          <label for="password"><i class="fas fa-lock" /> Mật khẩu</label>
          <input id="password" v-model="form.password" type="password" placeholder="Tối thiểu 6 ký tự..." required autocomplete="new-password">
        </div>

        <div class="form-group">
          <label for="confirmPassword"><i class="fas fa-lock" /> Xác nhận mật khẩu</label>
          <input id="confirmPassword" v-model="form.confirmPassword" type="password" placeholder="Nhập lại mật khẩu..." required autocomplete="new-password">
        </div>

        <button class="btn-submit" type="submit" :disabled="loading">
          <i v-if="loading" class="fas fa-circle-notch fa-spin" />
          <i v-else class="fas fa-user-plus" />
          {{ loading ? 'Đang xử lý...' : 'Đăng ký' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
        <router-link to="/" class="back-link"><i class="fas fa-arrow-left" /> Quay về trang chủ</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'

  const router = useRouter()
  const authStore = useAuthStore()
  const loading = ref(false)
  const errorMsg = ref('')
  const successMsg = ref('')
  const form = ref({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  async function handleRegister () {
    errorMsg.value = ''
    successMsg.value = ''

    if (form.value.password !== form.value.confirmPassword) {
      errorMsg.value = 'Mật khẩu xác nhận không khớp.'
      return
    }

    if (form.value.password.length < 6) {
      errorMsg.value = 'Mật khẩu phải có ít nhất 6 ký tự.'
      return
    }

    loading.value = true
    try {
      await authStore.register({
        fullName: form.value.fullName,
        username: form.value.username,
        email: form.value.email,
        password: form.value.password
      })
      successMsg.value = 'Đăng ký thành công! Đang chuyển sang đăng nhập...'
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (error) {
      errorMsg.value = error?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f5ff 0%, #f8fafc 50%, #e8f0fe 100%);
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

.success-banner {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
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
  margin-bottom: 1.1rem;
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
