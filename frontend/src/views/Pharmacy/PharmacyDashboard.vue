<template>
  <a-layout style="min-height: 100vh; background: #f8fafc;">
    <!-- Sidebar -->
    <a-layout-sider width="260" theme="light" style="background: #ffffff; border-right: 1px solid #f0f4f9;">
      <PharmacySidebar />
    </a-layout-sider>

    <!-- Main Container -->
    <a-layout style="background: #f8fafc;">
      <!-- Header -->
      <AppHeader :title="headerTitle" :welcome="headerWelcome" />

      <!-- Main Contents -->
      <a-layout-content style="padding: 24px 28px;">
        <a-spin :spinning="loading">
          <!-- 1. ADMIN DASHBOARD VIEW -->
          <template v-if="userRole === 'admin'">
            <!-- Stats Grid: 5 equal-width cards -->
            <div class="admin-stats-grid" style="margin-bottom: 28px;">
              <div class="admin-stat-col">
                <StatCard title="Doanh thu hôm nay" value="12.5M" unit="đ" icon="fas fa-money-bill-wave" color="#0047AB" lightColor="#e8f0fe" trend="+12%" trendType="up" trendText="vs hôm qua" />
              </div>
              <div class="admin-stat-col">
                <StatCard title="Hóa đơn chờ TT" value="24" icon="fas fa-file-invoice-dollar" color="#d97706" lightColor="#fffbeb" trend="12.46M đ" trendType="neutral" trendText="tổng tiền" />
              </div>
              <div class="admin-stat-col">
                <StatCard title="Đơn thuốc chờ xử lý" value="28" icon="fas fa-file-prescription" color="#0284c7" lightColor="#f0f9ff" trend="+12" trendType="up" trendText="vs hôm qua" />
              </div>
              <div class="admin-stat-col">
                <StatCard title="Thuốc sắp hết" value="15" icon="fas fa-exclamation-triangle" color="#ef4444" lightColor="#fef2f2" trend="Tồn kho thấp" trendType="down" />
              </div>
              <div class="admin-stat-col">
                <StatCard title="Thuốc sắp hết hạn" value="8" icon="fas fa-hourglass-end" color="#dc2626" lightColor="#fef2f2" trend="Cần xử lý gấp" trendType="down" />
              </div>
            </div>

            <!-- Section: Biểu đồ & Cảnh báo -->
            <div class="admin-section-header">
              <i class="fas fa-chart-bar" />
              <span>Biểu đồ & Cảnh báo tồn kho</span>
            </div>
            <a-row :gutter="[20, 20]" style="margin-bottom: 28px;">
              <a-col :xs="24" :lg="16">
                <a-card :bordered="false" class="admin-card" title="Biểu đồ doanh thu tuần này">
                  <div style="height: 260px; display: flex; align-items: flex-end; justify-content: space-around; padding: 20px 12px 0; background: #fafafa; border-radius: 8px;">
                    <div v-for="day in weeklyRevenue" :key="day.day" style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                      <span style="font-size: 0.72rem; font-weight: 700; color: #475569; margin-bottom: 6px;">{{ day.val }}M</span>
                      <div :style="{ height: `${day.height}px`, background: 'linear-gradient(180deg, #0047AB 0%, #3b82f6 100%)', width: '26px', borderRadius: '4px 4px 0 0', transition: 'height 0.5s' }"></div>
                      <span style="font-size: 0.78rem; font-weight: 600; color: #64748b; margin-top: 8px;">{{ day.day }}</span>
                    </div>
                  </div>
                </a-card>
              </a-col>
              
              <a-col :xs="24" :lg="8">
                <a-card :bordered="false" class="admin-card" style="height: 100%;" title="Cảnh báo tồn kho & Hết hạn">
                  <a-list item-layout="horizontal" :data-source="combinedAlerts" size="small">
                    <template #renderItem="{ item }">
                      <a-list-item>
                        <a-list-item-meta :description="item.desc">
                          <template #title>
                            <span style="font-weight: 700; color: #1e293b;">{{ item.name }}</span>
                          </template>
                          <template #avatar>
                            <a-avatar :style="{ backgroundColor: item.type === 'stock' ? '#fef2f2' : '#fffbeb', color: item.type === 'stock' ? '#ef4444' : '#d97706' }">
                              <i :class="item.type === 'stock' ? 'fas fa-exclamation-circle' : 'fas fa-hourglass-half'" />
                            </a-avatar>
                          </template>
                        </a-list-item-meta>
                        <StatusTag :type="item.type === 'stock' ? 'danger' : 'warning'">{{ item.statusText }}</StatusTag>
                      </a-list-item>
                    </template>
                  </a-list>
                </a-card>
              </a-col>
            </a-row>

            <!-- Section: Bảng dữ liệu -->
            <div class="admin-section-header">
              <i class="fas fa-table" />
              <span>Dữ liệu giao dịch gần đây</span>
            </div>
            <a-row :gutter="[20, 20]">
              <a-col :xs="24" :lg="12">
                <a-card :bordered="false" class="admin-card" title="Hóa đơn gần đây">
                  <a-table :columns="recentBillColumns" :data-source="recentBills" :pagination="false" size="middle" row-key="key">
                    <template #bodyCell="{ text, record, column }">
                      <template v-if="column.key === 'status'">
                        <StatusTag :type="record.status === 'Đã thanh toán' ? 'success' : 'warning'">{{ record.status }}</StatusTag>
                      </template>
                    </template>
                  </a-table>
                </a-card>
              </a-col>
              <a-col :xs="24" :lg="12">
                <a-card :bordered="false" class="admin-card" title="Thuốc sắp hết hạn">
                  <a-table :columns="expiringMedicinesColumns" :data-source="expiringMedicines" :pagination="false" size="middle" row-key="key">
                    <template #bodyCell="{ text, record, column }">
                      <template v-if="column.key === 'status'">
                        <StatusTag type="danger">{{ record.stock }} hộp</StatusTag>
                      </template>
                    </template>
                  </a-table>
                </a-card>
              </a-col>
            </a-row>
          </template>

          <!-- 2. PHARMACIST DASHBOARD VIEW -->
          <template v-else-if="userRole === 'pharmacist'">
            <!-- Stats -->
            <a-row :gutter="[20, 20]" style="margin-bottom: 24px;">
              <a-col :xs="24" :sm="12" :md="12" :lg="6">
                <StatCard title="Đơn thuốc chờ cấp phát" value="28" icon="fas fa-file-prescription" color="#0047AB" lightColor="#e8f0fe" trend="12 đơn mới nhận" trendType="up" />
              </a-col>
              <a-col :xs="24" :sm="12" :md="12" :lg="6">
                <StatCard title="Phiếu nhập hôm nay" value="3" icon="fas fa-file-import" color="#10b981" lightColor="#ecfdf5" trend="42,650,000 đ" trendType="up" trendText="tổng tiền" />
              </a-col>
              <a-col :xs="24" :sm="12" :md="12" :lg="6">
                <StatCard title="Thuốc tồn kho thấp" value="22" icon="fas fa-boxes" color="#ef4444" lightColor="#fef2f2" trend="Dưới mức tối thiểu" trendType="down" />
              </a-col>
              <a-col :xs="24" :sm="12" :md="12" :lg="6">
                <StatCard title="Thuốc sắp hết hạn" value="15" icon="fas fa-hourglass-end" color="#d97706" lightColor="#fffbeb" trend="Trong 90 ngày tới" trendType="down" />
              </a-col>
            </a-row>

            <!-- Dashboard sections -->
            <a-row :gutter="[20, 20]" style="margin-bottom: 24px;">
              <!-- Left side -->
              <a-col :xs="24" :lg="12">
                <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01);" title="Thuốc sắp hết hạn (trong 90 ngày)">
                  <template #extra><a-button type="link" @click="$router.push('/pharmacy/medicines')">Xem tất cả</a-button></template>
                  <a-table :columns="expiringMedColumns" :data-source="expiringMedList" :pagination="false" size="middle" row-key="key" />
                </a-card>
              </a-col>

              <!-- Right side -->
              <a-col :xs="24" :lg="12">
                <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01);" title="Đơn thuốc chờ cấp phát">
                  <template #extra><a-button type="link" @click="$router.push('/pharmacy/prescriptions')">Xem tất cả</a-button></template>
                  <a-table :columns="pendingPresColumns" :data-source="pendingPresList" :pagination="false" size="middle" row-key="key">
                    <template #bodyCell="{ text, record, column }">
                      <template v-if="column.key === 'status'">
                        <StatusTag type="warning">{{ record.status }}</StatusTag>
                      </template>
                    </template>
                  </a-table>
                </a-card>
              </a-col>
            </a-row>

            <a-row :gutter="[20, 20]">
              <a-col :xs="24" :lg="12">
                <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01);" title="Hóa đơn nhập thuốc gần đây">
                  <template #extra><a-button type="link" @click="$router.push('/pharmacy/inventory?tab=history')">Xem tất cả</a-button></template>
                  <a-table :columns="importInvoiceColumns" :data-source="importInvoiceList" :pagination="false" size="middle" row-key="key">
                    <template #bodyCell="{ text, record, column }">
                      <template v-if="column.key === 'status'">
                        <StatusTag type="success">{{ record.status }}</StatusTag>
                      </template>
                    </template>
                  </a-table>
                </a-card>
              </a-col>

              <a-col :xs="24" :lg="12">
                <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01);" title="Tồn kho theo lô (cận hạn &amp; tồn thấp)">
                  <template #extra><a-button type="link" @click="$router.push('/pharmacy/inventory?tab=batches')">Xem tất cả</a-button></template>
                  <a-table :columns="batchStockColumns" :data-source="batchStockList" :pagination="false" size="middle" row-key="key">
                    <template #bodyCell="{ text, record, column }">
                      <template v-if="column.key === 'status'">
                        <StatusTag :type="record.status === 'Thấp' ? 'danger' : 'warning'">{{ record.status }}</StatusTag>
                      </template>
                    </template>
                  </a-table>
                </a-card>
              </a-col>
            </a-row>
          </template>

          <!-- 3. CASHIER DASHBOARD VIEW (MATCHES IMAGE 1) -->
          <template v-else-if="userRole === 'cashier'">
            <!-- 5 Stats Cards Row -->
            <div class="cashier-stats-row" style="margin-bottom: 24px;">
              <!-- 1. Tổng hóa đơn -->
              <div class="stat-card">
                <div class="stat-icon-wrapper blue-bg">
                  <i class="fas fa-file-invoice" />
                </div>
                <div class="stat-info">
                  <span class="lbl">Tổng hóa đơn</span>
                  <strong class="val">156</strong>
                  <span class="trend trend-up"><i class="fas fa-arrow-up" /> 18% <span class="trend-lbl">so với hôm qua</span></span>
                </div>
              </div>

              <!-- 2. Đã thanh toán -->
              <div class="stat-card">
                <div class="stat-icon-wrapper green-bg">
                  <i class="fas fa-check-circle" />
                </div>
                <div class="stat-info">
                  <span class="lbl">Đã thanh toán</span>
                  <strong class="val">112</strong>
                  <span class="trend trend-up"><i class="fas fa-arrow-up" /> 22% <span class="trend-lbl">so với hôm qua</span></span>
                </div>
              </div>

              <!-- 3. Chưa thanh toán -->
              <div class="stat-card">
                <div class="stat-icon-wrapper orange-bg">
                  <i class="fas fa-clock" />
                </div>
                <div class="stat-info">
                  <span class="lbl">Chưa thanh toán</span>
                  <strong class="val">44</strong>
                  <span class="trend trend-down"><i class="fas fa-arrow-down" /> 8% <span class="trend-lbl">so với hôm qua</span></span>
                </div>
              </div>

              <!-- 4. Tổng tiền thu -->
              <div class="stat-card">
                <div class="stat-icon-wrapper teal-bg">
                  <i class="fas fa-wallet" />
                </div>
                <div class="stat-info">
                  <span class="lbl">Tổng tiền thu</span>
                  <strong class="val">78.650.000 đ</strong>
                  <span class="trend trend-up"><i class="fas fa-arrow-up" /> 19% <span class="trend-lbl">so với hôm qua</span></span>
                </div>
              </div>

              <!-- 5. Trung bình/HĐ -->
              <div class="stat-card">
                <div class="stat-icon-wrapper purple-bg">
                  <i class="fas fa-chart-line" />
                </div>
                <div class="stat-info">
                  <span class="lbl">Trung bình/hóa đơn</span>
                  <strong class="val">504.808 đ</strong>
                  <span class="trend trend-up"><i class="fas fa-arrow-up" /> 1% <span class="trend-lbl">so với hôm qua</span></span>
                </div>
              </div>
            </div>

            <!-- Graphs Row -->
            <a-row :gutter="20" style="margin-bottom: 24px;">
              <!-- Line Chart: Doanh thu theo giờ -->
              <a-col :xs="24" :lg="14">
                <a-card :bordered="false" class="premium-dashboard-card" style="height: 100%;">
                  <template #title>
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                      <span style="font-weight: 700; font-size: 0.95rem; color: #1e293b;">Doanh thu theo giờ trong ngày</span>
                      <a-select size="small" v-model:value="timeFilter" style="width: 100px;">
                        <a-select-option value="today">Hôm nay</a-select-option>
                        <a-select-option value="yesterday">Hôm qua</a-select-option>
                      </a-select>
                    </div>
                  </template>
                  
                  <div class="chart-container" style="position: relative; height: 180px; margin-top: 10px;">
                    <!-- Beautiful Custom SVG line chart to guarantee high fidelity without library issues -->
                    <svg viewBox="0 0 500 200" style="width: 100%; height: 100%;">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25" />
                          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
                        </linearGradient>
                      </defs>
                      <!-- Grid lines -->
                      <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" stroke-width="1" />
                      <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" stroke-width="1" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" stroke-width="1" />
                      <line x1="0" y1="160" x2="500" y2="160" stroke="#f1f5f9" stroke-width="1" />
                      <!-- Gradient Area -->
                      <path d="M 10 180 Q 60 170 110 150 T 210 80 T 310 110 T 410 70 T 490 180 L 490 180 L 10 180 Z" fill="url(#chartGradient)" />
                      <!-- Line -->
                      <path d="M 10 180 Q 60 170 110 150 T 210 80 T 310 110 T 410 70 T 490 180" fill="none" stroke="#3b82f6" stroke-width="3" />
                      <!-- Dots -->
                      <circle cx="10" cy="180" r="4" fill="#ffffff" stroke="#3b82f6" stroke-width="2" />
                      <circle cx="110" cy="150" r="4" fill="#ffffff" stroke="#3b82f6" stroke-width="2" />
                      <circle cx="210" cy="80" r="4" fill="#ffffff" stroke="#3b82f6" stroke-width="2" />
                      <circle cx="310" cy="110" r="4" fill="#ffffff" stroke="#3b82f6" stroke-width="2" />
                      <circle cx="410" cy="70" r="4" fill="#ffffff" stroke="#3b82f6" stroke-width="2" />
                      <circle cx="490" cy="180" r="4" fill="#ffffff" stroke="#3b82f6" stroke-width="2" />
                    </svg>
                    <div class="chart-x-labels" style="display: flex; justify-content: space-between; margin-top: 8px; color: #94a3b8; font-size: 0.72rem;">
                      <span>00:00</span>
                      <span>03:00</span>
                      <span>06:00</span>
                      <span>09:00</span>
                      <span>12:00</span>
                      <span>15:00</span>
                      <span>18:00</span>
                      <span>21:00</span>
                      <span>23:00</span>
                    </div>
                  </div>
                </a-card>
              </a-col>
 
              <!-- Pie Chart: Doanh thu theo phương thức -->
              <a-col :xs="24" :lg="10">
                <a-card :bordered="false" class="premium-dashboard-card" style="height: 100%;" title="Tổng tiền thu theo phương thức">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; height: 180px; padding-top: 10px;">
                    <!-- Donut SVG -->
                    <div style="position: relative; width: 110px; height: 110px; flex-shrink: 0;">
                      <svg viewBox="0 0 36 36" style="width: 100%; height: 100%;">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" stroke-width="4.2" />
                        <!-- Blue: 45% -->
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" stroke-width="4.2" stroke-dasharray="45 55" stroke-dashoffset="25" />
                        <!-- Green: 30% -->
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" stroke-width="4.2" stroke-dasharray="30 70" stroke-dashoffset="-20" />
                        <!-- Orange: 15% -->
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" stroke-width="4.2" stroke-dasharray="15 85" stroke-dashoffset="-50" />
                        <!-- Purple: 10% -->
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" stroke-width="4.2" stroke-dasharray="10 90" stroke-dashoffset="-65" />
                      </svg>
                      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 80px;">
                        <div style="font-size: 0.68rem; font-weight: 700; color: #1e293b; line-height: 1.1;">78.650M</div>
                        <div style="font-size: 0.52rem; color: #64748b; font-weight: 600;">Tổng thu</div>
                      </div>
                    </div>
 
                    <!-- Legend list -->
                    <div class="legend-list" style="display: flex; flex-direction: column; gap: 6px; flex: 1;">
                      <div class="legend-item"><span class="dot blue" /> <span class="lbl">Tiền mặt</span> <span class="val">45%</span></div>
                      <div class="legend-item"><span class="dot green" /> <span class="lbl">Chuyển khoản</span> <span class="val">30%</span></div>
                      <div class="legend-item"><span class="dot orange" /> <span class="lbl">Thẻ ngân hàng</span> <span class="val">15%</span></div>
                      <div class="legend-item"><span class="dot purple" /> <span class="lbl">Ví điện tử</span> <span class="val">10%</span></div>
                    </div>
                  </div>
                </a-card>
              </a-col>
            </a-row>
 
            <!-- Table & Widgets Row -->
            <a-row :gutter="20">
              <!-- Left side: Hóa đơn chưa thanh toán -->
              <a-col :xs="24" :lg="18">
                <a-card :bordered="false" class="table-container-card" title="Hóa đơn chưa thanh toán" style="height: 100%;">
                  <a-table
                    :columns="unpaidBillsColumns"
                    :data-source="unpaidBills"
                    row-key="id"
                    :pagination="paginationConfig"
                    size="middle"
                    class="unpaid-bills-table"
                  >
                    <template #bodyCell="{ text, record, column }">
                      <template v-if="column.key === 'code'">
                        <span class="code-link" @click="$router.push(`/pharmacy/create-bill?source=pres&code=${record.prescriptionCode || record.code}`)">{{ record.code }}</span>
                      </template>
                      <template v-else-if="column.key === 'total'">
                        <span style="font-weight: 600;">{{ record.total.toLocaleString() }} đ</span>
                      </template>
                      <template v-else-if="column.key === 'remaining'">
                        <span style="font-weight: 700; color: #ef4444;">{{ record.remaining.toLocaleString() }} đ</span>
                      </template>
                      <template v-else-if="column.key === 'action'">
                        <div style="display: flex; gap: 8px; align-items: center;">
                          <a-button type="primary" size="small" style="background: #2563eb; border-color: #2563eb; border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 4px;" @click="payUnpaidBill(record)">
                            Thanh toán
                          </a-button>
                          <a-button type="text" size="small" style="color: #64748b;"><i class="fas fa-ellipsis-v" /></a-button>
                        </div>
                      </template>
                    </template>
                  </a-table>
                </a-card>
              </a-col>
 
              <!-- Right side: Widgets -->
              <a-col :xs="24" :lg="6">
                <!-- 1. Đơn thuốc chờ xử lý -->
                <a-card :bordered="false" class="premium-dashboard-card mini-widget-card" style="margin-bottom: 16px;">
                  <template #title>
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                      <span style="font-weight: 700; font-size: 0.88rem; color: #1e293b;">Đơn thuốc chờ xử lý</span>
                      <a-badge :count="8" :number-style="{ backgroundColor: '#eff6ff', color: '#1e3a8a', boxShadow: 'none', fontWeight: 'bold' }" />
                    </div>
                  </template>
                  <div class="mini-widget-list">
                    <div class="mini-list-item" v-for="pres in widgetPresList" :key="pres.code" @click="$router.push(`/pharmacy/create-bill?source=pres&code=${pres.code}`)">
                      <div class="left-meta">
                        <div class="patient-name">{{ pres.patient }}</div>
                        <div class="pres-code">{{ pres.code }}</div>
                      </div>
                      <div class="right-meta">
                        <span class="time">{{ pres.time }}</span>
                        <span class="custom-badge badge-pending">Chờ tạo HĐ</span>
                      </div>
                    </div>
                    <div class="view-all-link" @click="$router.push('/pharmacy/create-bill?source=pres')">
                      Xem tất cả <i class="fas fa-chevron-right" />
                    </div>
                  </div>
                </a-card>
 
                <!-- 2. Thuốc tồn thấp -->
                <a-card :bordered="false" class="premium-dashboard-card mini-widget-card">
                  <template #title>
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                      <span style="font-weight: 700; font-size: 0.88rem; color: #1e293b;">Thuốc tồn thấp</span>
                      <a-badge :count="6" :number-style="{ backgroundColor: '#fef2f2', color: '#991b1b', boxShadow: 'none', fontWeight: 'bold' }" />
                    </div>
                  </template>
                  <div class="mini-widget-list">
                    <div class="mini-list-item no-hover" v-for="med in widgetLowStock" :key="med.name">
                      <div class="left-meta">
                        <div class="med-name">{{ med.name }}</div>
                        <div class="med-desc">{{ med.desc }}</div>
                      </div>
                      <div class="right-meta" style="justify-content: center;">
                        <span class="stock-qty red-txt">{{ med.qty }}</span>
                      </div>
                    </div>
                    <div class="view-all-link" @click="$router.push('/pharmacy/inventory')">
                      Xem tất cả <i class="fas fa-chevron-right" />
                    </div>
                  </div>
                </a-card>
              </a-col>
            </a-row>

          </template>
        </a-spin>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/authStore'
import PharmacySidebar from '@/components/PharmacySidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import StatCard from '@/components/StatCard.vue'
import StatusTag from '@/components/StatusTag.vue'
import { getBills, getPrescriptions, getMedicines } from '@/services/pharmacyService'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const timeFilter = ref('today')

// Detect Cashier vs Admin vs Pharmacist roles correctly
const userRole = computed(() => {
  const role = (authStore.user.value?.role || 'pharmacist').toLowerCase()
  if (role === 'receptionist' || role === 'cashier') return 'cashier'
  if (role === 'doctor') return 'pharmacist'
  return role
})

// Dynamic Header titles
const headerTitle = computed(() => {
  if (userRole.value === 'cashier') return 'Tổng quan thanh toán'
  return 'Tổng quan nhà thuốc'
})

const headerWelcome = computed(() => {
  if (userRole.value === 'cashier') return 'Tổng quan hoạt động thanh toán trong ngày 24/05/2025'
  return undefined
})

// ----------------------------------------
// CASHIER SPECIFIC DATA
// ----------------------------------------
const widgetPresList = ref<any[]>([])
const widgetLowStock = ref<any[]>([])

// Unpaid Bills Columns (matches Image 1)
const unpaidBillsColumns = [
  { title: 'Mã hóa đơn', dataIndex: 'code', key: 'code', width: 140 },
  { title: 'Bệnh nhân / Khách hàng', dataIndex: 'patient', key: 'patient' },
  { title: 'Loại hóa đơn', dataIndex: 'type', key: 'type', width: 220 },
  { title: 'Ngày lập', dataIndex: 'date', key: 'date', width: 170 },
  { title: 'Tổng tiền', dataIndex: 'total', key: 'total', width: 130, align: 'right' as const },
  { title: 'Còn lại', dataIndex: 'remaining', key: 'remaining', width: 130, align: 'right' as const },
  { title: 'Thao tác', key: 'action', width: 150, align: 'center' as const }
]

const unpaidBills = ref<any[]>([])

const paginationConfig = computed(() => ({
  pageSize: 5,
  total: unpaidBills.value.length,
  showTotal: (total: number, range: [number, number]) => `Hiển thị ${range[0]} đến ${range[1]} trong tổng số ${total} hóa đơn`,
  locale: { items_per_page: '/ trang' }
}))

function payUnpaidBill(record: any) {
  router.push(`/pharmacy/create-bill?source=pres&code=${record.prescriptionCode || record.code}`)
}

// ----------------------------------------
// ADMIN & PHARMACIST DATA
// ----------------------------------------
const weeklyRevenue = [
  { day: 'T2', val: 8.5, height: 110 },
  { day: 'T3', val: 12.0, height: 160 },
  { day: 'T4', val: 9.3, height: 120 },
  { day: 'T5', val: 15.6, height: 210 },
  { day: 'T6', val: 11.4, height: 150 },
  { day: 'T7', val: 21.4, height: 260 },
  { day: 'CN', val: 18.7, height: 230 },
]

const combinedAlerts = [
  { name: 'Amoxicillin 500mg', desc: 'Số lô: AMX240501 - HSD: 15/07/2025', type: 'stock', statusText: 'Tồn kho thấp: 5' },
  { name: 'Metformin 850mg', desc: 'Số lô: MET240212 - HSD: 30/08/2025', type: 'stock', statusText: 'Tồn kho thấp: 8' },
  { name: 'Aspirin 81mg', desc: 'Số lô: ASP240602 - HSD: 10/06/2025', type: 'expired', statusText: 'Sắp hết hạn' },
]

const expiringMedicinesColumns = [
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Số lô', dataIndex: 'batch', key: 'batch' },
  { title: 'Hạn sử dụng', dataIndex: 'hsd', key: 'hsd' },
  { title: 'Số lượng', key: 'status', align: 'right' }
]

const expiringMedicines = ref<any[]>([])

const expiringMedColumns = [
  { title: 'Thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Số lô', dataIndex: 'batch', key: 'batch' },
  { title: 'HSD', dataIndex: 'hsd', key: 'hsd' },
  { title: 'Còn lại', dataIndex: 'remaining', key: 'remaining' }
]

const expiringMedList = ref<any[]>([])

const pendingPresColumns = [
  { title: 'Mã đơn', dataIndex: 'code', key: 'code' },
  { title: 'Bệnh nhân', dataIndex: 'patient', key: 'patient' },
  { title: 'Thời gian', dataIndex: 'time', key: 'time' },
  { title: 'Trạng thái', key: 'status' }
]

const pendingPresList = ref<any[]>([])

const importInvoiceColumns = [
  { title: 'Mã hóa đơn', dataIndex: 'code', key: 'code' },
  { title: 'Nhà cung cấp', dataIndex: 'supplier', key: 'supplier' },
  { title: 'Tổng tiền', dataIndex: 'total', key: 'total' },
  { title: 'Trạng thái', key: 'status' }
]

const importInvoiceList = ref<any[]>([])

const batchStockColumns = [
  { title: 'Thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Số lô', dataIndex: 'batch', key: 'batch' },
  { title: 'HSD', dataIndex: 'hsd', key: 'hsd' },
  { title: 'Tồn kho', dataIndex: 'stock', key: 'stock' },
  { title: 'Trạng thái', key: 'status' }
]

const batchStockList = ref<any[]>([])

const recentBillColumns = [
  { title: 'Mã hóa đơn', dataIndex: 'code', key: 'code' },
  { title: 'Bệnh nhân', dataIndex: 'patient', key: 'patient' },
  { title: 'Tổng tiền', dataIndex: 'total', key: 'total' },
  { title: 'Trạng thái', key: 'status' },
]

const recentBills = ref<any[]>([])

const loadDashboardData = async () => {
  loading.value = true
  try {
    const [billsData, presData, medsData] = await Promise.all([
      getBills().catch(() => []),
      getPrescriptions().catch(() => []),
      getMedicines().catch(() => [])
    ])

    // 1. Unpaid Bills for Cashier
    unpaidBills.value = (billsData || [])
      .filter((b: any) => b.status?.toLowerCase() !== 'paid')
      .map((b: any, idx: number) => ({
        id: b.id || idx + 1,
        code: `INV${String(b.id || idx + 1).padStart(8, '0')}`,
        patient: b.patient || `Bệnh nhân #${b.patientId}`,
        type: b.examinationFee > 0 ? 'Hóa đơn tổng hợp' : 'Hóa đơn từ đơn thuốc',
        date: b.createdAt ? new Date(b.createdAt).toLocaleString('vi-VN') : 'Vừa xong',
        total: b.totalAmount || 0,
        remaining: b.totalAmount || 0,
        prescriptionCode: b.prescriptionId ? `PRC${String(b.prescriptionId).padStart(5, '0')}` : undefined
      }))

    // 2. Pending prescriptions widget for Cashier & Pharmacist
    widgetPresList.value = (presData || [])
      .filter((p: any) => p.status?.toLowerCase() === 'pending' || p.status?.toLowerCase() === 'waiting' || !p.status)
      .slice(0, 5)
      .map((p: any) => {
        const dateObj = p.createdAt ? new Date(p.createdAt) : new Date()
        return {
          patient: p.patient || 'Khách hàng',
          code: p.code || `PRC${String(p.id).padStart(5, '0')}`,
          time: dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      })

    // 3. Pending prescriptions list for Pharmacist
    pendingPresList.value = (presData || [])
      .filter((p: any) => p.status?.toLowerCase() === 'pending' || p.status?.toLowerCase() === 'waiting' || !p.status)
      .slice(0, 5)
      .map((p: any, idx: number) => ({
        key: String(p.id || idx),
        code: p.code || `PRC${String(p.id).padStart(5, '0')}`,
        patient: p.patient || 'Khách hàng',
        time: p.createdAt ? new Date(p.createdAt).toLocaleString('vi-VN') : 'Hôm nay',
        status: p.status || 'Chờ cấp phát'
      }))

    // 4. Low stock widget
    widgetLowStock.value = (medsData || [])
      .filter((m: any) => (m.stockQuantity || m.stock || 0) < 30)
      .slice(0, 4)
      .map((m: any) => ({
        name: m.name,
        desc: m.unit || 'Viên',
        qty: String(m.stockQuantity || m.stock || 0)
      }))

    // 5. Batch stock list for Pharmacist
    batchStockList.value = (medsData || [])
      .filter((m: any) => (m.stockQuantity || m.stock || 0) < 50)
      .slice(0, 5)
      .map((m: any, idx: number) => ({
        key: String(m.id || idx),
        name: m.name,
        batch: `L${new Date().getFullYear().toString().slice(2)}${String(idx + 1).padStart(4, '0')}`,
        hsd: '31/12/2026',
        stock: m.stockQuantity || m.stock || 0,
        status: (m.stockQuantity || m.stock || 0) < 20 ? 'Thấp' : 'Cảnh báo'
      }))

    // 6. Recent bills
    recentBills.value = (billsData || [])
      .slice(0, 3)
      .map((b: any, idx: number) => ({
        key: String(b.id || idx),
        code: `INV${String(b.id || idx + 1).padStart(8, '0')}`,
        patient: b.patient || `Bệnh nhân #${b.patientId}`,
        total: (b.totalAmount || 0).toLocaleString('vi-VN') + 'đ',
        status: b.status || 'Đã thanh toán'
      }))

    // 7. Expiring Medicines dynamically derived from medsData
    expiringMedicines.value = (medsData || [])
      .filter((m: any) => {
        if (!m.expiryDate) return false
        const expiry = new Date(m.expiryDate)
        const now = new Date()
        const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays >= 0 && diffDays <= 30
      })
      .slice(0, 5)
      .map((m: any, idx: number) => ({
        key: String(m.id || idx),
        name: m.name,
        batch: `LO${String(m.id).padStart(3, '0')}`,
        hsd: new Date(m.expiryDate).toLocaleDateString('vi-VN'),
        stock: m.stockQuantity || m.stock || 0
      }))

    // 8. Expiring Med list for Pharmacist
    expiringMedList.value = (medsData || [])
      .filter((m: any) => {
        if (!m.expiryDate) return false
        const expiry = new Date(m.expiryDate)
        const now = new Date()
        const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays >= 0 && diffDays <= 30
      })
      .slice(0, 5)
      .map((m: any, idx: number) => ({
        key: String(m.id || idx),
        name: m.name,
        batch: `LO${String(m.id).padStart(3, '0')}`,
        hsd: new Date(m.expiryDate).toLocaleDateString('vi-VN'),
        remaining: `${m.stockQuantity || m.stock || 0} ${m.unit || 'Viên'}`
      }))

    // 9. Import Invoice list loaded from local storage
    const storedImports = localStorage.getItem('import_bills_data')
    if (storedImports) {
      try {
        const list = JSON.parse(storedImports)
        importInvoiceList.value = list.slice(0, 5).map((item: any, idx: number) => ({
          key: String(idx),
          code: item.code,
          supplier: item.supplierName || 'Nhà cung cấp',
          total: item.finalTotal.toLocaleString('vi-VN') + ' đ',
          status: item.status === 'completed' ? 'Đã hoàn tất' : 'Lưu nháp'
        }))
      } catch (e) {
        importInvoiceList.value = []
      }
    } else {
      importInvoiceList.value = []
    }
  } catch (err: any) {
    message.error('Lỗi tải dữ liệu Dashboard: ' + err.message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadDashboardData()
})
</script>

<style scoped>
/* =========================================
   Admin Stats Grid: 5 equal columns
   ========================================= */
.admin-stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

@media (max-width: 1400px) {
  .admin-stats-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1100px) {
  .admin-stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .admin-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.admin-stat-col {
  min-width: 0; /* prevent overflow in grid */
  overflow: hidden;
}

/* Admin Section Header Divider */
.admin-section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0047AB;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e8f0fe;
}

.admin-section-header i {
  font-size: 0.95rem;
  background: #e8f0fe;
  color: #0047AB;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Admin Card styling */
.admin-card {
  border-radius: 12px;
  border: 1px solid #e8f0fe;
  box-shadow: 0 1px 4px rgba(0,71,171,0.04);
}

/* =========================================
   5 Stat Cards cashier layout
   ========================================= */
.cashier-stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

@media (max-width: 1200px) {
  .cashier-stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .cashier-stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #f0f4f9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  text-align: center;
  height: 100%;
}

.stat-icon-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.blue-bg { background: #eff6ff; color: #2563eb; }
.green-bg { background: #ecfdf5; color: #10b981; }
.orange-bg { background: #fff7ed; color: #ea580c; }
.teal-bg { background: #f0fdfa; color: #0d9488; }
.purple-bg { background: #faf5ff; color: #8b5cf6; }

.stat-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2px;
}

.stat-info .lbl {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
}

.stat-info .val {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
}

.trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 700;
}

.trend-up { color: #10b981; }
.trend-down { color: #ef4444; }
.trend-lbl { color: #94a3b8; font-weight: 500; }

/* Dashboard Section Divider Header */
.dashboard-section-header {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0047AB;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
}

/* Legend & Pie styling */
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 500;
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-item .dot.blue { background: #3b82f6; }
.legend-item .dot.green { background: #10b981; }
.legend-item .dot.orange { background: #f59e0b; }
.legend-item .dot.purple { background: #8b5cf6; }

.legend-item .lbl {
  color: #64748b;
  flex: 1;
}

.legend-item .val {
  color: #1e293b;
  font-weight: 700;
}

/* Premium Dashboard Card */
.premium-dashboard-card {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
}

.premium-dashboard-card :deep(.ant-card-head) {
  border-bottom: 1px solid #f1f5f9;
  padding: 0 20px !important;
  min-height: 52px;
}

.premium-dashboard-card :deep(.ant-card-body) {
  padding: 16px 20px !important;
}

/* Mini widgets list */
.mini-widget-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mini-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;
}

.mini-list-item:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.mini-list-item.no-hover {
  cursor: default;
}

.mini-list-item.no-hover:hover {
  background: transparent;
  border-color: #f1f5f9;
}

.left-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.left-meta .patient-name, .left-meta .med-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1e293b;
}

.left-meta .pres-code, .left-meta .med-desc {
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
}

.right-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.right-meta .time {
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 600;
}

.stock-qty {
  font-size: 0.9rem;
  font-weight: 800;
}

.red-txt {
  color: #dc2626;
}

/* Badges */
.custom-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
}

.badge-pending {
  background: #fff7ed;
  color: #ea580c;
}

.view-all-link {
  font-size: 0.8rem;
  font-weight: 700;
  color: #2563eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  transition: gap 0.2s;
  justify-content: flex-end;
}

.view-all-link:hover {
  color: #1d4ed8;
  gap: 6px;
}

/* Table Card */
.table-container-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  border: 1px solid #e2e8f0;
}

.unpaid-bills-table :deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.82rem;
  border-bottom: 1px solid #e2e8f0;
}

.unpaid-bills-table :deep(.ant-table-cell) {
  padding: 12px 16px !important;
  font-size: 0.88rem;
}

.code-link {
  font-weight: 700;
  color: #2563eb;
  cursor: pointer;
}

.code-link:hover {
  text-decoration: underline;
}
</style>
