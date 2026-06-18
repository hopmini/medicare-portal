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
          <span>Dashboard</span>
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
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'rooms' }" @click="activeTab = 'rooms'">
          <span class="nav-icon"><i class="fas fa-door-open text-blue" /></span>
          <span>Danh mục Phòng khám</span>
        </div>

        <div class="sidebar__divider">2. PHÂN HỆ BỆNH ÁN ĐIỆN TỬ</div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'medical-records' }" @click="activeTab = 'medical-records'">
          <span class="nav-icon"><i class="fas fa-notes-medical text-red" /></span>
          <span>Bệnh án điện tử</span>
        </div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'patient-registry' }" @click="activeTab = 'patient-registry'">
          <span class="nav-icon"><i class="fas fa-id-card text-red" /></span>
          <span>Hồ sơ Bệnh nhân</span>
        </div>

        <div class="sidebar__divider">3. PHÂN HỆ DƯỢC & HÓA ĐƠN</div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'pharmacy-medicines' }" @click="activeTab = 'pharmacy-medicines'">
          <span class="nav-icon"><i class="fas fa-prescription-bottle-alt text-green" /></span>
          <span>Quản lý thuốc</span>
        </div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'pharmacy-suppliers' }" @click="activeTab = 'pharmacy-suppliers'">
          <span class="nav-icon"><i class="fas fa-truck text-green" /></span>
          <span>Nhà cung cấp</span>
        </div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'pharmacy-import-bills' }" @click="activeTab = 'pharmacy-import-bills'">
          <span class="nav-icon"><i class="fas fa-file-import text-green" /></span>
          <span>Phiếu nhập thuốc</span>
        </div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'pharmacy-batches' }" @click="activeTab = 'pharmacy-batches'">
          <span class="nav-icon"><i class="fas fa-boxes text-green" /></span>
          <span>Tồn kho theo lô</span>
        </div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'pharmacy-prescriptions' }" @click="activeTab = 'pharmacy-prescriptions'">
          <span class="nav-icon"><i class="fas fa-file-prescription text-green" /></span>
          <span>Đơn thuốc &amp; Bán lẻ</span>
        </div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'pharmacy-billing' }" @click="activeTab = 'pharmacy-billing'">
          <span class="nav-icon"><i class="fas fa-receipt text-green" /></span>
          <span>Hóa đơn bán thuốc</span>
        </div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'pharmacy-payments' }" @click="activeTab = 'pharmacy-payments'">
          <span class="nav-icon"><i class="fas fa-credit-card text-green" /></span>
          <span>Quản lý thanh toán</span>
        </div>
        <div class="nav-item" :class="{ 'nav-item--active': activeTab === 'pharmacy-stock-history' }" @click="activeTab = 'pharmacy-stock-history'">
          <span class="nav-icon"><i class="fas fa-history text-green" /></span>
          <span>Lịch sử kho thuốc</span>
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
            <span style="margin-left: 6px; font-size: 0.72rem; font-weight: 600; color: #94a3b8; cursor: pointer; white-space: nowrap;" @click.stop="openCommandPalette" title="Mở tìm kiếm trang (Ctrl+K)">(Ctrl+K)</span>
          </div>

          <!-- COMPACT USER PILL IN TOP-RIGHT OF TOP-BAR WITH DROPDOWN -->
          <div v-if="authStore.user" class="top-user-dropdown-wrapper">
            <a-dropdown :trigger="['click']" placement="bottomRight">
              <div class="top-user-pill shadow-light" style="cursor: pointer;">
                <div class="top-user-main-info" style="display: flex; align-items: center; gap: 12px;">
                  <div class="avatar-small-top">{{ (authStore.user.username || authStore.user.fullName || 'AD').substring(0, 2).toUpperCase() }}</div>
                  <div class="top-user-info">
                    <p class="top-user-name">{{ authStore.user.fullName }}</p>
                    <p class="top-user-role">Hệ thống Admin</p>
                  </div>
                </div>
                <i class="fas fa-chevron-down" style="font-size: 0.75rem; color: #94a3b8; margin-left: 8px;" />
              </div>
              <template #overlay>
                <a-menu style="min-width: 150px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); padding: 4px 0;">
                  <a-menu-item key="profile" @click="$router.push('/profile')" style="padding: 10px 16px;">
                    <i class="far fa-user" style="margin-right: 8px; color: #596780;" /> Trang cá nhân
                  </a-menu-item>
                  <a-menu-divider style="margin: 4px 0;" />
                  <a-menu-item key="logout" @click="authStore.logout" style="padding: 10px 16px; color: #ef4444;">
                    <i class="fas fa-sign-out-alt" style="margin-right: 8px; color: #ef4444;" /> Đăng xuất
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </header>

      <!-- PAGE CONTAINER -->
      <div class="page-container">

        <!-- TAB 1: COCKPIT OVERVIEW (Dabang Redesign) -->
        <div v-if="activeTab === 'overview'" class="tab-content dashboard-overview-redesign">
          
          <!-- Top Analytics Row -->
          <div class="analytics-row">
            
            <!-- Left Side: Today's Sales & Total Revenue & Customer Satisfaction & Top Products -->
            <div class="analytics-left">
              
              <!-- Today's Sales Widget -->
              <div class="widget-card todays-sales-widget">
                <div class="widget-header-row">
                  <div>
                    <h3 class="widget-title">Hoạt động Hôm nay</h3>
                    <p class="widget-subtitle">Tóm tắt hoạt động khám chữa bệnh</p>
                  </div>
                  <button class="btn-export-widget" @click="fetchAllData">
                    <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }" /> Đồng bộ
                  </button>
                </div>
                
                <div class="sales-cards-grid">
                  <!-- Pink Card -->
                  <div class="sales-card pink-card">
                    <div class="sales-card-icon"><i class="fas fa-chart-line" /></div>
                    <div class="sales-card-value">{{ stats.totalAppointments }}</div>
                    <div class="sales-card-label">Tổng Lượt Hẹn</div>
                    <div class="sales-card-trend">+8% so với hôm qua</div>
                  </div>
                  
                  <!-- Orange Card -->
                  <div class="sales-card orange-card">
                    <div class="sales-card-icon"><i class="fas fa-hourglass-half" /></div>
                    <div class="sales-card-value">{{ stats.pendingAppointments }}</div>
                    <div class="sales-card-label">Chờ Phê Duyệt</div>
                    <div class="sales-card-trend">+5% so với hôm qua</div>
                  </div>
                  
                  <!-- Green Card -->
                  <div class="sales-card green-card">
                    <div class="sales-card-icon"><i class="fas fa-file-prescription" /></div>
                    <div class="sales-card-value">{{ stats.prescriptionsCount }}</div>
                    <div class="sales-card-label">Đơn Thuốc Đã Kê</div>
                    <div class="sales-card-trend">Đơn thuốc của ngày</div>
                  </div>
                  
                  <!-- Purple Card -->
                  <div class="sales-card purple-card">
                    <div class="sales-card-icon"><i class="fas fa-user-plus" /></div>
                    <div class="sales-card-value">{{ stats.newPatientsToday }}</div>
                    <div class="sales-card-label">Bệnh Nhân Mới</div>
                    <div class="sales-card-trend">Đăng ký hôm nay</div>
                  </div>
                </div>
              </div>

              <!-- Second Row: Total Revenue & Customer Satisfaction & Target vs Reality -->
              <div class="widgets-middle-grid">
                <!-- Total Revenue Chart -->
                <div class="widget-card revenue-chart-widget">
                  <h3 class="widget-title">Doanh Thu Phòng Khám</h3>
                  <div class="canvas-wrapper">
                    <canvas id="revenueChart" />
                  </div>
                </div>
                
                <!-- Customer Satisfaction Chart -->
                <div class="widget-card satisfaction-widget">
                  <h3 class="widget-title">Độ Hài Lòng (CSAT)</h3>
                  <div class="canvas-wrapper">
                    <canvas id="satisfactionChart" />
                  </div>
                  <div class="satisfaction-legend">
                    <div class="legend-item"><span class="dot last-month-dot"></span> Tháng trước <span>$3,004</span></div>
                    <div class="legend-item"><span class="dot this-month-dot"></span> Tháng này <span>$4,504</span></div>
                  </div>
                </div>
              </div>

              <!-- Third Row: Top Products & Sales Mapping -->
              <div class="widgets-bottom-grid">
                <!-- Top Products (Medical Services) -->
                <div class="widget-card top-products-widget">
                  <h3 class="widget-title">Dịch Vụ Phổ Biến</h3>
                  <div class="products-list">
                    <div class="product-item">
                      <span class="product-num">01</span>
                      <div class="product-info">
                        <span class="product-name">Khám sức khỏe tổng quát</span>
                        <div class="progress-bar-container"><div class="progress-bar-fill" style="width: 85%; background: #0047AB;"></div></div>
                      </div>
                      <span class="product-percent badge-blue">85%</span>
                    </div>
                    <div class="product-item">
                      <span class="product-num">02</span>
                      <div class="product-info">
                        <span class="product-name">Xét nghiệm huyết học</span>
                        <div class="progress-bar-container"><div class="progress-bar-fill" style="width: 72%; background: #10B981;"></div></div>
                      </div>
                      <span class="product-percent badge-green">72%</span>
                    </div>
                    <div class="product-item">
                      <span class="product-num">03</span>
                      <div class="product-info">
                        <span class="product-name">Chụp X-Quang Tim Phổi</span>
                        <div class="progress-bar-container"><div class="progress-bar-fill" style="width: 48%; background: #F59E0B;"></div></div>
                      </div>
                      <span class="product-percent badge-yellow">48%</span>
                    </div>
                    <div class="product-item">
                      <span class="product-num">04</span>
                      <div class="product-info">
                        <span class="product-name">Siêu âm Doppler Tim</span>
                        <div class="progress-bar-container"><div class="progress-bar-fill" style="width: 30%; background: #8B5CF6;"></div></div>
                      </div>
                      <span class="product-percent badge-purple">30%</span>
                    </div>
                  </div>
                </div>

                <!-- Sales Mapping by Area -->
                <div class="widget-card mapping-widget">
                  <h3 class="widget-title">Lượt Khám Theo Quận</h3>
                  <div class="mapping-list">
                    <div class="mapping-item">
                      <div class="mapping-lead">
                        <i class="fas fa-map-marker-alt" style="color: #EF4444;" />
                        <span>Quận 1, TP. HCM</span>
                      </div>
                      <span class="mapping-val">45%</span>
                    </div>
                    <div class="mapping-item">
                      <div class="mapping-lead">
                        <i class="fas fa-map-marker-alt" style="color: #F59E0B;" />
                        <span>Quận 3, TP. HCM</span>
                      </div>
                      <span class="mapping-val">29%</span>
                    </div>
                    <div class="mapping-item">
                      <div class="mapping-lead">
                        <i class="fas fa-map-marker-alt" style="color: #10B981;" />
                        <span>Bình Thạnh, TP. HCM</span>
                      </div>
                      <span class="mapping-val">18%</span>
                    </div>
                    <div class="mapping-item">
                      <div class="mapping-lead">
                        <i class="fas fa-map-marker-alt" style="color: #3B82F6;" />
                        <span>Thủ Đức, TP. HCM</span>
                      </div>
                      <span class="mapping-val">8%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Right Side: Visitor Insights & Target vs Reality & Volume vs Service Level -->
            <div class="analytics-right">
              <!-- Visitor Insights (Line Chart) -->
              <div class="widget-card visitor-insights-widget">
                <h3 class="widget-title">Nhật Ký Lượt Khám</h3>
                <div class="canvas-wrapper">
                  <canvas id="visitorInsightsChart" />
                </div>
              </div>

              <!-- Target vs Reality Chart -->
              <div class="widget-card target-reality-widget">
                <h3 class="widget-title">Chỉ Tiêu Hoạt Động</h3>
                <div class="canvas-wrapper">
                  <canvas id="targetRealityChart" />
                </div>
              </div>

              <!-- Volume vs Service Level Chart -->
              <div class="widget-card volume-service-widget">
                <h3 class="widget-title">Lượng Khám Theo Chuyên Khoa</h3>
                <div class="canvas-wrapper">
                  <canvas id="volumeServiceChart" />
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
          <div style="background: #ffffff; padding: 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; margin-bottom: 20px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 700; color: #475569; font-size: 0.9rem; white-space: nowrap;">Lọc Trạng Thái:</span>
              <a-select v-model:value="filterStatus" style="width: 180px;">
                <a-select-option value="all">Tất cả trạng thái</a-select-option>
                <a-select-option value="0">Chờ duyệt</a-select-option>
                <a-select-option value="1">Đã duyệt</a-select-option>
                <a-select-option value="2">Đã khám</a-select-option>
                <a-select-option value="3">Đã hủy</a-select-option>
              </a-select>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 250px;">
              <span style="font-weight: 700; color: #475569; font-size: 0.9rem; white-space: nowrap;">Tìm kiếm:</span>
              <a-input v-model:value="searchPatientQuery" placeholder="Họ tên bệnh nhân..." allow-clear />
            </div>
            <div style="font-size: 0.9rem; color: #64748b; font-weight: 600;">
              Tìm thấy: <strong style="color: #0f172a; font-size: 1rem;">{{ filteredAppointments.length }}</strong> lịch hẹn
            </div>
          </div>

          <a-table 
            :columns="columnsAppointments" 
            :data-source="filteredAppointments" 
            row-key="id" 
            :pagination="{ pageSize: 8 }"
            class="custom-antd-table"
          >
            <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
              <div style="padding: 8px">
                <a-input
                  :placeholder="`Tìm kiếm ${column.title}...`"
                  :value="selectedKeys[0]"
                  style="width: 188px; margin-bottom: 8px; display: block;"
                  @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                  @pressEnter="confirm()"
                />
                <div style="display: flex; gap: 8px;">
                  <a-button
                    type="primary"
                    size="small"
                    style="flex: 1; background-color: var(--primary); border-color: var(--primary);"
                    @click="confirm()"
                  >
                    Tìm
                  </a-button>
                  <a-button size="small" style="flex: 1;" @click="clearFilters(); confirm()">
                    Xóa
                  </a-button>
                </div>
              </div>
            </template>
            <template #customFilterIcon="{ filtered }">
              <i class="fas fa-search" :style="{ color: filtered ? '#3b82f6' : '#bfbfbf', fontSize: '0.85rem' }" />
            </template>
            <template #bodyCell="{ record, column, index }">
              <template v-if="column.key === 'stt'">
                <strong style="color: #64748b;">{{ index + 1 }}</strong>
              </template>
              <template v-else-if="column.key === 'id'">
                <code>#{{ String(record.id || '').substring(0, 8).toUpperCase() }}</code>
              </template>
              <template v-else-if="column.key === 'patientName'">
                <div class="user-cell" style="display: flex; align-items: center; gap: 8px;">
                  <div class="avatar-cell" style="width: 32px; height: 32px; line-height: 32px; border-radius: 50%; background: #e0f2fe; color: #0369a1; text-align: center; font-weight: 700;">{{ record.patientName?.charAt(0) }}</div>
                  <div><p style="font-weight: 700; margin: 0; color: #1e293b;">{{ record.patientName }}</p></div>
                </div>
              </template>
              <template v-else-if="column.key === 'doctorName'">
                <span class="doctor-name" style="font-weight: 600; color: #0047AB;">BS. {{ record.doctorName }}</span>
              </template>
              <template v-else-if="column.key === 'dateTime'">
                <p style="font-weight: 700; margin: 0; color: #1e293b;">{{ formatTime(record.time) }}</p>
                <p style="font-size: 0.75rem; color: #64748b; margin: 0; font-weight: 500;">{{ formatDate(record.date) }}</p>
              </template>
              <template v-else-if="column.key === 'serviceName'">
                <span class="badge badge--service" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; font-weight: 600; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem;">{{ record.serviceName }}</span>
              </template>
              <template v-else-if="column.key === 'queueNumber'">
                <span v-if="record.queueNumber" class="queue-number" style="font-weight: 700; color: #0f172a; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">#{{ record.queueNumber }}</span>
                <span v-else style="color: #94a3b8; font-style: italic;">Chưa cấp</span>
              </template>
              <template v-else-if="column.key === 'status'">
                <span class="badge" :class="getStatusClass(record.status)">{{ getStatusText(record.status) }}</span>
              </template>
              <template v-else-if="column.key === 'action'">
                <div class="action-btns" style="display: flex; justify-content: center; gap: 8px;">
                  <button v-if="record.status === 0" class="btn-icon btn-icon--check" @click="approve(record.id)" title="Duyệt đơn" style="border: none; background: #ecfdf5; color: #10b981; width: 30px; height: 30px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                    <i class="fas fa-check" />
                  </button>
                  <button v-if="record.status === 0" class="btn-icon btn-icon--close" @click="cancel(record.id)" title="Hủy đơn" style="border: none; background: #fef2f2; color: #ef4444; width: 30px; height: 30px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                    <i class="fas fa-times" />
                  </button>
                  <span v-else style="color: #94a3b8; font-size: 0.8rem; font-weight: 600;">Đã xử lý</span>
                </div>
              </template>
            </template>
          </a-table>
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
            <button v-if="authStore.user?.role === 'Admin'" class="btn-primary-cockpit" @click="showSlotModal = true">
              <i class="fas fa-magic" /> Khởi tạo lịch trực
            </button>
            <span v-else class="badge" style="background: #f1f5f9; color: #64748b; font-weight: 600; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">
              <i class="fas fa-lock" style="margin-right: 6px;" /> Chỉ Admin mới được phân lịch trực
            </span>
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
                <button v-if="authStore.user?.role === 'Admin'" class="btn-primary-cockpit" style="margin-top: 1rem;" @click="formSlots.doctorId = selectedScheduleDoc; formSlots.date = selectedScheduleDate; showSlotModal = true">
                  <i class="fas fa-plus" /> Khởi tạo ca trực ngay
                </button>
              </div>
              <div v-else class="slots-grid-pane">
                <div v-for="slot in activeSlots" :key="slot.id" class="slot-time-pill" :class="{ 'slot-booked': slot.isBooked }">
                  <div class="slot-pill-header">
                    <span class="slot-pill-time"><i class="far fa-clock" /> {{ formatTime(slot.startTime) }} - {{ formatTime(slot.endTime) }}</span>
                    <span class="slot-pill-status-badge" :class="slot.isBooked ? 'status-busy' : 'status-free'">
                      {{ slot.isBooked ? 'Đã đặt' : 'Còn trống' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 4: DOCTORS DIRECTORY -->
        <div v-if="activeTab === 'doctors'" class="tab-content">
          <div style="background: #ffffff; padding: 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; margin-bottom: 20px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 250px;">
              <span style="font-weight: 700; color: #475569; font-size: 0.9rem; white-space: nowrap;">Tìm kiếm bác sĩ:</span>
              <a-input v-model:value="searchDoctorQuery" placeholder="Họ tên, chuyên khoa, học vị..." allow-clear />
            </div>
            <div style="font-size: 0.9rem; color: #64748b; font-weight: 600;">
              Tổng số bác sĩ: <strong style="color: #0f172a; font-size: 1rem;">{{ filteredDoctors.length }}</strong> bác sĩ
            </div>
            <button class="btn-primary-cockpit" @click="showDoctorModal = true" style="margin-left: auto;">
              <i class="fas fa-user-plus" /> Thêm bác sĩ mới
            </button>
          </div>

          <a-table 
            :columns="columnsDoctors" 
            :data-source="filteredDoctors" 
            row-key="id" 
            :pagination="{ pageSize: 8 }"
            class="custom-antd-table"
          >
            <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
              <div style="padding: 8px">
                <a-input
                  :placeholder="`Tìm kiếm ${column.title}...`"
                  :value="selectedKeys[0]"
                  style="width: 188px; margin-bottom: 8px; display: block;"
                  @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                  @pressEnter="confirm()"
                />
                <div style="display: flex; gap: 8px;">
                  <a-button
                    type="primary"
                    size="small"
                    style="flex: 1; background-color: var(--primary); border-color: var(--primary);"
                    @click="confirm()"
                  >
                    Tìm
                  </a-button>
                  <a-button size="small" style="flex: 1;" @click="clearFilters(); confirm()">
                    Xóa
                  </a-button>
                </div>
              </div>
            </template>
            <template #customFilterIcon="{ filtered }">
              <i class="fas fa-search" :style="{ color: filtered ? '#3b82f6' : '#bfbfbf', fontSize: '0.85rem' }" />
            </template>
              <template #bodyCell="{ record, column, index }">
                <template v-if="column.key === 'stt'">
                  <strong style="color: #64748b;">{{ index + 1 }}</strong>
                </template>
                <template v-else-if="column.key === 'avatar'">
                  <div class="avatar-cell" style="width: 32px; height: 32px; line-height: 32px; border-radius: 50%; background: #eff6ff; color: var(--primary); text-align: center; font-weight: 700; font-size: 0.9rem; margin: 0 auto;">
                    {{ record.fullName.charAt(0) }}
                  </div>
                </template>
                <template v-else-if="column.key === 'fullName'">
                  <strong style="color: #1e293b;">{{ record.fullName }}</strong>
                </template>
                <template v-else-if="column.key === 'consultationFee'">
                  <span style="font-weight: 700; color: #0f172a;">{{ formatCurrency(record.consultationFee || 150000) }}</span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <button class="btn-primary-cockpit" style="padding: 6px 12px !important; font-size: 0.8rem !important; border-radius: 8px !important; white-space: nowrap !important; height: auto !important; min-height: 0 !important; font-weight: 600 !important;" @click="viewDoctorInfo(record)">
                    <i class="fas fa-key" style="font-size: 0.75rem;" /> Xem tài khoản
                  </button>
                </template>
              </template>
          </a-table>
        </div>

        <!-- TAB 5: SERVICES DIRECTORY -->
        <div v-if="activeTab === 'services'" class="tab-content">
          <div style="background: #ffffff; padding: 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; margin-bottom: 20px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 250px;">
              <span style="font-weight: 700; color: #475569; font-size: 0.9rem; white-space: nowrap;">Tìm kiếm dịch vụ:</span>
              <a-input v-model:value="searchServiceQuery" placeholder="Tên dịch vụ, mô tả..." allow-clear />
            </div>
            <div style="font-size: 0.9rem; color: #64748b; font-weight: 600;">
              Tổng số dịch vụ: <strong style="color: #0f172a; font-size: 1rem;">{{ filteredServices.length }}</strong> dịch vụ
            </div>
            <button class="btn-primary-cockpit" @click="showServiceModal = true" style="margin-left: auto;">
              <i class="fas fa-plus" /> Thêm dịch vụ mới
            </button>
          </div>

          <a-table 
            :columns="columnsServices" 
            :data-source="filteredServices" 
            row-key="id" 
            :pagination="{ pageSize: 8 }"
            class="custom-antd-table"
          >
            <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
              <div style="padding: 8px">
                <a-input
                  :placeholder="`Tìm kiếm ${column.title}...`"
                  :value="selectedKeys[0]"
                  style="width: 188px; margin-bottom: 8px; display: block;"
                  @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                  @pressEnter="confirm()"
                />
                <div style="display: flex; gap: 8px;">
                  <a-button
                    type="primary"
                    size="small"
                    style="flex: 1; background-color: var(--primary); border-color: var(--primary);"
                    @click="confirm()"
                  >
                    Tìm
                  </a-button>
                  <a-button size="small" style="flex: 1;" @click="clearFilters(); confirm()">
                    Xóa
                  </a-button>
                </div>
              </div>
            </template>
            <template #customFilterIcon="{ filtered }">
              <i class="fas fa-search" :style="{ color: filtered ? '#3b82f6' : '#bfbfbf', fontSize: '0.85rem' }" />
            </template>
            <template #bodyCell="{ record, column, index }">
              <template v-if="column.key === 'stt'">
                <strong style="color: #64748b;">{{ index + 1 }}</strong>
              </template>
              <template v-else-if="column.key === 'name'">
                <strong style="color: #1e293b;">{{ record.name }}</strong>
              </template>
              <template v-else-if="column.key === 'price'">
                <span style="font-weight: 700; color: #16a34a;">{{ formatCurrency(record.price) }}</span>
              </template>
              <template v-else-if="column.key === 'status'">
                <span class="badge badge--completed" style="background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; font-weight: 600; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem;">
                  <i class="fas fa-check-circle" style="margin-right: 4px;" /> Đang hoạt động
                </span>
              </template>
              <template v-else-if="column.key === 'action'">
                <div style="display: flex; gap: 6px; justify-content: center;">
                  <a-button type="primary" size="small" style="background: #3b82f6; border: none; display: flex; align-items: center; justify-content: center;" @click="editService(record)">
                    <i class="fas fa-edit" />
                  </a-button>
                  <a-button type="primary" danger size="small" style="display: flex; align-items: center; justify-content: center;" @click="deleteService(record.id)">
                    <i class="fas fa-trash-alt" />
                  </a-button>
                </div>
              </template>
            </template>
          </a-table>
        </div>

        <!-- TAB ROOMS: CLINIC ROOM MANAGEMENT -->
        <div v-if="activeTab === 'rooms'" class="tab-content">
          <div style="background: #ffffff; padding: 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; margin-bottom: 20px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 250px;">
              <span style="font-weight: 700; color: #475569; font-size: 0.9rem; white-space: nowrap;">Tìm kiếm phòng khám:</span>
              <a-input v-model:value="searchRoomQuery" placeholder="Mã phòng, tên phòng, bác sĩ phụ trách..." allow-clear />
            </div>
            <div>
              <button class="btn-main" style="background: linear-gradient(135deg, #0047AB 0%, #1e40af 100%); color: #ffffff !important; border: none;" @click="openAddRoomModal">
                <i class="fas fa-plus" /> Thêm phòng khám mới
              </button>
            </div>
          </div>

          <a-table
            :columns="columnsRooms"
            :data-source="filteredRooms"
            :pagination="{ pageSize: 8 }"
            class="custom-antd-table shadow-light"
            style="background: #ffffff; border-radius: 12px; overflow: hidden; border: 1.5px solid #e2e8f0;"
            row-key="id"
          >
            <template #bodyCell="{ record, column, index }">
              <template v-if="column.key === 'stt'">
                <strong style="color: #64748b;">{{ index + 1 }}</strong>
              </template>
              <template v-else-if="column.key === 'code'">
                <span style="font-family: monospace; font-weight: 800; color: #0f172a; font-size: 0.95rem; background: #f1f5f9; padding: 4px 8px; border-radius: 6px;">{{ record.code }}</span>
              </template>
              <template v-else-if="column.key === 'name'">
                <strong style="color: #1e293b; font-size: 0.95rem;">{{ record.name }}</strong>
              </template>
              <template v-else-if="column.key === 'floor'">
                <span style="color: #475569; font-weight: 600;"><i class="fas fa-layer-group" style="color: #94a3b8; margin-right: 6px;" />{{ record.floor }}</span>
              </template>
              <template v-else-if="column.key === 'doctorName'">
                <span v-if="record.doctorName" style="color: #1e3a8a; font-weight: 700;">
                  <i class="fas fa-user-md" style="color: #3b82f6; margin-right: 6px;" />{{ record.doctorName }}
                </span>
                <span v-else style="color: #94a3b8; font-style: italic;">Chưa phân công</span>
              </template>
              <template v-else-if="column.key === 'status'">
                <span v-if="record.status === 'Hoạt động'" class="badge badge--completed" style="background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">
                  <i class="fas fa-check-circle" style="margin-right: 4px;" /> Hoạt động
                </span>
                <span v-else class="badge badge--cancelled" style="background: #fff1f2; color: #9f1239; border: 1px solid #fecdd3; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">
                  <i class="fas fa-tools" style="margin-right: 4px;" /> Bảo trì
                </span>
              </template>
              <template v-else-if="column.key === 'action'">
                <div style="display: flex; gap: 8px; justify-content: center;">
                  <a-button type="primary" size="small" style="background: #3b82f6; border: none; display: flex; align-items: center; justify-content: center;" @click="openEditRoomModal(record)">
                    <i class="fas fa-edit" />
                  </a-button>
                  <a-button type="primary" danger size="small" style="display: flex; align-items: center; justify-content: center;" @click="deleteRoom(record.id)">
                    <i class="fas fa-trash-alt" />
                  </a-button>
                </div>
              </template>
            </template>
          </a-table>
        </div>

        <!-- TAB 6: MEDICAL RECORDS -->
        <div v-if="activeTab === 'medical-records'" class="tab-content">
          <div style="background: #ffffff; padding: 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; margin-bottom: 20px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 250px;">
              <span style="font-weight: 700; color: #475569; font-size: 0.9rem; white-space: nowrap;">Tìm kiếm bệnh án:</span>
              <a-input v-model:value="searchRecordQuery" placeholder="Triệu chứng, chẩn đoán..." allow-clear />
            </div>
            <div style="font-size: 0.9rem; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 12px;">
              <span>Tổng số bệnh án: <strong style="color: #0f172a; font-size: 1rem;">{{ allMedicalRecords.length }}</strong> bản ghi</span>
              <button class="btn-primary-cockpit" style="padding: 4px 12px; border-radius: 6px; font-weight: 700; background: #991b1b; color: white; border: none; cursor: pointer; font-size: 0.8rem;" @click="loadDeletedRecords">
                <i class="fas fa-trash-restore" /> Khôi phục
              </button>
            </div>
          </div>

          <a-table 
            :columns="columnsMedicalRecords" 
            :data-source="filteredRecords" 
            row-key="id" 
            :pagination="{ pageSize: 8 }"
            class="custom-antd-table"
          >
            <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
              <div style="padding: 8px">
                <a-input
                  :placeholder="`Tìm kiếm ${column.title}...`"
                  :value="selectedKeys[0]"
                  style="width: 188px; margin-bottom: 8px; display: block;"
                  @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                  @pressEnter="confirm()"
                />
                <div style="display: flex; gap: 8px;">
                  <a-button
                    type="primary"
                    size="small"
                    style="flex: 1; background-color: var(--primary); border-color: var(--primary);"
                    @click="confirm()"
                  >
                    Tìm
                  </a-button>
                  <a-button size="small" style="flex: 1;" @click="clearFilters(); confirm()">
                    Xóa
                  </a-button>
                </div>
              </div>
            </template>
            <template #customFilterIcon="{ filtered }">
              <i class="fas fa-search" :style="{ color: filtered ? '#3b82f6' : '#bfbfbf', fontSize: '0.85rem' }" />
            </template>
              <template #bodyCell="{ record, column, index }">
                <template v-if="column.key === 'stt'">
                  <strong style="color: #64748b;">{{ index + 1 }}</strong>
                </template>
                <template v-else-if="column.key === 'id'">
                  <code style="font-size: 0.8rem; font-weight: 600;">#{{ String(record.id || '').substring(0, 8).toUpperCase() }}</code>
                </template>
                <template v-else-if="column.key === 'patientId'">
                  <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span style="font-weight: 700; color: #1e293b; font-size: 0.85rem;">
                      {{ getPatientInfo(record.patientId)?.fullName || 'Chưa rõ' }}
                    </span>
                    <span style="font-family: monospace; font-size: 0.75rem; color: #0047AB; background: #e0f2fe; padding: 1px 4px; border-radius: 4px; width: fit-content;" :title="record.patientId">
                      {{ getPatientInfo(record.patientId)?.gatewayPatientId ? '#' + getPatientInfo(record.patientId).gatewayPatientId : (record.gatewayPatientId ? '#' + record.gatewayPatientId : '#' + (parseInt(String(record.patientId || '').split('-').pop() || '0', 10) || '?')) }}
                    </span>
                  </div>
                </template>
                <template v-else-if="column.key === 'symptoms'">
                  <div 
                    style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; color: #475569;"
                    :title="record.symptoms"
                    @click="viewRecordDetails(record)"
                    class="clickable-text"
                  >
                    {{ record.symptoms || 'Chưa ghi nhận' }}
                  </div>
                </template>
                <template v-else-if="column.key === 'diagnosis'">
                  <span 
                    class="badge badge--completed clickable-badge"
                    style="background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; font-weight: 600; padding: 4px 8px; border-radius: 6px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; vertical-align: middle; cursor: pointer;"
                    :title="record.diagnosis"
                    @click="viewRecordDetails(record)"
                  >
                    {{ record.diagnosis }}
                  </span>
                </template>
                <template v-else-if="column.key === 'prescription'">
                  <span v-if="record.prescription" class="badge badge--service" style="background: #fdf2f2; color: #991b1b; border: 1px solid #fca5a5; font-weight: 600; padding: 2px 8px; border-radius: 6px;">
                    <i class="fas fa-pills" /> Có kê đơn
                  </span>
                  <span v-else style="color: #94a3b8; font-style: italic;">Không kê đơn</span>
                </template>
                <template v-else-if="column.key === 'createdAt'">
                  {{ formatDate(record.createdAt) }}
                </template>
                <template v-else-if="column.key === 'action'">
                  <button class="btn-primary-cockpit" style="padding: 6px 12px !important; font-size: 0.8rem !important; border-radius: 8px !important; white-space: nowrap !important; height: auto !important; min-height: 0 !important; font-weight: 600 !important;" @click="viewRecordDetails(record)">
                    <i class="fas fa-eye" style="font-size: 0.75rem;" /> Chi tiết
                  </button>
                </template>
              </template>
          </a-table>
        </div>

        <!-- TAB 7: PATIENT REGISTRY -->
        <div v-if="activeTab === 'patient-registry'" class="tab-content">
          <div style="background: #ffffff; padding: 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; margin-bottom: 20px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 250px;">
              <span style="font-weight: 700; color: #475569; font-size: 0.9rem; white-space: nowrap;">Tìm kiếm bệnh nhân:</span>
              <a-input v-model:value="searchPatientRegistryQuery" placeholder="Họ tên bệnh nhân..." allow-clear />
            </div>
            <div style="font-size: 0.9rem; color: #64748b; font-weight: 600;">
              Tổng số bệnh nhân: <strong style="color: #0f172a; font-size: 1rem;">{{ allPatientsList.length }}</strong> người
            </div>
          </div>

          <a-table 
            :columns="columnsPatients" 
            :data-source="filteredPatientRegistry" 
            row-key="id" 
            :pagination="{ pageSize: 8 }"
            class="custom-antd-table"
          >
            <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
              <div style="padding: 8px">
                <a-input
                  :placeholder="`Tìm kiếm ${column.title}...`"
                  :value="selectedKeys[0]"
                  style="width: 188px; margin-bottom: 8px; display: block;"
                  @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                  @pressEnter="confirm()"
                />
                <div style="display: flex; gap: 8px;">
                  <a-button
                    type="primary"
                    size="small"
                    style="flex: 1; background-color: var(--primary); border-color: var(--primary);"
                    @click="confirm()"
                  >
                    Tìm
                  </a-button>
                  <a-button size="small" style="flex: 1;" @click="clearFilters(); confirm()">
                    Xóa
                  </a-button>
                </div>
              </div>
            </template>
            <template #customFilterIcon="{ filtered }">
              <i class="fas fa-search" :style="{ color: filtered ? '#3b82f6' : '#bfbfbf', fontSize: '0.85rem' }" />
            </template>
              <template #bodyCell="{ record, column, index }">
                <template v-if="column.key === 'stt'">
                  <strong style="color: #64748b;">{{ index + 1 }}</strong>
                </template>
                <template v-else-if="column.key === 'id'">
                  <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span v-if="record.gatewayPatientId" style="font-weight: 700; color: #0047AB; font-size: 0.85rem; background: #e0f2fe; padding: 2px 6px; border-radius: 4px; display: inline-block; width: fit-content;">
                      #{{ record.gatewayPatientId }}
                    </span>
                    <span style="font-family: monospace; font-size: 0.75rem; color: #64748b;" :title="record.id">
                      {{ record.id ? (record.id.length > 8 ? record.id.substring(0, 8) + '...' : record.id) : 'N/A' }}
                    </span>
                  </div>
                </template>
                <template v-else-if="column.key === 'fullName'">
                  <strong style="color: #1e293b;">{{ record.fullName }}</strong>
                </template>
                <template v-else-if="column.key === 'dateOfBirth'">
                  {{ formatDate(record.dateOfBirth) }}
                </template>
                <template v-else-if="column.key === 'gender'">
                  <span class="badge" :class="record.gender === 'Nam' ? 'badge--confirmed' : 'badge--pending'" style="font-weight: 700;">
                    {{ record.gender }}
                  </span>
                </template>
                <template v-else-if="column.key === 'medicalHistory'">
                  <div 
                    style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;" 
                    :title="record.medicalHistory"
                    @click="viewPatientDetails(record)"
                    class="clickable-text"
                  >
                    {{ record.medicalHistory || 'Chưa cập nhật' }}
                  </div>
                </template>
                <template v-else-if="column.key === 'allergies'">
                  <div 
                    style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #dc2626; font-weight: 600; cursor: pointer;" 
                    :title="record.allergies"
                    @click="viewPatientDetails(record)"
                    class="clickable-text"
                  >
                    {{ record.allergies || 'Không dị ứng' }}
                  </div>
                </template>
                <template v-else-if="column.key === 'action'">
                  <button class="btn-primary-cockpit" style="padding: 6px 12px !important; font-size: 0.8rem !important; background: #64748b !important; border-radius: 8px !important; white-space: nowrap !important; height: auto !important; min-height: 0 !important; font-weight: 600 !important;" @click="viewPatientDetails(record)">
                    <i class="fas fa-user-shield" style="font-size: 0.75rem;" /> Xem hồ sơ
                  </button>
                </template>
              </template>
          </a-table>
        </div>

        <!-- TAB 8: PHARMACY MEDICINES -->
        <div v-if="activeTab === 'pharmacy-medicines'" class="tab-content">
          <MedicineManagement :inline="true" />
        </div>

        <!-- TAB 9: PHARMACY SUPPLIERS -->
        <div v-if="activeTab === 'pharmacy-suppliers'" class="tab-content">
          <SupplierManagement :inline="true" />
        </div>

        <!-- TAB 10: PHARMACY IMPORT BILLS -->
        <div v-if="activeTab === 'pharmacy-import-bills'" class="tab-content">
          <ImportBill :inline="true" />
        </div>

        <!-- TAB 11: PHARMACY BATCHES -->
        <div v-if="activeTab === 'pharmacy-batches'" class="tab-content">
          <BatchStock :inline="true" />
        </div>

        <!-- TAB 12: PHARMACY PRESCRIPTIONS -->
        <div v-if="activeTab === 'pharmacy-prescriptions'" class="tab-content">
          <PrescriptionManagement :inline="true" />
        </div>

        <!-- TAB 13: PHARMACY BILLING -->
        <div v-if="activeTab === 'pharmacy-billing'" class="tab-content">
          <BillingManagement :inline="true" />
        </div>

        <!-- TAB 14: PHARMACY PAYMENTS -->
        <div v-if="activeTab === 'pharmacy-payments'" class="tab-content">
          <PaymentManagement :inline="true" />
        </div>

        <!-- TAB 15: PHARMACY STOCK HISTORY -->
        <div v-if="activeTab === 'pharmacy-stock-history'" class="tab-content">
          <InventoryManagement :inline="true" />
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
            <div class="form-group-cockpit">
              <label>Tên đăng nhập (Tài khoản) *:</label>
              <input v-model="formDoctor.username" placeholder="Nhập tên đăng nhập (Mật khẩu mặc định sẽ tự động tạo)..." required type="text" class="cockpit-input" />
            </div>
            <div class="form-row-cockpit">
              <div class="form-group-cockpit">
                <label>Chuyên khoa:</label>
                <select v-model="formDoctor.specialty" required class="cockpit-input" style="height: 40px; padding: 0 10px; border-radius: 8px; border: 1.5px solid #cbd5e1; background: white;">
                  <option value="" disabled>-- Chọn chuyên khoa --</option>
                  <option value="Nội tổng quát">Nội tổng quát</option>
                  <option value="Nhi khoa">Nhi khoa</option>
                  <option value="Khám mắt">Khám mắt</option>
                  <option value="Ngoại chấn thương chỉnh hình">Ngoại chấn thương chỉnh hình</option>
                  <option value="Răng Hàm Mặt">Răng Hàm Mặt</option>
                  <option value="Tai Mũi Họng">Tai Mũi Họng</option>
                  <option value="Sản Phụ Khoa">Sản Phụ Khoa</option>
                  <option value="Da liễu">Da liễu</option>
                  <option value="Ngoại tổng quát">Ngoại tổng quát</option>
                </select>
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

    <!-- 4. Doctor Info Modal -->
    <div v-if="showDoctorInfoModal" class="modal-backdrop">
      <div class="modal-card shadow-lg animate-fade-in" style="max-width: 500px;">
        <div class="modal-header" style="background: #eff6ff; color: #1e40af; border-bottom: 1px solid #dbeafe;">
          <h3><i class="fas fa-id-card text-blue" /> Thông tin tài khoản Bác sĩ</h3>
          <button class="btn-close-modal" @click="showDoctorInfoModal = false">&times;</button>
        </div>
        <div class="modal-body" style="padding: 1.5rem;">
          <div v-if="loadingDoctorInfo" style="text-align: center; padding: 2rem;">
            <i class="fas fa-spinner fa-spin fa-2x text-blue" />
            <p style="margin-top: 1rem; color: #64748b;">Đang truy vấn thông tin tài khoản...</p>
          </div>
          <div v-else-if="selectedDoctorInfo">
            <!-- Professional profile -->
            <div style="background: #f8fafc; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem; border: 1px solid #e2e8f0; text-align: left;">
              <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: #0f172a; font-weight: 800;">
                {{ selectedDoctorInfo.fullName }}
              </h4>
              <p style="margin: 0 0 0.25rem 0; font-size: 0.9rem; color: #475569;">
                Chuyên khoa: <strong>{{ selectedDoctorInfo.specialty }}</strong>
              </p>
              <p style="margin: 0 0 0.25rem 0; font-size: 0.9rem; color: #475569;">
                Học vị: <strong>{{ selectedDoctorInfo.degree || 'Bác sĩ' }}</strong>
              </p>
              <p style="margin: 0; font-size: 0.9rem; color: #475569;">
                Phí khám: <strong style="color: #0047AB;">{{ formatCurrency(selectedDoctorInfo.consultationFee) }}</strong>
              </p>
            </div>

            <!-- Credentials / Account -->
            <div style="border: 2px dashed #3b82f6; border-radius: 12px; padding: 1.25rem; background: #f0f9ff; text-align: left;">
              <h4 style="margin: 0 0 0.75rem 0; font-size: 0.95rem; color: #1e3a8a; display: flex; align-items: center; gap: 6px; font-weight: 800;">
                <i class="fas fa-key" /> THÔNG TIN ĐĂNG NHẬP
              </h4>
              
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                  <span style="color: #64748b;">Tên đăng nhập (Username):</span>
                  <strong style="color: #0f172a; font-family: monospace; font-size: 1rem;">{{ selectedDoctorInfo.username }}</strong>
                </div>
                
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; align-items: center;">
                  <span style="color: #64748b;">Mật khẩu mặc định:</span>
                  <strong style="color: #dc2626; font-family: monospace; font-size: 1rem; background: #fee2e2; padding: 2px 8px; border-radius: 4px;">
                    {{ selectedDoctorInfo.password }}
                  </strong>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; align-items: center; margin-top: 4px; padding-top: 8px; border-top: 1px solid #e0f2fe;">
                  <span style="color: #64748b;">Trạng thái tài khoản:</span>
                  <span v-if="selectedDoctorInfo.forceChange" class="badge" style="background: #fef3c7; color: #d97706; font-weight: 700; border: none; padding: 4px 8px;">
                    Yêu cầu đổi mật khẩu lần đầu
                  </span>
                  <span v-else class="badge" style="background: #d1fae5; color: #065f46; font-weight: 700; border: none; padding: 4px 8px;">
                    Đã đổi mật khẩu / Sẵn sàng
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer-btns" style="margin-top: 1.5rem;">
            <button class="btn-cancel-modal" style="width: 100%;" @click="showDoctorInfoModal = false">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Doctor Created Result Modal -->
    <div v-if="newDoctorResult" class="modal-backdrop" style="background: rgba(15, 23, 42, 0.4); backdrop-filter: none;">
      <div class="modal-card animate-fade-in" style="max-width: 500px; background: white; border-radius: 4px; border: 1px solid #cbd5e1; box-shadow: none !important; overflow: visible;">
        <div class="modal-header" style="background: #f8fafc; color: #0f172a; border-bottom: 1px solid #e2e8f0; border-top-left-radius: 4px; border-top-right-radius: 4px; padding: 1rem 1.5rem;">
          <h3 style="font-weight: 700; font-size: 1.1rem; color: #0f172a;"><i class="fas fa-check-circle" style="color: #3b82f6; margin-right: 8px;" /> Tạo tài khoản bác sĩ thành công</h3>
          <button class="btn-close-modal" @click="newDoctorResult = null" style="color: #64748b;">&times;</button>
        </div>
        <div class="modal-body" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
          <p style="color: #475569; font-weight: 500; font-size: 0.9rem; text-align: left; margin: 0;">
            Tài khoản bác sĩ đã được khởi tạo thành công trên hệ thống. Dưới đây là thông tin đăng nhập:
          </p>

          <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <tbody>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #475569; font-weight: 500; text-align: left;">Họ tên bác sĩ:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0f172a;">{{ newDoctorResult.fullName }}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #475569; font-weight: 500; text-align: left;">Tên đăng nhập:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 600; font-family: monospace; color: #0f172a; font-size: 0.95rem;">{{ newDoctorResult.username }}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #475569; font-weight: 500; text-align: left; vertical-align: middle;">Mật khẩu mặc định:</td>
                <td style="padding: 10px 0; text-align: right; display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                  <span style="font-weight: 700; font-family: monospace; color: #1e3a8a; background: #eff6ff; padding: 4px 8px; border-radius: 2px; border: 1px solid #bfdbfe;">
                    {{ newDoctorResult.password }}
                  </span>
                  <button @click="copyToClipboard(newDoctorResult.password)" style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; border-radius: 2px; padding: 4px 10px; font-size: 0.75rem; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s;">
                    <i class="fas fa-copy" /> Copy
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 12px; color: #475569; font-size: 0.8rem; line-height: 1.45; text-align: left;">
            <i class="fas fa-exclamation-triangle" style="margin-right: 4px; color: #d97706;" /> <strong>Lưu ý:</strong> Bác sĩ bắt buộc phải đổi mật khẩu khi đăng nhập lần đầu tiên để kích hoạt tài khoản.
          </div>

          <div class="modal-footer-btns" style="margin-top: 0.5rem; display: flex; justify-content: flex-end;">
            <button class="btn-cancel-modal" style="width: 100%; padding: 10px; border-radius: 4px; font-weight: 700; background: #3b82f6; border: none; color: white; cursor: pointer; box-shadow: none !important;" @click="newDoctorResult = null">Hoàn tất</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Service Add/Edit Modal -->
    <div v-if="showServiceModal" class="modal-backdrop">
      <div class="modal-card shadow-lg animate-fade-in">
        <div class="modal-header">
          <h3><i class="fas fa-concierge-bell text-blue" /> {{ editingServiceId ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới' }}</h3>
          <button class="btn-close-modal" @click="closeServiceModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitServiceForm" class="cockpit-form">
            <div class="form-group-cockpit">
              <label>Tên dịch vụ y khoa:</label>
              <input v-model="formService.name" placeholder="Ví dụ: Siêu Âm Đầu Dò" required type="text" class="cockpit-input" />
            </div>
            <div class="form-group-cockpit">
              <label>Danh mục:</label>
              <input v-model="formService.category" placeholder="Ví dụ: Chẩn đoán, Xét nghiệm, Siêu âm..." type="text" class="cockpit-input" />
            </div>
            <div class="form-group-cockpit">
              <label>Đơn giá (VNĐ):</label>
              <input v-model.number="formService.price" placeholder="Ví dụ: 200000" required type="number" min="0" class="cockpit-input" />
            </div>
            <div class="form-group-cockpit">
              <label>Mô tả dịch vụ:</label>
              <textarea v-model="formService.description" placeholder="Nhập mô tả của dịch vụ khám bệnh..." class="cockpit-input" style="height: 80px; resize: none;"></textarea>
            </div>
            <div class="modal-footer-btns">
              <button type="button" class="btn-cancel-modal" @click="closeServiceModal">Hủy</button>
              <button type="submit" class="btn-primary-cockpit" :disabled="submittingService">
                <span v-if="submittingService"><i class="fas fa-spinner fa-spin" /> {{ editingServiceId ? 'Đang cập nhật...' : 'Đang tạo...' }}</span>
                <span v-else><i class="fas fa-plus-circle" /> {{ editingServiceId ? 'Cập nhật' : 'Thêm dịch vụ' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  
    <!-- Room Add/Edit Modal -->
    <div v-if="showRoomModal" class="modal-backdrop">
      <div class="modal-card shadow-lg animate-fade-in">
        <div class="modal-header">
          <h3>
            <i class="fas fa-door-open text-blue" />
            {{ isEditRoom ? 'Cập nhật thông tin phòng khám' : 'Thêm phòng khám mới' }}
          </h3>
          <button class="btn-close-modal" @click="showRoomModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitRoomForm" class="cockpit-form">
            <div class="form-group-cockpit">
              <label>Mã phòng khám (Ví dụ: P101, P204):</label>
              <input v-model="formRoom.code" placeholder="Ví dụ: P101" required type="text" class="cockpit-input" />
            </div>
            <div class="form-group-cockpit">
              <label>Tên phòng khám:</label>
              <input v-model="formRoom.name" placeholder="Ví dụ: Phòng khám Nội 1" required type="text" class="cockpit-input" />
            </div>
            <div class="form-group-cockpit">
              <label>Tầng / Vị trí:</label>
              <select v-model="formRoom.floor" class="cockpit-input">
                <option value="Tầng 1">Tầng 1</option>
                <option value="Tầng 2">Tầng 2</option>
                <option value="Tầng 3">Tầng 3</option>
                <option value="Tầng 4">Tầng 4</option>
              </select>
            </div>
            <div class="form-group-cockpit">
              <label>Bác sĩ phụ trách:</label>
              <select v-model="formRoom.doctorName" class="cockpit-input">
                <option value="">-- Chưa phân công --</option>
                <option v-for="doc in doctorsList" :key="doc.id" :value="'BS. ' + doc.fullName">
                  BS. {{ doc.fullName }} ({{ doc.specialty }})
                </option>
              </select>
            </div>
            <div class="form-group-cockpit">
              <label>Trạng thái vận hành:</label>
              <select v-model="formRoom.status" class="cockpit-input">
                <option value="Hoạt động">Hoạt động</option>
                <option value="Bảo trì">Bảo trì</option>
              </select>
            </div>
            <div class="modal-footer-btns">
              <button type="button" class="btn-cancel-modal" @click="showRoomModal = false">Hủy</button>
              <button type="submit" class="btn-primary-cockpit" style="background: linear-gradient(135deg, #0047AB 0%, #1d4ed8 100%);">
                <i class="fas fa-save" /> Lưu thông tin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
   

   
    <!-- 4. Medical Record Detail Modal -->
    <div v-if="selectedRecord" class="modal-backdrop" @click.self="selectedRecord = null; isEditingRecord = false">
      <div class="modal-card shadow-lg animate-fade-in" style="width: 780px; max-width: 95vw;">
        <div class="modal-header" style="background: #f8fafc; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding: 1.25rem 1.75rem;">
          <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a;">
            <i class="fas fa-file-medical" style="color: #0047AB;" /> {{ isEditingRecord ? 'Sửa bệnh án' : 'Chi tiết bệnh án' }} #{{ String(selectedRecord.id || '').substring(0, 8).toUpperCase() }}
          </h3>
          <button class="btn-close-modal" @click="selectedRecord = null; isEditingRecord = false">&times;</button>
        </div>
        <div class="modal-body" style="padding: 1.75rem; display: flex; flex-direction: column; gap: 1.25rem; max-height: 72vh; overflow-y: auto;">
          <!-- Patient info section -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem;">
            <h4 style="margin: 0 0 12px; font-size: 0.9rem; font-weight: 800; color: #0047AB; display: flex; align-items: center; gap: 6px;"><i class="fas fa-user" /> Bệnh nhân</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Họ tên</div>
                <div style="margin-top: 4px; font-size: 0.95rem; font-weight: 700; color: #0f172a;">{{ getPatientInfo(selectedRecord.patientId)?.fullName || 'Chưa rõ' }}</div>
              </div>
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Mã BN</div>
                <div style="margin-top: 4px; font-size: 0.95rem; font-weight: 700; color: #0047AB; font-family: monospace;">
                  {{ selectedRecord.gatewayPatientId ? '#' + selectedRecord.gatewayPatientId : '#' + (parseInt(String(selectedRecord.patientId || '').split('-').pop() || '0', 10) || '?') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Clinical section -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem;">
            <h4 style="margin: 0 0 12px; font-size: 0.9rem; font-weight: 800; color: #0047AB; display: flex; align-items: center; gap: 6px;"><i class="fas fa-stethoscope" /> Ghi nhận lâm sàng</h4>
            <template v-if="isEditingRecord">
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div>
                  <label style="font-weight: 700; color: #475569; font-size: 0.8rem;">Triệu chứng lâm sàng</label>
                  <textarea v-model="editRecordForm.symptoms" class="form-control" rows="3" style="margin-top: 4px; width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; resize: vertical;"></textarea>
                </div>
                <div>
                  <label style="font-weight: 700; color: #475569; font-size: 0.8rem;">Chẩn đoán của Bác sĩ</label>
                  <input v-model="editRecordForm.diagnosis" type="text" class="form-control" style="margin-top: 4px; width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="font-weight: 700; color: #475569; font-size: 0.8rem;">Lời dặn y khoa</label>
                  <textarea v-model="editRecordForm.notes" class="form-control" rows="3" style="margin-top: 4px; width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; resize: vertical;"></textarea>
                </div>
              </div>
            </template>
            <template v-else>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Triệu chứng</div>
                  <p style="margin: 0; background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; line-height: 1.5; font-size: 0.88rem;">{{ selectedRecord.symptoms }}</p>
                </div>
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Chẩn đoán</div>
                  <p style="margin: 0; background: white; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px 14px; color: #15803d; font-weight: 700; font-size: 0.88rem;">{{ selectedRecord.diagnosis }}</p>
                </div>
                <div v-if="selectedRecord.notes">
                  <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Ghi chú</div>
                  <p style="margin: 0; background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; line-height: 1.5; font-size: 0.88rem;">{{ selectedRecord.notes }}</p>
                </div>
              </div>
            </template>
          </div>

          <!-- Prescription -->
          <div v-if="selectedRecord.prescription" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem;">
            <h4 style="margin: 0 0 12px; font-size: 0.9rem; font-weight: 800; color: #b91c1c; display: flex; align-items: center; gap: 6px;"><i class="fas fa-prescription-bottle" /> Đơn thuốc</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div v-for="(med, idx) in selectedRecord.prescription.details" :key="idx" style="background: white; border: 1px solid #fee2e2; border-radius: 6px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="font-weight: 700; font-size: 0.88rem;">{{ idx + 1 }}. {{ med.medicationName }}</span>
                  <span style="font-size: 0.8rem; color: #64748b; margin-left: 6px;">{{ med.dosage }}</span>
                </div>
                <span style="font-weight: 800; color: #b91c1c;">x{{ med.quantity }}</span>
              </div>
              <div v-if="selectedRecord.prescription.instructions" style="font-size: 0.85rem; color: #7f1d1d; background: #fee2e2; padding: 8px 12px; border-radius: 6px; border-left: 3px solid #ef4444;">
                <strong>Lời dặn:</strong> {{ selectedRecord.prescription.instructions }}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="padding: 1rem 1.75rem; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; justify-content: space-between; align-items: center; flex-wrap: wrap;">
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button v-if="!selectedRecord.isLocked" style="padding: 7px 14px; border: 1px solid #d1d5db; border-radius: 6px; background: white; color: #374151; font-weight: 600; font-size: 0.8rem; cursor: pointer;" @click="lockRecord(selectedRecord.id)">
              <i class="fas fa-lock" /> Khóa
            </button>
            <button v-if="selectedRecord.isLocked" style="padding: 7px 14px; border: 1px solid #d1d5db; border-radius: 6px; background: white; color: #374151; font-weight: 600; font-size: 0.8rem; cursor: pointer;" @click="unlockRecord(selectedRecord.id)">
              <i class="fas fa-unlock" /> Mở khóa
            </button>
            <button style="padding: 7px 14px; border: 1px solid #d1d5db; border-radius: 6px; background: white; color: #374151; font-weight: 600; font-size: 0.8rem; cursor: pointer;" @click="softDeleteRecord(selectedRecord.id)">
              <i class="fas fa-trash" /> Xóa
            </button>
            <button style="padding: 7px 14px; border: 1px solid #d1d5db; border-radius: 6px; background: white; color: #374151; font-weight: 600; font-size: 0.8rem; cursor: pointer;" @click="showAuditHistory(selectedRecord.id)">
              <i class="fas fa-history" /> Lịch sử
            </button>
          </div>
          <div style="display: flex; gap: 8px;">
            <template v-if="isEditingRecord">
              <button style="padding: 7px 16px; border: 1px solid #0047AB; border-radius: 6px; background: #0047AB; color: white; font-weight: 600; font-size: 0.85rem; cursor: pointer;" @click="saveRecord">
                <i class="fas fa-save" /> Lưu
              </button>
              <button style="padding: 7px 16px; border: 1px solid #d1d5db; border-radius: 6px; background: white; color: #374151; font-weight: 600; font-size: 0.85rem; cursor: pointer;" @click="isEditingRecord = false">Hủy</button>
            </template>
            <template v-else>
              <button style="padding: 7px 16px; border: 1px solid #0047AB; border-radius: 6px; background: #0047AB; color: white; font-weight: 600; font-size: 0.85rem; cursor: pointer;" @click="startEditingRecord">
                <i class="fas fa-edit" /> Sửa
              </button>
              <button style="padding: 7px 16px; border: 1px solid #d1d5db; border-radius: 6px; background: white; color: #374151; font-weight: 600; font-size: 0.85rem; cursor: pointer;" @click="selectedRecord = null; isEditingRecord = false">Đóng</button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- AUDIT HISTORY MODAL -->
    <div v-if="auditRecordId" class="modal-backdrop" @click.self="auditRecordId = null">
      <div class="modal-card shadow-lg animate-fade-in" style="width: 600px; max-width: 90vw;">
        <div class="modal-header" style="background: #1e293b; color: white; border-bottom: 1px solid #334155;">
          <h3 style="color: white;"><i class="fas fa-history" /> Lịch sử thay đổi bệnh án</h3>
          <button class="btn-close-modal" @click="auditRecordId = null">&times;</button>
        </div>
        <div class="modal-body" style="max-height: 60vh; overflow-y: auto; padding: 1.5rem;">
          <div v-if="auditLoading" style="text-align: center; padding: 2rem; color: #94a3b8;">
            <i class="fas fa-circle-notch fa-spin" /> Đang tải...
          </div>
          <div v-else-if="auditLogs.length === 0" style="text-align: center; padding: 2rem; color: #94a3b8;">
            Chưa có lịch sử thay đổi.
          </div>
          <div v-else style="display: flex; flex-direction: column; gap: 8px;">
            <div v-for="log in auditLogs" :key="log.id" style="display: flex; gap: 12px; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem;">
              <div style="min-width: 80px; color: #64748b; font-weight: 600;">{{ formatDate(log.changedAt) }}</div>
              <div style="flex: 1;">
                <span style="font-weight: 700; color: #0f172a;">{{ log.changedBy || 'N/A' }}</span>
                <span style="color: #475569;"> đã thay đổi </span>
                <span style="font-weight: 700; color: #2563eb;">{{ log.field }}</span>
                <div v-if="log.oldValue || log.newValue" style="margin-top: 4px; font-family: monospace; font-size: 0.8rem;">
                  <span v-if="log.oldValue" style="color: #dc2626;">{{ log.oldValue }}</span>
                  <span v-if="log.oldValue && log.newValue" style="color: #94a3b8;"> → </span>
                  <span v-if="log.newValue" style="color: #16a34a;">{{ log.newValue }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel-modal" style="background: #64748b; color: white;" @click="auditRecordId = null">Đóng</button>
        </div>
      </div>
    </div>

    <!-- RESTORE DELETED MODAL -->
    <div v-if="showDeletedRecords" class="modal-backdrop" @click.self="showDeletedRecords = false">
      <div class="modal-card shadow-lg animate-fade-in" style="width: 700px; max-width: 90vw;">
        <div class="modal-header" style="background: #991b1b; color: white; border-bottom: 1px solid #7f1d1d;">
          <h3 style="color: white;"><i class="fas fa-trash-restore" /> Bệnh án đã xóa</h3>
          <button class="btn-close-modal" @click="showDeletedRecords = false">&times;</button>
        </div>
        <div class="modal-body" style="max-height: 60vh; overflow-y: auto; padding: 1.5rem;">
          <div v-if="deletedRecordsLoading" style="text-align: center; padding: 2rem; color: #94a3b8;">
            <i class="fas fa-circle-notch fa-spin" /> Đang tải...
          </div>
          <div v-else-if="deletedRecords.length === 0" style="text-align: center; padding: 2rem; color: #94a3b8;">
            Không có bệnh án nào đã xóa.
          </div>
          <div v-else style="display: flex; flex-direction: column; gap: 8px;">
            <div v-for="rec in deletedRecords" :key="rec.id" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
              <div>
                <div style="font-weight: 700; color: #0f172a;">#{{ String(rec.id || '').substring(0, 8).toUpperCase() }} - {{ rec.diagnosis }}</div>
                <div style="font-size: 0.8rem; color: #64748b;">{{ rec.patientName || '' }}</div>
              </div>
              <button style="background: #16a34a; color: white; border: none; border-radius: 6px; padding: 6px 14px; font-weight: 700; cursor: pointer;" @click="restoreRecord(rec.id)">
                <i class="fas fa-undo" /> Khôi phục
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel-modal" style="background: #64748b; color: white;" @click="showDeletedRecords = false">Đóng</button>
        </div>
      </div>
    </div>

    <!-- 5. Patient Profile View Modal -->
    <div v-if="selectedPatient" class="modal-backdrop">
      <div class="modal-card shadow-lg animate-fade-in" style="width: 700px; max-width: 90vw;">
        <div class="modal-header" style="background: #eff6ff; color: #1e40af; border-bottom: 1px solid #dbeafe;">
          <h3><i class="fas fa-id-card text-blue" /> {{ isEditingPatient ? 'Sửa hồ sơ Bệnh nhân' : 'Hồ sơ Bệnh nhân' }}</h3>
          <button class="btn-close-modal" @click="selectedPatient = null; isEditingPatient = false">&times;</button>
        </div>
        <div class="modal-body" style="display: flex; flex-direction: column; gap: 1.25rem; text-align: left; max-height: 75vh; overflow-y: auto; padding: 1.5rem;">
          <!-- Patient identifiers -->
          <div style="display: flex; gap: 1rem; background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="flex: 1;">
              <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Mã bệnh nhân</label>
              <p style="font-family: monospace; font-size: 0.9rem; font-weight: bold; color: #0047AB; margin: 2px 0 0 0;">
                <template v-if="selectedPatient.gatewayPatientId">#{{ selectedPatient.gatewayPatientId }}</template>
                <template v-else-if="selectedPatient.identityCard">{{ selectedPatient.identityCard }}</template>
                <template v-else>#BN{{ String(selectedPatient.id || '').substring(0, 8).toUpperCase() }}</template>
              </p>
            </div>
            <div v-if="selectedPatient.gatewayPatientId" style="flex: 2;">
              <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Mã định danh (GUID)</label>
              <p style="font-family: monospace; font-size: 0.8rem; color: #64748b; margin: 2px 0 0 0; word-break: break-all;">
                {{ selectedPatient.id }}
              </p>
            </div>
          </div>

          <!-- Edit mode -->
          <template v-if="isEditingPatient">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem;">
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Họ và tên</label>
                <input v-model="editPatientForm.fullName" type="text" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Giới tính</label>
                <select v-model="editPatientForm.gender" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; background: white;">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Nhóm máu</label>
                <select v-model="editPatientForm.bloodGroup" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; background: white;">
                  <option value="">Chưa rõ</option>
                  <option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
                  <option value="A+">A+</option><option value="B+">B+</option><option value="AB+">AB+</option><option value="O+">O+</option>
                  <option value="A-">A-</option><option value="B-">B-</option><option value="AB-">AB-</option><option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Ngày sinh</label>
                <input v-model="editPatientForm.dateOfBirth" type="date" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Số điện thoại</label>
                <input v-model="editPatientForm.phone" type="text" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Email</label>
                <input v-model="editPatientForm.email" type="email" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>

            <div>
              <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Địa chỉ</label>
              <input v-model="editPatientForm.address" type="text" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">CMND/CCCD</label>
                <input v-model="editPatientForm.identityCard" type="text" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Số BHYT</label>
                <input v-model="editPatientForm.insuranceNumber" type="text" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Nghề nghiệp</label>
                <input v-model="editPatientForm.occupation" type="text" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Dân tộc</label>
                <input v-model="editPatientForm.ethnicity" type="text" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Quốc tịch</label>
                <input v-model="editPatientForm.nationality" type="text" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Liên hệ khẩn cấp (Tên)</label>
                <input v-model="editPatientForm.emergencyContact" type="text" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">SĐT khẩn cấp</label>
                <input v-model="editPatientForm.emergencyPhone" type="text" class="form-control" style="margin-top: 4px; width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Tiền sử bệnh lý</label>
                <textarea v-model="editPatientForm.medicalHistory" class="form-control" rows="3" style="margin-top: 4px; width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; resize: vertical;"></textarea>
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Dị ứng thuốc / Thức ăn</label>
                <textarea v-model="editPatientForm.allergies" class="form-control" rows="3" style="margin-top: 4px; width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; resize: vertical; color: #991b1b; font-weight: 600;"></textarea>
              </div>
            </div>
          </template>

          <!-- Read-only mode -->
          <template v-else>
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem;">
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Họ và tên</label>
                <p style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 4px 0 0 0;">{{ selectedPatient.fullName }}</p>
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Giới tính</label>
                <p style="margin: 4px 0 0 0; font-weight: 600;">{{ selectedPatient.gender }}</p>
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Nhóm máu</label>
                <p style="margin: 4px 0 0 0;">
                  <span class="badge" style="background: #fff5f5; color: #e53e3e; border: 1px solid #fed7d7; font-weight: 800; padding: 2px 8px; border-radius: 6px;">
                    {{ selectedPatient.bloodGroup || 'Chưa rõ' }}
                  </span>
                </p>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Ngày sinh</label>
                <p style="margin: 4px 0 0 0; font-weight: 500;">{{ formatDate(selectedPatient.dateOfBirth) }}</p>
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Số điện thoại</label>
                <p style="margin: 4px 0 0 0; font-weight: 500;">{{ selectedPatient.phone || 'Chưa cập nhật' }}</p>
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Email</label>
                <p style="margin: 4px 0 0 0; font-weight: 500;">{{ selectedPatient.email || 'Chưa cập nhật' }}</p>
              </div>
            </div>

            <div>
              <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Địa chỉ</label>
              <p style="margin: 4px 0 0 0; font-weight: 500;">{{ selectedPatient.address || 'Chưa cập nhật' }}</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">CMND/CCCD</label>
                <p style="margin: 4px 0 0 0; font-weight: 500;">{{ selectedPatient.identityCard || 'Chưa cập nhật' }}</p>
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Số BHYT</label>
                <p style="margin: 4px 0 0 0; font-weight: 500;">{{ selectedPatient.insuranceNumber || 'Chưa cập nhật' }}</p>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Nghề nghiệp</label>
                <p style="margin: 4px 0 0 0; font-weight: 500;">{{ selectedPatient.occupation || 'Chưa cập nhật' }}</p>
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Dân tộc</label>
                <p style="margin: 4px 0 0 0; font-weight: 500;">{{ selectedPatient.ethnicity || 'Chưa cập nhật' }}</p>
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Quốc tịch</label>
                <p style="margin: 4px 0 0 0; font-weight: 500;">{{ selectedPatient.nationality || 'Chưa cập nhật' }}</p>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Liên hệ khẩn cấp</label>
                <p style="margin: 4px 0 0 0; font-weight: 500;">{{ selectedPatient.emergencyContact || 'Chưa cập nhật' }}</p>
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">SĐT khẩn cấp</label>
                <p style="margin: 4px 0 0 0; font-weight: 500;">{{ selectedPatient.emergencyPhone || 'Chưa cập nhật' }}</p>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Tiền sử bệnh lý</label>
                <p style="background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 4px 0 0 0; font-size: 0.85rem;">
                  {{ selectedPatient.medicalHistory || 'Chưa có ghi nhận' }}
                </p>
              </div>
              <div>
                <label style="font-weight: bold; color: #475569; font-size: 0.75rem;">Dị ứng thuốc / Thức ăn</label>
                <p style="background: #fff5f5; padding: 10px; border-radius: 8px; border: 1px solid #fee2e2; color: #991b1b; margin: 4px 0 0 0; font-size: 0.85rem; font-weight: 600;">
                  {{ selectedPatient.allergies || 'Không dị ứng' }}
                </p>
              </div>
            </div>
          </template>

          <!-- Examination History -->
          <div style="margin-top: 5px; border-top: 1.5px dashed #cbd5e1; padding-top: 15px;">
            <h4 style="font-weight: 800; color: #1e3a8a; margin: 0 0 12px 0; display: flex; align-items: center; gap: 6px; font-size: 0.95rem;">
              <i class="fas fa-history" /> Lịch sử khám lâm sàng ({{ selectedPatientRecords.length }})
            </h4>
            <div v-if="selectedPatientRecords.length > 0" style="display: flex; flex-direction: column; gap: 10px; max-height: 250px; overflow-y: auto; padding-right: 4px;">
              <div v-for="rec in selectedPatientRecords" :key="rec.id" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; font-size: 0.85rem;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; color: #64748b; margin-bottom: 6px;">
                  <span><i class="far fa-calendar-alt" /> {{ formatDate(rec.createdAt) }}</span>
                  <span style="color: #0047AB;">BS. {{ rec.doctorName || 'Medicare' }}</span>
                </div>
                <div style="margin-bottom: 4px; line-height: 1.4;">
                  <strong style="color: #475569;">Triệu chứng:</strong> {{ rec.symptoms }}
                </div>
                <div style="line-height: 1.4;">
                  <strong style="color: #475569;">Chẩn đoán:</strong> 
                  <span class="badge badge--completed" style="background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-size: 0.75rem; margin-left: 4px;">
                    {{ rec.diagnosis }}
                  </span>
                </div>
                <div v-if="rec.notes" style="margin-top: 4px; font-style: italic; color: #64748b;">
                  * Lời dặn: {{ rec.notes }}
                </div>
              </div>
            </div>
            <div v-else style="text-align: center; color: #94a3b8; font-style: italic; padding: 20px 0; font-size: 0.85rem;">
              Chưa có lịch sử khám bệnh nào trên hệ thống.
            </div>
          </div>
        </div>
        <div class="modal-footer" style="padding: 10px 1.5rem 1.5rem 1.5rem; display: flex; gap: 10px; justify-content: flex-end; border-top: 1px solid #f1f5f9;">
          <template v-if="isEditingPatient">
            <button class="btn-primary-cockpit" style="border-radius: 6px; padding: 10px 20px; font-weight: 700; background: #166534; color: white;" @click="savePatientProfile">
              <i class="fas fa-save" /> Lưu thay đổi
            </button>
            <button class="btn-cancel-modal" style="border-radius: 6px; padding: 10px 20px; font-weight: 700; background: #94a3b8; color: white;" @click="isEditingPatient = false">Hủy</button>
          </template>
          <template v-else>
            <button class="btn-primary-cockpit" style="border-radius: 6px; padding: 10px 20px; font-weight: 700; background: #0047AB; color: white;" @click="startEditingPatient">
              <i class="fas fa-edit" /> Sửa hồ sơ
            </button>
            <button class="btn-cancel-modal" style="border-radius: 6px; padding: 10px 20px; font-weight: 700; background: #64748b; color: white;" @click="selectedPatient = null; isEditingPatient = false">Đóng hồ sơ</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import api, { publicApi, medicalApi } from '@/services/api'
  import { normalizeSearch } from '@/utils/search'
  import { appointmentService } from '@/services/appointmentService'
  import { useAuthStore } from '@/stores/authStore'
  import { medicalRecordService, mapUserIdToGuid } from '@/services/medicalRecordService'
  import type { AuditLogEntry } from '@/services/medicalRecordService'
  import MedicineManagement from '@/views/Pharmacy/MedicineManagement.vue'
  import SupplierManagement from '@/views/Pharmacy/SupplierManagement.vue'
  import ImportBill from '@/views/Pharmacy/ImportBill.vue'
  import BatchStock from '@/views/Pharmacy/BatchStock.vue'
  import PrescriptionManagement from '@/views/Pharmacy/PrescriptionManagement.vue'
  import BillingManagement from '@/views/Pharmacy/BillingManagement.vue'
  import PaymentManagement from '@/views/Pharmacy/PaymentManagement.vue'
  import InventoryManagement from '@/views/Pharmacy/InventoryManagement.vue'
  const router = useRouter()
  const authStore = useAuthStore()
  const loading = ref(false)

  // Columns Definitions for Ant Design Tables
  const columnsAppointments = [
    {
      title: 'STT',
      key: 'stt',
      width: '60px',
      align: 'center'
    },
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      width: '120px',
      sorter: (a, b) => a.id.localeCompare(b.id)
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
      customFilterDropdown: true,
      onFilter: (value, record) => normalizeSearch(record.patientName || '').includes(normalizeSearch(value)),
      sorter: (a, b) => a.patientName.localeCompare(b.patientName)
    },
    {
      title: 'Bác sĩ khám',
      dataIndex: 'doctorName',
      key: 'doctorName',
      customFilterDropdown: true,
      onFilter: (value, record) => normalizeSearch(record.doctorName || '').includes(normalizeSearch(value)),
      sorter: (a, b) => a.doctorName.localeCompare(b.doctorName)
    },
    {
      title: 'Thời gian',
      key: 'dateTime',
      sorter: (a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime()
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
      sorter: (a, b) => a.serviceName.localeCompare(b.serviceName)
    },
    {
      title: 'STT Khám',
      dataIndex: 'queueNumber',
      key: 'queueNumber',
      sorter: (a, b) => (a.queueNumber || 0) - (b.queueNumber || 0)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status - b.status,
      filters: [
        { text: 'Chờ duyệt', value: 0 },
        { text: 'Đã duyệt', value: 1 },
        { text: 'Đã khám', value: 2 },
        { text: 'Đã hủy', value: 3 }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '150px',
      align: 'center'
    }
  ]

  const columnsMedicalRecords = [
    {
      title: 'STT',
      key: 'stt',
      width: '60px',
      align: 'center'
    },
    {
      title: 'Mã BA',
      dataIndex: 'id',
      key: 'id',
      width: '100px',
      sorter: (a, b) => a.id.localeCompare(b.id)
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientId',
      key: 'patientId',
      width: '200px',
      sorter: (a, b) => a.patientId.localeCompare(b.patientId)
    },
    {
      title: 'Triệu chứng',
      dataIndex: 'symptoms',
      key: 'symptoms',
      width: '200px',
      sorter: (a, b) => (a.symptoms || '').localeCompare(b.symptoms || '')
    },
    {
      title: 'Chẩn đoán',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      width: '200px',
      customFilterDropdown: true,
      onFilter: (value, record) => normalizeSearch(record.diagnosis || '').includes(normalizeSearch(value)),
      sorter: (a, b) => (a.diagnosis || '').localeCompare(b.diagnosis || '')
    },
    {
      title: 'Đơn thuốc',
      key: 'prescription',
      width: '120px',
      sorter: (a, b) => (a.prescription ? 1 : 0) - (b.prescription ? 1 : 0),
      filters: [
        { text: 'Có kê đơn', value: true },
        { text: 'Không kê đơn', value: false }
      ],
      onFilter: (value, record) => !!record.prescription === value
    },
    {
      title: 'Ngày khám',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '120px',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '120px',
      align: 'center'
    }
  ]

  const columnsPatients = [
    {
      title: 'STT',
      key: 'stt',
      width: '60px',
      align: 'center'
    },
    {
      title: 'Mã số',
      dataIndex: 'id',
      key: 'id',
      width: '120px',
      sorter: (a, b) => a.id.localeCompare(b.id)
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      customFilterDropdown: true,
      onFilter: (value, record) => normalizeSearch(record.fullName || '').includes(normalizeSearch(value)),
      sorter: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      sorter: (a, b) => new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime()
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      filters: [
        { text: 'Nam', value: 'Nam' },
        { text: 'Nữ', value: 'Nữ' }
      ],
      onFilter: (value, record) => record.gender === value
    },
    {
      title: 'Tiền sử bệnh lý',
      dataIndex: 'medicalHistory',
      key: 'medicalHistory',
      sorter: (a, b) => (a.medicalHistory || '').localeCompare(b.medicalHistory || '')
    },
    {
      title: 'Dị ứng',
      dataIndex: 'allergies',
      key: 'allergies',
      sorter: (a, b) => (a.allergies || '').localeCompare(b.allergies || '')
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '120px',
      align: 'center'
    }
  ]

  const columnsDoctors = [
    {
      title: 'STT',
      key: 'stt',
      width: '60px',
      align: 'center'
    },
    {
      title: 'Ảnh',
      key: 'avatar',
      width: '70px',
      align: 'center'
    },
    {
      title: 'Họ và tên bác sĩ',
      dataIndex: 'fullName',
      key: 'fullName',
      customFilterDropdown: true,
      onFilter: (value, record) => normalizeSearch(record.fullName || '').includes(normalizeSearch(value)),
      sorter: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    {
      title: 'Chuyên khoa',
      dataIndex: 'specialty',
      key: 'specialty',
      customFilterDropdown: true,
      onFilter: (value, record) => normalizeSearch(record.specialty || '').includes(normalizeSearch(value)),
      sorter: (a, b) => a.specialty.localeCompare(b.specialty)
    },
    {
      title: 'Học vị',
      dataIndex: 'degree',
      key: 'degree',
      sorter: (a, b) => (a.degree || '').localeCompare(b.degree || '')
    },
    {
      title: 'Phí khám cơ bản',
      dataIndex: 'consultationFee',
      key: 'consultationFee',
      sorter: (a, b) => (a.consultationFee || 150000) - (b.consultationFee || 150000)
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '180px',
      align: 'center'
    }
  ]

  const columnsServices = [
    {
      title: 'STT',
      key: 'stt',
      width: '60px',
      align: 'center'
    },
    {
      title: 'Tên dịch vụ y khoa',
      dataIndex: 'name',
      key: 'name',
      customFilterDropdown: true,
      onFilter: (value, record) => normalizeSearch(record.name || '').includes(normalizeSearch(value)),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Mô tả dịch vụ',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description)
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: '160px',
      align: 'center'
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '120px',
      align: 'center'
    }
  ]

  // Navigation control
  const activeTab = ref(router.currentRoute.value.query.tab || 'overview')

  // Watch for external route query updates (e.g. back/forward button navigation)
  watch(() => router.currentRoute.value.query.tab, (newTab) => {
    if (newTab && newTab !== activeTab.value) {
      activeTab.value = newTab
    }
  })

  // Watch for activeTab changes to update the router query
  watch(activeTab, (newTab) => {
    if (router.currentRoute.value.query.tab !== newTab) {
      router.replace({ query: { ...router.currentRoute.value.query, tab: newTab } })
    }
  })

  const quickSearchQuery = ref('')
  const filterStatus = ref('all')
  const searchPatientQuery = ref('')
  const searchDoctorQuery = ref('')
  const searchServiceQuery = ref('')
  const searchRoomQuery = ref('')
  const showRoomModal = ref(false)
  const isEditRoom = ref(false)
  const editRoomId = ref(null)
  const formRoom = ref({ code: '', name: '', floor: 'Tầng 1', status: 'Hoạt động', doctorName: '' })
  const roomsList = ref([])

  const initialRooms = [
    { id: 1, code: 'P101', name: 'Phòng khám Nội 1', floor: 'Tầng 1', doctorName: 'BS. Nguyễn Văn A', status: 'Hoạt động' },
    { id: 2, code: 'P102', name: 'Phòng khám Nội 2', floor: 'Tầng 1', doctorName: 'BS. Trần Thị B', status: 'Hoạt động' },
    { id: 3, code: 'P204', name: 'Phòng khám Chuyên khoa 204', floor: 'Tầng 2', doctorName: 'BS. Phạm Văn C', status: 'Hoạt động' },
    { id: 4, code: 'P301', name: 'Phòng Siêu âm', floor: 'Tầng 3', doctorName: 'BS. Lê Hoàng D', status: 'Hoạt động' },
    { id: 5, code: 'P302', name: 'Phòng Xét nghiệm', floor: 'Tầng 3', doctorName: 'KTV. Nguyễn Văn E', status: 'Bảo trì' }
  ]

  function initRooms() {
    const saved = localStorage.getItem('medicare_rooms')
    if (saved) {
      roomsList.value = JSON.parse(saved)
    } else {
      roomsList.value = [...initialRooms]
      localStorage.setItem('medicare_rooms', JSON.stringify(initialRooms))
    }
  }

  function saveRoomsToStorage() {
    localStorage.setItem('medicare_rooms', JSON.stringify(roomsList.value))
  }

  const columnsRooms = [
    { title: 'STT', key: 'stt', width: '60px', align: 'center' },
    { title: 'Mã phòng', dataIndex: 'code', key: 'code', width: '120px', sorter: (a, b) => a.code.localeCompare(b.code) },
    { title: 'Tên phòng khám', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Vị trí', dataIndex: 'floor', key: 'floor', sorter: (a, b) => a.floor.localeCompare(b.floor) },
    { title: 'Bác sĩ phụ trách', dataIndex: 'doctorName', key: 'doctorName', sorter: (a, b) => a.doctorName.localeCompare(b.doctorName) },
    { title: 'Trạng thái', key: 'status', width: '150px' },
    { title: 'Thao tác', key: 'action', width: '120px', align: 'center' }
  ]

  const filteredRooms = computed(() => {
    let list = [...roomsList.value]
    if (searchRoomQuery.value) {
      const q = normalizeSearch(searchRoomQuery.value)
      list = list.filter(r => 
        normalizeSearch(r.code).includes(q) || 
        normalizeSearch(r.name).includes(q) ||
        normalizeSearch(r.doctorName).includes(q) ||
        normalizeSearch(r.floor).includes(q)
      )
    }
    return list
  })

  function openAddRoomModal() {
    isEditRoom.value = false
    editRoomId.value = null
    formRoom.value = { code: '', name: '', floor: 'Tầng 1', status: 'Hoạt động', doctorName: '' }
    showRoomModal.value = true
  }

  function openEditRoomModal(record) {
    isEditRoom.value = true
    editRoomId.value = record.id
    formRoom.value = { ...record }
    showRoomModal.value = true
  }

  function submitRoomForm() {
    if (!formRoom.value.code || !formRoom.value.name) return
    
    if (isEditRoom.value) {
      const idx = roomsList.value.findIndex(r => r.id === editRoomId.value)
      if (idx > -1) {
        roomsList.value[idx] = { ...roomsList.value[idx], ...formRoom.value }
      }
    } else {
      const newId = roomsList.value.length ? Math.max(...roomsList.value.map(r => r.id)) + 1 : 1
      roomsList.value.push({
        id: newId,
        ...formRoom.value
      })
    }
    saveRoomsToStorage()
    showRoomModal.value = false
  }

  function deleteRoom(id) {
    if (confirm('Bạn có chắc chắn muốn xóa phòng khám này?')) {
      roomsList.value = roomsList.value.filter(r => r.id !== id)
      saveRoomsToStorage()
    }
  }

  // Modal display toggles (Appointment Service - ACTIVE)
  const showSlotModal = ref(false)
  const showDoctorModal = ref(false)
  const newDoctorResult = ref(null)
  const showDoctorInfoModal = ref(false)
  const selectedDoctorInfo = ref(null)
  const loadingDoctorInfo = ref(false)
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

  // Medical Record Service states (N2)
  const allMedicalRecords = ref([])
  const allPatientsList = ref([])
  const searchRecordQuery = ref('')
  const searchPatientRegistryQuery = ref('')
  const selectedRecord = ref(null)
  const selectedPatient = ref(null)

  const getPatientInfo = (patientId) => {
    if (!patientId) return null
    return allPatientsList.value.find(p => p.id === patientId) || null
  }

  const isEditingRecord = ref(false)
  const editRecordForm = ref({
    symptoms: '',
    diagnosis: '',
    notes: ''
  })

  function startEditingRecord() {
    if (!selectedRecord.value) return
    editRecordForm.value.symptoms = selectedRecord.value.symptoms || ''
    editRecordForm.value.diagnosis = selectedRecord.value.diagnosis || ''
    editRecordForm.value.notes = selectedRecord.value.notes || ''
    isEditingRecord.value = true
  }

  async function saveRecord() {
    if (!selectedRecord.value) return
    if (!editRecordForm.value.symptoms.trim() || !editRecordForm.value.diagnosis.trim()) {
      alert('Vui lòng điền triệu chứng và chẩn đoán!')
      return
    }
    loading.value = true
    try {
      const res = await medicalRecordService.updateRecord(selectedRecord.value.id, {
        patientId: selectedRecord.value.patientId,
        doctorId: selectedRecord.value.doctorId,
        title: selectedRecord.value.title,
        symptoms: editRecordForm.value.symptoms,
        diagnosis: editRecordForm.value.diagnosis,
        notes: editRecordForm.value.notes,
        weight: selectedRecord.value.weight,
        height: selectedRecord.value.height,
        bloodPressure: selectedRecord.value.bloodPressure,
        heartRate: selectedRecord.value.heartRate,
        temperature: selectedRecord.value.temperature,
        customMetricsJson: selectedRecord.value.customMetricsJson,
        attachmentsJson: selectedRecord.value.attachmentsJson
      })
      if (res.success) {
        alert('Cập nhật bệnh án thành công!')
        
        // Cập nhật tại chỗ
        selectedRecord.value.symptoms = editRecordForm.value.symptoms
        selectedRecord.value.diagnosis = editRecordForm.value.diagnosis
        selectedRecord.value.notes = editRecordForm.value.notes
        
        // Tải lại toàn bộ bệnh án
        const recordsData = await medicalRecordService.getAllRecords()
        allMedicalRecords.value = recordsData || []
        
        isEditingRecord.value = false
      } else {
        alert(res.message || 'Lỗi khi cập nhật.')
      }
    } catch (e) {
      alert('Lỗi: ' + (e.message || e))
    } finally {
      loading.value = false
    }
  }

  // Admin features: lock/unlock, soft delete, restore, audit
  const auditRecordId = ref<string | null>(null)
  const auditLogs = ref<AuditLogEntry[]>([])
  const auditLoading = ref(false)
  const showDeletedRecords = ref(false)
  const deletedRecords = ref<any[]>([])
  const deletedRecordsLoading = ref(false)

  async function lockRecord (id: string) {
    if (!confirm('Khóa bệnh án này? Bệnh án sẽ không thể chỉnh sửa.')) return
    loading.value = true
    try {
      await medicalRecordService.lockRecord(id)
      alert('Đã khóa bệnh án.')
      viewRecordDetails(selectedRecord.value)
    } catch (e: any) { alert(e.message || 'Lỗi') }
    finally { loading.value = false }
  }

  async function unlockRecord (id: string) {
    if (!confirm('Mở khóa bệnh án này?')) return
    loading.value = true
    try {
      await medicalRecordService.unlockRecord(id)
      alert('Đã mở khóa bệnh án.')
      viewRecordDetails(selectedRecord.value)
    } catch (e: any) { alert(e.message || 'Lỗi') }
    finally { loading.value = false }
  }

  async function softDeleteRecord (id: string) {
    if (!confirm('Xóa bệnh án này? Có thể khôi phục sau.')) return
    loading.value = true
    try {
      await medicalRecordService.softDeleteRecord(id)
      alert('Đã xóa bệnh án.')
      selectedRecord.value = null
      allMedicalRecords.value = (await medicalRecordService.getAllRecords()) || []
    } catch (e: any) { alert(e.message || 'Lỗi') }
    finally { loading.value = false }
  }

  async function restoreRecord (id: string) {
    if (!confirm('Khôi phục bệnh án này?')) return
    try {
      await medicalRecordService.restoreRecord(id)
      alert('Đã khôi phục bệnh án.')
      deletedRecords.value = (await medicalRecordService.getDeletedRecords()) || []
    } catch (e: any) { alert(e.message || 'Lỗi') }
  }

  async function showAuditHistory (id: string) {
    auditRecordId.value = id
    auditLoading.value = true
    auditLogs.value = []
    try {
      auditLogs.value = (await medicalRecordService.getRecordHistory(id)) || []
    } catch (e) { console.error(e) }
    finally { auditLoading.value = false }
  }

  async function loadDeletedRecords () {
    showDeletedRecords.value = true
    deletedRecordsLoading.value = true
    try {
      deletedRecords.value = (await medicalRecordService.getDeletedRecords()) || []
    } catch (e) { console.error(e) }
    finally { deletedRecordsLoading.value = false }
  }

  const isEditingPatient = ref(false)
  const editPatientForm = ref({
    fullName: '',
    dateOfBirth: '',
    gender: 'Nam',
    bloodGroup: '',
    phone: '',
    email: '',
    address: '',
    identityCard: '',
    insuranceNumber: '',
    occupation: '',
    ethnicity: '',
    nationality: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    allergies: ''
  })

  const selectedPatientRecords = computed(() => {
    if (!selectedPatient.value) return []
    const patientGuid = mapUserIdToGuid(selectedPatient.value.id).toLowerCase()
    return allMedicalRecords.value.filter(r => {
      if (!r.patientId) return false
      return mapUserIdToGuid(r.patientId).toLowerCase() === patientGuid
    })
  })

  function startEditingPatient() {
    if (!selectedPatient.value) return
    editPatientForm.value.fullName = selectedPatient.value.fullName || ''
    editPatientForm.value.dateOfBirth = selectedPatient.value.dateOfBirth ? new Date(selectedPatient.value.dateOfBirth).toISOString().split('T')[0] : ''
    editPatientForm.value.gender = selectedPatient.value.gender || 'Nam'
    editPatientForm.value.bloodGroup = selectedPatient.value.bloodGroup || ''
    editPatientForm.value.phone = selectedPatient.value.phone || ''
    editPatientForm.value.email = selectedPatient.value.email || ''
    editPatientForm.value.address = selectedPatient.value.address || ''
    editPatientForm.value.identityCard = selectedPatient.value.identityCard || ''
    editPatientForm.value.insuranceNumber = selectedPatient.value.insuranceNumber || ''
    editPatientForm.value.occupation = selectedPatient.value.occupation || ''
    editPatientForm.value.ethnicity = selectedPatient.value.ethnicity || ''
    editPatientForm.value.nationality = selectedPatient.value.nationality || ''
    editPatientForm.value.emergencyContact = selectedPatient.value.emergencyContact || ''
    editPatientForm.value.emergencyPhone = selectedPatient.value.emergencyPhone || ''
    editPatientForm.value.medicalHistory = selectedPatient.value.medicalHistory || ''
    editPatientForm.value.allergies = selectedPatient.value.allergies || ''
    isEditingPatient.value = true
  }

  async function savePatientProfile() {
    if (!selectedPatient.value) return
    if (!editPatientForm.value.fullName.trim()) {
      alert('Vui lòng điền họ và tên!')
      return
    }
    loading.value = true
    try {
      const res = await medicalRecordService.updatePatientProfile(selectedPatient.value.id, {
        fullName: editPatientForm.value.fullName,
        dateOfBirth: editPatientForm.value.dateOfBirth,
        gender: editPatientForm.value.gender,
        bloodGroup: editPatientForm.value.bloodGroup,
        phone: editPatientForm.value.phone,
        email: editPatientForm.value.email,
        address: editPatientForm.value.address,
        identityCard: editPatientForm.value.identityCard,
        insuranceNumber: editPatientForm.value.insuranceNumber,
        occupation: editPatientForm.value.occupation,
        ethnicity: editPatientForm.value.ethnicity,
        nationality: editPatientForm.value.nationality,
        emergencyContact: editPatientForm.value.emergencyContact,
        emergencyPhone: editPatientForm.value.emergencyPhone,
        medicalHistory: editPatientForm.value.medicalHistory,
        allergies: editPatientForm.value.allergies
      })
      if (res.success) {
        alert('Cập nhật thông tin bệnh nhân thành công!')
        
        // Cập nhật thông tin hiển thị tại chỗ
        Object.assign(selectedPatient.value, editPatientForm.value)
        
        // Tải lại toàn bộ danh sách bệnh nhân
        const patientsRes = await medicalRecordService.getAllPatients()
        allPatientsList.value = patientsRes || []
        
        isEditingPatient.value = false
      } else {
        alert(typeof res.message === 'object' ? JSON.stringify(res.message) : (res.message || 'Lỗi khi cập nhật.'))
      }
    } catch (e) {
      alert('Lỗi: ' + (e.message || e))
    } finally {
      loading.value = false
    }
  }

  const filteredRecords = computed(() => {
    let list = [...allMedicalRecords.value]
    if (searchRecordQuery.value) {
      const q = normalizeSearch(searchRecordQuery.value)
      list = list.filter(r => {
        const pName = getPatientInfo(r.patientId)?.fullName || ''
        return normalizeSearch(r.symptoms).includes(q) || 
               normalizeSearch(r.diagnosis).includes(q) ||
               normalizeSearch(r.notes).includes(q) ||
               normalizeSearch(r.patientId).includes(q) ||
               normalizeSearch(pName).includes(q)
      })
    }
    return list
  })

  const filteredPatientRegistry = computed(() => {
    let list = [...allPatientsList.value]
    if (searchPatientRegistryQuery.value) {
      const q = normalizeSearch(searchPatientRegistryQuery.value)
      list = list.filter(p => 
        normalizeSearch(p.fullName).includes(q) || 
        normalizeSearch(p.medicalHistory).includes(q) ||
        normalizeSearch(p.allergies).includes(q)
      )
    }
    return list
  })

  const filteredDoctors = computed(() => {
    let list = [...doctorsList.value]
    if (searchDoctorQuery.value) {
      const q = normalizeSearch(searchDoctorQuery.value)
      list = list.filter(d => 
        normalizeSearch(d.fullName).includes(q) || 
        normalizeSearch(d.specialty).includes(q) ||
        normalizeSearch(d.degree).includes(q)
      )
    }
    return list
  })

  const filteredServices = computed(() => {
    let list = [...servicesList.value]
    if (searchServiceQuery.value) {
      const q = normalizeSearch(searchServiceQuery.value)
      list = list.filter(s => 
        normalizeSearch(s.name).includes(q) || 
        normalizeSearch(s.description).includes(q)
      )
    }
    return list
  })

  function viewRecordDetails(rec) {
    selectedRecord.value = rec
  }

  function viewPatientDetails(pat) {
    selectedPatient.value = pat
  }

  // Strategic Stats (Appointment Service - ACTIVE)
  const stats = computed(() => {
    const todayStr = new Date().toDateString()
    const newPats = allPatientsList.value.filter(p => {
      if (!p.createdAt) return false
      return new Date(p.createdAt).toDateString() === todayStr
    }).length

    return {
      totalAppointments: appointments.value.length || 0,
      pendingAppointments: appointments.value.filter(a => a.status === 0).length || 0,
      newPatientsToday: newPats,
      prescriptionsCount: allMedicalRecords.value.filter(r => r.prescription).length || 0
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
      const q = normalizeSearch(searchPatientQuery.value)
      list = list.filter(a => normalizeSearch(a.patientName).includes(q))
    }
    if (quickSearchQuery.value) {
      const q = normalizeSearch(quickSearchQuery.value)
      list = list.filter(a => 
        normalizeSearch(a.patientName).includes(q) || 
        normalizeSearch(a.doctorName).includes(q) ||
        normalizeSearch(a.serviceName).includes(q)
      )
    }
    return list.sort((a, b) => {
      if (a.status === 0 && b.status !== 0) return -1
      if (a.status !== 0 && b.status === 0) return 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  })

  // Forms bounds (Appointment Service - ACTIVE)
  const formDoctor = ref({ fullName: '', specialty: '', degree: '', consultationFee: null, username: '', password: '' })
  const formService = ref({ name: '', category: '', description: '', price: 0 })
  const editingServiceId = ref(null)
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

      // Fetch all medical records and patients (N2)
      try {
        const recordsData = await medicalRecordService.getAllRecords()
        allMedicalRecords.value = recordsData || []
      } catch (errRecord) {
        console.error('Lỗi khi tải toàn bộ bệnh án:', errRecord)
      }

      try {
        const res = await api.get('/Users/patients')
        allPatientsList.value = res.data || []
      } catch (errPatient) {
        console.error('Lỗi khi tải danh sách bệnh nhân từ gateway:', errPatient)
        try {
          const patientsData = await medicalRecordService.getAllPatients()
          allPatientsList.value = patientsData || []
        } catch (errRecordPatient) {
          console.error('Lỗi khi tải danh sách bệnh nhân từ medical service:', errRecordPatient)
        }
      }

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
  function openCommandPalette() {
    window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 'k', bubbles: true }))
  }

  function getPageTitle () {
    switch (activeTab.value) {
      case 'overview': return 'Tổng Quan Trung Tâm'
      case 'appointments': return 'Quản Lý Lịch Hẹn Khám'
      case 'schedule': return 'Quản Lý Lịch Trực Bác Sĩ'
      case 'doctors': return 'Danh Mục Bác Sĩ'
      case 'services': return 'Dịch Vụ Y Khoa'
      case 'rooms': return 'Danh Mục Phòng Khám & Vận Hành Lâm Sàng'
      case 'medical-records': return 'Quản Lý Bệnh Án'
      case 'patient-registry': return 'Danh Sách Bệnh Nhân'
      case 'pharmacy-medicines': return 'Quản Lý Danh Mục Thuốc'
      case 'pharmacy-suppliers': return 'Quản Lý Nhà Cung Cấp'
      case 'pharmacy-import-bills': return 'Quản Lý Phiếu Nhập Thuốc'
      case 'pharmacy-batches': return 'Tồn Kho Theo Lô'
      case 'pharmacy-prescriptions': return 'Quản Lý Đơn Thuốc & Bán Lẻ'
      case 'pharmacy-billing': return 'Hóa Đơn Bán Thuốc'
      case 'pharmacy-payments': return 'Quản Lý Thanh Toán'
      case 'pharmacy-stock-history': return 'Lịch Sử Kho Thuốc'
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
    if (!formDoctor.value.username) {
      alert('Vui lòng nhập tên đăng nhập của bác sĩ!')
      return
    }
    submittingDoctor.value = true
    try {
      // Sinh mật khẩu tự động ngẫu nhiên dạng MC-XXXXXX
      const autoPassword = 'MC-' + Math.floor(100000 + Math.random() * 900000)

      // 1. Đăng ký tài khoản trong Cổng xác thực với cờ forceChange trong Email
      const regRes = await publicApi.post('/Auth/register', {
        username: formDoctor.value.username,
        password: autoPassword,
        fullName: formDoctor.value.fullName,
        email: `${formDoctor.value.username}@medicare.vn|${autoPassword}|forceChange`,
        role: 'Doctor'
      })
      
      const newUserId = regRes.data?.userId
      if (!newUserId) {
        throw new Error('Đăng ký tài khoản bác sĩ thất bại, không nhận được ID!')
      }

      // 2. Thêm thông tin chuyên môn bác sĩ trong Appointment-Service
      await api.post('/Doctors', {
        userId: String(newUserId),
        fullName: formDoctor.value.fullName,
        specialty: formDoctor.value.specialty,
        degree: formDoctor.value.degree,
        consultationFee: formDoctor.value.consultationFee
      })

      newDoctorResult.value = {
        fullName: formDoctor.value.fullName,
        username: formDoctor.value.username,
        password: autoPassword
      }
      formDoctor.value = { fullName: '', specialty: '', degree: '', consultationFee: null, username: '', password: '' }
      showDoctorModal.value = false
      fetchAllData()
    } catch (e) {
      alert('Lỗi thêm bác sĩ: ' + (e.response?.data?.message || e.message))
    } finally {
      submittingDoctor.value = false
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Đã sao chép mật khẩu vào bộ nhớ tạm!');
      }).catch(err => {
        console.error('Không thể sao chép: ', err);
      });
    } else {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('Đã sao chép mật khẩu vào bộ nhớ tạm!');
    }
  }

  async function viewDoctorInfo(doc) {
    selectedDoctorInfo.value = { ...doc, username: '', password: '', originalEmail: '', forceChange: false }
    showDoctorInfoModal.value = true
    loadingDoctorInfo.value = true
    
    try {
      const res = await api.get('/Users/doctors')
      const doctorsUsers = res.data || []
      
      let userAccount = doctorsUsers.find(u => u.id === doc.userId)
      
      if (!userAccount) {
        userAccount = doctorsUsers.find(u => {
          const uName = u.fullName?.replace(/^(BS\.|Bác sĩ)\s+/i, '').trim().toLowerCase()
          const docName = doc.fullName?.replace(/^(BS\.|Bác sĩ)\s+/i, '').trim().toLowerCase()
          return uName === docName || u.fullName?.toLowerCase() === doc.fullName?.toLowerCase()
        })
      }
      
      if (userAccount) {
        selectedDoctorInfo.value.username = userAccount.username
        
        const emailStr = userAccount.email || ''
        if (emailStr.includes('|')) {
          const parts = emailStr.split('|')
          selectedDoctorInfo.value.originalEmail = parts[0]
          selectedDoctorInfo.value.password = parts[1]
          selectedDoctorInfo.value.forceChange = parts[2] === 'forceChange'
        } else {
          selectedDoctorInfo.value.originalEmail = emailStr
          selectedDoctorInfo.value.password = '(Đã thay đổi mật khẩu mặc định)'
          selectedDoctorInfo.value.forceChange = false
        }
      } else {
        selectedDoctorInfo.value.username = 'Không tìm thấy tài khoản'
        selectedDoctorInfo.value.password = 'N/A'
      }
    } catch (e) {
      console.error('Lỗi khi tải thông tin tài khoản:', e)
    } finally {
      loadingDoctorInfo.value = false
    }
  }

  function closeServiceModal () {
    showServiceModal.value = false
    editingServiceId.value = null
    formService.value = { name: '', category: '', description: '', price: 0 }
  }

  async function submitServiceForm () {
    submittingService.value = true
    try {
      const payload = {
        name: formService.value.name,
        category: formService.value.category || null,
        description: formService.value.description || null,
        price: formService.value.price || 0,
        isActive: true
      }
      if (editingServiceId.value) {
        await api.put(`/MedicalServices/${editingServiceId.value}`, payload)
        alert('Cập nhật dịch vụ thành công!')
      } else {
        await api.post('/MedicalServices', payload)
        alert('Thêm dịch vụ thành công!')
      }
      closeServiceModal()
      fetchAllData()
    } catch (e) {
      alert((editingServiceId.value ? 'Lỗi cập nhật' : 'Lỗi thêm') + ' dịch vụ: ' + (e.response?.data || e.message))
    } finally {
      submittingService.value = false
    }
  }

  async function editService (record) {
    formService.value = {
      name: record.name || '',
      category: record.category || '',
      description: record.description || '',
      price: record.price || 0
    }
    editingServiceId.value = record.id
    showServiceModal.value = true
  }

  async function deleteService (id) {
    if (!confirm('Xác nhận xóa dịch vụ này?')) return
    try {
      await api.delete(`/MedicalServices/${id}`)
      alert('Đã xóa dịch vụ!')
      fetchAllData()
    } catch (e) {
      alert('Lỗi xóa dịch vụ: ' + (e.response?.data || e.message))
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
      case 3: return 'Đã hủy'
      default: return 'Không xác định'
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

  // Charts setup
  let visitorInsightsChartInstance = null
  let revenueChartInstance = null
  let satisfactionChartInstance = null
  let targetRealityChartInstance = null
  let volumeServiceChartInstance = null

  function initCharts () {
    // 1. Visitor Insights Chart
    const visitorCtx = document.querySelector('#visitorInsightsChart')
    if (visitorCtx) {
      if (visitorInsightsChartInstance) visitorInsightsChartInstance.destroy()
      
      // Calculate dynamic values for the past 7 days based on actual appointments
      const days = []
      const counts = []
      const approvedCounts = []
      const pendingCounts = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const label = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
        days.push(label)

        const total = appointments.value.filter(a => {
          const appDate = new Date(a.date).toLocaleDateString('vi-VN')
          return appDate === d.toLocaleDateString('vi-VN')
        }).length
        
        const approved = appointments.value.filter(a => {
          const appDate = new Date(a.date).toLocaleDateString('vi-VN')
          return appDate === d.toLocaleDateString('vi-VN') && a.status === 1
        }).length
        
        const pending = appointments.value.filter(a => {
          const appDate = new Date(a.date).toLocaleDateString('vi-VN')
          return appDate === d.toLocaleDateString('vi-VN') && a.status === 0
        }).length

        counts.push(total)
        approvedCounts.push(approved)
        pendingCounts.push(pending)
      }

      visitorInsightsChartInstance = new window.Chart(visitorCtx, {
        type: 'line',
        data: {
          labels: days,
          datasets: [
            {
              label: 'Tổng lượt hẹn',
              data: counts,
              borderColor: '#8B5CF6',
              backgroundColor: 'transparent',
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 4,
              pointBackgroundColor: '#8B5CF6'
            },
            {
              label: 'Đã duyệt',
              data: approvedCounts,
              borderColor: '#10B981',
              backgroundColor: 'transparent',
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 4,
              pointBackgroundColor: '#10B981'
            },
            {
              label: 'Chờ duyệt',
              data: pendingCounts,
              borderColor: '#FF947A',
              backgroundColor: 'transparent',
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 4,
              pointBackgroundColor: '#FF947A'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } } },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', stepSize: 1 } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      })
    }

    // 2. Revenue Chart
    const revenueCtx = document.querySelector('#revenueChart')
    if (revenueCtx) {
      if (revenueChartInstance) revenueChartInstance.destroy()
      revenueChartInstance = new window.Chart(revenueCtx, {
        type: 'bar',
        data: {
          labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
          datasets: [
            {
              label: 'Khám Bảo Hiểm',
              data: [12, 19, 15, 8, 22, 14, 6],
              backgroundColor: '#0047AB',
              borderRadius: 6
            },
            {
              label: 'Dịch vụ tự nguyện',
              data: [18, 11, 23, 17, 15, 20, 10],
              backgroundColor: '#FF947A',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      })
    }

    // 3. Satisfaction Chart (CSAT Area Chart)
    const satCtx = document.querySelector('#satisfactionChart')
    if (satCtx) {
      if (satisfactionChartInstance) satisfactionChartInstance.destroy()
      satisfactionChartInstance = new window.Chart(satCtx, {
        type: 'line',
        data: {
          labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
          datasets: [
            {
              label: 'Tháng này',
              data: [82, 88, 85, 91, 94, 96, 95],
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 4,
              pointBackgroundColor: '#10B981'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { display: false },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      })
    }

    // 4. Target vs Reality Chart
    const targetCtx = document.querySelector('#targetRealityChart')
    if (targetCtx) {
      if (targetRealityChartInstance) targetRealityChartInstance.destroy()
      targetRealityChartInstance = new window.Chart(targetCtx, {
        type: 'bar',
        data: {
          labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
          datasets: [
            {
              label: 'Chỉ tiêu',
              data: [150, 180, 200, 220, 250, 280],
              backgroundColor: '#FFE2E5',
              borderColor: '#FA5A7D',
              borderWidth: 1.5,
              borderRadius: 6
            },
            {
              label: 'Thực tế',
              data: [135, 192, 188, 230, 265, 290],
              backgroundColor: '#0047AB',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } } },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      })
    }

    // 5. Volume vs Service Level Chart (Stacked Specialties)
    const volCtx = document.querySelector('#volumeServiceChart')
    if (volCtx) {
      if (volumeServiceChartInstance) volumeServiceChartInstance.destroy()
      volumeServiceChartInstance = new window.Chart(volCtx, {
        type: 'bar',
        data: {
          labels: ['Nội', 'Ngoại', 'Nhi', 'Sản', 'Răng', 'Tai Mũi'],
          datasets: [
            {
              label: 'Đã khám',
              data: [42, 30, 38, 25, 20, 18],
              backgroundColor: '#10B981',
              borderRadius: 4
            },
            {
              label: 'Chờ khám',
              data: [15, 8, 12, 10, 6, 7],
              backgroundColor: '#FFF4DE',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } } },
          scales: {
            y: { stacked: true, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } },
            x: { stacked: true, grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      })
    }
  }

  // Watch activeTab to re-initialize charts when switching back to Overview
  watch(activeTab, (newVal) => {
    if (newVal === 'overview') {
      nextTick(() => {
        initCharts()
      })
    }
  })

  onMounted(() => {
    fetchAllData()
    initRooms()
  })
</script>

<style src="@/styles/dashboard.css"></style>
<style src="@/styles/notif.css"></style>

<style scoped>
.custom-antd-table :deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  font-weight: 700;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
}
.custom-antd-table :deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
  color: #334155;
  font-size: 0.9rem;
}
.custom-antd-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f8fafc;
}
.custom-antd-table :deep(.ant-table-pagination) {
  margin: 16px 0;
}
.clickable-text {
  cursor: pointer;
  transition: color 0.2s ease;
}
.clickable-text:hover {
  color: #0047AB !important;
  text-decoration: underline;
}
.clickable-badge {
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.clickable-badge:hover {
  transform: scale(1.02);
  opacity: 0.95;
}
</style>
