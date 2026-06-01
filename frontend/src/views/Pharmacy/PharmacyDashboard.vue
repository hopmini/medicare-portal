<template>
  <a-layout style="min-height: 100vh; background: #f0f2f5;">
    <a-layout-sider width="260" theme="light">
      <PharmacySidebar />
    </a-layout-sider>

    <a-layout style="background: #f0f2f5;">
      <!-- Header -->
      <a-layout-header style="background: #ffffff; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f0f0f0; height: 64px;">
        <h2 style="margin: 0; font-weight: 700; color: #262626; font-size: 1.25rem;">
          <i class="fas fa-chart-line" style="color: #007d88; margin-right: 8px;" />
          Tổng quan Dược phẩm &amp; Hóa đơn
        </h2>
        <div style="display: flex; align-items: center; gap: 8px;">
          <a-avatar size="small" style="background-color: #007d88;"><i class="fas fa-user" /></a-avatar>
          <span style="font-weight: 600; color: #262626; font-size: 0.9rem;">
            {{ authStore.user?.value?.role || 'Admin' }}
          </span>
        </div>
      </a-layout-header>

      <a-layout-content style="padding: 24px;">

        <!-- ADMIN DASHBOARD -->
        <template v-if="authStore.isAdmin.value">
          <a-row :gutter="[16, 16]" style="margin-bottom: 24px;">
            <a-col :xs="24" :sm="12" :md="12" :lg="6"
              v-for="item in adminStats" :key="item.title">
              <a-card hoverable style="border-radius: 10px; border: 1px solid #e6f7f9;">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="width: 48px; height: 48px; border-radius: 12px; background: #e6f7f9; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #007d88;">
                    <i :class="item.icon" />
                  </div>
                  <div>
                    <div style="font-size: 0.8rem; color: #8c8c8c;">{{ item.title }}</div>
                    <div style="font-size: 1.4rem; font-weight: 700; color: #262626;">{{ item.value }}</div>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>

          <a-card title="Top 5 thuốc bán chạy nhất" style="border-radius: 10px; margin-bottom: 24px;">
            <a-table
              :columns="topMedColumns"
              :data-source="topMedicines"
              :pagination="false"
              row-key="key"
            />
          </a-card>

          <a-row :gutter="[16, 16]">
            <a-col :xs="24" :md="12">
              <a-card title="Hóa đơn gần đây" style="border-radius: 10px;">
                <a-table
                  :columns="recentBillColumns"
                  :data-source="recentBills"
                  :pagination="false"
                  row-key="key"
                  size="small"
                />
              </a-card>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-card title="Thuốc sắp hết hàng" style="border-radius: 10px;">
                <a-table
                  :columns="lowStockColumns"
                  :data-source="lowStockItems"
                  :pagination="false"
                  row-key="key"
                  size="small"
                />
              </a-card>
            </a-col>
          </a-row>
        </template>

        <!-- DOCTOR DASHBOARD -->
        <template v-else-if="authStore.isDoctor.value">
          <a-row :gutter="[16, 16]" style="margin-bottom: 24px;">
            <a-col :xs="24" :sm="12" :md="12" :lg="8"
              v-for="item in doctorStats" :key="item.title">
              <a-card hoverable style="border-radius: 10px; border: 1px solid #e6f7f9;">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="width: 48px; height: 48px; border-radius: 12px; background: #e6f7f9; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #007d88;">
                    <i :class="item.icon" />
                  </div>
                  <div>
                    <div style="font-size: 0.8rem; color: #8c8c8c;">{{ item.title }}</div>
                    <div style="font-size: 1.4rem; font-weight: 700; color: #262626;">{{ item.value }}</div>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
          <a-card title="Thuốc tôi kê nhiều nhất" style="border-radius: 10px;">
            <a-table :columns="[
              { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
              { title: 'Số lần kê đơn', dataIndex: 'prescribed', key: 'prescribed' }
            ]" :data-source="[
              { key: '1', name: 'Paracetamol', prescribed: 45 },
              { key: '2', name: 'Amoxicillin', prescribed: 30 },
              { key: '3', name: 'Ibuprofen', prescribed: 12 }
            ]" :pagination="false" row-key="key" />
          </a-card>
        </template>

        <!-- RECEPTIONIST DASHBOARD -->
        <template v-else-if="authStore.isReceptionist.value">
          <a-row :gutter="[16, 16]" style="margin-bottom: 24px;">
            <a-col :xs="24" :sm="12" :md="12" :lg="8"
              v-for="item in receptionistStats" :key="item.title">
              <a-card hoverable style="border-radius: 10px; border: 1px solid #e6f7f9;">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="width: 48px; height: 48px; border-radius: 12px; background: #e6f7f9; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #007d88;">
                    <i :class="item.icon" />
                  </div>
                  <div>
                    <div style="font-size: 0.8rem; color: #8c8c8c;">{{ item.title }}</div>
                    <div style="font-size: 1.4rem; font-weight: 700; color: #262626;">{{ item.value }}</div>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
          <a-card title="Các hóa đơn mới xuất gần đây" style="border-radius: 10px;">
            <a-table :columns="recentBillColumns" :data-source="recentBills" :pagination="false" row-key="key" />
          </a-card>
        </template>

        <!-- PATIENT DASHBOARD -->
        <template v-else-if="authStore.isPatient.value">
          <a-row :gutter="[16, 16]" style="margin-bottom: 24px;">
            <a-col :xs="24" :sm="12" :md="12" :lg="8"
              v-for="item in patientStats" :key="item.title">
              <a-card hoverable style="border-radius: 10px; border: 1px solid #e6f7f9;">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="width: 48px; height: 48px; border-radius: 12px; background: #e6f7f9; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #007d88;">
                    <i :class="item.icon" />
                  </div>
                  <div>
                    <div style="font-size: 0.8rem; color: #8c8c8c;">{{ item.title }}</div>
                    <div style="font-size: 1.4rem; font-weight: 700; color: #262626;">{{ item.value }}</div>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
          <a-card title="Hóa đơn điều trị của tôi" style="border-radius: 10px;">
            <a-table :columns="[
              { title: 'Ngày khám', dataIndex: 'date', key: 'date' },
              { title: 'Tiền khám', dataIndex: 'treatment', key: 'treatment' },
              { title: 'Tiền thuốc', dataIndex: 'medicine', key: 'medicine' },
              { title: 'Tổng cộng', dataIndex: 'total', key: 'total' }
            ]" :data-source="[
              { key: '1', date: '2026-05-20', treatment: '150,000đ', medicine: '120,000đ', total: '270,000đ' },
              { key: '2', date: '2026-05-28', treatment: '150,000đ', medicine: '0đ', total: '150,000đ' }
            ]" :pagination="false" row-key="key" />
          </a-card>
        </template>

      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import PharmacySidebar from '@/components/PharmacySidebar.vue'

const authStore = useAuthStore()

const adminStats = [
  { title: 'Tổng số thuốc', value: 1500, icon: 'fas fa-capsules' },
  { title: 'Cảnh báo sắp hết hàng', value: 45, icon: 'fas fa-exclamation-triangle' },
  { title: 'Doanh thu tháng này', value: '12,500,000đ', icon: 'fas fa-chart-line' },
  { title: 'Tổng hóa đơn đã xuất', value: 320, icon: 'fas fa-file-invoice-dollar' },
]

const doctorStats = [
  { title: 'Tổng số đơn thuốc đã kê', value: 87, icon: 'fas fa-file-prescription' },
  { title: 'Đơn thuốc đang hoạt động', value: 12, icon: 'fas fa-notes-medical' },
  { title: 'Số thuốc trong kho dược', value: 1500, icon: 'fas fa-capsules' },
]

const receptionistStats = [
  { title: 'Hóa đơn hôm nay', value: 18, icon: 'fas fa-file-invoice' },
  { title: 'Tổng tiền thu hôm nay', value: '4,500,000đ', icon: 'fas fa-money-bill-wave' },
  { title: 'Hóa đơn chờ xử lý', value: 3, icon: 'fas fa-clock' },
]

const patientStats = [
  { title: 'Đơn thuốc của tôi', value: 5, icon: 'fas fa-file-prescription' },
  { title: 'Tổng số hóa đơn', value: 3, icon: 'fas fa-file-invoice-dollar' },
  { title: 'Cần thanh toán', value: '0đ', icon: 'fas fa-credit-card' },
]

const topMedColumns = [
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Số lượng đã bán', dataIndex: 'sold', key: 'sold' },
  { title: 'Tổng doanh thu', dataIndex: 'revenue', key: 'revenue' },
]
const topMedicines = [
  { key: '1', name: 'Paracetamol', sold: 120, revenue: '1,200,000đ' },
  { key: '2', name: 'Amoxicillin', sold: 95, revenue: '1,425,000đ' },
  { key: '3', name: 'Ibuprofen', sold: 80, revenue: '1,600,000đ' },
  { key: '4', name: 'Cough Syrup', sold: 70, revenue: '1,050,000đ' },
  { key: '5', name: 'Vitamin C', sold: 65, revenue: '975,000đ' },
]

const recentBillColumns = [
  { title: 'Mã hóa đơn', dataIndex: 'code', key: 'code' },
  { title: 'Bệnh nhân', dataIndex: 'patient', key: 'patient' },
  { title: 'Tổng tiền', dataIndex: 'total', key: 'total' },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
]
const recentBills = [
  { key: '1', code: 'HD001', patient: 'Nguyễn Văn A', total: '2,500,000đ', status: 'Chờ thanh toán' },
  { key: '2', code: 'HD002', patient: 'Trần Thị B', total: '1,800,000đ', status: 'Đã thanh toán' },
  { key: '3', code: 'HD003', patient: 'Lê Văn C', total: '3,200,000đ', status: 'Đã thanh toán' },
]

const lowStockColumns = [
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Tồn kho', dataIndex: 'stock', key: 'stock' },
  { title: 'Mức tối thiểu', dataIndex: 'min', key: 'min' },
]
const lowStockItems = [
  { key: '1', name: 'Amoxicillin', stock: 5, min: 20 },
  { key: '2', name: 'Metformin', stock: 8, min: 30 },
  { key: '3', name: 'Aspirin', stock: 12, min: 25 },
]
</script>
