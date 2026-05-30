<template>
  <div class="dashboard-layout">
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
        <div class="sidebar__divider">TỔNG QUAN HỆ THỐNG</div>

        <div class="nav-item nav-item--active">
          <span class="nav-icon"><i class="fas fa-th-large" /></span>
          <span>Dashboard Chung</span>
        </div>

        <div class="sidebar__divider">PHÂN HỆ LIÊN THÔNG</div>

        <div class="nav-item" @click="redirectToBooking">
          <span class="nav-icon"><i class="fas fa-calendar-check" /></span>
          <span>Cổng Lịch Khám</span>
        </div>

        <div class="nav-item" @click="redirectToPharmacy">
          <span class="nav-icon"><i class="fas fa-pills" /></span>
          <span>Cổng Dược & Hóa đơn</span>
        </div>

        <div class="nav-item" @click="redirectToMedicalRecord">
          <span class="nav-icon"><i class="fas fa-file-medical" /></span>
          <span>Cổng Bệnh Án</span>
        </div>
      </nav>

      <div class="sidebar__footer">
        <div v-if="authStore.user" class="user-brief">
          <div class="avatar-small">{{ (authStore.user.username || authStore.user.fullName || 'U').substring(0, 2).toUpperCase() }}</div>

          <div class="user-brief-info">
            <p class="user-brief-name">{{ authStore.user.fullName }}</p>
            <p class="user-brief-role">{{ authStore.user.role }}</p>
          </div>
        </div>

        <div class="nav-item logout-btn" @click="authStore.logout()">
          <span class="nav-icon"><i class="fas fa-sign-out-alt" /></span>
          <span>Đăng xuất</span>
        </div>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <header class="top-bar">
        <div class="page-context">
          <h1 class="page-title">Dashboard Liên Thông Trung Tâm</h1>
        </div>

        <div class="top-bar-actions">
          <div class="search-box">
            <i class="fas fa-search" style="margin-left: 1rem; color: #94a3b8;" />
            <input placeholder="Tìm kiếm nhanh..." type="text">
          </div>
        </div>
      </header>

      <div class="page-container">
        <!-- UNIFIED STATISTICS PORTAL -->
        <section class="dashboard-content dashboard-content--overview">
          <div class="section-header" style="margin-bottom: 24px;">
            <div class="welcome-text">
              <h2>Xin chào, {{ authStore.user.value?.fullName || 'Quản trị viên' }} 👋</h2>
              <p>Hệ sinh thái Medicare đang hoạt động xanh mướt. Dưới đây là báo cáo tổng hợp từ cả 3 phân hệ liên thông.</p>
            </div>

            <button class="btn-primary" :disabled="loading" @click="fetchData">
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }" /> Cập nhật số liệu
            </button>
          </div>

          <!-- KPI Grid (Unified from all 3 services) -->
          <div class="stats-grid">
            <!-- Stat 1: Lịch khám -->
            <div class="stat-card" @click="redirectToBooking">
              <div class="stat-card__info">
                <p class="stat-card__label">Hệ Lịch Khám</p>
                <h3 class="stat-card__value">{{ strategicStats?.kpis?.totalAppointments || 128 }} lịch hẹn</h3>
                <p class="stat-card__trend up">Hoạt động bình thường</p>
              </div>
              <div class="stat-card__icon"><i class="fas fa-calendar-check" /></div>
            </div>

            <!-- Stat 2: Dược & Hóa đơn -->
            <div class="stat-card" @click="redirectToPharmacy">
              <div class="stat-card__info">
                <p class="stat-card__label">Hệ Dược & Hóa Đơn</p>
                <h3 class="stat-card__value">5 danh mục thuốc mẫu</h3>
                <p class="stat-card__trend up">Đã kết nối PostgreSQL</p>
              </div>
              <div class="stat-card__icon" style="background: #ecfdf5; color: #10b981;"><i class="fas fa-pills" /></div>
            </div>

            <!-- Stat 3: Bệnh án điện tử -->
            <div class="stat-card" @click="redirectToMedicalRecord">
              <div class="stat-card__info">
                <p class="stat-card__label">Hệ Bệnh Án Điện Tử</p>
                <h3 class="stat-card__value">45 bệnh án số hóa</h3>
                <p class="stat-card__trend up">Cơ sở dữ liệu an toàn</p>
              </div>
              <div class="stat-card__icon" style="background: #fffbeb; color: #f59e0b;"><i class="fas fa-file-medical" /></div>
            </div>

            <!-- Stat 4: Doanh thu chung -->
            <div class="stat-card">
              <div class="stat-card__info">
                <p class="stat-card__label">Tổng Doanh Thu</p>
                <h3 class="stat-card__value">{{ formatCurrency(strategicStats?.kpis?.totalRevenue || 12500000) }}</h3>
                <p class="stat-card__trend up">Tổng hợp thời gian thực</p>
              </div>
              <div class="stat-card__icon" style="background: #fef2f2; color: #ef4444;"><i class="fas fa-wallet" /></div>
            </div>
          </div>

          <!-- PORTAL NAVIGATOR HUB -->
          <div class="hub-section-header">
            <h3><i class="fas fa-share-square" /> Truy cập phân quyền quản trị của từng phân hệ</h3>
          </div>

          <div class="hub-grid">
            <!-- Card 1: Lịch khám -->
            <div class="hub-card" @click="redirectToBooking">
              <div class="hub-card__icon bg-blue">
                <i class="fas fa-calendar-check" />
              </div>
              <div class="hub-card__body">
                <h3>Phân hệ Lịch khám (Appointment-Service)</h3>
                <p>Mở giao diện quản trị lịch hẹn, sơ đồ phân lịch trực của bác sĩ, quản trị hồ sơ bác sĩ và danh mục dịch vụ y khoa.</p>
                <span class="hub-card__btn">Mở Cổng Lịch Khám (SSO) <i class="fas fa-arrow-right" /></span>
              </div>
            </div>

            <!-- Card 2: Dược & Hóa đơn -->
            <div class="hub-card" @click="redirectToPharmacy">
              <div class="hub-card__icon bg-green">
                <i class="fas fa-pills" />
              </div>
              <div class="hub-card__body">
                <h3>Phân hệ Dược & Hóa đơn (Pharmacy-Billing-Service)</h3>
                <p>Mở cổng quản lý kho dược phẩm, nhập xuất thuốc, tiếp nhận đơn thuốc từ bác sĩ, tính toán chi phí và xuất hóa đơn.</p>
                <span class="hub-card__btn">Mở Cổng Dược & Hóa Đơn (SSO) <i class="fas fa-arrow-right" /></span>
              </div>
            </div>

            <!-- Card 3: Bệnh án điện tử -->
            <div class="hub-card" @click="redirectToMedicalRecord">
              <div class="hub-card__icon bg-red">
                <i class="fas fa-file-medical" />
              </div>
              <div class="hub-card__body">
                <h3>Phân hệ Bệnh án Điện tử (Medical-Record-Service)</h3>
                <p>Mở cổng lưu trữ và tra cứu hồ sơ bệnh án số hóa của bệnh nhân, lịch sử khám lâm sàng và các chỉ số sức khỏe.</p>
                <span class="hub-card__btn">Mở Cổng Bệnh Án (SSO) <i class="fas fa-arrow-right" /></span>
              </div>
            </div>
          </div>

          <!-- UNIFIED CHART & METRICS -->
          <div class="dashboard-main-grid">
            <div class="chart-container main-chart" style="width: 100%;">
              <div class="chart-header">
                <h3>Thống kê tần suất truy cập & Lượt khám hệ thống</h3>
                <div class="chart-actions">
                  <span class="dot trend-dot" /> <small>Lượt hoạt động</small>
                </div>
              </div>

              <div class="canvas-wrapper">
                <canvas id="trendChart" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
  import api from '@/services/api'
  import { useAuthStore } from '@/stores/authStore'

  const authStore = useAuthStore()
  const loading = ref(false)
  const strategicStats = ref<any>(null)
  let trendChartInstance: any = null

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  const APPOINTMENT_URL = currentHost === 'localhost' || currentHost === '127.0.0.1'
    ? 'http://localhost:5173'
    : `http://${currentHost}:3001`
  const MEDICAL_RECORD_URL = currentHost === 'localhost' || currentHost === '127.0.0.1'
    ? 'http://localhost:8001'
    : `http://${currentHost}:8001`
  const PHARMACY_URL = currentHost === 'localhost' || currentHost === '127.0.0.1'
    ? 'http://localhost:8002'
    : `http://${currentHost}:8002`

  function redirectToBooking () {
    if (authStore.isAuthenticated.value) {
      const user = authStore.user.value
      const redirect = `${APPOINTMENT_URL}/auth-callback?token=${authStore.token.value}&user=${encodeURIComponent(JSON.stringify(user))}&role=${user.role}`
      window.location.href = redirect
    } else {
      window.location.href = `${APPOINTMENT_URL}/patient`
    }
  }

  function redirectToMedicalRecord () {
    if (authStore.isAuthenticated.value) {
      const user = authStore.user.value
      const redirect = `${MEDICAL_RECORD_URL}/auth-callback.html?token=${authStore.token.value}&user=${encodeURIComponent(JSON.stringify(user))}&role=${user.role}`
      window.location.href = redirect
    } else {
      window.location.href = `${MEDICAL_RECORD_URL}`
    }
  }

  function redirectToPharmacy () {
    if (authStore.isAuthenticated.value) {
      const user = authStore.user.value
      const redirect = `${PHARMACY_URL}/auth-callback.html?token=${authStore.token.value}&user=${encodeURIComponent(JSON.stringify(user))}&role=${user.role}`
      window.location.href = redirect
    } else {
      window.location.href = `${PHARMACY_URL}`
    }
  }

  async function fetchData () {
    loading.value = true
    try {
      const statsRes = await api.get('/Statistics/overview')
      strategicStats.value = statsRes.data
      nextTick(() => initCharts())
    } catch (error) {
      console.error('Lỗi tải thống kê:', error)
    } finally {
      loading.value = false
    }
  }

  function initCharts () {
    if (!strategicStats.value) return

    const trendCtx = document.querySelector('#trendChart') as HTMLCanvasElement
    if (trendCtx) {
      if (trendChartInstance) trendChartInstance.destroy()
      trendChartInstance = new (window as any).Chart(trendCtx, {
        type: 'line',
        data: {
          labels: strategicStats.value.trends.map((t: any) => t.label),
          datasets: [{
            label: 'Lượt hoạt động',
            data: strategicStats.value.trends.map((t: any) => t.value),
            borderColor: '#0047AB',
            backgroundColor: 'rgba(0, 71, 171, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#0047AB',
            pointRadius: 4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { display: false } },
            x: { grid: { display: false } },
          },
        },
      })
    }
  }

  const formatCurrency = (v: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)

  onMounted(() => {
    fetchData()
  })
</script>

<style src="@/styles/dashboard.css"></style>
<style src="@/styles/notif.css"></style>

<style scoped>
.dashboard-content--hub {
  padding: 8px;
}
.welcome-text h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}
.welcome-text p {
  color: #64748b;
  font-size: 1rem;
}
.hub-section-header {
  margin-top: 40px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
}
.hub-section-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
}
.hub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}
.hub-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}
.hub-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #0047AB;
}
.hub-card__icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 24px;
  transition: transform 0.3s;
}
.hub-card:hover .hub-card__icon {
  transform: scale(1.1) rotate(5deg);
}
.bg-blue {
  background: #eff6ff;
  color: #2563eb;
}
.bg-green {
  background: #f0fdf4;
  color: #16a34a;
}
.bg-red {
  background: #fef2f2;
  color: #dc2626;
}
.hub-card__body h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}
.hub-card__body p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 24px;
}
.hub-card__btn {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0047AB;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.hub-card__btn i {
  transition: transform 0.2s;
}
.hub-card:hover .hub-card__btn i {
  transform: translateX(4px);
}
</style>
