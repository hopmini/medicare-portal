<template>
  <div class="receptionist-layout">
    <!-- SIDEBAR -->
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
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'dashboard' }" @click="activeTab = 'dashboard'">
          <span>📊</span>
          <span>Dashboard tiếp tân</span>
        </div>

        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'appointments' }" @click="activeTab = 'appointments'">
          <span>📅</span>
          <span>Danh sách lịch hẹn</span>
        </div>
      </nav>

      <div class="sidebar__footer">
        <div class="nav-item logout-btn" @click="authStore.logout()">
          <span>🚪</span>
          <span>Đăng xuất</span>
        </div>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <!-- TOP BAR -->
      <header class="top-bar">
        <div class="search-box">
          <svg
            fill="none"
            height="18"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>

          <input v-model="searchQuery" placeholder="Tìm kiếm bệnh nhân theo tên..." type="text">
        </div>

        <div class="user-profile">
          <div class="user-info" style="text-align: right;">
            <p style="font-weight: 700; font-size: 0.9rem; margin: 0;">{{ authStore.user?.value?.fullName || 'Tiếp Tân' }}</p>
            <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Quản trị Tiếp tân</p>
          </div>

          <div class="user-avatar">{{ (authStore.user?.value?.username || authStore.user?.value?.fullName || 'AD').substring(0, 2).toUpperCase() }}</div>
        </div>
      </header>

      <!-- PAGE CONTAINER -->
      <div class="page-container">
        <div class="page-header" style="text-align: left;">
          <h1 class="page-title">Cổng Tiếp Tân</h1>
          <p class="page-subtitle">Chào buổi sáng! Hệ thống đã sẵn sàng xử lý dữ liệu thực.</p>
        </div>

        <!-- STATS GRID -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-card__label">Tổng lịch hẹn</span>
            <span class="stat-card__value">{{ stats.total }}</span>
            <span class="stat-card__trend trend--up">Cập nhật thời gian thực</span>
          </div>

          <div class="stat-card">
            <span class="stat-card__label">Chờ duyệt</span>
            <span class="stat-card__value" style="color: #c2410c;">{{ stats.pending }}</span>
            <span class="stat-card__trend">Cần xử lý ngay</span>
          </div>

          <div class="stat-card">
            <span class="stat-card__label">Đã xác nhận</span>
            <span class="stat-card__value" style="color: #047857;">{{ stats.confirmed }}</span>
            <span class="stat-card__trend trend--up">Lịch hẹn hợp lệ</span>
          </div>

          <div class="stat-card">
            <span class="stat-card__label">Vai trò hiện tại</span>
            <span class="stat-card__value" style="font-size: 1.25rem; font-weight: 800; color: #0047AB;">{{ authStore.user?.value?.role }}</span>
            <span class="stat-card__trend">Quyền hạn hệ thống</span>
          </div>
        </div>

        <!-- RECENT APPOINTMENTS -->
        <section class="content-section">
          <div class="section-header">
            <h2 class="section-title">{{ activeTab === 'dashboard' ? 'Danh sách chờ duyệt chuyên khoa' : 'Tất cả lịch hẹn đăng ký' }}</h2>
            <button class="btn-ghost" style="padding: 0.4rem 0.875rem; font-size: 0.85rem; border: 1.5px solid #cbd5e1; background: white; border-radius: 6px; cursor: pointer; font-weight: 700;" @click="fetchData">
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }" /> Làm mới dữ liệu
            </button>
          </div>

          <div v-if="loading" class="empty-state">Đang tải dữ liệu lịch hẹn...</div>
          <div v-else-if="filteredAppointments.length === 0" class="empty-state">Không có lịch hẹn nào phù hợp.</div>

          <table v-else class="data-table">
            <thead>
              <tr>
                <th style="width: 100px;">Mã đơn</th>
                <th>Bệnh nhân</th>
                <th>Bác sĩ chỉ định</th>
                <th>Thời gian</th>
                <th style="width: 120px; text-align: center;">Mã số / STT</th>
                <th style="width: 120px; text-align: center;">Trạng thái</th>
                <th style="width: 220px; text-align: right;">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="app in filteredAppointments" :key="app.id">
                <td>
                  <code style="font-family: monospace; background: #eff6ff; color: #0047AB; padding: 2px 6px; border-radius: 4px; font-weight: 800; font-size: 0.8rem;">#{{ String(app.id).substring(0,8).toUpperCase() }}</code>
                </td>

                <td>
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.8rem; background: #0047AB;">
                      {{ app.patientName?.charAt(0) }}
                    </div>

                    <div style="text-align: left;">
                      <p style="font-weight: 700; margin: 0; color: #0f172a;">{{ app.patientName }}</p>
                      <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Mã: {{ app.patientId || 'Khách' }}</p>
                    </div>
                  </div>
                </td>

                <td style="text-align: left; font-weight: 600; color: #0f172a;">BS. {{ app.doctorName || 'Chưa phân công' }}</td>

                <td style="text-align: left;">
                  <p style="font-weight: 700; margin: 0; color: #0f172a;">{{ formatTime(app.time) }}</p>
                  <p style="font-size: 0.75rem; color: #64748b; margin: 0;">{{ formatDate(app.date) }}</p>
                </td>

                <td style="text-align: center;">
                  <span v-if="app.queueNumber" class="stt-badge">#{{ app.queueNumber }}</span>
                  <span v-else style="color: #94a3b8; font-size: 0.85rem;">Chưa cấp</span>
                </td>

                <td style="text-align: center;">
                  <span class="badge" :class="getStatusClass(app.status)">
                    {{ getStatusText(app.status) }}
                  </span>
                </td>

                <td style="text-align: right;">
                  <div class="action-cell-row">
                    <button class="btn-table-action btn-detail" @click="viewDetail(app)">
                      <i class="fas fa-eye" /> Chi tiết
                    </button>
                    <button v-if="app.status === 0" class="btn-table-action btn-approve" @click="approve(app.id)">
                      <i class="fas fa-check" /> Duyệt
                    </button>
                    <button v-if="app.status === 0 || app.status === 1" class="btn-table-action btn-cancel" @click="cancel(app.id)">
                      <i class="fas fa-times" /> Hủy
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </main>

    <!-- CLINICAL DETAILS MODAL (POPUP ON REQUEST) -->
    <div v-if="selectedApp" class="detail-modal-overlay" @click.self="closeDetail">
      <div class="detail-modal-card animate-scale-up">
        <div class="modal-header">
          <div class="modal-header__title">
            <span class="ref-code-lg">#{{ String(selectedApp.id).toUpperCase() }}</span>
            <h3>Chi tiết Lịch hẹn Y khoa Bệnh nhân</h3>
          </div>
          <button class="modal-close-btn" @click="closeDetail">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Status Banner -->
          <div class="modal-status-banner" :class="getStatusClass(selectedApp.status)">
            <i class="fas fa-info-circle" /> Trạng thái duyệt hồ sơ: <strong>{{ getStatusText(selectedApp.status) }}</strong>
          </div>

          <!-- Section: Patient profile (parsed dynamically from booking reason note) -->
          <div class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-user-circle" /> Hồ sơ Hành chính Bệnh nhân</h4>
            
            <div class="clinical-details-grid">
              <div class="detail-cell">
                <span class="cell-label">Họ và tên bệnh nhân:</span>
                <span class="cell-value font-semibold">{{ parsedPatientInfo.fullName || selectedApp.patientName }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Số điện thoại liên lạc:</span>
                <span class="cell-value font-medium">{{ parsedPatientInfo.phone || 'Chưa cung cấp' }}</span>
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
                <span class="cell-label">Địa chỉ thường trú đăng ký:</span>
                <span class="cell-value">{{ parsedPatientInfo.address || 'Chưa cung cấp' }}</span>
              </div>
            </div>
          </div>

          <!-- Section: Schedule allocation -->
          <div class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-notes-medical" /> Thông tin Chỉ định khám & Phân giờ</h4>
            
            <div class="clinical-details-grid">
              <div class="detail-cell">
                <span class="cell-label">Chuyên khoa khám:</span>
                <span class="cell-value font-bold text-dark">{{ selectedApp.serviceName || 'Khám tổng quát' }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Bác sĩ phụ trách:</span>
                <span class="cell-value font-bold text-blue">BS. {{ selectedApp.doctorName || 'Chưa chỉ định' }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Ngày đăng ký hẹn:</span>
                <span class="cell-value">{{ formatDate(selectedApp.date) }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Khung giờ:</span>
                <span class="cell-value highlight-value">{{ formatTime(selectedApp.time) }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Thời lượng khám dự kiến:</span>
                <span class="cell-value text-warning font-bold">{{ selectedApp.examinationDuration || 30 }} phút</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Số thứ tự xếp hàng (STT):</span>
                <span class="cell-value text-success font-bold">{{ selectedApp.queueNumber ? '#' + selectedApp.queueNumber : 'Chưa cấp' }}</span>
              </div>
            </div>

            <!-- Symptoms box -->
            <div class="symptom-box">
              <span class="cell-label">Lý do & Triệu chứng bệnh khai báo:</span>
              <p class="symptom-text">{{ parsedPatientInfo.reason }}</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button v-if="selectedApp.status === 0" class="btn-modal-approve" @click="approveFromModal(selectedApp.id)">
            <i class="fas fa-check" /> Phê duyệt & Cấp STT
          </button>
          <button v-if="selectedApp.status === 0 || selectedApp.status === 1" class="btn-modal-cancel" @click="cancelFromModal(selectedApp.id)">
            <i class="fas fa-times" /> Hủy lịch hẹn
          </button>
          <button class="btn-modal-close" @click="closeDetail">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { appointmentService } from '@/services/appointmentService'
  import { useAuthStore } from '@/stores/authStore'

  const authStore = useAuthStore()
  const activeTab = ref('dashboard')
  const searchQuery = ref('')
  const loading = ref(false)
  const selectedApp = ref<any>(null)

  const appointments = ref<any[]>([])

  const stats = computed(() => {
    return {
      total: appointments.value.length,
      pending: appointments.value.filter(a => a.status === 0).length,
      confirmed: appointments.value.filter(a => a.status === 1).length,
    }
  })

  const filteredAppointments = computed(() => {
    let list = [...appointments.value]
    
    // Filter by tab
    if (activeTab.value === 'dashboard') {
      list = list.filter(a => a.status === 0)
    }

    // Filter by search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      list = list.filter(a => a.patientName?.toLowerCase().includes(q))
    }

    return list.sort((a, b) => {
      if (a.status === 0 && b.status !== 0) return -1
      if (a.status !== 0 && b.status === 0) return 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  })

  async function fetchData () {
    loading.value = true
    try {
      appointments.value = await appointmentService.getAllAppointments()
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    } finally {
      loading.value = false
    }
  }

  async function approve (id: string) {
    if (!confirm('Xác nhận duyệt lịch hẹn và cấp số thứ tự khám cho bệnh nhân?')) return
    try {
      await appointmentService.approveAppointment(id)
      await fetchData()
      alert('Đã duyệt đơn và cấp số thứ tự thành công!')
    } catch (error) {
      alert('Lỗi khi duyệt đơn: ' + error)
    }
  }

  async function cancel (id: string) {
    if (!confirm('Bạn có chắc chắn muốn hủy lịch hẹn khám này?')) return
    try {
      await appointmentService.cancelAppointment(id)
      await fetchData()
      alert('Đã hủy lịch hẹn khám thành công.')
    } catch {
      alert('Lỗi khi hủy đơn.')
    }
  }

  async function approveFromModal (id: string) {
    await approve(id)
    closeDetail()
  }

  async function cancelFromModal (id: string) {
    await cancel(id)
    closeDetail()
  }

  function getStatusText (status: number) {
    switch (status) {
      case 0: return 'Chờ duyệt'
      case 1: return 'Đã duyệt'
      case 2: return 'Đã hủy'
      default: return 'Không xác định'
    }
  }

  function getStatusClass (status: number) {
    switch (status) {
      case 0: return 'badge--pending'
      case 1: return 'badge--confirmed'
      case 2: return 'badge--cancelled'
      default: return ''
    }
  }

  function formatDate (dateStr: string) {
    return new Date(dateStr).toLocaleDateString('vi-VN')
  }

  function formatDateFull (iso: string) {
    if (!iso) return ''
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  function formatTime (timeStr: string) {
    return timeStr?.slice(0, 5) || '--:--'
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
      lines.forEach((line: string) => {
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
@import '@/styles/receptionist.css';

/* Snug Table actions */
.action-cell-row {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.stt-badge {
  font-family: monospace;
  font-weight: 800;
  color: #0047AB;
  background: #eff6ff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
}

.btn-table-action {
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 750;
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

.btn-approve {
  background: #f0fdf4;
  border-color: #dcfce7;
  color: #15803d;
}

.btn-approve:hover {
  background: #dcfce7;
}

.btn-cancel {
  background: #fef2f2;
  border-color: #fee2e2;
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
  justify-content: flex-end;
  gap: 10px;
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
}

.btn-modal-close:hover {
  background: #1e293b;
}

.btn-modal-approve {
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

.btn-modal-approve:hover {
  background: #059669;
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
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn-modal-cancel:hover {
  background: #fee2e2;
}
</style>
