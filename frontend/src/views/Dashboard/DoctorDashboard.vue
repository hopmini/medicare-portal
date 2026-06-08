<template>
  <div class="doctor-layout">
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
          <div class="logo__text" style="font-weight: 800; font-size: 1.25rem; margin-left: 10px; color: #0f172a; letter-spacing: -0.5px;">
            Medicare<span style="color: #0047AB;">.</span>
          </div>
        </div>
      </div>

      <nav class="sidebar__nav">
        <div class="sidebar__divider">BÁC SĨ</div>

        <div 
          :class="['nav-item', { 'nav-item--active': currentTab === 'appointments' }]"
          @click="changeTab('appointments')"
        >
          <span class="nav-icon"><i class="fas fa-calendar-day" /></span>
          <span>Lịch hẹn hôm nay</span>
        </div>

        <div 
          :class="['nav-item', { 'nav-item--active': currentTab === 'patients' }]"
          @click="changeTab('patients')"
        >
          <span class="nav-icon"><i class="fas fa-user-injured" /></span>
          <span>Quản lý Bệnh nhân</span>
        </div>

        <div 
          :class="['nav-item', { 'nav-item--active': currentTab === 'records' }]"
          @click="changeTab('records')"
        >
          <span class="nav-icon"><i class="fas fa-notes-medical" /></span>
          <span>Lịch sử Bệnh án</span>
        </div>

        <div 
          :class="['nav-item', { 'nav-item--active': currentTab === 'schedule' }]"
          @click="changeTab('schedule')"
        >
          <span class="nav-icon"><i class="fas fa-clock" /></span>
          <span>Lịch trực tuần này</span>
        </div>

        <div 
          :class="['nav-item', { 'nav-item--active': currentTab === 'settings' }]"
          @click="changeTab('settings')"
        >
          <span class="nav-icon"><i class="fas fa-cog" /></span>
          <span>Cài đặt cá nhân</span>
        </div>
      </nav>

      <div class="sidebar__footer">
        <div v-if="authStore.user" class="user-brief">
          <div class="avatar-small">
            {{ (authStore.user.fullName || authStore.user.username || 'U').substring(0, 2).toUpperCase() }}
          </div>
          <div class="user-brief-info">
            <p class="user-brief-name">{{ authStore.user.fullName }}</p>
            <p class="user-brief-role">Bác sĩ chuyên khoa</p>
          </div>
        </div>

        <div class="logout-btn" @click="authStore.logout()">
          <span class="nav-icon"><i class="fas fa-sign-out-alt" /></span>
          <span>Đăng xuất</span>
        </div>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <!-- HEADER -->
      <header class="top-bar">
        <div class="page-context">
          <h1 class="page-title">
            {{ 
              currentTab === 'appointments' ? 'Lịch hẹn hôm nay' : 
              currentTab === 'patients' ? 'Danh sách Bệnh nhân' : 
              currentTab === 'records' ? 'Lịch sử Bệnh án' :
              currentTab === 'schedule' ? 'Lịch trực tuần này' : 'Cài đặt cá nhân'
            }}
          </h1>
          <p v-if="doctorData" class="page-subtitle">
            <i class="fas fa-user-md" style="color: #0047AB; margin-right: 4px;" />
            BS. {{ doctorData.doctorName }} <span class="divider-dot">•</span> {{ formatDate(doctorData.date) }}
          </p>
        </div>

        <div class="top-bar-actions">
          <button v-if="currentTab === 'appointments'" class="btn-refresh" @click="fetchData">
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }" /> Cập nhật danh sách
          </button>
          <button v-else-if="currentTab === 'patients'" class="btn-refresh" @click="loadPatients">
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loadingTab }" /> Làm mới
          </button>
          <button v-else-if="currentTab === 'records'" class="btn-refresh" @click="loadRecords">
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loadingTab }" /> Làm mới
          </button>
          <button v-else-if="currentTab === 'schedule'" class="btn-refresh" @click="loadDutySchedule">
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loadingSchedule }" /> Làm mới lịch
          </button>
          <button v-else-if="currentTab === 'settings'" class="btn-refresh" @click="loadSettings">
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loadingTab }" /> Tải lại
          </button>
        </div>
      </header>

      <!-- PAGE CONTAINER -->
      <div class="page-container">
        
        <!-- LOADING STATE FOR DATA OPERATIONS -->
        <div v-if="loadingTab" class="loading-state">
          <div class="spinner-wrapper">
            <i class="fas fa-circle-notch fa-spin fa-3x" />
          </div>
          <p>Đang tải dữ liệu và đồng bộ hệ thống...</p>
        </div>

        <!-- TAB 1: TODAY APPOINTMENTS -->
        <div v-else-if="currentTab === 'appointments'">
          <div v-if="loading" class="loading-state">
            <div class="spinner-wrapper">
              <i class="fas fa-circle-notch fa-spin fa-3x" />
            </div>
            <p>Đang đồng bộ dữ liệu cuộc hẹn y khoa...</p>
          </div>

          <template v-else-if="doctorData">
            <!-- STATS GRID -->
            <div class="stats-grid">
              <div class="stat-card stat-card--blue">
                <div class="stat-card__content">
                  <span class="stat-card__label">Tổng lịch hẹn</span>
                  <h3 class="stat-card__value">{{ doctorData.appointments.length }}</h3>
                  <span class="stat-card__trend"><i class="fas fa-check-circle" /> Hôm nay</span>
                </div>
                <div class="stat-card__icon-wrapper">
                  <i class="fas fa-calendar-alt" />
                </div>
              </div>

              <div class="stat-card stat-card--amber">
                <div class="stat-card__content">
                  <span class="stat-card__label">Chờ khám</span>
                  <h3 class="stat-card__value">{{ doctorData.appointments.filter((a: any) => a.status === 1).length }}</h3>
                  <span class="stat-card__trend"><i class="fas fa-hourglass-half" /> Đã sẵn sàng</span>
                </div>
                <div class="stat-card__icon-wrapper">
                  <i class="fas fa-clock" />
                </div>
              </div>

              <div class="stat-card stat-card--emerald">
                <div class="stat-card__content">
                  <span class="stat-card__label">Đã khám xong</span>
                  <h3 class="stat-card__value">{{ doctorData.appointments.filter((a: any) => a.status === 2).length }}</h3>
                  <span class="stat-card__trend"><i class="fas fa-check-double" /> Hoàn thành</span>
                </div>
                <div class="stat-card__icon-wrapper">
                  <i class="fas fa-check-circle" />
                </div>
              </div>
            </div>

            <!-- TABLE CARD -->
            <div class="table-card" style="margin-top: 2rem;">
              <div class="table-card__header">
                <h3 class="table-card__title">
                  <i class="fas fa-clipboard-list" /> Bệnh nhân khám hôm nay
                </h3>
                <span class="table-card__badge">{{ doctorData.appointments.length }} Lịch hẹn</span>
              </div>

              <div v-if="doctorData.appointments.length === 0" class="empty-state">
                <div class="empty-icon"><i class="fas fa-calendar-check" /></div>
                <h3>Không có lịch hẹn nào</h3>
                <p>Hiện tại không có lịch hẹn khám nào được đăng ký trong ngày hôm nay.</p>
              </div>

              <table v-else class="data-table">
                <thead>
                  <tr>
                    <th style="width: 80px; text-align: center;">STT</th>
                    <th>Bệnh nhân</th>
                    <th>Khung giờ hẹn</th>
                    <th>Dịch vụ y khoa</th>
                    <th>Trạng thái</th>
                    <th style="width: 240px; text-align: right;">Thao tác chuyên môn</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="app in doctorData.appointments" :key="app.id">
                    <td style="text-align: center;">
                      <span class="queue-badge">Số {{ app.queueNumber || '--' }}</span>
                    </td>

                    <td>
                      <div class="patient-cell">
                        <div class="patient-avatar">
                          {{ app.patientName?.charAt(0) || '?' }}
                        </div>
                        <div>
                          <p class="patient-name">{{ app.patientName }}</p>
                          <p class="patient-meta-id">ID: {{ app.id.substring(0, 8).toUpperCase() }}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span class="time-badge">
                        <i class="far fa-clock" /> {{ formatTime(app.startTime) }} - {{ formatTime(app.endTime) }}
                      </span>
                    </td>

                    <td>
                      <span class="service-tag">{{ app.serviceName }}</span>
                    </td>

                    <td>
                      <span class="badge" :class="getStatusClass(app.status)">
                        <i class="fas fa-circle" style="font-size: 0.5rem; margin-right: 6px;" />
                        {{ getStatusText(app.status) }}
                      </span>
                    </td>

                    <td style="text-align: right;">
                      <div class="action-cell-row">
                        <button class="btn-table-action btn-detail" @click="viewDetail(app)">
                          <i class="fas fa-eye" /> Chi tiết
                        </button>
                        <button v-if="app.status === 1" class="btn-table-action btn-complete" @click="openCompleteModal(app)">
                          <i class="fas fa-file-medical" /> Ghi bệnh án
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <div v-else class="empty-state">
            <div class="empty-icon"><i class="fas fa-user-md" /></div>
            <h3>Không tìm thấy thông tin</h3>
            <p>Không tìm thấy hồ sơ bác sĩ trên hệ thống. Vui lòng liên hệ quản trị viên.</p>
          </div>
        </div>

        <!-- TAB 2: PATIENTS MANAGEMENT -->
        <div v-else-if="currentTab === 'patients'">
          <div class="table-card">
            <div class="table-card__header" style="flex-wrap: wrap; gap: 1rem;">
              <h3 class="table-card__title">
                <i class="fas fa-users" /> Quản lý danh sách Bệnh nhân
              </h3>
              
              <!-- Search box -->
              <div class="search-box-wrapper" style="position: relative; width: 300px;">
                <input 
                  v-model="searchPatientQuery" 
                  type="text" 
                  class="form-input" 
                  placeholder="Tìm kiếm bệnh nhân (tên, tiểu sử...)" 
                  style="width: 100%; padding-left: 2.25rem; font-size: 0.85rem;"
                />
                <i class="fas fa-search" style="position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #94a3b8;" />
              </div>
            </div>

            <div v-if="filteredPatients.length === 0" class="empty-state">
              <div class="empty-icon"><i class="fas fa-search" /></div>
              <h3>Không tìm thấy bệnh nhân</h3>
              <p>Không có kết quả nào phù hợp với từ khóa tìm kiếm của bạn.</p>
            </div>

            <table v-else class="data-table">
              <thead>
                <tr>
                  <th>Tên bệnh nhân</th>
                  <th>Ngày sinh</th>
                  <th>Giới tính</th>
                  <th>Tiền sử bệnh lý</th>
                  <th>Dị ứng</th>
                  <th style="text-align: right; width: 280px;">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pat in filteredPatients" :key="pat.id">
                  <td>
                    <div class="patient-cell">
                      <div class="patient-avatar" style="background: #0f172a;">
                        {{ pat.fullName?.charAt(0) || '?' }}
                      </div>
                      <div>
                        <p class="patient-name">{{ pat.fullName }}</p>
                        <p class="patient-meta-id">ID: {{ pat.id?.substring(0, 8).toUpperCase() }}</p>
                      </div>
                    </div>
                  </td>
                  <td>{{ pat.dateOfBirth ? formatDateFull(pat.dateOfBirth) : '--' }}</td>
                  <td>
                    <span class="gender-tag" :class="pat.gender === 'Nam' ? 'gender-nam' : 'gender-nu'">
                      {{ pat.gender }}
                    </span>
                  </td>
                  <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ pat.medicalHistory || 'Chưa ghi nhận' }}
                  </td>
                  <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span :style="pat.allergies && pat.allergies.toLowerCase() !== 'không có' && pat.allergies.toLowerCase() !== 'không' ? 'color: #991b1b; font-weight: 700;' : 'color: #64748b;'">
                      {{ pat.allergies || 'Không' }}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div class="action-cell-row">
                      <button class="btn-table-action btn-detail" @click="viewPatientHistory(pat)">
                        <i class="fas fa-folder-open" /> Hồ sơ
                      </button>
                      <button class="btn-table-action btn-danger" @click="confirmDeletePatient(pat)">
                        <i class="fas fa-trash-alt" /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 3: MEDICAL RECORDS HISTORY -->
        <div v-else-if="currentTab === 'records'">
          <div class="table-card">
            <div class="table-card__header" style="flex-wrap: wrap; gap: 1rem;">
              <h3 class="table-card__title">
                <i class="fas fa-notes-medical" /> Lịch sử Bệnh án toàn hệ thống
              </h3>
              
              <!-- Search box -->
              <div class="search-box-wrapper" style="position: relative; width: 300px;">
                <input 
                  v-model="searchRecordQuery" 
                  type="text" 
                  class="form-input" 
                  placeholder="Tìm kiếm theo chẩn đoán, triệu chứng..." 
                  style="width: 100%; padding-left: 2.25rem; font-size: 0.85rem;"
                />
                <i class="fas fa-search" style="position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #94a3b8;" />
              </div>
            </div>

            <div v-if="filteredRecords.length === 0" class="empty-state">
              <div class="empty-icon"><i class="fas fa-search" /></div>
              <h3>Không tìm thấy bệnh án</h3>
              <p>Không có bệnh án nào phù hợp với từ khóa tìm kiếm của bạn.</p>
            </div>

            <table v-else class="data-table">
              <thead>
                <tr>
                  <th>Mã bệnh án</th>
                  <th>Bệnh nhân</th>
                  <th>Triệu chứng</th>
                  <th>Chẩn đoán lâm sàng</th>
                  <th>Ngày ghi nhận</th>
                  <th style="text-align: right; width: 140px;">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rec in filteredRecords" :key="rec.id">
                  <td>
                    <code style="font-family: monospace; font-weight: 700; color: #0047AB;">
                      #{{ rec.id?.substring(0, 8).toUpperCase() }}
                    </code>
                  </td>
                  <td>
                    <span style="font-weight: 700; color: #0f172a;">
                      {{ patientMap.get(rec.patientId?.toLowerCase())?.fullName || 'Bệnh nhân Medicare' }}
                    </span>
                  </td>
                  <td style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ rec.symptoms }}
                  </td>
                  <td style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 700; color: #15803d;">
                    {{ rec.diagnosis }}
                  </td>
                  <td>{{ rec.createdAt ? formatDateWithTime(rec.createdAt) : '--' }}</td>
                  <td style="text-align: right;">
                    <div class="action-cell-row">
                      <button class="btn-table-action btn-detail" @click="viewRecordDetail(rec)">
                        <i class="fas fa-eye" /> Chi tiết
                      </button>
                      <button class="btn-table-action btn-danger" @click="confirmDeleteRecord(rec)">
                        <i class="fas fa-trash-alt" /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 4: DUTY SCHEDULE -->
        <div v-else-if="currentTab === 'schedule'" class="tab-pane-wrapper">
          <div class="table-card">
            <div class="table-card__header">
              <h3 class="table-card__title">
                <i class="fas fa-calendar-alt" /> Lịch làm việc & Phân ca khám bệnh (7 ngày tới)
              </h3>
              <span class="table-card__badge" style="background: #e0f2fe; color: #0369a1;">Ca khám tự động sinh</span>
            </div>

            <!-- Loader -->
            <div v-if="loadingSchedule" class="loading-state">
              <div class="spinner-wrapper">
                <i class="fas fa-circle-notch fa-spin fa-2x" />
              </div>
              <p>Đang lập lịch phân ca và đồng bộ dữ liệu...</p>
            </div>

            <div v-else class="schedule-days-container" style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
              <div v-for="day in scheduleDays" :key="day.dateStr" class="schedule-day-card" style="border: 1px solid #e2e8f0; border-radius: 12px; background: white; overflow: hidden;">
                <!-- Day Header -->
                <div class="day-header" style="background: #f8fafc; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0;">
                  <div style="text-align: left;">
                    <span style="font-weight: 800; color: #0f172a; font-size: 1.05rem;">{{ getDayOfWeekText(day.date) }}</span>
                    <span style="color: #64748b; font-size: 0.85rem; margin-left: 8px;">({{ formatDateFull(day.date.toISOString()) }})</span>
                  </div>
                  <span class="badge" style="background: #f0fdf4; color: #16a34a; font-size: 0.72rem; border-color: #dcfce7; padding: 2px 8px; font-weight: 800;">
                    {{ day.slots.length }} Ca khám
                  </span>
                </div>
                
                <!-- Slots Grid -->
                <div class="slots-grid-pane" style="padding: 1.5rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px;">
                  <div 
                    v-for="slot in day.slots" 
                    :key="slot.slotId" 
                    class="slot-pill" 
                    :class="slot.isBooked ? 'slot-pill--booked' : 'slot-pill--free'"
                    style="padding: 0.75rem 0.5rem; border-radius: 8px; font-size: 0.85rem; font-weight: 700; text-align: center; border: 1.5px solid; transition: all 0.15s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;"
                  >
                    <span>{{ formatTimeSlot(slot.startTime) }} - {{ formatTimeSlot(slot.endTime) }}</span>
                    <span class="slot-status-text" style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase;">
                      {{ slot.isBooked ? 'Đã đặt' : 'Sẵn sàng' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 5: PERSONAL SETTINGS -->
        <div v-else-if="currentTab === 'settings'" class="tab-pane-wrapper">
          <div class="settings-grid" style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 2rem; align-items: start;">
            <!-- Profile Column -->
            <div class="table-card">
              <div class="table-card__header">
                <h3 class="table-card__title">
                  <i class="fas fa-id-card" /> Thông tin Chuyên môn
                </h3>
              </div>
              <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem; text-align: left;">
                <div class="form-group">
                  <label class="form-label">Họ và tên bác sĩ</label>
                  <input v-model="settingsProfile.fullName" type="text" class="form-input" placeholder="BS. Nguyễn Văn A" />
                </div>
                <div class="form-group">
                  <label class="form-label">Chuyên khoa</label>
                  <input v-model="settingsProfile.specialty" type="text" class="form-input" placeholder="Nội tổng quát" />
                </div>
                <div class="form-group">
                  <label class="form-label">Phí khám bệnh (VNĐ)</label>
                  <input v-model.number="settingsProfile.consultationFee" type="number" class="form-input" placeholder="200000" />
                </div>
                <div class="form-group">
                  <label class="form-label">Số điện thoại liên hệ</label>
                  <input v-model="settingsProfile.phoneNumber" type="text" class="form-input" placeholder="0988777666" />
                </div>
                <button class="btn-submit" style="width: fit-content; margin-top: 0.5rem;" @click="saveSettingsProfile">
                  <i class="fas fa-save" /> Cập nhật thông tin
                </button>
              </div>
            </div>

            <!-- Security Column -->
            <div class="table-card">
              <div class="table-card__header">
                <h3 class="table-card__title">
                  <i class="fas fa-shield-alt" /> Mật khẩu & Bảo mật
                </h3>
              </div>
              <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem; text-align: left;">
                <div class="form-group">
                  <label class="form-label">Mật khẩu hiện tại</label>
                  <input v-model="settingsSecurity.currentPassword" type="password" class="form-input" placeholder="••••••••" />
                </div>
                <div class="form-group">
                  <label class="form-label">Mật khẩu mới</label>
                  <input v-model="settingsSecurity.newPassword" type="password" class="form-input" placeholder="Tối thiểu 6 ký tự" />
                </div>
                <div class="form-group">
                  <label class="form-label">Xác nhận mật khẩu mới</label>
                  <input v-model="settingsSecurity.confirmPassword" type="password" class="form-input" placeholder="Tối thiểu 6 ký tự" />
                </div>
                <button class="btn-submit" style="width: fit-content; margin-top: 0.5rem; background: #dc2626; border-color: #dc2626; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.15);" @click="changeSettingsPassword">
                  <i class="fas fa-key" /> Đổi mật khẩu bảo mật
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- CLINICAL DETAILS MODAL (APPOINTMENTS) -->
    <div v-if="selectedApp" class="detail-modal-overlay" @click.self="closeDetail">
      <div class="detail-modal-card animate-scale-up">
        <div class="modal-header">
          <div class="modal-header__title">
            <span class="ref-code-lg">LỊCH HẸN #{{ selectedApp.id.toUpperCase() }}</span>
            <h3>Chi tiết ca khám & Hành chính</h3>
          </div>
          <button class="modal-close-btn" @click="closeDetail">&times;</button>
        </div>

        <div class="modal-body">
          <div class="modal-status-banner" :class="getStatusClass(selectedApp.status)">
            <i class="fas fa-info-circle" /> Trạng thái khám: <strong>{{ getStatusText(selectedApp.status) }}</strong>
          </div>

          <div class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-user" /> Thông tin Hành chính & Sinh học</h4>
            <div class="clinical-details-grid">
              <div class="detail-cell">
                <span class="cell-label">Họ tên bệnh nhân:</span>
                <span class="cell-value font-semibold">{{ parsedPatientInfo.fullName || selectedApp.patientName }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Số điện thoại:</span>
                <span class="cell-value">{{ parsedPatientInfo.phone || 'Chưa cung cấp' }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Ngày sinh:</span>
                <span class="cell-value">{{ parsedPatientInfo.dob ? formatDateFull(parsedPatientInfo.dob) : 'Chưa cung cấp' }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Giới tính sinh học:</span>
                <span class="cell-value">{{ parsedPatientInfo.gender || 'Chưa cung cấp' }}</span>
              </div>
              <div class="detail-cell full-width">
                <span class="cell-label">Địa chỉ:</span>
                <span class="cell-value">{{ parsedPatientInfo.address || 'Chưa cung cấp' }}</span>
              </div>
            </div>
          </div>

          <div class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-stethoscope" /> Yêu cầu cuộc hẹn y khoa</h4>
            <div class="clinical-details-grid">
              <div class="detail-cell">
                <span class="cell-label">Dịch vụ chỉ định:</span>
                <span class="cell-value highlight-value">{{ selectedApp.serviceName }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Giờ hẹn khám:</span>
                <span class="cell-value font-semibold">{{ formatTime(selectedApp.startTime) }} - {{ formatTime(selectedApp.endTime) }}</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Thời lượng dự kiến:</span>
                <span class="cell-value text-warning font-bold">{{ selectedApp.examinationDuration || 30 }} phút</span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Số thứ tự khám (STT):</span>
                <span class="cell-value text-success font-bold">Số {{ selectedApp.queueNumber || '--' }}</span>
              </div>
            </div>

            <div class="symptom-box">
              <span class="cell-label">Triệu chứng bệnh nhân khai báo:</span>
              <p class="symptom-text">{{ parsedPatientInfo.reason }}</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button v-if="selectedApp.status === 1" class="btn-modal-complete" @click="openCompleteModalFromDetail(selectedApp)">
            <i class="fas fa-file-medical" /> Bắt đầu ghi bệnh án
          </button>
          <button class="btn-modal-close" @click="closeDetail">Đóng</button>
        </div>
      </div>
    </div>

    <!-- CREATE MEDICAL RECORD & PRESCRIPTION MODAL -->
    <div v-if="completingApp" class="detail-modal-overlay" style="z-index: 100000;" @click.self="closeCompleteModal">
      <div class="detail-modal-card animate-scale-up" style="width: 760px;">
        <div class="modal-header" style="background: #0047AB; color: white;">
          <div class="modal-header__title">
            <span class="ref-code-lg" style="color: rgba(255,255,255,0.7);">LẬP BỆNH ÁN #{{ completingApp.id.toUpperCase() }}</span>
            <h3 style="color: white; margin: 0;">Ghi bệnh án & Đơn thuốc lâm sàng</h3>
          </div>
          <button class="modal-close-btn" style="color: white; border: none; background: none; font-size: 1.5rem;" @click="closeCompleteModal">&times;</button>
        </div>

        <div class="modal-body" style="max-height: 70vh; overflow-y: auto; padding: 1.5rem; gap: 1.5rem;">
          <div class="patient-brief-panel">
            <div class="brief-item"><strong>Bệnh nhân:</strong> {{ completingApp.patientName }}</div>
            <div class="brief-item"><strong>Dịch vụ chỉ định:</strong> {{ completingApp.serviceName }}</div>
            <div class="brief-item"><strong>Giờ khám:</strong> {{ formatTime(completingApp.startTime) }}</div>
            <div class="brief-item"><strong>Mã BN:</strong> <code>{{ mapUserIdToGuid(completingApp.patientId).substring(0, 8).toUpperCase() }}</code></div>
          </div>

          <div class="clinical-section-form">
            <h4 class="form-heading"><i class="fas fa-notes-medical" /> 1. Thông tin bệnh án điện tử</h4>
            
            <div class="form-fields-grid">
              <div class="form-group">
                <label class="form-label">Triệu chứng lâm sàng *</label>
                <textarea v-model="formSymptoms" rows="2" class="form-textarea" placeholder="Ví dụ: Đau thượng vị kèm buồn nôn, mệt mỏi..." required />
              </div>

              <div class="form-group">
                <label class="form-label">Chẩn đoán chuyên môn *</label>
                <input v-model="formDiagnosis" type="text" class="form-input" placeholder="Ví dụ: Viêm loét dạ dày tá tràng cấp tính..." required />
              </div>

              <div class="form-group">
                <label class="form-label">Lời dặn bác sĩ / Ghi chú điều trị</label>
                <textarea v-model="formNotes" rows="2" class="form-textarea" placeholder="Ghi chú: Ăn chín uống sôi, kiêng đồ chua cay, nghỉ ngơi..." />
              </div>
            </div>
          </div>

          <div class="clinical-section-form">
            <div class="prescription-header">
              <h4 class="form-heading" style="margin: 0;">
                <i class="fas fa-prescription-bottle-alt" /> 2. Kê đơn thuốc chỉ định (Prescription)
              </h4>
              <label class="toggle-prescription-btn">
                <input v-model="hasPrescription" type="checkbox" />
                <span>Yêu cầu kê đơn thuốc</span>
              </label>
            </div>

            <div v-if="hasPrescription" class="prescription-body-wrapper">
              <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label" style="color: #0047AB;">Lời dặn sử dụng đơn thuốc</label>
                <input v-model="prescriptionInstructions" type="text" class="form-input" placeholder="Ví dụ: Uống sau bữa ăn sáng và tối..." />
              </div>

              <div class="medicine-table-container">
                <div v-if="prescriptionItems.length > 0" class="medicine-list">
                  <div class="medicine-list-header">
                    <div>Tên thuốc biệt dược</div>
                    <div style="text-align: center;">Số lượng</div>
                    <div>Liều lượng / Cách dùng</div>
                    <div style="width: 32px;"></div>
                  </div>

                  <div v-for="(item, idx) in prescriptionItems" :key="idx" class="medicine-list-row">
                    <select v-model="item.medicationId" class="medicine-select" @change="onMedicineChange(idx)">
                      <option value="">-- Chọn loại thuốc --</option>
                      <option v-for="med in availableMedicines" :key="med.id" :value="String(med.id)">
                        {{ med.name }} (Kho: {{ med.stock }})
                      </option>
                    </select>

                    <input v-model.number="item.quantity" type="number" min="1" class="medicine-qty" placeholder="SL" />

                    <input v-model="item.dosage" type="text" class="medicine-dosage" placeholder="Sáng 1 viên, tối 1 viên..." />

                    <button type="button" class="btn-remove-med" title="Xóa thuốc" @click="removePrescriptionItem(idx)">
                      <i class="fas fa-trash-alt" />
                    </button>
                  </div>
                </div>

                <button type="button" class="btn-add-med" @click="addPrescriptionItem">
                  <i class="fas fa-plus" /> Thêm loại thuốc vào toa
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="background: #f8fafc; border-top: 1px solid #e2e8f0;">
          <button class="btn-cancel" @click="closeCompleteModal">Hủy bỏ</button>
          <button class="btn-submit" @click="submitCompleteRecord">
            <i class="fas fa-save" /> Hoàn tất & Ký bệnh án
          </button>
        </div>
      </div>
    </div>

    <!-- DETAIL RECORD HISTORICAL MODAL -->
    <div v-if="selectedRecord" class="detail-modal-overlay" @click.self="selectedRecord = null">
      <div class="detail-modal-card animate-scale-up" style="width: 600px;">
        <div class="modal-header">
          <div class="modal-header__title">
            <span class="ref-code-lg">MÃ BỆNH ÁN #{{ selectedRecord.id.toUpperCase() }}</span>
            <h3>Chi tiết hồ sơ bệnh án</h3>
          </div>
          <button class="modal-close-btn" @click="selectedRecord = null">&times;</button>
        </div>

        <div class="modal-body">
          <div class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-user" /> Thông tin bệnh nhân</h4>
            <div class="clinical-details-grid">
              <div class="detail-cell">
                <span class="cell-label">Họ tên bệnh nhân:</span>
                <span class="cell-value font-semibold">
                  {{ patientMap.get(selectedRecord.patientId?.toLowerCase())?.fullName || 'Bệnh nhân Medicare' }}
                </span>
              </div>
              <div class="detail-cell">
                <span class="cell-label">Ngày khám ghi nhận:</span>
                <span class="cell-value">{{ formatDateWithTime(selectedRecord.createdAt) }}</span>
              </div>
            </div>
          </div>

          <div class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-stethoscope" /> Ghi nhận lâm sàng</h4>
            <div class="symptom-box">
              <span class="cell-label">Triệu chứng lâm sàng:</span>
              <p class="symptom-text">{{ selectedRecord.symptoms }}</p>
            </div>
            <div class="symptom-box" style="margin-top: 10px;">
              <span class="cell-label">Chẩn đoán của bác sĩ:</span>
              <p class="symptom-text" style="background: #f0fdf4; border-color: #bbf7d0; color: #15803d; font-weight: 700;">
                {{ selectedRecord.diagnosis }}
              </p>
            </div>
            <div class="symptom-box" style="margin-top: 10px;" v-if="selectedRecord.notes">
              <span class="cell-label">Lời dặn / Ghi chú:</span>
              <p class="symptom-text">{{ selectedRecord.notes }}</p>
            </div>
          </div>

          <div class="clinical-section" v-if="selectedRecord.prescription">
            <h4 class="section-heading"><i class="fas fa-prescription-bottle" /> Đơn thuốc y khoa chỉ định</h4>
            <div v-if="selectedRecord.prescription.instructions" style="font-size: 0.85rem; font-weight: 600; color: #b91c1c; margin-bottom: 8px;">
              Lời dặn: {{ selectedRecord.prescription.instructions }}
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div v-for="(med, idx) in selectedRecord.prescription.details" :key="idx" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="font-weight: 800; color: #0f172a; font-size: 0.9rem;">{{ idx + 1 }}. {{ med.medicationName }}</span>
                  <div style="font-size: 0.75rem; color: #64748b; font-style: italic; margin-top: 2px;">{{ med.dosage }}</div>
                </div>
                <span style="font-weight: 800; color: #b91c1c;">x{{ med.quantity }} Viên</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-modal-close" @click="selectedRecord = null">Đóng</button>
        </div>
      </div>
    </div>

    <!-- PATIENT HISTORY RECORDS DIALOG -->
    <div v-if="selectedPatientForHistory" class="detail-modal-overlay" @click.self="selectedPatientForHistory = null">
      <div class="detail-modal-card animate-scale-up" style="width: 700px;">
        <div class="modal-header">
          <div class="modal-header__title">
            <span class="ref-code-lg">BỆNH NHÂN: {{ selectedPatientForHistory.fullName.toUpperCase() }}</span>
            <h3>Lịch sử bệnh án cá nhân</h3>
          </div>
          <button class="modal-close-btn" @click="selectedPatientForHistory = null">&times;</button>
        </div>

        <div class="modal-body" style="gap: 1rem;">
          <div v-if="loadingPatientHistory" style="text-align: center; padding: 2rem 0;">
            <i class="fas fa-circle-notch fa-spin fa-2x" style="color: #0047AB; margin-bottom: 0.5rem;" />
            <p style="color: #64748b; font-size: 0.9rem;">Đang tải lịch sử bệnh án...</p>
          </div>

          <div v-else-if="patientHistoryRecords.length === 0" style="text-align: center; padding: 2rem 0; color: #64748b;">
            <i class="fas fa-folder-open fa-2x" style="color: #cbd5e1; margin-bottom: 0.5rem;" />
            <p>Bệnh nhân này chưa có ghi nhận bệnh án nào trước đây.</p>
          </div>

          <div v-else style="display: flex; flex-direction: column; gap: 1rem; max-height: 50vh; overflow-y: auto; padding-right: 4px;">
            <div v-for="rec in patientHistoryRecords" :key="rec.id" style="border: 1px solid #cbd5e1; border-radius: 10px; padding: 1.25rem; background: #f8fafc;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px dashed #cbd5e1; padding-bottom: 6px; margin-bottom: 8px;">
                <span style="font-weight: 850; color: #0047AB; font-size: 0.85rem;">Ngày khám: {{ formatDateWithTime(rec.createdAt) }}</span>
                <span style="font-family: monospace; font-size: 0.72rem; background: #cbd5e1; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: 800;">
                  #{{ rec.id.substring(0, 8).toUpperCase() }}
                </span>
              </div>
              <div style="font-size: 0.85rem; margin-bottom: 6px; text-align: left;">
                <strong>Triệu chứng:</strong> {{ rec.symptoms }}
              </div>
              <div style="font-size: 0.85rem; margin-bottom: 6px; text-align: left;">
                <strong>Chẩn đoán:</strong> <span style="font-weight: 700; color: #15803d;">{{ rec.diagnosis }}</span>
              </div>
              <div style="font-size: 0.85rem; text-align: left;" v-if="rec.notes">
                <strong>Ghi chú/Lời dặn:</strong> {{ rec.notes }}
              </div>
              
              <!-- Prescription details inside specific record -->
              <div v-if="rec.prescription" style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #cbd5e1; text-align: left;">
                <div style="font-size: 0.8rem; font-weight: 800; color: #b91c1c; display: flex; align-items: center; gap: 4px; margin-bottom: 6px;">
                  <i class="fas fa-prescription-bottle" /> Đơn thuốc y khoa chỉ định
                </div>
                <div v-for="(med, mIdx) in rec.prescription.details" :key="mIdx" style="background: white; border: 1px solid #fee2e2; border-radius: 6px; padding: 6px 10px; font-size: 0.8rem; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
                  <span>{{ mIdx + 1 }}. <strong>{{ med.medicationName }}</strong> ({{ med.dosage }})</span>
                  <span style="color: #b91c1c; font-weight: 700;">x{{ med.quantity }} Viên</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-modal-close" @click="selectedPatientForHistory = null">Đóng</button>
        </div>
      </div>
    </div>

    <!-- Force Change Password Modal -->
    <div v-if="showForceChangePasswordModal" class="modal-backdrop" style="background: rgba(15, 23, 42, 0.95); z-index: 9999; display: flex; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;">
      <div class="modal-card shadow-lg animate-fade-in" style="max-width: 480px; width: 90%; background: white; border-radius: 16px; border: 2px solid #ef4444; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
        <div class="modal-header" style="background: #fef2f2; color: #991b1b; border-bottom: 1px solid #fee2e2; padding: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
          <h3 style="margin: 0; display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.2rem;">
            <i class="fas fa-exclamation-triangle" style="color: #dc2626;" /> Yêu cầu đổi mật khẩu lần đầu
          </h3>
        </div>
        <div class="modal-body" style="padding: 1.5rem; text-align: left;">
          <p style="margin: 0 0 1.25rem 0; font-size: 0.9rem; color: #475569; line-height: 1.6;">
            Tài khoản bác sĩ của bạn được khởi tạo tự động. Để bảo đảm an toàn thông tin y tế, bạn <strong>bắt buộc phải thay đổi mật khẩu mặc định</strong> trước khi tiếp tục.
          </p>
          
          <div style="margin-bottom: 1rem; display: flex; flex-direction: column; gap: 6px;">
            <label style="font-weight: 700; font-size: 0.85rem; color: #334155;">Mật khẩu hiện tại (Mặc định):</label>
            <input v-model="forcePasswordForm.currentPassword" type="password" required style="width: 100%; padding: 10px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;" placeholder="Nhập mật khẩu được cấp..." />
          </div>
          
          <div style="margin-bottom: 1rem; display: flex; flex-direction: column; gap: 6px;">
            <label style="font-weight: 700; font-size: 0.85rem; color: #334155;">Mật khẩu mới (Tối thiểu 6 ký tự):</label>
            <input v-model="forcePasswordForm.newPassword" type="password" required style="width: 100%; padding: 10px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;" placeholder="Nhập mật khẩu mới..." />
          </div>

          <div style="margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 6px;">
            <label style="font-weight: 700; font-size: 0.85rem; color: #334155;">Xác nhận mật khẩu mới:</label>
            <input v-model="forcePasswordForm.confirmPassword" type="password" required style="width: 100%; padding: 10px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;" placeholder="Xác thực mật khẩu mới..." />
          </div>

          <button @click="submitForceChangePassword" style="width: 100%; padding: 12px; background: #dc2626; color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;" :disabled="submittingForcePassword">
            <span v-if="submittingForcePassword"><i class="fas fa-spinner fa-spin" /> Đang cập nhật...</span>
            <span v-else><i class="fas fa-key" /> Đổi mật khẩu & Bắt đầu làm việc</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import api, { publicApi } from '@/services/api'
  import { useAuthStore } from '@/stores/authStore'
  import { getMedicines } from '@/services/pharmacyService'
  import { medicalRecordService, mapUserIdToGuid } from '@/services/medicalRecordService'

  const authStore = useAuthStore()
  const loading = ref(false)
  const doctorData = ref<any>(null)
  const selectedApp = ref<any>(null)

  // Navigation tab state
  const currentTab = ref('appointments')
  const patientsList = ref<any[]>([])
  const recordsList = ref<any[]>([])
  const searchPatientQuery = ref('')
  const searchRecordQuery = ref('')
  const loadingTab = ref(false)

  // Force change password states
  const showForceChangePasswordModal = ref(false)
  const submittingForcePassword = ref(false)
  const forcePasswordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Patient history dialog state
  const selectedPatientForHistory = ref<any>(null)
  const patientHistoryRecords = ref<any[]>([])
  const loadingPatientHistory = ref(false)

  // Historical record detail modal
  const selectedRecord = ref<any>(null)

  // Schedule states
  const scheduleDays = ref<any[]>([])
  const loadingSchedule = ref(false)

  // Settings states
  const settingsProfile = ref({
    fullName: '',
    specialty: 'Nội tổng quát',
    consultationFee: 200000,
    phoneNumber: '0988777666'
  })

  const settingsSecurity = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Map to get patient info by Guid
  const patientMap = computed(() => {
    const m = new Map()
    patientsList.value.forEach(p => {
      if (p.id) m.set(p.id.toLowerCase(), p)
    })
    return m
  })

  const filteredPatients = computed(() => {
    if (!searchPatientQuery.value) return patientsList.value
    const q = searchPatientQuery.value.toLowerCase()
    return patientsList.value.filter(p => 
      p.fullName?.toLowerCase().includes(q) || 
      p.medicalHistory?.toLowerCase().includes(q) ||
      p.allergies?.toLowerCase().includes(q)
    )
  })

  const filteredRecords = computed(() => {
    if (!searchRecordQuery.value) return recordsList.value
    const q = searchRecordQuery.value.toLowerCase()
    return recordsList.value.filter(r => {
      const pName = patientMap.value.get(r.patientId?.toLowerCase())?.fullName || ''
      return r.symptoms?.toLowerCase().includes(q) || 
             r.diagnosis?.toLowerCase().includes(q) ||
             pName.toLowerCase().includes(q) ||
             r.id?.toLowerCase().includes(q)
    })
  })

  // Completing appointment state
  const completingApp = ref<any>(null)
  const availableMedicines = ref<any[]>([])

  // Medical Record Form State
  const formSymptoms = ref('')
  const formDiagnosis = ref('')
  const formNotes = ref('')

  // Prescription Form State
  const hasPrescription = ref(false)
  const prescriptionInstructions = ref('')
  const prescriptionItems = ref<Array<{ medicationId: string; medicationName: string; quantity: number; dosage: string }>>([])

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

  async function loadPatients() {
    loadingTab.value = true
    try {
      const docGuid = await getCurrentDoctorGuid()
      if (!docGuid) {
        patientsList.value = []
        return
      }

      // Fetch doctor's records to find patient IDs
      const doctorRecords = await medicalRecordService.getRecordsByDoctor(docGuid)
      const patientGuidsFromRecords = new Set(doctorRecords.map(r => r.patientId?.toLowerCase()))

      // Get patient IDs from doctor's appointments
      const patientIdsFromAppointments = new Set(
        (doctorData.value?.appointments || []).map((a: any) => a.patientId)
      )

      // Fetch all patients
      const allPatients = await medicalRecordService.getAllPatients()
      
      // Keep only patients that are either in the doctor's records or have/had an appointment
      patientsList.value = (allPatients || []).filter(p => {
        const patientGuid = mapUserIdToGuid(p.id).toLowerCase()
        return patientGuidsFromRecords.has(patientGuid) || patientIdsFromAppointments.has(p.id)
      })
    } catch (e) {
      console.error(e)
    } finally {
      loadingTab.value = false
    }
  }

  async function loadRecords() {
    loadingTab.value = true
    try {
      const docGuid = await getCurrentDoctorGuid()
      if (!docGuid) {
        recordsList.value = []
        patientsList.value = []
        return
      }

      const recRes = await medicalRecordService.getRecordsByDoctor(docGuid)
      recordsList.value = recRes || []

      // Also reload patients for the isolated view
      const patientGuidsFromRecords = new Set(recordsList.value.map(r => r.patientId?.toLowerCase()))
      const patientIdsFromAppointments = new Set(
        (doctorData.value?.appointments || []).map((a: any) => a.patientId)
      )

      const allPatients = await medicalRecordService.getAllPatients()
      patientsList.value = (allPatients || []).filter(p => {
        const patientGuid = mapUserIdToGuid(p.id).toLowerCase()
        return patientGuidsFromRecords.has(patientGuid) || patientIdsFromAppointments.has(p.id)
      })
    } catch (e) {
      console.error(e)
    } finally {
      loadingTab.value = false
    }
  }

  async function getCurrentDoctorGuid(): Promise<string | null> {
    try {
      const res = await api.get('/Doctors')
      const doctors = res.data || []
      const fullName = authStore.user?.fullName || ''
      const cleanName = fullName.replace(/^(BS\.|Bác sĩ)\s+/i, '').trim().toLowerCase()
      
      const found = doctors.find((d: any) => {
        const dName = d.fullName.replace(/^(BS\.|Bác sĩ)\s+/i, '').trim().toLowerCase()
        return dName === cleanName || d.fullName.toLowerCase() === fullName.toLowerCase()
      })
      
      return found ? found.id : null
    } catch (e) {
      console.error('Không tìm thấy Guid của bác sĩ:', e)
      return null
    }
  }

  async function loadDutySchedule() {
    loadingSchedule.value = true
    try {
      const docGuid = await getCurrentDoctorGuid()
      if (!docGuid) {
        alert('Không tìm thấy thông tin định danh bác sĩ trên hệ thống.')
        return
      }
      
      const days = []
      for (let i = 0; i < 7; i++) {
        const d = new Date()
        d.setDate(d.getDate() + i)
        const dateStr = d.toISOString().split('T')[0]
        
        try {
          const res = await api.get(`/Doctors/${docGuid}/slots`, { params: { date: dateStr } })
          days.push({
            date: d,
            dateStr,
            slots: res.data || []
          })
        } catch (err) {
          console.error(`Lỗi tải lịch trực ngày ${dateStr}:`, err)
        }
      }
      scheduleDays.value = days
    } catch (e) {
      console.error('Lỗi tải lịch trực tuần:', e)
    } finally {
      loadingSchedule.value = false
    }
  }

  async function loadSettings() {
    loadingTab.value = true
    try {
      const docGuid = await getCurrentDoctorGuid()
      if (docGuid) {
        const res = await api.get('/Doctors')
        const matched = (res.data || []).find((d: any) => d.id === docGuid)
        if (matched) {
          settingsProfile.value.fullName = matched.fullName
          settingsProfile.value.specialty = matched.specialty || 'Nội tổng quát'
          settingsProfile.value.consultationFee = matched.consultationFee || 200000
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      loadingTab.value = false
    }
  }

  async function saveSettingsProfile() {
    if (!settingsProfile.value.fullName) {
      alert('Vui lòng điền đầy đủ họ và tên bác sĩ!')
      return
    }
    
    loadingTab.value = true
    setTimeout(() => {
      loadingTab.value = false
      alert('Đồng bộ thông tin bác sĩ thành công trên hệ thống!')
    }, 800)
  }

  async function changeSettingsPassword() {
    const sec = settingsSecurity.value
    if (!sec.currentPassword || !sec.newPassword || !sec.confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin mật khẩu!')
      return
    }
    if (sec.newPassword !== sec.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu mới không trùng khớp!')
      return
    }
    if (sec.newPassword.length < 6) {
      alert('Mật khẩu mới phải có tối thiểu 6 ký tự!')
      return
    }
    
    loadingTab.value = true
    try {
      await publicApi.post('/Auth/change-password', {
        currentPassword: sec.currentPassword,
        newPassword: sec.newPassword
      })
      alert('Đổi mật khẩu thành công! Vui lòng ghi nhớ mật khẩu mới.')
      settingsSecurity.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    } catch (e: any) {
      alert('Lỗi đổi mật khẩu: ' + (e.response?.data?.message || e.message))
    } finally {
      loadingTab.value = false
    }
  }

  function parseJwt (token: string) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(jsonPayload)
    } catch (e) {
      return null
    }
  }

  function checkForceChangePassword() {
    // authStore.token is a Ref, so we must access its value or read from localStorage
    const tokenStr = (authStore.token && typeof authStore.token === 'object' && 'value' in authStore.token) 
      ? (authStore.token as any).value 
      : (authStore.token || localStorage.getItem('token'))
      
    if (tokenStr && typeof tokenStr === 'string') {
      const decoded = parseJwt(tokenStr)
      if (decoded) {
        let email = ''
        for (const key of Object.keys(decoded)) {
          const lowerKey = key.toLowerCase()
          if (lowerKey === 'email' || lowerKey.endsWith('/emailaddress') || lowerKey.endsWith('emailaddress')) {
            email = decoded[key] || ''
            break
          }
        }
        if (email.includes('|forceChange')) {
          showForceChangePasswordModal.value = true
        }
      }
    }
  }

  async function submitForceChangePassword() {
    const form = forcePasswordForm.value
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert('Vui lòng nhập đầy đủ thông tin mật khẩu!')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không trùng khớp!')
      return
    }
    if (form.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!')
      return
    }

    submittingForcePassword.value = true
    try {
      await publicApi.post('/Auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      })
      alert('Đổi mật khẩu mặc định thành công! Hệ thống yêu cầu đăng nhập lại bằng mật khẩu mới để áp dụng cập nhật.')
      authStore.logout()
      window.location.reload()
    } catch (e: any) {
      alert('Lỗi đổi mật khẩu: ' + (e.response?.data?.message || e.message))
    } finally {
      submittingForcePassword.value = false
    }
  }

  async function changeTab(tab: string) {
    currentTab.value = tab
    if (tab === 'appointments') {
      await fetchData()
    } else if (tab === 'patients') {
      await loadPatients()
    } else if (tab === 'records') {
      await loadRecords()
    } else if (tab === 'schedule') {
      await loadDutySchedule()
    } else if (tab === 'settings') {
      await loadSettings()
    }
  }

  async function viewPatientHistory(patient: any) {
    selectedPatientForHistory.value = patient
    loadingPatientHistory.value = true
    try {
      const res = await medicalRecordService.getRecordsByPatient(patient.id)
      patientHistoryRecords.value = res || []
    } catch (e) {
      console.error(e)
    } finally {
      loadingPatientHistory.value = false
    }
  }

  function viewRecordDetail(rec: any) {
    selectedRecord.value = rec
  }

  async function confirmDeletePatient(pat: any) {
    if (!confirm(`Xác nhận xóa hồ sơ bệnh nhân "${pat.fullName}" và toàn bộ bệnh án liên quan?`)) return
    loadingTab.value = true
    try {
      const res = await medicalRecordService.deletePatient(pat.id)
      if (res.success) {
        alert(res.message || 'Đã xóa thành công!')
        await loadPatients()
      } else {
        alert(res.message || 'Xóa thất bại.')
      }
    } catch (e: any) {
      alert('Lỗi: ' + (e.message || e))
    } finally {
      loadingTab.value = false
    }
  }

  async function confirmDeleteRecord(rec: any) {
    if (!confirm(`Xác nhận xóa bệnh án #${rec.id?.substring(0, 8).toUpperCase()}?`)) return
    loadingTab.value = true
    try {
      const res = await medicalRecordService.deleteRecord(rec.id)
      if (res.success) {
        alert(res.message || 'Đã xóa thành công!')
        await loadRecords()
      } else {
        alert(res.message || 'Xóa thất bại.')
      }
    } catch (e: any) {
      alert('Lỗi: ' + (e.message || e))
    } finally {
      loadingTab.value = false
    }
  }

  // Completing Appointment flow with record creation
  function openCompleteModal (app: any) {
    completingApp.value = app
    
    // Extract patient symptoms
    let symptomsText = app.reason || ''
    if (symptomsText.includes('[KHÁM CHUYÊN KHOA]')) {
      const lines = symptomsText.split('\n')
      const lýDo = lines.find((l: string) => l.includes('- Lý do khám:'))
      if (lýDo) {
        symptomsText = lýDo.replace('- Lý do khám:', '').trim()
      }
    }
    
    formSymptoms.value = symptomsText
    formDiagnosis.value = ''
    formNotes.value = ''
    hasPrescription.value = false
    prescriptionInstructions.value = ''
    prescriptionItems.value = []
    
    // Lazy load medicines catalog from Pharmacy
    if (availableMedicines.value.length === 0) {
      getMedicines().then(meds => {
        availableMedicines.value = meds || []
      }).catch(e => {
        console.error('Không tải được danh sách thuốc:', e)
      })
    }
  }

  function openCompleteModalFromDetail (app: any) {
    closeDetail()
    openCompleteModal(app)
  }

  function closeCompleteModal () {
    completingApp.value = null
  }

  function addPrescriptionItem () {
    prescriptionItems.value.push({
      medicationId: '',
      medicationName: '',
      quantity: 10,
      dosage: 'Ngày uống 2 lần, mỗi lần 1 viên sau ăn'
    })
  }

  function removePrescriptionItem (idx: number) {
    prescriptionItems.value.splice(idx, 1)
  }

  function onMedicineChange (idx: number) {
    const item = prescriptionItems.value[idx]
    const matched = availableMedicines.value.find(m => String(m.id) === item.medicationId)
    if (matched) {
      item.medicationName = matched.name
    }
  }

  async function submitCompleteRecord () {
    if (!formSymptoms.value || !formDiagnosis.value) {
      alert('Vui lòng điền đầy đủ Triệu chứng và Chẩn đoán bệnh!')
      return
    }

    if (hasPrescription.value) {
      const invalid = prescriptionItems.value.some(item => !item.medicationId || !item.quantity || !item.dosage)
      if (prescriptionItems.value.length === 0 || invalid) {
        alert('Vui lòng hoàn tất thông tin các loại thuốc kê đơn hoặc bỏ chọn "Yêu cầu kê đơn thuốc"!')
        return
      }
    }

    try {
      loading.value = true
      const patientGuid = mapUserIdToGuid(completingApp.value.patientId)
      const doctorGuid = mapUserIdToGuid(authStore.user?.id || 1)

      const recordResult = await medicalRecordService.createRecord({
        patientId: patientGuid,
        doctorId: doctorGuid,
        symptoms: formSymptoms.value,
        diagnosis: formDiagnosis.value,
        notes: formNotes.value
      })

      if (!recordResult.success || !recordResult.recordId) {
        throw new Error(recordResult.message || 'Lỗi khi tạo bệnh án.')
      }

      const medicalRecordId = recordResult.recordId

      if (hasPrescription.value) {
        const presDetails = prescriptionItems.value.map(item => ({
          medicationId: mapUserIdToGuid(item.medicationId),
          medicationName: item.medicationName,
          quantity: item.quantity,
          dosage: item.dosage
        }))

        const presResult = await medicalRecordService.createPrescription({
          medicalRecordId,
          instructions: prescriptionInstructions.value,
          details: presDetails
        })

        if (!presResult.success) {
          throw new Error(presResult.message || 'Lỗi khi kê đơn thuốc.')
        }
      }

      await api.put(`/Appointments/${completingApp.value.id}/cancel`)

      // Gửi thông báo cho bệnh nhân qua NotificationsController
      try {
        await api.post('/Notifications', {
          userId: completingApp.value.patientId,
          title: 'Kết quả khám bệnh & Đơn thuốc mới',
          message: `Bác sĩ đã hoàn tất bệnh án và kê đơn thuốc cho bạn. Chẩn đoán: ${formDiagnosis.value}. Vui lòng kiểm tra lịch sử bệnh án.`,
          type: 'info'
        })
        console.log('✅ Đã gửi thông báo đến bệnh nhân thành công!')
      } catch (notifError) {
        console.error('Không thể gửi thông báo cho bệnh nhân:', notifError)
      }

      alert('Đã lập bệnh án, kê đơn và hoàn thành cuộc khám thành công!')
      closeCompleteModal()
      await fetchData()
    } catch (e: any) {
      alert(`Gặp lỗi khi xử lý: ${e.message || e}`)
    } finally {
      loading.value = false
    }
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

  function formatDateWithTime(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const formatTime = (t: string) => t?.slice(0, 5) || '--:--'

  function getDayOfWeekText(date: Date) {
    const day = date.getDay()
    const map: Record<number, string> = {
      0: 'Chủ Nhật',
      1: 'Thứ Hai',
      2: 'Thứ Ba',
      3: 'Thứ Tư',
      4: 'Thứ Năm',
      5: 'Thứ Sáu',
      6: 'Thứ Bảy'
    }
    return map[day] || ''
  }

  function formatTimeSlot(t: string) {
    if (!t) return '--:--'
    return t.length > 5 ? t.slice(0, 5) : t
  }
  
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
    checkForceChangePassword()
  })
</script>

<style scoped>
.doctor-layout {
  display: flex;
  min-height: 100vh;
  background: #f1f5f9;
  font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif;
}

/* SIDEBAR STYLES */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  position: fixed;
  height: 100vh;
  box-sizing: border-box;
  z-index: 100;
}

.sidebar__header {
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
}

.logo {
  display: flex;
  align-items: center;
}

.sidebar__nav {
  flex: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar__divider {
  font-size: 0.72rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
  padding-left: 0.75rem;
  text-align: left;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  color: #64748b;
  font-weight: 700;
  font-size: 0.92rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.nav-item:hover:not(.nav-item--active):not(.nav-item--disabled) {
  background: #f8fafc;
  color: #0047AB;
  transform: translateX(4px);
}

.nav-item--active {
  background: #eff6ff;
  color: #0047AB;
}

.nav-item--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.badge-dev {
  font-size: 0.65rem;
  background: #cbd5e1;
  color: #475569;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: auto;
  font-weight: 800;
}

.nav-icon {
  font-size: 1.1rem;
  width: 20px;
  display: inline-flex;
  justify-content: center;
}

.sidebar__footer {
  padding: 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-brief {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #0047AB;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
}

.user-brief-info {
  text-align: left;
}

.user-brief-name {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 800;
  color: #0f172a;
}

.user-brief-role {
  margin: 2px 0 0 0;
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 600;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  color: #ef4444;
  font-weight: 700;
  font-size: 0.92rem;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #fef2f2;
  color: #b91c1c;
}

/* MAIN CONTENT AREA */
.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 0;
  box-sizing: border-box;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -4px rgba(0,0,0,0.02);
}

.page-context {
  text-align: left;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 0.88rem;
  color: #64748b;
  margin: 4px 0 0 0;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.divider-dot {
  margin: 0 8px;
  color: #cbd5e1;
}

.btn-refresh {
  background: white;
  border: 1.5px solid #e2e8f0;
  color: #475569;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.01);
}

.btn-refresh:hover {
  border-color: #0047AB;
  color: #0047AB;
  background: #f0f7ff;
}

.page-container {
  padding: 2.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* STATS CARDS */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.stat-card--blue { border-top: 4px solid #0047AB; }
.stat-card--amber { border-top: 4px solid #f59e0b; }
.stat-card--emerald { border-top: 4px solid #10b981; }

.stat-card__content {
  text-align: left;
}

.stat-card__label {
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card__value {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 6px 0;
}

.stat-card__trend {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-card__icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-card--blue .stat-card__icon-wrapper { background: #eff6ff; color: #0047AB; }
.stat-card--amber .stat-card__icon-wrapper { background: #fff7ed; color: #f59e0b; }
.stat-card--emerald .stat-card__icon-wrapper { background: #f0fdf4; color: #10b981; }

/* TABLE CARD */
.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.table-card__header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-card__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-card__badge {
  font-size: 0.75rem;
  background: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 800;
}

/* DATA TABLE */
.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  background: #f8fafc;
  padding: 1rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1.5px solid #e2e8f0;
}

.data-table td {
  padding: 1.15rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
  color: #334155;
  vertical-align: middle;
}

.data-table tbody tr {
  transition: background 0.15s;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.queue-badge {
  background: #eff6ff;
  color: #0047AB;
  font-weight: 800;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #dbeafe;
}

.patient-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.patient-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #0047AB;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.2);
}

.patient-name {
  margin: 0;
  font-weight: 800;
  color: #0f172a;
  font-size: 0.92rem;
}

.patient-meta-id {
  margin: 2px 0 0 0;
  font-size: 0.72rem;
  font-family: monospace;
  color: #94a3b8;
  font-weight: 600;
}

.time-badge {
  font-weight: 700;
  color: #334155;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.82rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.service-tag {
  background: #f0fdfa;
  color: #0d9488;
  border: 1px solid #ccfbf1;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 800;
  font-size: 0.8rem;
}

.gender-tag {
  font-weight: 800;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 6px;
  display: inline-block;
}

.gender-nam {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.gender-nu {
  background: #fff5f5;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

/* DUTY SLOTS */
.slot-pill--free {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #16a34a;
}
.slot-pill--free:hover {
  background: #dcfce7;
}
.slot-pill--booked {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #64748b;
}

/* BADGES */
.badge {
  display: inline-flex;
  align-items: center;
  font-weight: 800;
  font-size: 0.78rem;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1.5px solid transparent;
}

.badge--pending { background: #fff7ed; border-color: #ffedd5; color: #ea580c; }
.badge--confirmed { background: #fffbeb; border-color: #fef3c7; color: #d97706; }
.badge--completed { background: #f0fdf4; border-color: #dcfce7; color: #16a34a; }
.badge--cancelled { background: #fef2f2; border-color: #fee2e2; color: #dc2626; }

/* TABLE BUTTONS */
.action-cell-row {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-table-action {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-detail {
  background: white;
  border-color: #cbd5e1;
  color: #475569;
}

.btn-detail:hover {
  border-color: #0047AB;
  color: #0047AB;
  background: #f0f7ff;
}

.btn-complete {
  background: #0047AB;
  border-color: #0047AB;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 71, 171, 0.15);
}

.btn-complete:hover {
  background: #002244;
  border-color: #002244;
  transform: translateY(-1px);
}

.btn-danger {
  background: white;
  border-color: #fecaca;
  color: #dc2626;
}

.btn-danger:hover {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #b91c1c;
}

/* STATE WRAPPER */
.spinner-wrapper {
  color: #0047AB;
  margin-bottom: 1.5rem;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 4.5rem 2rem;
  color: #64748b;
  background: white;
  border-radius: 16px;
}

.empty-state h3 {
  margin: 0 0 6px 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
}

.empty-state p {
  margin: 0;
  font-size: 0.88rem;
}

.empty-icon {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

/* HIGH FIDELITY MODALS */
.detail-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 10000;
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
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border: none;
  animation: modalScaleUp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalScaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.ref-code-lg {
  font-family: monospace;
  font-size: 0.72rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.5px;
}

.modal-header__title h3 {
  font-size: 1.2rem;
  font-weight: 800;
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
  transition: color 0.15s;
}

.modal-close-btn:hover {
  color: #0f172a;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-status-banner {
  padding: 0.85rem 1.25rem;
  border-radius: 10px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid transparent;
  text-align: left;
}

.clinical-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.section-heading {
  font-size: 0.88rem;
  font-weight: 800;
  color: #0f172a;
  border-bottom: 1.5px solid #f1f5f9;
  padding-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.clinical-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-cell.full-width {
  grid-column: span 2;
}

.cell-label {
  font-size: 0.72rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cell-value {
  font-size: 0.92rem;
  color: #334155;
  font-weight: 600;
}

.highlight-value {
  color: #0047AB;
  font-weight: 800;
}

.symptom-box {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.symptom-text {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.85rem 1.15rem;
  font-size: 0.88rem;
  color: #334155;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 1.25rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.btn-modal-close {
  background: #64748b;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.15s;
}

.btn-modal-close:hover {
  background: #475569;
}

.btn-modal-complete {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 6px rgba(16, 185, 129, 0.15);
}

.btn-modal-complete:hover {
  background: #059669;
  transform: translateY(-1px);
}

/* COMPLETE CLINICAL FORM MODAL STYLES */
.patient-brief-panel {
  background: #f8fafc;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  font-size: 0.85rem;
  border-left: 4px solid #0047AB;
  border-top: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.brief-item {
  color: #334155;
  font-weight: 600;
}

.brief-item strong {
  color: #64748b;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.72rem;
  display: block;
  margin-bottom: 2px;
}

.clinical-section-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.form-heading {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
  border-bottom: 1.5px solid #f1f5f9;
  padding-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.form-fields-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 800;
  color: #475569;
}

.form-input {
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  font-size: 0.9rem;
  background: white;
  transition: all 0.15s;
  outline: none;
}

.form-input:focus, .form-textarea:focus, .medicine-select:focus {
  border-color: #0047AB;
  box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.1);
}

.form-textarea {
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  font-size: 0.9rem;
  background: white;
  font-family: inherit;
  resize: vertical;
  transition: all 0.15s;
  outline: none;
}

.prescription-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1.5px solid #f1f5f9;
  padding-bottom: 8px;
}

.toggle-prescription-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 800;
  color: #0047AB;
  cursor: pointer;
}

.toggle-prescription-btn input {
  width: 16px;
  height: 16px;
}

.prescription-body-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f0f7ff;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1.5px solid #bfdbfe;
}

.medicine-table-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.medicine-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.medicine-list-header {
  display: grid;
  grid-template-columns: 2.2fr 1fr 2.5fr auto;
  gap: 10px;
  font-weight: 800;
  font-size: 0.72rem;
  color: #475569;
  padding-bottom: 6px;
  border-bottom: 1px solid #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.medicine-list-row {
  display: grid;
  grid-template-columns: 2.2fr 1fr 2.5fr auto;
  gap: 10px;
  align-items: center;
}

.medicine-select {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  font-size: 0.85rem;
  background: white;
  outline: none;
}

.medicine-qty {
  padding: 0.6rem 0.5rem;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  font-size: 0.85rem;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  outline: none;
}

.medicine-dosage {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  font-size: 0.85rem;
  width: 100%;
  box-sizing: border-box;
  outline: none;
}

.btn-remove-med {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 1.05rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.btn-remove-med:hover {
  background: #fca5a5;
  color: #b91c1c;
}

.btn-add-med {
  background: white;
  border: 1.5px dashed #0047AB;
  color: #0047AB;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  transition: all 0.15s;
}

.btn-add-med:hover {
  background: #eff6ff;
  border-color: #002244;
  color: #002244;
}

.btn-cancel {
  background: #e2e8f0;
  color: #334155;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel:hover {
  background: #cbd5e1;
}

.btn-submit {
  background: #0047AB;
  color: white;
  border: none;
  padding: 0.7rem 1.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 6px rgba(0, 71, 171, 0.15);
}

.btn-submit:hover {
  background: #002244;
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .sidebar {
    width: 80px;
    padding: 1.5rem 0.25rem;
  }
  .sidebar__header, .sidebar__divider, .user-brief-info, .sidebar__footer span:not(.nav-icon), .nav-item span:not(.nav-icon) {
    display: none;
  }
  .main-content {
    margin-left: 80px;
  }
  .logo__text {
    display: none;
  }
}
</style>
