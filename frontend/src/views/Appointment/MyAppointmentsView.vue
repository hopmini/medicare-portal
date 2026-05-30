<template>
  <div class="public-page">
    <Navbar />

    <div class="page-header">
      <div class="container">
        <h1>Lịch sử đặt hẹn</h1>
        <p>Theo dõi và quản lý các lịch hẹn khám bệnh y khoa của bạn.</p>
      </div>
    </div>

    <div class="container" style="padding-bottom: 4rem; max-width: 1100px; margin-top: 1.5rem;">
      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin fa-2x text-blue" style="margin-bottom: 1rem;" />
        <p>Đang tải danh sách lịch đặt hẹn...</p>
      </div>

      <div v-else-if="appointments.length === 0" class="empty-state">
        <div class="empty-icon"><i class="fas fa-calendar-times" /></div>
        <h3>Chưa có lịch hẹn nào</h3>
        <p>Quý khách chưa đăng ký lịch khám bệnh nào tại hệ thống Medicare.</p>
        <router-link class="btn-primary-action" to="/patient">Đặt lịch khám ngay</router-link>
      </div>

      <div v-else class="table-container animate-fade-in">
        <table class="appointments-table">
          <thead>
            <tr>
              <th style="width: 110px;">Mã đơn</th>
              <th>Chuyên khoa khám</th>
              <th>Bác sĩ phụ trách</th>
              <th>Thời gian</th>
              <th style="width: 140px; text-align: center;">Trạng thái</th>
              <th style="width: 180px; text-align: right;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in appointments" :key="app.id">
              <td>
                <span class="ref-code">#{{ app.id.substring(0, 8).toUpperCase() }}</span>
              </td>
              <td class="font-bold text-dark">{{ app.serviceName }}</td>
              <td>
                <div class="doc-info-cell">
                  <i class="fas fa-user-md text-blue" style="font-size: 0.85rem;" />
                  <span>BS. {{ app.doctorName }}</span>
                </div>
              </td>
              <td class="font-medium text-slate">
                <div class="time-cell">
                  <span>{{ formatDate(app.date) }}</span>
                  <span class="time-badge">{{ formatTime(app.time) }}</span>
                </div>
              </td>
              <td style="text-align: center;">
                <span class="status-pill" :class="getStatusClass(app.status)">
                  {{ getStatusText(app.status) }}
                </span>
              </td>
              <td style="text-align: right;">
                <div class="action-cell">
                  <button class="btn-table-action btn-detail" @click="viewDetail(app)">
                    <i class="fas fa-eye" /> Chi tiết
                  </button>
                  <button v-if="app.status === 0 || app.status === 1" class="btn-table-action btn-cancel" @click="cancelAppointment(app.id)">
                    <i class="fas fa-times" /> Hủy
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CLINICAL DETAILS MODAL (POPUP ON REQUEST) -->
    <div v-if="selectedApp" class="detail-modal-overlay" @click.self="closeDetail">
      <div class="detail-modal-card animate-scale-up">
        <div class="modal-header">
          <div class="modal-header__title">
            <span class="ref-code-lg">#{{ selectedApp.id.toUpperCase() }}</span>
            <h3>Chi tiết Lịch hẹn Y khoa</h3>
          </div>
          <button class="modal-close-btn" @click="closeDetail">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Status block -->
          <div class="modal-status-banner" :class="getStatusClass(selectedApp.status)">
            <i class="fas fa-info-circle" /> Trạng thái hồ sơ: <strong>{{ getStatusText(selectedApp.status) }}</strong>
          </div>

          <!-- Section: Clinical case details -->
          <div class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-file-invoice" /> Thông tin đăng ký khám</h4>
            
            <div class="clinical-details-grid">
              <div class="detail-cell">
                <span class="cell-label">Chuyên khoa / Dịch vụ:</span>
                <span class="cell-value font-bold text-dark">{{ selectedApp.serviceName }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Bác sĩ khám phụ trách:</span>
                <span class="cell-value font-bold text-blue">BS. {{ selectedApp.doctorName }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Ngày khám y khoa:</span>
                <span class="cell-value">{{ formatDate(selectedApp.date) }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Giờ hẹn cụ thể:</span>
                <span class="cell-value highlight-value">{{ formatTime(selectedApp.time) }}</span>
              </div>
              <div v-if="selectedApp.queueNumber" class="detail-cell">
                <span class="cell-label">Số thứ tự tại quầy:</span>
                <span class="cell-value text-success font-bold">Số {{ selectedApp.queueNumber }}</span>
              </div>
            </div>
          </div>

          <!-- Section: Patient clinical information (Parsed dynamically) -->
          <div class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-user-injured" /> Thông tin lâm sàng Bệnh nhân</h4>
            
            <div class="clinical-details-grid">
              <div class="detail-cell">
                <span class="cell-label">Họ và tên bệnh nhân:</span>
                <span class="cell-value font-semibold">{{ parsedPatientInfo.fullName || authStore.user.value?.fullName }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Số điện thoại liên hệ:</span>
                <span class="cell-value">{{ parsedPatientInfo.phone || authStore.user.value?.phoneNumber || 'Chưa cung cấp' }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Địa chỉ Email nhận kết quả:</span>
                <span class="cell-value">{{ authStore.user.value?.email }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Ngày sinh:</span>
                <span class="cell-value">{{ parsedPatientInfo.dob ? formatDateFull(parsedPatientInfo.dob) : 'Chưa cung cấp' }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Giới tính sinh học:</span>
                <span class="cell-value">{{ parsedPatientInfo.gender || 'Chưa cung cấp' }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Địa chỉ thường trú:</span>
                <span class="cell-value">{{ parsedPatientInfo.address || 'Chưa cung cấp' }}</span>
              </div>
            </div>

            <!-- Reason and symptoms text box -->
            <div class="symptom-box">
              <span class="cell-label">Triệu chứng & Lý do đăng ký khám bệnh:</span>
              <p class="symptom-text">{{ parsedPatientInfo.reason }}</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button v-if="selectedApp.status === 0 || selectedApp.status === 1" class="btn-modal-cancel" @click="cancelFromModal(selectedApp.id)">
            Hủy lịch khám này
          </button>
          <button class="btn-modal-close" @click="closeDetail">Đóng thông tin</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import Navbar from '@/components/Navbar.vue'
  import api from '@/services/api'
  import { useAuthStore } from '@/stores/authStore'

  const router = useRouter()
  const authStore = useAuthStore()
  const loading = ref(false)
  const appointments = ref([])
  const selectedApp = ref(null)

  async function fetchAppointments () {
    loading.value = true
    try {
      const res = await api.get('/Appointments/my')
      appointments.value = res.data
    } catch (error) {
      console.error('Lỗi tải lịch hẹn:', error)
    } finally {
      loading.value = false
    }
  }

  async function cancelAppointment (id) {
    if (!confirm('Bạn có chắc muốn hủy lịch hẹn khám này?')) return
    try {
      await api.put(`/Appointments/${id}/cancel`)
      alert('Đã hủy lịch khám bệnh thành công.')
      await fetchAppointments()
    } catch (e) {
      alert('Lỗi khi hủy lịch hẹn.')
    }
  }

  async function cancelFromModal (id) {
    await cancelAppointment(id)
    closeDetail()
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN')
  const formatTime = (t) => t?.slice(0, 5) || '--:--'

  function formatDateFull (iso) {
    if (!iso) return ''
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }
  
  function getStatusText (s) {
    const map = { 0: 'Chờ duyệt', 1: 'Đã duyệt', 2: 'Đã khám' }
    return map[s] || 'Đã hủy'
  }
  
  function getStatusClass (s) {
    const map = { 0: 'status--pending', 1: 'status--confirmed', 2: 'status--completed' }
    return map[s] || 'status--cancelled'
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

  function viewDetail (app) {
    selectedApp.value = app
  }

  function closeDetail () {
    selectedApp.value = null
  }

  onMounted(() => {
    if (!authStore.isAuthenticated.value) {
      router.push('/login')
      return
    }
    fetchAppointments()
  })
</script>

<style scoped>
@import '@/styles/public-pages.css';

/* Premium Clinical Styling for History Table & Popups */
.table-container {
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-sizing: border-box;
}

.appointments-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.appointments-table th {
  background: #f8fafc;
  padding: 1rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 800;
  color: #475569;
  border-bottom: 1.5px solid #e2e8f0;
}

.appointments-table td {
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
  vertical-align: middle;
}

.appointments-table tr:last-child td {
  border-bottom: none;
}

.appointments-table tr:hover td {
  background: #f8fafc;
}

/* Cell Helpers */
.ref-code {
  font-family: monospace;
  font-weight: 800;
  color: #0047AB;
  background: #eff6ff;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
}

.doc-info-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #0f172a;
}

.time-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-badge {
  font-size: 0.75rem;
  font-weight: 800;
  color: #0047AB;
  width: fit-content;
}

/* Flat Clinical Status Badges */
.status-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 800;
  border: 1.5px solid transparent;
}

.status--pending {
  background: #fff7ed;
  color: #c2410c;
  border-color: #ffedd5;
}

.status--confirmed {
  background: #f0fdf4;
  color: #15803d;
  border-color: #dcfce7;
}

.status--completed {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #dbeafe;
}

.status--cancelled {
  background: #fef2f2;
  color: #b91c1c;
  border-color: #fee2e2;
}

/* Action buttons in Table */
.action-cell {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-table-action {
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
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

.btn-cancel {
  background: #fef2f2;
  color: #dc2626;
}

.btn-cancel:hover {
  background: #fee2e2;
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
}

.modal-status-banner.status--pending { background: #fff7ed; border-color: #ffedd5; color: #c2410c; }
.modal-status-banner.status--confirmed { background: #f0fdf4; border-color: #dcfce7; color: #15803d; }
.modal-status-banner.status--completed { background: #eff6ff; border-color: #dbeafe; color: #1d4ed8; }
.modal-status-banner.status--cancelled { background: #fef2f2; border-color: #fee2e2; color: #b91c1c; }

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

@media (max-width: 500px) {
  .clinical-details-grid {
    grid-template-columns: 1fr;
  }
}

.detail-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
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

.btn-modal-cancel {
  background: #fef2f2;
  color: #dc2626;
  border: 1.5px solid #fee2e2;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.15s;
}

.btn-modal-cancel:hover {
  background: #fee2e2;
}

.empty-state {
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.btn-primary-action {
  display: inline-block;
  margin-top: 1.25rem;
  background: #0047AB;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.9rem;
  transition: 0.15s;
}

.btn-primary-action:hover {
  background: #003380;
}

/* Snug Page Header Optimization */
.page-header {
  padding: 2rem 0 !important;
  margin-bottom: 1rem !important;
}

.page-header h1 {
  font-size: 2.25rem !important;
  margin-bottom: 0.5rem !important;
}
</style>
