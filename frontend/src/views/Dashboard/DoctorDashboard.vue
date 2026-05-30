<template>
  <div class="doctor-layout">
    <aside class="sidebar">
      <div class="sidebar__header">
        <div class="logo" style="cursor: pointer;" @click="$router.push('/')">
          <div class="logo__icon">
            <svg fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="height: 32px; width: 32px;">
              <rect fill="#0047AB" height="32" rx="8" width="32" />
              <path d="M16 6v20M6 16h20" stroke="white" stroke-linecap="round" stroke-width="4" />
            </svg>
          </div>

          <div class="logo__text" style="font-weight: 800; font-size: 1.2rem; margin-left: 8px;">
            Medicare<span style="color: #E53935;">.</span>
          </div>
        </div>
      </div>

      <nav class="sidebar__nav">
        <div class="sidebar__divider">BÁC SĨ</div>

        <div class="nav-item nav-item--active">
          <span class="nav-icon"><i class="fas fa-calendar-day" /></span>
          <span>Lịch hẹn hôm nay</span>
        </div>
      </nav>

      <div class="sidebar__footer">
        <div v-if="authStore.user" class="user-brief">
          <div class="avatar-small">{{ (authStore.user.username || authStore.user.fullName || 'U').substring(0, 2).toUpperCase() }}</div>

          <div class="user-brief-info">
            <p class="user-brief-name">{{ authStore.user.fullName }}</p>
            <p class="user-brief-role">Bác sĩ chuyên khoa</p>
          </div>
        </div>

        <div class="nav-item logout-btn" @click="authStore.logout()">
          <span class="nav-icon"><i class="fas fa-sign-out-alt" /></span>
          <span>Đăng xuất</span>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="top-bar">
        <div class="page-context">
          <h1 class="page-title">Lịch hẹn hôm nay</h1>
          <p v-if="doctorData" class="page-subtitle">BS. {{ doctorData.doctorName }} - {{ formatDate(doctorData.date) }}</p>
        </div>

        <div class="top-bar-actions">
          <button class="btn-primary" @click="fetchData">
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }" /> Làm mới danh sách
          </button>
        </div>
      </header>

      <div class="page-container">
        <div v-if="loading" class="loading-state">
          <i class="fas fa-circle-notch fa-spin fa-2x" style="color: #0047AB; margin-bottom: 1rem;" />
          <p>Đang tải lịch hẹn...</p>
        </div>

        <template v-else-if="doctorData">
          <div class="stats-grid" style="margin-bottom: 2rem;">
            <div class="stat-card">
              <p class="stat-card__label">Tổng lịch hẹn</p>
              <h3 class="stat-card__value">{{ doctorData.appointments.length }}</h3>
            </div>

            <div class="stat-card">
              <p class="stat-card__label">Chờ khám</p>
              <h3 class="stat-card__value" style="color: #f59e0b;">{{ doctorData.appointments.filter((a: any) => a.status === 1).length }}</h3>
            </div>

            <div class="stat-card">
              <p class="stat-card__label">Đã khám</p>
              <h3 class="stat-card__value" style="color: #10b981;">{{ doctorData.appointments.filter((a: any) => a.status === 2).length }}</h3>
            </div>
          </div>

          <div v-if="doctorData.appointments.length === 0" class="empty-state">
            <div class="empty-icon"><i class="fas fa-calendar-check" /></div>
            <p>Hôm nay không có lịch hẹn nào.</p>
          </div>

          <table v-else class="data-table">
            <thead>
              <tr>
                <th style="width: 70px; text-align: center;">STT</th>
                <th>Bệnh nhân</th>
                <th>Khung giờ hẹn</th>
                <th>Dịch vụ y khoa</th>
                <th>Trạng thái</th>
                <th style="width: 220px; text-align: right;">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="app in doctorData.appointments" :key="app.id">
                <td style="text-align: center;">
                  <span class="queue-number-circle">{{ app.queueNumber || '--' }}</span>
                </td>

                <td>
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #0047AB; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.85rem;">
                      {{ app.patientName?.charAt(0) || '?' }}
                    </div>

                    <div>
                      <p style="font-weight: 700; margin: 0; color: #0f172a;">{{ app.patientName }}</p>
                    </div>
                  </div>
                </td>

                <td class="font-medium text-slate">{{ formatTime(app.startTime) }} - {{ formatTime(app.endTime) }}</td>
                <td><span class="service-badge">{{ app.serviceName }}</span></td>
                <td><span class="badge" :class="getStatusClass(app.status)">{{ getStatusText(app.status) }}</span></td>
                <td style="text-align: right;">
                  <div class="action-cell-row">
                    <button class="btn-table-action btn-detail" @click="viewDetail(app)">
                      <i class="fas fa-eye" /> Chi tiết
                    </button>
                    <button v-if="app.status === 1" class="btn-table-action btn-complete" @click="completeAppointment(app.id)">
                      <i class="fas fa-check" /> Khám xong
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <div v-else class="empty-state">
          <div class="empty-icon"><i class="fas fa-user-md" /></div>
          <p>Không tìm thấy thông tin bác sĩ. Vui lòng liên hệ Admin.</p>
        </div>
      </div>
    </main>

    <!-- CLINICAL DETAILS MODAL (POPUP ON REQUEST) -->
    <div v-if="selectedApp" class="detail-modal-overlay" @click.self="closeDetail">
      <div class="detail-modal-card animate-scale-up">
        <div class="modal-header">
          <div class="modal-header__title">
            <span class="ref-code-lg">#{{ selectedApp.id.toUpperCase() }}</span>
            <h3>Bệnh án & Chi tiết Khám lâm sàng</h3>
          </div>
          <button class="modal-close-btn" @click="closeDetail">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Status banner -->
          <div class="modal-status-banner" :class="getStatusClass(selectedApp.status)">
            <i class="fas fa-info-circle" /> Trạng thái hiện tại: <strong>{{ getStatusText(selectedApp.status) }}</strong>
          </div>

          <!-- Section: Patient clinical info -->
          <div class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-user-injured" /> Thông tin Hành chính & Sinh học</h4>
            
            <div class="clinical-details-grid">
              <div class="detail-cell">
                <span class="cell-label">Họ và tên bệnh nhân:</span>
                <span class="cell-value font-semibold">{{ parsedPatientInfo.fullName || selectedApp.patientName }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Số điện thoại liên hệ:</span>
                <span class="cell-value">{{ parsedPatientInfo.phone || 'Chưa cung cấp' }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Ngày sinh bệnh nhân:</span>
                <span class="cell-value">{{ parsedPatientInfo.dob ? formatDateFull(parsedPatientInfo.dob) : 'Chưa cung cấp' }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Giới tính sinh học:</span>
                <span class="cell-value">{{ parsedPatientInfo.gender || 'Chưa cung cấp' }}</span>
              </div>
              <div class="detail-cell full-width">
                <span class="cell-label">Địa chỉ thường trú:</span>
                <span class="cell-value">{{ parsedPatientInfo.address || 'Chưa cung cấp' }}</span>
              </div>
            </div>
          </div>

          <!-- Section: Examination info -->
          <div class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-stethoscope" /> Chi tiết cuộc hẹn y khoa</h4>
            
            <div class="clinical-details-grid">
              <div class="detail-cell">
                <span class="cell-label">Dịch vụ chỉ định:</span>
                <span class="cell-value font-bold text-dark">{{ selectedApp.serviceName }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Giờ khám bệnh:</span>
                <span class="cell-value highlight-value">{{ formatTime(selectedApp.startTime) }} - {{ formatTime(selectedApp.endTime) }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Số thứ tự khám (STT):</span>
                <span class="cell-value text-success font-bold">Số {{ selectedApp.queueNumber || '--' }}</span>
              </div>
            </div>

            <!-- Reason and symptoms text box -->
            <div class="symptom-box">
              <span class="cell-label">Triệu chứng lâm sàng bệnh nhân tự khai báo:</span>
              <p class="symptom-text">{{ parsedPatientInfo.reason }}</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button v-if="selectedApp.status === 1" class="btn-modal-complete" @click="completeFromModal(selectedApp.id)">
            <i class="fas fa-check" /> Xác nhận đã khám xong
          </button>
          <button class="btn-modal-close" @click="closeDetail">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import api from '@/services/api'
  import { useAuthStore } from '@/stores/authStore'

  const authStore = useAuthStore()
  const loading = ref(false)
  const doctorData = ref<any>(null)
  const selectedApp = ref<any>(null)

  async function fetchData () {
    loading.value = true
    try {
      const res = await api.get('/Appointments/doctor-today')
      doctorData.value = res.data
    } catch (error) {
      console.error('Lỗi tải lịch hẹn:', error)
    } finally {
      loading.value = false
    }
  }

  async function completeAppointment (id: string) {
    if (!confirm('Xác nhận hoàn tất quá trình khám bệnh cho bệnh nhân này?')) return
    try {
      await api.put(`/Appointments/${id}/cancel`) // sets status = 2 (completed for Doctor frontend layout)
      alert('Đã cập nhật trạng thái đã khám thành công.')
      await fetchData()
    } catch (e) {
      alert('Lỗi khi hoàn tất khám bệnh.')
    }
  }

  async function completeFromModal (id: string) {
    await completeAppointment(id)
    closeDetail()
  }

  function formatDate (d: string | Date) {
    const dateObj = typeof d === 'string' ? new Date(d) : d
    return dateObj.toLocaleDateString('vi-VN')
  }

  function formatDateFull (iso: string) {
    if (!iso) return ''
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  const formatTime = (t: string) => t?.slice(0, 5) || '--:--'
  
  function getStatusText (s: number) {
    const map: Record<number, string> = { 0: 'Chờ duyệt', 1: 'Chờ khám', 2: 'Đã khám' }
    return map[s] || 'Đã hủy'
  }
  
  function getStatusClass (s: number) {
    const map: Record<number, string> = { 0: 'badge--pending', 1: 'badge--confirmed', 2: 'badge--completed' }
    return map[s] || 'badge--cancelled'
  }

  // Dynamic parser for complex reason string
  const parsedPatientInfo = computed(() => {
    if (!selectedApp.value || !selectedApp.value.reason) {
      return { reason: 'Khám chuyên khoa định kỳ', fullName: '', dob: '', gender: '', phone: '', address: '' }
    }

    const rawReason = selectedApp.value.reason
    const info = {
      reason: rawReason,
      fullName: '',
      dob: '',
      gender: '',
      phone: '',
      address: ''
    }

    if (rawReason.includes('[KHÁM CHUYÊN KHOA]')) {
      const lines = rawReason.split('\n')
      lines.forEach(line => {
        if (line.includes('- Lý do khám:')) info.reason = line.replace('- Lý do khám:', '').trim()
        if (line.includes('- Bệnh nhân:')) info.fullName = line.replace('- Bệnh nhân:', '').trim()
        if (line.includes('- Ngày sinh:')) info.dob = line.replace('- Ngày sinh:', '').trim()
        if (line.includes('- Giới tính:')) info.gender = line.replace('- Giới tính:', '').trim()
        if (line.includes('- SĐT liên hệ:')) info.phone = line.replace('- SĐT liên hệ:', '').trim()
        if (line.includes('- Địa chỉ thường trú:')) info.address = line.replace('- Địa chỉ thường trú:', '').trim()
      })
    }

    return info
  })

  function viewDetail (app: any) {
    selectedApp.value = app
  }

  function closeDetail () {
    selectedApp.value = null
  }

  onMounted(() => {
    fetchData()
  })
</script>

<style scoped>
@import '@/styles/dashboard.css';

.doctor-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 0;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.page-context {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  text-align: left;
}

.page-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
  text-align: left;
}

.page-container {
  padding: 2rem;
}

.queue-number-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #eff6ff;
  font-weight: 800;
  font-size: 0.9rem;
  color: #0047AB;
}

.loading-state {
  text-align: center;
  padding: 4rem;
  color: #64748b;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #64748b;
}

.empty-icon {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

/* Action button row */
.action-cell-row {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-table-action {
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn-detail {
  background: white;
  border-color: #cbd5e1;
  color: #475569;
}

.btn-detail:hover {
  border-color: #0f172a;
  color: #0f172a;
}

.btn-complete {
  background: #f0fdf4;
  border-color: #dcfce7;
  color: #15803d;
}

.btn-complete:hover {
  background: #dcfce7;
}

/* HIGH FIDELITY MEDICAL DETAIL POPUP (MODAL) */
.detail-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-sizing: border-box;
}

.detail-modal-card {
  background: white;
  width: 580px;
  max-width: 100%;
  border-radius: 16px;
  border: 1.5px solid #0f172a;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1.5px solid #e2e8f0;
}

.modal-header__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.ref-code-lg {
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 800;
  color: #64748b;
}

.modal-header__title h3 {
  font-size: 1.15rem;
  font-weight: 850;
  color: #0f172a;
  margin: 0;
}

.modal-close-btn {
  font-size: 1.75rem;
  font-weight: 500;
  color: #94a3b8;
  background: none;
  border: none;
  cursor: pointer;
}

.modal-close-btn:hover {
  color: #0f172a;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.modal-status-banner {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid transparent;
  text-align: left;
}

.modal-status-banner.badge--pending { background: #fff7ed; border-color: #ffedd5; color: #c2410c; }
.modal-status-banner.badge--confirmed { background: #f0fdf4; border-color: #dcfce7; color: #15803d; }
.modal-status-banner.badge--completed { background: #eff6ff; border-color: #dbeafe; color: #1d4ed8; }
.modal-status-banner.badge--cancelled { background: #fef2f2; border-color: #fee2e2; color: #b91c1c; }

.clinical-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
}

.section-heading {
  font-size: 0.9rem;
  font-weight: 800;
  color: #0f172a;
  border-bottom: 1.5px solid #f1f5f9;
  padding-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
}

.clinical-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.detail-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.detail-cell.full-width {
  grid-column: span 2;
}

.cell-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.cell-value {
  font-size: 0.88rem;
  color: #0f172a;
}

.highlight-value {
  color: #0047AB;
  font-weight: 700;
}

.symptom-box {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.symptom-text {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #334155;
  line-height: 1.45;
  margin: 0;
  white-space: pre-wrap;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: #f8fafc;
  border-top: 1.5px solid #e2e8f0;
}

.btn-modal-close {
  background: #0f172a;
  color: white;
  border: none;
  padding: 0.65rem 1.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.15s;
  margin-left: auto;
}

.btn-modal-close:hover {
  background: #1e293b;
}

.btn-modal-complete {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn-modal-complete:hover {
  background: #059669;
}
</style>
