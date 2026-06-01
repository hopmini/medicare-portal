<template>
  <div class="profile-page">
    <Navbar />

    <div class="profile-container animate-fade-in">
      <!-- HERO BANNER ACCENT -->
      <div class="profile-banner-accent">
        <div class="banner-overlay" />
        <div class="banner-text">
          <h2>Hồ Sơ Cá Nhân</h2>
          <p>Quản lý thông tin tài khoản và bảo mật liên thông hệ thống Medicare</p>
        </div>
      </div>

      <!-- MAIN LAYOUT -->
      <div class="profile-grid">
        <!-- LEFT SIDEBAR CARD -->
        <div class="profile-sidebar shadow-light">
          <div class="user-avatar-section">
            <div class="avatar-large">
              <i class="fas fa-user-md" v-if="userRole.toLowerCase() === 'doctor'" />
              <i class="fas fa-user-shield" v-else-if="userRole.toLowerCase() === 'admin'" />
              <i class="fas fa-user" v-else />
            </div>
            <h3 class="user-fullname">{{ profileForm.fullName }}</h3>
            <span class="role-badge" :class="getRoleClass(userRole)">{{ getRoleText(userRole) }}</span>
          </div>

          <div class="quick-stats-list">
            <div class="quick-stat-item">
              <span class="stat-label">Tài khoản</span>
              <span class="stat-val"><code>{{ userUsername }}</code></span>
            </div>
            <div class="quick-stat-item">
              <span class="stat-label">Thành viên từ</span>
              <span class="stat-val">2026</span>
            </div>
            <div class="quick-stat-item">
              <span class="stat-label">Trạng thái</span>
              <span class="stat-val text-green"><i class="fas fa-check-circle" /> Đang hoạt động</span>
            </div>
          </div>

          <button class="btn-logout-sidebar" @click="authStore.logout()">
            <i class="fas fa-sign-out-alt" /> Đăng xuất tài khoản
          </button>
        </div>

        <!-- RIGHT FORM CARD (Tabs Layout) -->
        <div class="profile-main shadow-light">
          <!-- TABS HEADERS -->
          <div class="profile-tabs-header">
            <button 
              class="tab-btn" 
              :class="{ 'tab-btn--active': activeSubTab === 'info' }" 
              @click="activeSubTab = 'info'"
            >
              <i class="fas fa-user-circle" /> Thông tin cá nhân
            </button>
            <button 
              class="tab-btn" 
              :class="{ 'tab-btn--active': activeSubTab === 'security' }" 
              @click="activeSubTab = 'security'"
            >
              <i class="fas fa-shield-alt" /> Bảo mật
            </button>
            <button 
              class="tab-btn" 
              :class="{ 'tab-btn--active': activeSubTab === 'history' }" 
              @click="activeSubTab = 'history'"
            >
              <i class="fas fa-history" /> Nhật ký hoạt động
            </button>
          </div>

          <!-- TAB CONTENT: PERSONAL INFO -->
          <div v-if="activeSubTab === 'info'" class="tab-pane-content">
            <h4 class="tab-pane-title">Cập nhật thông tin tài khoản</h4>
            <p class="tab-pane-subtitle">Thay đổi các thông tin liên hệ cá nhân bên dưới để Medicare cập nhật hồ sơ liên thông của bạn.</p>

            <form @submit.prevent="submitUpdateInfo" class="profile-form-layout">
              <div class="form-row-profile">
                <div class="form-group-profile">
                  <label>Họ và tên của bạn:</label>
                  <input v-model="profileForm.fullName" required type="text" class="profile-input" placeholder="Ví dụ: Nguyễn Văn A" />
                </div>
                <div class="form-group-profile">
                  <label>Địa chỉ Email liên hệ:</label>
                  <input v-model="profileForm.email" required type="email" class="profile-input" placeholder="example@medicare.vn" />
                </div>
              </div>

              <div class="form-row-profile">
                <div class="form-group-profile">
                  <label>Số điện thoại di động:</label>
                  <input v-model="profileForm.phoneNumber" required type="tel" class="profile-input" placeholder="Ví dụ: 0987654321" />
                </div>
                <div class="form-group-profile">
                  <label>Địa chỉ thường trú:</label>
                  <input v-model="profileForm.address" required type="text" class="profile-input" placeholder="Ví dụ: 78 Giải Phóng, Hà Nội" />
                </div>
              </div>

              <div class="form-row-profile">
                <div class="form-group-profile">
                  <label>Tên đăng nhập hệ thống:</label>
                  <input :value="userUsername" disabled type="text" class="profile-input disabled-input" />
                </div>
                <div class="form-group-profile">
                  <label>Quyền hạn tài khoản:</label>
                  <input :value="getRoleText(userRole)" disabled type="text" class="profile-input disabled-input" />
                </div>
              </div>

              <div class="form-actions-profile">
                <button type="submit" class="btn-profile-primary" :disabled="submittingInfo">
                  <span v-if="submittingInfo"><i class="fas fa-spinner fa-spin" /> Đang cập nhật...</span>
                  <span v-else><i class="fas fa-save" /> Cập nhật hồ sơ</span>
                </button>
              </div>
            </form>
          </div>

          <!-- TAB CONTENT: SECURITY -->
          <div v-if="activeSubTab === 'security'" class="tab-pane-content">
            <h4 class="tab-pane-title">Thay đổi mật khẩu đăng nhập</h4>
            <p class="tab-pane-subtitle">Mật khẩu cần tối thiểu 6 ký tự bao gồm chữ và số để tăng tính bảo mật cho tài khoản của bạn.</p>

            <form @submit.prevent="submitChangePassword" class="profile-form-layout">
              <div class="form-group-profile">
                <label>Mật khẩu hiện tại:</label>
                <input v-model="securityForm.currentPassword" required type="password" class="profile-input" placeholder="Nhập mật khẩu hiện tại..." />
              </div>
              <div class="form-group-profile">
                <label>Mật khẩu mới:</label>
                <input v-model="securityForm.newPassword" required type="password" class="profile-input" placeholder="Nhập mật khẩu mới..." />
              </div>
              <div class="form-group-profile">
                <label>Xác nhận lại mật khẩu mới:</label>
                <input v-model="securityForm.confirmPassword" required type="password" class="profile-input" placeholder="Nhập lại mật khẩu mới..." />
              </div>

              <div class="form-actions-profile">
                <button type="submit" class="btn-profile-primary" :disabled="submittingPassword">
                  <span v-if="submittingPassword"><i class="fas fa-spinner fa-spin" /> Đang thiết lập...</span>
                  <span v-else><i class="fas fa-key" /> Cập nhật mật khẩu</span>
                </button>
              </div>
            </form>
          </div>

          <!-- TAB CONTENT: HISTORY & LOGS -->
          <div v-if="activeSubTab === 'history'" class="tab-pane-content">
            <h4 class="tab-pane-title">Lịch sử hoạt động y khoa</h4>
            <p class="tab-pane-subtitle">Nhật ký hoạt động của tài khoản được ghi nhận tự động trên hệ thống liên thông Medicare.</p>

            <div class="profile-logs-timeline">
              <div v-for="log in dynamicRoleLogs" :key="log.time" class="log-timeline-item">
                <div class="timeline-dot-circle" :class="log.colorClass">
                  <i :class="log.icon" />
                </div>
                <div class="timeline-log-details">
                  <p class="log-timeline-text" v-html="log.text" />
                  <span class="log-timeline-time">{{ log.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import Navbar from '@/components/Navbar.vue'
  import { useAuthStore } from '@/stores/authStore'

  const authStore = useAuthStore()
  const activeSubTab = ref('info')

  // Submit states
  const submittingInfo = ref(false)
  const submittingPassword = ref(false)

  // Current logged in user info details
  const userUsername = computed(() => authStore.user.value?.username || 'user_medicare')
  const userRole = computed(() => authStore.user.value?.role || 'Patient')

  // Forms bounds
  const profileForm = ref({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: ''
  })

  const securityForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Dynamic logs feed depending on User Role
  const dynamicRoleLogs = computed(() => {
    const role = userRole.value
    const today = new Date().toLocaleDateString('vi-VN')
    
    if (role === 'Admin' || role === 'Receptionist') {
      return [
        { text: 'Truy cập <b>Tổng Quan Liên Thông Trung Tâm</b> và kiểm tra thông tin đồng bộ.', time: today + ' 10:14', icon: 'fas fa-eye', colorClass: 'bg-blue' },
        { text: 'Phê duyệt trạng thái lịch khám cho bệnh nhân bệnh án số #AP-4890.', time: today + ' 09:30', icon: 'fas fa-check-circle', colorClass: 'bg-green' },
        { text: 'Xác thực đăng nhập tài khoản hệ thống quản trị hành chính.', time: today + ' 08:00', icon: 'fas fa-sign-in-alt', colorClass: 'bg-blue' }
      ]
    } else if (role === 'Doctor') {
      return [
        { text: 'Cập nhật phân bổ ca khám và lịch trực tuần mới thành công.', time: today + ' 14:02', icon: 'fas fa-clock', colorClass: 'bg-amber' },
        { text: 'Hoàn thành lượt khám lâm sàng và cấp chẩn đoán y khoa.', time: today + ' 11:20', icon: 'fas fa-user-md', colorClass: 'bg-green' },
        { text: 'Đăng nhập phân hệ điều phối bác sĩ và ca trực.', time: today + ' 07:45', icon: 'fas fa-sign-in-alt', colorClass: 'bg-blue' }
      ]
    } else {
      // Patients
      return [
        { text: 'Đăng ký thành công lịch hẹn khám chuyên khoa Nội tổng quát.', time: today + ' 15:45', icon: 'fas fa-calendar-plus', colorClass: 'bg-green' },
        { text: 'Tra cứu tình trạng hồ sơ lịch khám trên cổng tiếp đón.', time: today + ' 15:30', icon: 'fas fa-search', colorClass: 'bg-blue' },
        { text: 'Đăng ký tài khoản cổng thông tin bệnh nhân Medicare.', time: today + ' 15:10', icon: 'fas fa-user-plus', colorClass: 'bg-green' }
      ]
    }
  })

  function getRoleText (role) {
    switch ((role || '').toLowerCase()) {
      case 'admin': return 'Hệ thống Admin'
      case 'receptionist': return 'Nhân viên Tiếp nhận'
      case 'doctor': return 'Bác sĩ lâm sàng'
      default: return 'Bệnh nhân'
    }
  }

  function getRoleClass (role) {
    switch ((role || '').toLowerCase()) {
      case 'admin': return 'role--admin'
      case 'receptionist': return 'role--receptionist'
      case 'doctor': return 'role--doctor'
      default: return 'role--patient'
    }
  }

  async function submitUpdateInfo () {
    submittingInfo.value = true
    setTimeout(() => {
      submittingInfo.value = false
      alert('Cập nhật hồ sơ cá nhân thành công! (Dữ liệu đã được đồng bộ liên thông)')
    }, 800)
  }

  async function submitChangePassword () {
    if (securityForm.value.newPassword !== securityForm.value.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu mới không khớp nhau!')
      return
    }
    submittingPassword.value = true
    setTimeout(() => {
      submittingPassword.value = false
      alert('Đổi mật khẩu bảo mật thành công! Vui lòng ghi nhớ mật khẩu mới.')
      securityForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    }, 800)
  }

  onMounted(() => {
    // Seed current authenticated user data
    if (authStore.user.value) {
      profileForm.value.fullName = authStore.user.value.fullName || 'Người dùng Medicare'
      profileForm.value.email = authStore.user.value.email || 'user@medicare.vn'
      profileForm.value.phoneNumber = authStore.user.value.phoneNumber || '0901234567'
      profileForm.value.address = authStore.user.value.address || '78 Giải Phóng, Hà Nội'
    } else {
      profileForm.value.fullName = 'Bệnh nhân thử nghiệm'
      profileForm.value.email = 'patient@gmail.com'
      profileForm.value.phoneNumber = '0988777666'
      profileForm.value.address = 'Hà Nội, Việt Nam'
    }
  })
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8fafc;
  padding-top: 80px; /* Space for fixed navbar */
  font-family: 'Inter', sans-serif;
}

.profile-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

/* Banner accent */
.profile-banner-accent {
  height: 180px;
  background: linear-gradient(135deg, #0047AB 0%, #1565C0 100%);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 3rem;
  margin-bottom: 2rem;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%);
}

.banner-text {
  position: relative;
  z-index: 2;
  color: white;
}

.banner-text h2 {
  font-size: 1.8rem;
  font-weight: 850;
  margin-bottom: 0.5rem;
}

.banner-text p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

/* Grid Layout */
.profile-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
}

@media (max-width: 968px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

/* Sidebar Styling */
.profile-sidebar {
  background: white;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
}

.user-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.avatar-large {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgba(0, 71, 171, 0.08);
  color: #0047AB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  border: 3px solid #eff6ff;
}

.user-fullname {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
}

.role-badge {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 30px;
}

.role--admin { background: #fee2e2; color: #991b1b; }
.role--receptionist { background: #fff7ed; color: #9a3412; }
.role--doctor { background: #eff6ff; color: #1e40af; }
.role--patient { background: #f0fdf4; color: #166534; }

.quick-stats-list {
  width: 100%;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  padding: 1.5rem 0;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.stat-label {
  color: #64748b;
  font-weight: 650;
}

.stat-val {
  color: #0f172a;
  font-weight: 750;
}

.btn-logout-sidebar {
  width: 100%;
  background: #fef2f2;
  color: #ef4444;
  border: 1.5px solid #fee2e2;
  padding: 0.75rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-logout-sidebar:hover {
  background: #fee2e2;
}

/* Main Content area */
.profile-main {
  background: white;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  overflow: hidden;
}

.profile-tabs-header {
  display: flex;
  background: #f8fafc;
  border-bottom: 1.5px solid #e2e8f0;
}

.tab-btn {
  flex: 1;
  padding: 1.25rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 0.9rem;
  font-weight: 750;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-btn:hover {
  color: #0f172a;
  background: rgba(0, 0, 0, 0.01);
}

.tab-btn--active {
  color: #0047AB;
  border-bottom-color: #0047AB;
  background: white;
}

.tab-pane-content {
  padding: 2.5rem;
}

.tab-pane-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.tab-pane-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.5;
}

/* Form layouts */
.profile-form-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row-profile {
  display: flex;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .form-row-profile {
    flex-direction: column;
    gap: 1.25rem;
  }
}

.form-group-profile {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group-profile label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
  text-align: left;
}

.profile-input {
  width: 100%;
  height: 46px;
  background: white;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  padding: 0 1rem;
  font-size: 0.9rem;
  font-weight: 400;
  color: #1e293b;
  outline: none;
  transition: 0.2s;
  box-sizing: border-box;
}

.profile-input:focus {
  border-color: #0047AB;
  box-shadow: 0 0 0 4px rgba(0, 71, 171, 0.08);
}

.disabled-input {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

.form-actions-profile {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 1.5rem;
}

.btn-profile-primary {
  background: #0047AB;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-profile-primary:hover {
  background: #003380;
  transform: translateY(-1px);
}

.btn-profile-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Timeline details logs */
.profile-logs-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  padding-left: 1rem;
}

.profile-logs-timeline::before {
  content: '';
  position: absolute;
  top: 0;
  left: 27px;
  height: 100%;
  width: 2px;
  background: #e2e8f0;
}

.log-timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  position: relative;
  z-index: 2;
}

.timeline-dot-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.timeline-dot-circle.bg-blue { border-color: #0047AB; color: #0047AB; }
.timeline-dot-circle.bg-green { border-color: #10b981; color: #10b981; }
.timeline-dot-circle.bg-amber { border-color: #f59e0b; color: #f59e0b; }

.timeline-log-details {
  flex: 1;
}

.log-timeline-text {
  font-size: 0.875rem;
  color: #334155;
  line-height: 1.5;
  margin: 0;
  text-align: left;
}

.log-timeline-time {
  font-size: 0.75rem;
  color: #94a3b8;
  display: block;
  margin-top: 4px;
  text-align: left;
}

.text-green {
  color: #16a34a;
}
</style>
