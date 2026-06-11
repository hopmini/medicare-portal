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

          <div class="logo__text" style="font-weight: 800; font-size: 1.25rem; margin-left: 10px; color: #0f172a; letter-spacing: -0.5px;">
            Medicare<span style="color: #0047AB;">.</span>
          </div>
        </div>
      </div>

      <nav class="sidebar__nav">
        <div class="sidebar__divider">TIẾP TÂN</div>

        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'dashboard' }" @click="activeTab = 'dashboard'">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </span>
          <span>Dashboard tiếp tân</span>
        </div>

        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'appointments' }" @click="activeTab = 'appointments'">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </span>
          <span>Danh sách lịch hẹn</span>
        </div>

        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'payments' }" @click="activeTab = 'payments'">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          </span>
          <span>Trạng thái thanh toán</span>
        </div>

        <div class="nav-item" @click="$router.push('/dashboard?tab=pharmacy-billing')">
          <span>🧾</span>
          <span>Hóa đơn bán thuốc</span>
        </div>

        <div class="nav-item" @click="$router.push('/dashboard?tab=pharmacy-payments')">
          <span>💳</span>
          <span>Xác nhận thanh toán</span>
        </div>
      </nav>

      <div class="sidebar__footer">
        <div v-if="authStore.user?.value" class="user-brief">
          <div class="avatar-small">
            {{ (authStore.user.value.fullName || authStore.user.value.username || 'AD').substring(0, 2).toUpperCase() }}
          </div>
          <div class="user-brief-info">
            <p class="user-brief-name">{{ authStore.user.value.fullName }}</p>
            <p class="user-brief-role">Quản trị Tiếp tân</p>
          </div>
        </div>

        <div class="logout-btn" @click="authStore.logout()">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
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
          <div class="stat-card stat-card--blue">
            <div class="stat-card__content">
              <span class="stat-card__label">Tổng lịch hẹn</span>
              <p class="stat-card__value">{{ stats.total }}</p>
              <span class="stat-card__trend">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px; margin-right: 4px;" class="fa-spin">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                </svg>
                Cập nhật thời gian thực
              </span>
            </div>
            <div class="stat-card__icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </div>

          <div class="stat-card stat-card--amber">
            <div class="stat-card__content">
              <span class="stat-card__label">Chờ duyệt</span>
              <p class="stat-card__value" style="color: #d97706;">{{ stats.pending }}</p>
              <span class="stat-card__trend">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px; margin-right: 4px;">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Cần xử lý ngay
              </span>
            </div>
            <div class="stat-card__icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>

          <div class="stat-card stat-card--emerald">
            <div class="stat-card__content">
              <span class="stat-card__label">Đã xác nhận</span>
              <p class="stat-card__value" style="color: #16a34a;">{{ stats.confirmed }}</p>
              <span class="stat-card__trend" style="color: #10b981;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px; margin-right: 4px;">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Lịch hẹn hợp lệ
              </span>
            </div>
            <div class="stat-card__icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>

          <div class="stat-card stat-card--blue">
            <div class="stat-card__content">
              <span class="stat-card__label">Vai trò hiện tại</span>
              <p class="stat-card__value" style="font-size: 1.35rem; color: #0047AB; margin-top: 10px; font-weight: 800; text-transform: capitalize;">{{ authStore.user?.value?.role }}</p>
              <span class="stat-card__trend">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px; margin-right: 4px;">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Quyền hạn hệ thống
              </span>
            </div>
            <div class="stat-card__icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- RECENT APPOINTMENTS -->
        <div v-if="activeTab === 'dashboard' || activeTab === 'appointments'" class="table-card">
          <div class="table-card__header">
            <h3 class="table-card__title">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0047AB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {{ activeTab === 'dashboard' ? 'Danh sách chờ duyệt chuyên khoa' : 'Tất cả lịch hẹn đăng ký' }}
            </h3>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="table-card__badge">{{ filteredAppointments.length }} lịch hẹn</span>
              <button class="btn-refresh" @click="fetchData" :disabled="loading">
                <svg :class="{ 'fa-spin': loading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Làm mới dữ liệu
              </button>
            </div>
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
                      {{ (app.patientName || 'K').charAt(0) }}
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
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Chi tiết
                    </button>
                    <button v-if="app.status === 0" class="btn-table-action btn-approve" @click="approve(app.id)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Duyệt
                    </button>
                    <button v-if="app.status === 0 || app.status === 1" class="btn-table-action btn-cancel" @click="cancel(app.id)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Hủy
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TAB: PATIENT PAYMENT STATUS -->
        <div v-else-if="activeTab === 'payments'" class="table-card animate-fade-in">
          <div class="table-card__header" style="flex-wrap: wrap; gap: 1rem;">
            <h3 class="table-card__title">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0047AB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              Trạng thái thanh toán & Hóa đơn viện phí
            </h3>
            
            <div style="display: flex; gap: 12px; align-items: center; margin-left: auto;">
              <!-- Status Filter -->
              <select v-model="filterBillStatus" class="form-input" style="width: 170px; font-size: 0.85rem; padding: 6px 12px; border-radius: 6px; height: 38px; border: 1.5px solid #cbd5e1;">
                <option value="All">Tất cả trạng thái</option>
                <option value="Pending">Chờ thanh toán</option>
                <option value="Paid">Đã thanh toán</option>
              </select>

              <!-- Search input -->
              <div style="position: relative; width: 250px;">
                <input 
                  v-model="searchBillQuery" 
                  type="text" 
                  class="form-input" 
                  placeholder="Tìm theo ID bệnh nhân..." 
                  style="width: 100%; padding-left: 1rem; font-size: 0.85rem; padding: 6px 12px; border-radius: 6px; height: 38px; border: 1.5px solid #cbd5e1;"
                />
              </div>

              <button class="btn-refresh" @click="fetchBills" :disabled="loadingBills" style="padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; height: 38px; display: inline-flex; align-items: center; gap: 6px; background: #0047AB; color: white; border: none; font-weight: 700; cursor: pointer;">
                <svg :class="{ 'fa-spin': loadingBills }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Tải lại
              </button>
            </div>
          </div>

          <div v-if="loadingBills" class="empty-state" style="padding: 3rem 0;">
            <p>Đang tải danh sách hóa đơn viện phí...</p>
          </div>
          <div v-else-if="filteredBills.length === 0" class="empty-state" style="padding: 3rem 0;">
            <p>Không tìm thấy hóa đơn nào phù hợp.</p>
          </div>

          <table v-else class="data-table">
            <thead>
              <tr>
                <th style="width: 120px;">Mã hóa đơn</th>
                <th>Bệnh nhân</th>
                <th style="text-align: right;">Phí khám</th>
                <th style="text-align: right;">Tiền thuốc</th>
                <th style="text-align: right;">Tổng thanh toán</th>
                <th style="text-align: center;">Ngày tạo</th>
                <th style="text-align: center; width: 150px;">Trạng thái</th>
                <th style="text-align: right; width: 200px;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bill in filteredBills" :key="bill.id">
                <td>
                  <code style="font-family: monospace; font-weight: 800; color: #0047AB; font-size: 0.9rem;">
                    #INV-${String(bill.id).padStart(5, '0')}
                  </code>
                </td>
                <td style="text-align: left; font-weight: 700;">
                  <span style="color: #0f172a;">{{ bill.patient }}</span>
                  <span style="font-size: 0.72rem; color: #64748b; display: block;">Mã bệnh nhân: {{ bill.patientId }}</span>
                </td>
                <td style="text-align: right; font-weight: 600; color: #475569;">
                  {{ formatCurrency(bill.examinationFee) }}
                </td>
                <td style="text-align: right; font-weight: 600; color: #475569;">
                  {{ formatCurrency(bill.medicineFee) }}
                </td>
                <td style="text-align: right; font-weight: 800; color: #0047AB; font-size: 1rem;">
                  {{ formatCurrency(bill.totalAmount) }}
                </td>
                <td style="text-align: center; color: #64748b; font-size: 0.85rem;">
                  {{ formatDateWithTime(bill.createdAt) }}
                </td>
                <td style="text-align: center;">
                  <span 
                    class="badge" 
                    :class="bill.status === 'Paid' ? 'badge--confirmed' : 'badge--pending'"
                    style="font-weight: 800; font-size: 0.75rem; text-transform: uppercase;"
                  >
                    {{ bill.status === 'Paid' ? 'Đã thanh toán' : 'Chờ thanh toán' }}
                  </span>
                </td>
                <td style="text-align: right;">
                  <div class="action-cell-row">
                    <button 
                      v-if="bill.status !== 'Paid'" 
                      class="btn-table-action btn-approve" 
                      @click="confirmPayment(bill)"
                    >
                      💳 Xác nhận
                    </button>
                    <button 
                      class="btn-table-action btn-detail" 
                      @click="printBillInvoice(bill)"
                    >
                      🖨️ In
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- CLINICAL DETAILS MODAL (POPUP ON REQUEST) -->
    <div v-if="selectedApp" class="detail-modal-overlay" @click.self="closeDetail">
      <div class="detail-modal-card">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; margin-right: 4px;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Trạng thái duyệt hồ sơ: <strong>{{ getStatusText(selectedApp.status) }}</strong>
          </div>

          <!-- Section: Patient profile (parsed dynamically from booking reason note) -->
          <div class="clinical-section">
            <h4 class="section-heading">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Hồ sơ Hành chính Bệnh nhân
            </h4>
            
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
            <h4 class="section-heading">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              Thông tin Chỉ định khám & Phân giờ
            </h4>
            
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Phê duyệt & Cấp STT
          </button>
          <button v-if="selectedApp.status === 0 || selectedApp.status === 1" class="btn-modal-cancel" @click="cancelFromModal(selectedApp.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Hủy lịch hẹn
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
  import { getBills, payBill } from '@/services/pharmacyService'

  const authStore = useAuthStore()
  const activeTab = ref('dashboard')
  const searchQuery = ref('')
  const loading = ref(false)
  const selectedApp = ref<any>(null)

  const appointments = ref<any[]>([])

  // States for patient billing/payments
  const billsList = ref<any[]>([])
  const loadingBills = ref(false)
  const searchBillQuery = ref('')
  const filterBillStatus = ref('All')

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
      await fetchBills()
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

  // Bills methods and computed properties
  const filteredBills = computed(() => {
    let list = [...billsList.value]
    
    // Filter by status
    if (filterBillStatus.value !== 'All') {
      list = list.filter(b => b.status === filterBillStatus.value)
    }

    // Filter by search query
    if (searchBillQuery.value.trim()) {
      const q = searchBillQuery.value.toLowerCase().trim()
      list = list.filter(b => 
        (b.patient && b.patient.toLowerCase().includes(q)) || 
        String(b.patientId).includes(q) ||
        String(b.id).includes(q)
      )
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })

  async function fetchBills() {
    loadingBills.value = true
    try {
      const bills = await getBills()
      billsList.value = bills || []
    } catch (error) {
      console.error('Failed to fetch bills:', error)
    } finally {
      loadingBills.value = false
    }
  }

  async function confirmPayment(bill: any) {
    if (!confirm(`Xác nhận thanh toán cho hóa đơn #INV-${String(bill.id).padStart(5, '0')} với tổng số tiền là ${formatCurrency(bill.totalAmount)}?`)) return
    try {
      await payBill(bill.id)
      alert('Thanh toán hóa đơn thành công!')
      await fetchBills()
    } catch (error) {
      alert('Không thể thanh toán hóa đơn: ' + error)
    }
  }

  function formatCurrency(value: number) {
    if (value === undefined || value === null) return '0 đ'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  function formatDateWithTime(dateStr: string) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
  }

  function printBillInvoice(bill: any) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn thanh toán - Medicare</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #333; }
            .receipt-header { text-align: center; border-bottom: 2px solid #0047AB; padding-bottom: 15px; margin-bottom: 20px; }
            .receipt-title { font-size: 24px; font-weight: bold; color: #0047AB; }
            .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .details-table th, .details-table td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
            .details-table th { background: #f8f9fa; }
            .total-row { font-weight: bold; font-size: 18px; color: #0047AB; }
            .receipt-footer { text-align: center; margin-top: 40px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="receipt-header">
            <div class="receipt-title">MEDICARE CLINIC RECEIPT</div>
            <p>Hóa đơn viện phí & Thuốc biệt dược</p>
            <p>Mã hóa đơn: #INV-${String(bill.id).padStart(5, '0')}</p>
            <p>Ngày tạo: ${new Date(bill.createdAt).toLocaleString('vi-VN')}</p>
          </div>
          <div>
            <p><strong>Bệnh nhân:</strong> ${bill.patient}</p>
            <p><strong>Trạng thái:</strong> ${bill.status === 'Paid' ? 'ĐÃ THANH TOÁN (PAID)' : 'CHỜ THANH TOÁN (PENDING)'}</p>
          </div>
          <table class="details-table">
            <thead>
              <tr>
                <th>Hạng mục dịch vụ</th>
                <th style="text-align: right;">Chi phí</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Phí khám lâm sàng / Khám chuyên khoa</td>
                <td style="text-align: right;">${formatCurrency(bill.examinationFee)}</td>
              </tr>
              <tr>
                <td>Tiền thuốc biệt dược chỉ định</td>
                <td style="text-align: right;">${formatCurrency(bill.medicineFee)}</td>
              </tr>
              <tr class="total-row">
                <td>Tổng số tiền thanh toán:</td>
                <td style="text-align: right;">${formatCurrency(bill.totalAmount)}</td>
              </tr>
            </tbody>
          </table>
          <div class="receipt-footer">
            <p>Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ tại hệ thống phòng khám Medicare.</p>
            <p>Hỗ trợ kỹ thuật: support@medicare.vn | Hotline: 1900-6000</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
