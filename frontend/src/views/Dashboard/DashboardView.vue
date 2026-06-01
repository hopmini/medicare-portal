<template>
  <div class="dashboard-layout">
    <!-- SIDEBAR (Rich Navigation covering all 3 Services) -->
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
        <!-- Section 1: Strategic Overview -->
        <div class="sidebar__divider">QUẢN TRỊ CHIẾN LƯỢC</div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'overview' }" @click="activeTab = 'overview'">
          <span class="nav-icon"><i class="fas fa-cubes" /></span>
          <span>Tổng Quan Liên Thông</span>
        </div>

        <div class="sidebar__divider">1. PHÂN HỆ LỊCH KHÁM</div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'appointments' }" @click="activeTab = 'appointments'">
          <span class="nav-icon"><i class="fas fa-calendar-check text-blue" /></span>
          <span>Lịch hẹn chờ duyệt</span>
        </div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'schedule' }" @click="activeTab = 'schedule'">
          <span class="nav-icon"><i class="fas fa-clock text-blue" /></span>
          <span>Quản lý Lịch trực</span>
        </div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'doctors' }" @click="activeTab = 'doctors'">
          <span class="nav-icon"><i class="fas fa-user-md text-blue" /></span>
          <span>Danh mục Bác sĩ</span>
        </div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'services' }" @click="activeTab = 'services'">
          <span class="nav-icon"><i class="fas fa-concierge-bell text-blue" /></span>
          <span>Dịch vụ y khoa</span>
        </div>



        <!-- Section 5: Return to Portal -->
        <div class="sidebar__divider">LIÊN THÔNG HỆ THỐNG</div>
        <div class="nav-item" @click="$router.push('/')">
          <span class="nav-icon"><i class="fas fa-home" /></span>
          <span>Về Cổng Trung Tâm</span>
        </div>
      </nav>

      <div class="sidebar__footer">
        <p style="font-size: 0.75rem; color: #94a3b8; text-align: center; font-weight: 700;">Medicare Cockpit v2.1</p>
      </div>
    </aside>

    <!-- MAIN CONTENT VIEW AREA -->
    <main class="main-content">
      <!-- HEADER -->
      <header class="top-bar">
        <div class="page-context">
          <h1 class="page-title">{{ getPageTitle() }}</h1>
        </div>
        <div class="top-bar-actions">
          <div class="search-box">
            <i class="fas fa-search" style="color: #94a3b8;" />
            <input placeholder="Tìm kiếm nhanh..." type="text" v-model="quickSearchQuery" />
          </div>

          <!-- COMPACT USER PILL IN TOP-RIGHT OF TOP-BAR -->
          <div v-if="authStore.user" class="top-user-pill shadow-light">
            <div class="top-user-main-info" @click="$router.push('/profile')" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
              <div class="avatar-small-top">{{ (authStore.user.username || authStore.user.fullName || 'AD').substring(0, 2).toUpperCase() }}</div>
              <div class="top-user-info">
                <p class="top-user-name">{{ authStore.user.fullName }}</p>
                <p class="top-user-role">Hệ thống Admin</p>
              </div>
            </div>
            <button class="top-user-logout" title="Đăng xuất" @click="authStore.logout()">
              <i class="fas fa-sign-out-alt" />
            </button>
          </div>
        </div>
      </header>

      <!-- PAGE CONTAINER -->
      <div class="page-container">

        <!-- TAB 1: COCKPIT OVERVIEW -->
        <div v-if="activeTab === 'overview'" class="tab-content">
          <div class="section-header-cockpit">
            <h2 class="section-title-clinical">Phân tích hệ thống real-time phân hệ lịch khám</h2>
            <button class="btn-primary-cockpit" :disabled="loading" @click="fetchAllData">
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }" /> Đồng bộ số liệu liên thông
            </button>
          </div>

          <!-- KPI Cards (Appointment Service - ACTIVE) -->
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-card__label">Tổng Lượt Hẹn Khám</span>
              <h3 class="stat-card__value">{{ stats.totalAppointments }}</h3>
              <p class="stat-card__trend text-blue"><i class="fas fa-calendar-check"></i> Cổng Lịch Hẹn</p>
              <div class="stat-card__icon bg-blue-light"><i class="fas fa-plus-square text-blue" /></div>
            </div>

            <div class="stat-card">
              <span class="stat-card__label">Đơn Chờ Duyệt</span>
              <h3 class="stat-card__value" style="color: #ea580c;">{{ stats.pendingAppointments }}</h3>
              <p class="stat-card__trend text-orange"><i class="fas fa-hourglass-half"></i> Tiếp nhận lâm sàng</p>
              <div class="stat-card__icon bg-orange-light"><i class="fas fa-user-clock text-orange" /></div>
            </div>


          </div>

          <!-- Unified Charts & Feeds -->
          <div class="dashboard-main-grid">
            <div class="chart-container">
              <div class="chart-header">
                <h3>Xu hướng Lượt Khám & Hoạt động (7 ngày qua)</h3>
                <span class="dot trend-dot" /> <small>Lượt hoạt động</small>
              </div>
              <div class="canvas-wrapper">
                <canvas id="trendChart" />
              </div>
            </div>

            <!-- Activity Logs (Appointment Service) -->
            <div class="top-services-panel">
              <div class="panel-header">
                <h3>Hoạt Động Lâm Sàng Gần Đây</h3>
              </div>
              <div class="activity-scroller">
                <div class="activity-feed-list">
                  <div v-for="log in unifiedActivities" :key="log.time" class="activity-feed-item">
                    <div class="activity-icon-circle" :class="log.colorClass">
                      <i :class="log.icon" />
                    </div>
                    <div class="activity-details">
                      <p class="activity-text" v-html="log.text"></p>
                      <span class="activity-time-stamp">{{ log.time }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- #-------------------------------------------------- -->
        <!-- # Appointment Service (Phân hệ lịch khám - ACTIVE) -->
        <!-- #-------------------------------------------------- -->

        <!-- TAB 2: APPOINTMENTS LIST (Receptions) -->
        <div v-if="activeTab === 'appointments'" class="tab-content">
          <div class="filter-bar">
            <div class="filter-group">
              <label>Lọc Trạng Thái:</label>
              <select v-model="filterStatus" class="filter-select">
                <option value="all">Tất cả trạng thái</option>
                <option value="0">Chờ duyệt</option>
                <option value="1">Đã duyệt</option>
                <option value="2">Đã khám</option>
                <option value="3">Đã hủy</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Tìm kiếm:</label>
              <input placeholder="Họ tên bệnh nhân..." type="text" v-model="searchPatientQuery" class="filter-input" />
            </div>
            <div class="filter-stats">
              Tìm thấy: <b>{{ filteredAppointments.length }}</b> lịch hẹn
            </div>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Bệnh nhân</th>
                  <th>Bác sĩ khám</th>
                  <th>Thời gian</th>
                  <th>Dịch vụ</th>
                  <th>STT</th>
                  <th>Trạng thái</th>
                  <th style="text-align: center;">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredAppointments.length === 0">
                  <td colspan="8" style="text-align: center; padding: 3rem; color: #64748b;">
                    Không tìm thấy lịch hẹn nào.
                  </td>
                </tr>
                <tr v-for="app in filteredAppointments" :key="app.id">
                  <td><code>#{{ app.id.substring(0, 8).toUpperCase() }}</code></td>
                  <td>
                    <div class="user-cell">
                      <div class="avatar-cell">{{ app.patientName?.charAt(0) }}</div>
                      <div><p style="font-weight: 700;">{{ app.patientName }}</p></div>
                    </div>
                  </td>
                  <td><span class="doctor-name">BS. {{ app.doctorName }}</span></td>
                  <td>
                    <p style="font-weight: 600;">{{ formatTime(app.time) }}</p>
                    <p style="font-size: 0.75rem; color: #64748b;">{{ formatDate(app.date) }}</p>
                  </td>
                  <td><span class="badge badge--service">{{ app.serviceName }}</span></td>
                  <td>
                    <span v-if="app.queueNumber" class="queue-number">#{{ app.queueNumber }}</span>
                    <span v-else style="color: #94a3b8; font-style: italic;">Chưa cấp</span>
                  </td>
                  <td><span class="badge" :class="getStatusClass(app.status)">{{ getStatusText(app.status) }}</span></td>
                  <td>
                    <div class="action-btns" style="justify-content: center;">
                      <button v-if="app.status === 0" class="btn-icon btn-icon--check" @click="approve(app.id)" title="Duyệt đơn">
                        <i class="fas fa-check" />
                      </button>
                      <button v-if="app.status === 0" class="btn-icon btn-icon--close" @click="cancel(app.id)" title="Hủy đơn">
                        <i class="fas fa-times" />
                      </button>
                      <span v-else style="color: #94a3b8; font-size: 0.8rem;">Đã xử lý</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 3: SHIFT SCHEDULES -->
        <div v-if="activeTab === 'schedule'" class="tab-content">
          <div class="section-header-cockpit">
            <div class="schedule-selector-bar">
              <div class="filter-group">
                <label>Bác sĩ lâm sàng:</label>
                <select v-model="selectedScheduleDoc" class="filter-select" @change="loadActiveSlots">
                  <option value="">-- Chọn bác sĩ để xem lịch --</option>
                  <option v-for="doc in doctorsList" :key="doc.id" :value="doc.id">
                    {{ doc.fullName }} - {{ doc.specialty }}
                  </option>
                </select>
              </div>
              <div class="filter-group">
                <label>Ngày trực:</label>
                <input v-model="selectedScheduleDate" type="date" class="filter-input" @change="loadActiveSlots" />
              </div>
            </div>
            <button class="btn-primary-cockpit" @click="showSlotModal = true">
              <i class="fas fa-magic" /> Khởi tạo lịch trực
            </button>
          </div>

          <div class="table-container shadow-light" style="padding: 2rem; background: white; border-radius: 20px; border: 1.5px solid #e2e8f0;">
            <div v-if="!selectedScheduleDoc" class="empty-state-slots">
              <i class="fas fa-user-md" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;" />
              <p>Vui lòng lựa chọn Bác sĩ và Ngày trực ở trên để kiểm tra phân bổ ca trực!</p>
            </div>
            <div v-else>
              <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-calendar-day text-blue" /> 
                Chi tiết Ca khám: {{ getSelectedDocName() }} - Ngày: {{ formatDate(selectedScheduleDate) }}
              </h3>

              <div v-if="loadingSlots" style="text-align: center; padding: 3rem; color: #64748b;">
                <i class="fas fa-spinner fa-spin fa-2x text-blue" />
                <p style="margin-top: 1rem;">Đang tải danh sách ca khám...</p>
              </div>
              <div v-else-if="activeSlots.length === 0" class="empty-state-slots">
                <i class="fas fa-clock" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;" />
                <p>Ngày này bác sĩ chưa có ca khám trực nào được tạo.</p>
                <button class="btn-primary-cockpit" style="margin-top: 1rem;" @click="formSlots.doctorId = selectedScheduleDoc; formSlots.date = selectedScheduleDate; showSlotModal = true">
                  <i class="fas fa-plus" /> Khởi tạo ca trực ngay
                </button>
              </div>
              <div v-else class="slots-grid-pane">
                <div v-for="slot in activeSlots" :key="slot.id" class="slot-time-pill" :class="{ 'slot-booked': !slot.isAvailable }">
                  <div class="slot-pill-header">
                    <span class="slot-pill-time"><i class="far fa-clock" /> {{ formatTime(slot.startTime) }} - {{ formatTime(slot.endTime) }}</span>
                    <span class="slot-pill-status-badge" :class="slot.isAvailable ? 'status-free' : 'status-busy'">
                      {{ slot.isAvailable ? 'Còn trống' : 'Đã đặt' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 4: DOCTORS DIRECTORY -->
        <div v-if="activeTab === 'doctors'" class="tab-content">
          <div class="section-header-cockpit">
            <h2 class="section-title-clinical">Đội ngũ bác sĩ của Medicare ({{ doctorsList.length }} nhân sự)</h2>
            <button class="btn-primary-cockpit" @click="showDoctorModal = true">
              <i class="fas fa-user-plus" /> Thêm bác sĩ mới
            </button>
          </div>

          <div class="doctors-grid-cards">
            <div v-for="doc in doctorsList" :key="doc.id" class="doctor-premium-card shadow-light">
              <div class="doc-card-top">
                <div class="doc-avatar-large">{{ doc.fullName.charAt(4) || doc.fullName.charAt(0) }}</div>
                <div class="doc-meta-info">
                  <h3 class="doc-card-name">{{ doc.fullName }}</h3>
                  <span class="doc-card-spec">{{ doc.specialty }}</span>
                </div>
              </div>
              <div class="doc-card-body">
                <p class="doc-card-detail">Học vị lâm sàng: <b>{{ doc.degree || 'Bác sĩ' }}</b></p>
                <p class="doc-card-detail">Phí khám cơ bản: <b style="color: var(--cobalt);">{{ formatCurrency(doc.consultationFee || 150000) }}</b></p>
              </div>
              <div class="doc-card-footer">
                <button class="btn-doc-action" @click="selectedScheduleDoc = doc.id; activeTab = 'schedule'; loadActiveSlots()">
                  <i class="fas fa-calendar-alt" /> Xem lịch trực bác sĩ
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 5: SERVICES DIRECTORY -->
        <div v-if="activeTab === 'services'" class="tab-content">
          <div class="section-header-cockpit">
            <h2 class="section-title-clinical">Danh mục kỹ thuật & Dịch vụ y tế ({{ servicesList.length }} dịch vụ)</h2>
            <button class="btn-primary-cockpit" @click="showServiceModal = true">
              <i class="fas fa-plus" /> Thêm dịch vụ mới
            </button>
          </div>

          <div class="services-grid-cards">
            <div v-for="svc in servicesList" :key="svc.id" class="service-premium-card shadow-light">
              <div class="svc-card-header">
                <div class="svc-card-icon-wrapper"><i class="fas fa-stethoscope" /></div>
                <h3 class="svc-card-name">{{ svc.name }}</h3>
              </div>
              <p class="svc-card-desc">{{ svc.description }}</p>
              <div class="svc-card-footer">
                <span class="svc-card-price">{{ formatCurrency(svc.price) }}</span>
                <span class="svc-status-tag"><i class="fas fa-check-circle" /> Đang hoạt động</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- PREMIUM OVERLAY DIALOG MODALS -->
    
    <!-- 1. Slot Schedule Generation Modal -->
    <div v-if="showSlotModal" class="modal-backdrop">
      <div class="modal-card shadow-lg animate-fade-in">
        <div class="modal-header">
          <h3><i class="fas fa-magic text-blue" /> Khởi tạo ca trực</h3>
          <button class="btn-close-modal" @click="showSlotModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitGenerateSlots" class="cockpit-form">
            <div class="form-group-cockpit">
              <label>Chọn Bác Sĩ Cần Phân Lịch:</label>
              <select v-model="formSlots.doctorId" required class="cockpit-input">
                <option value="">-- Click để chọn bác sĩ --</option>
                <option v-for="doc in doctorsList" :key="doc.id" :value="doc.id">
                  {{ doc.fullName }} - Chuyên khoa: {{ doc.specialty }}
                </option>
              </select>
            </div>
            <div class="form-group-cockpit">
              <label>Ngày Làm Việc:</label>
              <input v-model="formSlots.date" required type="date" class="cockpit-input" />
            </div>
            <div class="modal-footer-btns">
              <button type="button" class="btn-cancel-modal" @click="showSlotModal = false">Hủy</button>
              <button type="submit" class="btn-primary-cockpit" :disabled="generatingSlots">
                <span v-if="generatingSlots"><i class="fas fa-spinner fa-spin" /> Đang tạo...</span>
                <span v-else><i class="fas fa-check" /> Xác nhận</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 2. Doctor Add Modal -->
    <div v-if="showDoctorModal" class="modal-backdrop">
      <div class="modal-card shadow-lg animate-fade-in">
        <div class="modal-header">
          <h3><i class="fas fa-user-md text-blue" /> Thêm bác sĩ mới</h3>
          <button class="btn-close-modal" @click="showDoctorModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitAddDoctor" class="cockpit-form">
            <div class="form-group-cockpit">
              <label>Họ và tên bác sĩ:</label>
              <input v-model="formDoctor.fullName" placeholder="Ví dụ: BS. Nguyễn Văn A" required type="text" class="cockpit-input" />
            </div>
            <div class="form-row-cockpit">
              <div class="form-group-cockpit">
                <label>Chuyên khoa:</label>
                <input v-model="formDoctor.specialty" placeholder="Ví dụ: Nội khoa tổng quát" required type="text" class="cockpit-input" />
              </div>
              <div class="form-group-cockpit">
                <label>Học vị:</label>
                <input v-model="formDoctor.degree" placeholder="Ví dụ: Thạc sĩ" required type="text" class="cockpit-input" />
              </div>
            </div>
            <div class="form-group-cockpit">
              <label>Phí khám bệnh cơ bản (VND):</label>
              <input v-model="formDoctor.consultationFee" placeholder="Ví dụ: 150000" required type="number" class="cockpit-input" />
            </div>
            <div class="modal-footer-btns">
              <button type="button" class="btn-cancel-modal" @click="showDoctorModal = false">Hủy</button>
              <button type="submit" class="btn-primary-cockpit" :disabled="submittingDoctor">
                <span v-if="submittingDoctor"><i class="fas fa-spinner fa-spin" /> Đang lưu...</span>
                <span v-else><i class="fas fa-save" /> Thêm bác sĩ</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 3. Service Add Modal -->
    <div v-if="showServiceModal" class="modal-backdrop">
      <div class="modal-card shadow-lg animate-fade-in">
        <div class="modal-header">
          <h3><i class="fas fa-concierge-bell text-blue" /> Thêm dịch vụ mới</h3>
          <button class="btn-close-modal" @click="showServiceModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitAddService" class="cockpit-form">
            <div class="form-group-cockpit">
              <label>Tên dịch vụ y khoa:</label>
              <input v-model="formService.name" placeholder="Ví dụ: Siêu Âm Đầu Dò" required type="text" class="cockpit-input" />
            </div>
            <div class="form-group-cockpit">
              <label>Mô tả dịch vụ:</label>
              <textarea v-model="formService.description" placeholder="Nhập mô tả của dịch vụ khám bệnh..." required class="cockpit-input" style="height: 80px; resize: none;"></textarea>
            </div>
            <div class="form-group-cockpit">
              <label>Đơn giá dịch vụ (VND):</label>
              <input v-model="formService.price" placeholder="Ví dụ: 250000" required type="number" class="cockpit-input" />
            </div>
            <div class="modal-footer-btns">
              <button type="button" class="btn-cancel-modal" @click="showServiceModal = false">Hủy</button>
              <button type="submit" class="btn-primary-cockpit" :disabled="submittingService">
                <span v-if="submittingService"><i class="fas fa-spinner fa-spin" /> Đang tạo...</span>
                <span v-else><i class="fas fa-plus-circle" /> Thêm dịch vụ</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>


  <!-- -------------------------------------------------------- -->
  <!-- -------------Pharmecy Billing Service------------------- -->
  <!-- -------------------------------------------------------- -->
  <!-- Viết code ở đây -->  

   
  <!-- -------------------------------------------------------- -->
  <!-- -------------Medicare Record Service-------------------- -->
  <!-- -------------------------------------------------------- -->
  <!-- Viết code ở đây --> 

</template>

<script setup>
  import { computed, nextTick, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api, { publicApi } from '@/services/api'
  import { appointmentService } from '@/services/appointmentService'
  import { useAuthStore } from '@/stores/authStore'

  const router = useRouter()
  const authStore = useAuthStore()
  const loading = ref(false)

  // Navigation control
  const activeTab = ref('overview')
  const quickSearchQuery = ref('')
  const filterStatus = ref('all')
  const searchPatientQuery = ref('')

  // Modal display toggles (Appointment Service - ACTIVE)
  const showSlotModal = ref(false)
  const showDoctorModal = ref(false)
  const showServiceModal = ref(false)

  // Doctor Schedule state
  const selectedScheduleDoc = ref('')
  const selectedScheduleDate = ref(new Date().toISOString().split('T')[0])
  const activeSlots = ref([])
  const loadingSlots = ref(false)

  // Submit states (Appointment Service - ACTIVE)
  const submittingDoctor = ref(false)
  const submittingService = ref(false)
  const generatingSlots = ref(false)

  // Data pools (Appointment Service - ACTIVE)
  const appointments = ref([])
  const doctorsList = ref([])
  const servicesList = ref([])

  // Strategic Stats (Appointment Service - ACTIVE)
  const stats = computed(() => {
    return {
      totalAppointments: appointments.value.length || 0,
      pendingAppointments: appointments.value.filter(a => a.status === 0).length || 0
    }
  })

  // Dynamic clinical activities list (Appointment Service - ACTIVE)
  const unifiedActivities = computed(() => {
    const list = []
    
    // Appointments logs
    appointments.value.slice(0, 5).forEach(a => {
      list.push({
        text: `Lịch hẹn bệnh nhân <b>${a.patientName}</b> với BS. <b>${a.doctorName}</b> được ghi nhận.`,
        time: formatDate(a.date) + ' ' + formatTime(a.time),
        icon: 'fas fa-calendar-check',
        colorClass: 'act-blue'
      })
    })


    if (list.length === 0) {
      return [
        { text: 'Hệ thống tiếp nhận lâm sàng hoạt động ổn định.', time: 'Hôm nay', icon: 'fas fa-check-circle', colorClass: 'act-blue' }
      ]
    }

    return list.sort((a, b) => b.time.localeCompare(a.time))
  })

  // Filter clinical appointments
  const filteredAppointments = computed(() => {
    let list = [...appointments.value]
    if (filterStatus.value !== 'all') {
      list = list.filter(a => a.status === parseInt(filterStatus.value))
    }
    if (searchPatientQuery.value) {
      const q = searchPatientQuery.value.toLowerCase()
      list = list.filter(a => a.patientName?.toLowerCase().includes(q))
    }
    if (quickSearchQuery.value) {
      const q = quickSearchQuery.value.toLowerCase()
      list = list.filter(a => 
        a.patientName?.toLowerCase().includes(q) || 
        a.doctorName?.toLowerCase().includes(q) ||
        a.serviceName?.toLowerCase().includes(q)
      )
    }
    return list.sort((a, b) => {
      if (a.status === 0 && b.status !== 0) return -1
      if (a.status !== 0 && b.status === 0) return 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  })

  // Forms bounds (Appointment Service - ACTIVE)
  const formDoctor = ref({ fullName: '', specialty: '', degree: '', consultationFee: null })
  const formService = ref({ name: '', description: '', price: null })
  const formSlots = ref({ doctorId: '', date: '' })

  // Dynamic schedules slots loader
  async function loadActiveSlots () {
    if (!selectedScheduleDoc.value) {
      activeSlots.value = []
      return
    }
    loadingSlots.value = true
    try {
      const res = await publicApi.get('/Doctors/' + selectedScheduleDoc.value + '/slots?date=' + selectedScheduleDate.value)
      activeSlots.value = res.data
    } catch (e) {
      console.error('Failed to load slots y khoa:', e)
    } finally {
      loadingSlots.value = false
    }
  }

  function getSelectedDocName () {
    const doc = doctorsList.value.find(d => d.id === selectedScheduleDoc.value)
    return doc ? doc.fullName : 'Bác sĩ'
  }

  // Fetch real synchronized clinical data (Appointment Service - ACTIVE)
  async function fetchAllData () {
    loading.value = true
    try {
      const apps = await appointmentService.getAllAppointments()
      appointments.value = apps

      const docsRes = await publicApi.get('/Doctors')
      doctorsList.value = docsRes.data

      const svcsRes = await publicApi.get('/MedicalServices')
      servicesList.value = svcsRes.data

      // Refresh slots if doctor selected
      if (selectedScheduleDoc.value) {
        loadActiveSlots()
      }

      nextTick(() => {
        initCharts()
      })
    } catch (e) {
      console.error('Unified stats loading issues:', e)
    } finally {
      loading.value = false
    }
  }

  // Unified page title
  function getPageTitle () {
    switch (activeTab.value) {
      case 'overview': return 'Tổng Quan Liên Thông Trung Tâm'
      case 'appointments': return 'Quản Lý Lịch Hẹn Khám'
      case 'schedule': return 'Quản Lý Lịch Trực Bác Sĩ'
      case 'doctors': return 'Danh Mục Bác Sĩ Lâm Sàng'
      case 'services': return 'Dịch Vụ Y Khoa Toàn Viện'
      default: return 'Medicare Master Cockpit'
    }
  }

  // #--------------------------------------------------
  // # Appointment Service Logic (Fully Active & Integrated)
  // #--------------------------------------------------
  async function approve (id) {
    if (!confirm('Xác nhận phê duyệt lịch hẹn khám?')) return
    try {
      await appointmentService.approveAppointment(id)
      alert('Phê duyệt và cấp số thứ tự thành công!')
      fetchAllData()
    } catch (e) {
      alert('Phê duyệt lỗi: ' + e)
    }
  }

  async function cancel (id) {
    if (!confirm('Xác nhận hủy lịch khám này?')) return
    try {
      await appointmentService.cancelAppointment(id)
      alert('Đã hủy lịch khám.')
      fetchAllData()
    } catch (e) {
      alert('Hủy lịch lỗi: ' + e)
    }
  }

  async function submitAddDoctor () {
    submittingDoctor.value = true
    try {
      await api.post('/Doctors', {
        fullName: formDoctor.value.fullName,
        specialty: formDoctor.value.specialty,
        degree: formDoctor.value.degree,
        consultationFee: formDoctor.value.consultationFee
      })
      alert('Thêm bác sĩ thành công!')
      formDoctor.value = { fullName: '', specialty: '', degree: '', consultationFee: null }
      showDoctorModal.value = false
      fetchAllData()
    } catch (e) {
      alert('Lỗi thêm bác sĩ: ' + (e.response?.data || e.message))
    } finally {
      submittingDoctor.value = false
    }
  }

  async function submitAddService () {
    submittingService.value = true
    try {
      await api.post('/MedicalServices', {
        name: formService.value.name,
        description: formService.value.description,
        price: formService.value.price,
        isActive: true
      })
      alert('Thêm dịch vụ thành công!')
      formService.value = { name: '', description: '', price: null }
      showServiceModal.value = false
      fetchAllData()
    } catch (e) {
      alert('Lỗi thêm dịch vụ: ' + (e.response?.data || e.message))
    } finally {
      submittingService.value = false
    }
  }

  async function submitGenerateSlots () {
    generatingSlots.value = true
    try {
      await api.post('/Appointments/generate-slots', {
        doctorId: formSlots.value.doctorId,
        date: new Date(formSlots.value.date).toISOString()
      })
      alert('Khởi tạo ca khám thành công!')
      formSlots.value = { doctorId: '', date: '' }
      showSlotModal.value = false
      fetchAllData()
    } catch (e) {
      alert('Lỗi khởi tạo slots: ' + (e.response?.data || e.message))
    } finally {
      generatingSlots.value = false
    }
  }

  // ==========================================
  // PHÂN HỆ DƯỢC & BỆNH ÁN (FUTURE SERVICES)
  // Code viết ở trong này
  // ==========================================

  // Utilities
  function formatCurrency (v) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)
  }

  function formatDate (d) {
    if (!d) return ''
    return new Date(d).toLocaleDateString('vi-VN')
  }

  function formatTime (t) {
    return t?.slice(0, 5) || '--:--'
  }

  function getStatusText (status) {
    switch (status) {
      case 0: return 'Chờ duyệt'
      case 1: return 'Đã duyệt'
      case 2: return 'Đã khám'
      default: return 'Đã hủy'
    }
  }

  function getStatusClass (status) {
    switch (status) {
      case 0: return 'badge--pending'
      case 1: return 'badge--confirmed'
      case 2: return 'badge--completed'
      case 3: return 'badge--cancelled'
      default: return ''
    }
  }

  // Charts trend setup
  let trendChartInstance = null
  function initCharts () {
    const trendCtx = document.querySelector('#trendChart')
    if (!trendCtx) return

    if (trendChartInstance) trendChartInstance.destroy()

    const days = []
    const counts = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
      days.push(label)

      const count = appointments.value.filter(a => {
        const appDate = new Date(a.date).toLocaleDateString('vi-VN')
        return appDate === d.toLocaleDateString('vi-VN')
      }).length
      counts.push(count)
    }

    trendChartInstance = new window.Chart(trendCtx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          label: 'Lượt khám y tế',
          data: counts,
          borderColor: '#0047AB',
          backgroundColor: 'rgba(0, 71, 171, 0.05)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#0047AB',
          pointRadius: 5,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#e2e8f0' }, ticks: { stepSize: 1 } },
          x: { grid: { display: false } },
        },
      }
    })
  }

  onMounted(() => {
    fetchAllData()
  })
</script>

<style src="@/styles/dashboard.css"></style>
<style src="@/styles/notif.css"></style>
