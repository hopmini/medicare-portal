<template>
  <a-layout :style="inline ? 'background: transparent; min-height: auto;' : 'min-height: 100vh; background: #f8fafc;'">
    <!-- Sidebar -->
    <a-layout-sider v-if="!inline" width="260" theme="light" style="background: #ffffff; border-right: 1px solid #f0f4f9;">
      <PharmacySidebar />
    </a-layout-sider>
    
    <!-- Main Content -->
    <a-layout :style="inline ? 'background: transparent;' : 'background: #f8fafc;'">
      <!-- Header -->
      <AppHeader 
        v-if="!inline"
        :title="userRole === 'patient' ? 'Đơn thuốc của tôi' : 'Quản lý đơn thuốc & Bán thuốc'" 
        :welcome="userRole === 'patient' ? 'Xem danh sách các đơn thuốc đã được bác sĩ kê đơn của bạn.' : undefined"
      />
 
      <a-layout-content :style="inline ? 'padding: 0;' : 'padding: 24px 28px;'">
        <!-- Top Title -->
        <div v-if="userRole !== 'patient'" style="margin-bottom: 16px;">
          <h2 style="font-size: 1.6rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
            Đơn thuốc & Cấp phát
          </h2>
          <div style="font-size: 0.9rem; color: #64748b;">
            Quản lý đơn thuốc của bác sĩ và thực hiện bán lẻ ngoài đơn
          </div>
        </div>

        <!-- Navigation Tabs for 2 flows -->
        <a-tabs v-if="userRole !== 'patient'" v-model:activeKey="activeTabKey" class="custom-tabs" style="margin-bottom: 24px;">
          <a-tab-pane key="prescription-flow" tab="1. Đơn thuốc theo đơn bác sĩ" />
          <a-tab-pane key="free-flow" tab="2. Bán thuốc ngoài đơn bác sĩ" />
        </a-tabs>

        <!-- ==================== FLOW 1: ĐƠN THUỐC THEO ĐƠN BÁC SĨ ==================== -->
        <div v-if="activeTabKey === 'prescription-flow'">
          <!-- Metric Cards -->
          <a-row v-if="userRole !== 'patient'" :gutter="24" style="margin-bottom: 24px;">
            <a-col :xs="24" :sm="8">
              <a-card :bordered="false" class="metric-card">
                <div class="metric-content">
                  <div class="metric-icon" style="background: #eff6ff; color: #3b82f6;">
                    <i class="fas fa-file-prescription" />
                  </div>
                  <div>
                    <div class="metric-title">Đơn thuốc chờ xử lý</div>
                    <div class="metric-value">{{ pendingPrescriptionsCount }} <span style="font-size: 0.85rem; font-weight: 500; color: #64748b;">Đơn</span></div>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="8">
              <a-card :bordered="false" class="metric-card">
                <div class="metric-content">
                  <div class="metric-icon" style="background: #ecfdf5; color: #10b981;">
                    <i class="fas fa-hand-holding-medical" />
                  </div>
                  <div>
                    <div class="metric-title">Đã cấp phát hôm nay</div>
                    <div class="metric-value">{{ completedPrescriptionsCount }} <span style="font-size: 0.85rem; font-weight: 500; color: #64748b;">Đơn</span></div>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="8">
              <a-card :bordered="false" class="metric-card">
                <div class="metric-content">
                  <div class="metric-icon" style="background: #fff7ed; color: #f97316;">
                    <i class="fas fa-capsules" />
                  </div>
                  <div>
                    <div class="metric-title">Tổng số loại thuốc đã kê</div>
                    <div class="metric-value">{{ totalMedicinesCount }} <span style="font-size: 0.85rem; font-weight: 500; color: #64748b;">Loại</span></div>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>

          <!-- Filters Bar -->
          <div class="filters-bar">
            <div class="filter-inputs">
              <a-input v-model:value="search" :placeholder="userRole === 'patient' ? 'Tìm theo mã đơn thuốc...' : 'Tìm theo mã đơn hoặc bệnh nhân...'" style="width: 280px; border-radius: 8px;">
                <template #prefix>
                  <i class="fas fa-search" style="color: #cbd5e1;" />
                </template>
              </a-input>

              <a-select v-model:value="statusFilter" style="width: 180px;" placeholder="Tất cả trạng thái">
                <a-select-option value="all">Tất cả trạng thái</a-select-option>
                <a-select-option value="pending">Chờ xử lý</a-select-option>
                <a-select-option value="processing">Đang xử lý</a-select-option>
                <a-select-option value="completed">Đã cấp phát</a-select-option>
              </a-select>

              <a-range-picker style="width: 260px;" :placeholder="['Từ ngày', 'Đến ngày']" />
            </div>
          </div>

          <a-row :gutter="24">
            <!-- Left Table: Prescriptions -->
            <a-col :xs="24" :lg="userRole === 'patient' ? 14 : 13">
              <a-card :bordered="false" class="main-card" :title="userRole === 'patient' ? 'Danh sách đơn thuốc của tôi' : 'Danh sách đơn thuốc chờ xử lý'">
                <a-table
                  :columns="columns"
                  :data-source="filteredPrescriptions"
                  row-key="id"
                  :pagination="{ pageSize: 5, showSizeChanger: true, locale: { items_per_page: '/ trang' } }"
                  :customRow="customRow"
                  size="middle"
                >
                  <template #bodyCell="{ text, record, column }">
                    <template v-if="column.key === 'code'">
                      <span style="font-weight: 700; color: #0047AB; cursor: pointer;">{{ record.code }}</span>
                    </template>
                    <template v-else-if="column.key === 'status'">
                      <a-tag v-if="record.status === 'pending'" color="error" style="font-weight: 700; border-radius: 4px; padding: 2px 8px;">Chờ xử lý</a-tag>
                      <a-tag v-else-if="record.status === 'processing'" color="warning" style="font-weight: 700; border-radius: 4px; padding: 2px 8px;">Đang xử lý</a-tag>
                      <a-tag v-else-if="record.status === 'completed'" color="success" style="font-weight: 700; border-radius: 4px; padding: 2px 8px;">Đã cấp phát</a-tag>
                    </template>
                    <template v-else-if="column.key === 'action'">
                      <div style="display: flex; gap: 8px; justify-content: center;">
                        <a-button type="primary" size="small" style="background: #0047AB; border: none; font-size: 0.75rem;" @click.stop="selectPrescription(record)">
                          <i class="fas fa-file-prescription" /> Chi tiết
                        </a-button>
                      </div>
                    </template>
                  </template>
                </a-table>
              </a-card>
            </a-col>

            <!-- Right Detail Form -->
            <a-col :xs="24" :lg="userRole === 'patient' ? 10 : 11">
              <a-card :bordered="false" class="checkout-card" :title="userRole === 'patient' ? 'Chi tiết đơn thuốc' : 'Chi tiết & Cấp phát thuốc'">
                <div v-if="selectedPrescription">
                  <div style="font-size: 0.85rem; margin-bottom: 20px; color: #1e293b;">
                    <h4 style="font-weight: 700; color: #0f172a; margin-bottom: 12px; font-size: 0.95rem;">Thông tin đơn thuốc</h4>
                    <a-row :gutter="16" style="margin-bottom: 8px;">
                      <a-col :span="12">Mã đơn thuốc</a-col>
                      <a-col :span="12" style="font-weight: 700; color: #0047AB;">{{ selectedPrescription.code }}</a-col>
                    </a-row>
                    <a-row v-if="userRole !== 'patient'" :gutter="16" style="margin-bottom: 8px;">
                      <a-col :span="12">Bệnh nhân</a-col>
                      <a-col :span="12" style="font-weight: 600;">{{ selectedPrescription.patient }}</a-col>
                    </a-row>
                    <a-row :gutter="16" style="margin-bottom: 8px;">
                      <a-col :span="12">Bác sĩ kê đơn</a-col>
                      <a-col :span="12" style="font-weight: 600;">{{ selectedPrescription.doctorName }}</a-col>
                    </a-row>
                    <a-row :gutter="16" style="margin-bottom: 8px;">
                      <a-col :span="12">Ngày kê đơn</a-col>
                      <a-col :span="12" style="font-weight: 600;">{{ selectedPrescription.date }}</a-col>
                    </a-row>
                  </div>

                  <a-divider style="margin: 16px 0;" />

                  <div>
                    <h4 style="font-weight: 700; color: #0f172a; margin-bottom: 12px; font-size: 0.95rem;">Danh sách thuốc kê đơn</h4>
                    <a-table
                      :columns="medicationColumns"
                      :data-source="selectedPrescription.medications"
                      :pagination="false"
                      size="small"
                      row-key="name"
                    >
                      <template #bodyCell="{ text, record, index, column }">
                        <template v-if="column.key === 'index'">
                          {{ index + 1 }}
                        </template>
                      </template>
                    </a-table>
                  </div>

                  <a-divider style="margin: 16px 0;" />

                  <a-form layout="vertical">
                    <a-form-item v-if="userRole !== 'patient'" label="Ghi chú cấp phát">
                      <a-textarea v-model:value="dispenseForm.note" placeholder="Nhập ghi chú cho dược sĩ hoặc bệnh nhân..." :rows="2" />
                    </a-form-item>

                    <div class="due-warning-bar" :style="{ background: selectedPrescription.status === 'completed' ? '#f0fdf4' : '#fffbeb', border: selectedPrescription.status === 'completed' ? '1px solid #bbf7d0' : '1px solid #fef3c7', color: selectedPrescription.status === 'completed' ? '#16a34a' : '#d97706' }">
                      <span>Trạng thái đơn:</span>
                      <strong style="font-size: 1.1rem;">
                        {{ selectedPrescription.status === 'completed' ? 'ĐÃ CẤP PHÁT THUỐC' : 'CHỜ CẤP PHÁT' }}
                      </strong>
                    </div>

                    <div :style="{ display: 'grid', gridTemplateColumns: userRole === 'patient' ? '1fr' : '1.8fr 1fr', gap: '12px', marginTop: '20px' }">
                      <a-button v-if="userRole !== 'patient'" type="primary" style="background: #0047AB; border-color: #0047AB; border-radius: 8px; font-weight: bold; height: 40px; display: flex; align-items: center; justify-content: center; gap: 6px;" @click="submitDispensation" :disabled="selectedPrescription.status === 'completed'">
                        <i class="fas fa-check" /> Xác nhận cấp phát thuốc
                      </a-button>
                      <a-button style="border-radius: 8px; font-weight: bold; height: 40px; border-color: #cbd5e1; display: flex; align-items: center; justify-content: center; gap: 6px;" @click="printPrescription">
                        <i class="fas fa-print" /> In đơn thuốc
                      </a-button>
                    </div>
                  </a-form>
                </div>
                <div v-else style="padding: 40px 0; text-align: center; color: #94a3b8;">
                  <i class="fas fa-file-prescription" style="font-size: 3rem; margin-bottom: 12px; color: #e2e8f0;" />
                  <p>{{ userRole === 'patient' ? 'Chọn một đơn thuốc từ danh sách bên trái để xem chi tiết' : 'Chọn một đơn thuốc từ danh sách bên trái để tiến hành cấp phát' }}</p>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </div>

        <!-- ==================== FLOW 2: BÁN THUỐC NGOÀI ĐƠN BÁC SĨ ==================== -->
        <div v-else>
          <a-row :gutter="24">
            <!-- Left Side: Customer Info & Cart Medicines List -->
            <a-col :xs="24" :lg="14">
              <a-card :bordered="false" class="main-card" title="Thông tin khách hàng & Giỏ hàng thuốc">
                <template #extra>
                  <a-button type="primary" style="background: #0047AB; border-color: #0047AB; border-radius: 6px;" @click="openAddMedicineModal">
                    <i class="fas fa-plus" style="margin-right: 6px;" /> Thêm thuốc vào giỏ
                  </a-button>
                </template>

                <a-form layout="vertical">
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item label="Tên khách hàng" required>
                        <a-input v-model:value="freeFlowCustomer.name" placeholder="Họ và tên khách mua" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="Số điện thoại" required>
                        <a-input v-model:value="freeFlowCustomer.phone" placeholder="Số điện thoại liên lạc" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-form-item label="Địa chỉ">
                    <a-input v-model:value="freeFlowCustomer.address" placeholder="Địa chỉ liên hệ (không bắt buộc)" />
                  </a-form-item>
                </a-form>

                <h4 style="font-weight: 700; margin-top: 24px; margin-bottom: 12px; color: #0f172a;">Giỏ hàng thuốc mua tự do</h4>
                <a-table :columns="freeCartColumns" :data-source="freeCartRows" :pagination="false" size="middle" row-key="id">
                  <template #bodyCell="{ text, record, index, column }">
                    <template v-if="column.key === 'index'">
                      {{ index + 1 }}
                    </template>
                    <template v-else-if="column.key === 'price'">
                      {{ record.price.toLocaleString() }} đ
                    </template>
                    <template v-else-if="column.key === 'qty'">
                      <a-input-number v-model:value="record.qty" :min="1" style="width: 80px;" @change="updateCartTotal" />
                    </template>
                    <template v-else-if="column.key === 'total'">
                      <strong>{{ (record.price * record.qty).toLocaleString() }} đ</strong>
                    </template>
                    <template v-else-if="column.key === 'action'">
                      <a-button type="link" danger style="padding: 0;" @click="removeCartMedicine(record.id)">
                        <i class="far fa-trash-alt" />
                      </a-button>
                    </template>
                  </template>
                </a-table>
              </a-card>
            </a-col>

            <!-- Right Side: Calculate Dispense billing -->
            <a-col :xs="24" :lg="10">
              <a-card :bordered="false" class="checkout-card" title="Chi tiết thanh toán bán lẻ">
                <div>
                  <h4 style="font-weight: 700; color: #0f172a; margin-bottom: 16px; font-size: 0.95rem;">Hóa đơn chi tiết</h4>
                  <a-row :gutter="16" style="margin-bottom: 8px; font-size: 0.85rem;">
                    <a-col :span="12" style="color: #64748b;">Tổng tiền hàng</a-col>
                    <a-col :span="12" style="text-align: right; font-weight: 600; color: #1e293b;">{{ rawGoodsTotal.toLocaleString() }} đ</a-col>
                  </a-row>
                  <a-row :gutter="16" style="margin-bottom: 8px; font-size: 0.85rem;">
                    <a-col :span="12" style="color: #64748b;">Thuế VAT (5%)</a-col>
                    <a-col :span="12" style="text-align: right; font-weight: 600; color: #1e293b;">{{ calculatedVat.toLocaleString() }} đ</a-col>
                  </a-row>
                  <a-row :gutter="16" style="margin-bottom: 12px; font-size: 0.85rem;">
                    <a-col :span="12" style="color: #64748b;">Chiết khấu trực tiếp</a-col>
                    <a-col :span="12" style="text-align: right; font-weight: 600; color: #ef4444;">-{{ discountAmount.toLocaleString() }} đ</a-col>
                  </a-row>

                  <a-row :gutter="16" style="margin-top: 12px; border-top: 1px dashed #f1f5f9; padding-top: 12px; font-size: 0.95rem;">
                    <a-col :span="12" style="color: #0f172a; font-weight: 700;">Khách cần trả</a-col>
                    <a-col :span="12" style="text-align: right; font-weight: bold; color: #0047AB; font-size: 1.25rem;">{{ netTotalPayable.toLocaleString() }} đ</a-col>
                  </a-row>
                </div>

                <a-divider style="margin: 16px 0;" />

                <a-form layout="vertical">
                  <a-form-item label="Chiết khấu hóa đơn (đ)">
                    <a-input-number
                      v-model:value="discountInput"
                      style="width: 100%; border-radius: 6px;"
                      :min="0"
                      :max="rawGoodsTotal"
                      placeholder="Nhập số tiền giảm giá"
                    />
                  </a-form-item>

                  <a-form-item label="Phương thức thanh toán" required>
                    <a-radio-group v-model:value="freeFlowPaymentMethod" style="width: 100%;">
                      <a-row>
                        <a-col :span="8">
                          <a-radio value="cash">Tiền mặt</a-radio>
                        </a-col>
                        <a-col :span="8">
                          <a-radio value="transfer">Chuyển khoản</a-radio>
                        </a-col>
                        <a-col :span="8">
                          <a-radio value="card">Thẻ</a-radio>
                        </a-col>
                      </a-row>
                    </a-radio-group>
                  </a-form-item>

                  <a-form-item label="Số tiền khách đưa" required>
                    <a-input-number
                      v-model:value="customerGivenAmount"
                      style="width: 100%; border-radius: 6px;"
                      :min="netTotalPayable"
                      placeholder="Nhập số tiền khách trả"
                    />
                  </a-form-item>

                  <!-- Change refund alert -->
                  <div class="due-warning-bar" style="background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a;">
                    <span>Tiền thối lại:</span>
                    <strong style="font-size: 1.2rem;">{{ calculatedRefund.toLocaleString() }} đ</strong>
                  </div>

                  <div style="display: grid; grid-template-columns: 1.8fr 1fr; gap: 12px; margin-top: 20px;">
                    <a-button type="primary" style="background: #10b981; border-color: #10b981; border-radius: 8px; font-weight: bold; height: 40px; display: flex; align-items: center; justify-content: center; gap: 6px;" @click="submitFreeSale" :disabled="freeCartRows.length === 0 || !freeFlowCustomer.name || !freeFlowCustomer.phone">
                      <i class="fas fa-check" /> Xác nhận bán &amp; In
                    </a-button>
                    <a-button style="border-radius: 8px; font-weight: bold; height: 40px; border-color: #cbd5e1; display: flex; align-items: center; justify-content: center; gap: 6px;" @click="resetFreeFlow">
                      Hủy bỏ
                    </a-button>
                  </div>
                </a-form>
              </a-card>
            </a-col>
          </a-row>

          <!-- OTC Sales History Table -->
          <a-card :bordered="false" class="main-card" style="margin-top: 24px;" title="Lịch sử bán thuốc ngoài đơn gần đây">
            <a-table
              :columns="otcHistoryColumns"
              :data-source="otcSalesHistory"
              row-key="id"
              :pagination="{ pageSize: 5, showSizeChanger: true, locale: { items_per_page: '/ trang' } }"
              size="middle"
            >
              <template #bodyCell="{ text, record, column }">
                <template v-if="column.key === 'code'">
                  <span style="font-weight: 700; color: #0047AB;">{{ record.code }}</span>
                </template>
                <template v-else-if="column.key === 'total'">
                  <strong>{{ record.total.toLocaleString() }} đ</strong>
                </template>
                <template v-else-if="column.key === 'items'">
                  <span>{{ record.items }}</span>
                </template>
                <template v-else-if="column.key === 'payMethod'">
                  <a-tag v-if="record.payMethod === 'cash'" color="green" style="font-weight: 600; border-radius: 4px;">Tiền mặt</a-tag>
                  <a-tag v-else-if="record.payMethod === 'transfer'" color="blue" style="font-weight: 600; border-radius: 4px;">Chuyển khoản</a-tag>
                  <a-tag v-else color="purple" style="font-weight: 600; border-radius: 4px;">Thẻ</a-tag>
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag color="success" style="font-weight: 700; border-radius: 4px; padding: 2px 8px;">Hoàn tất</a-tag>
                </template>
              </template>
            </a-table>
          </a-card>
        </div>

      </a-layout-content>
    </a-layout>
  </a-layout>

  <!-- Add Medicine Modal Dialog for Free Flow Sales -->
  <a-modal v-model:open="medicineModalVisible" title="Chọn thuốc cấp phát ngoài đơn" @ok="addSelectedMedicines" width="600px">
    <a-table
      :columns="selectColumns"
      :data-source="allMedicines"
      row-key="id"
      :row-selection="{ selectedRowKeys: selectedIds, onChange: onSelectChange }"
      :pagination="{ pageSize: 6 }"
      size="middle"
    >
      <template #bodyCell="{ text, record, column }">
        <template v-if="column.key === 'price'">
          {{ record.price.toLocaleString() }} đ
        </template>
        <template v-else-if="column.key === 'stockQuantity'">
          <span :style="{ color: record.stockQuantity > 20 ? '#10b981' : '#f59e0b', fontWeight: 'bold' }">
            {{ record.stockQuantity }}
          </span>
        </template>
      </template>
    </a-table>
  </a-modal>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore';
const notif = useNotificationStore();
import { ref, computed, onMounted } from 'vue';
import PharmacySidebar from '@/components/PharmacySidebar.vue';
import AppHeader from '@/components/AppHeader.vue';
import { getPrescriptions, getMedicines, processPrescription } from '@/services/pharmacyService';
import { useAuthStore } from '@/stores/authStore';
import { normalizeSearch } from '@/utils/search';

const props = withDefaults(
  defineProps<{
    inline?: boolean
  }>(),
  {
    inline: false
  }
)

interface PrescriptionItem {
  name: string;
  qty: number;
  dosage: string;
}

interface Prescription {
  id: number;
  code: string;
  patient: string;
  doctorName: string;
  date: string;
  medications: PrescriptionItem[];
  status: 'pending' | 'processing' | 'completed';
}

// Active flow control tab
const activeTabKey = ref('prescription-flow');

// Form select inputs
const loading = ref(false);
const prescriptions = ref<Prescription[]>([]);
const viewMode = ref<'list' | 'create-rx' | 'create-otc' | 'create-combo'>('list');
const statusFilter = ref('all');

const pendingPrescriptionsCount = computed(() => prescriptions.value.filter(p => p.status === 'pending').length)
const completedPrescriptionsCount = computed(() => prescriptions.value.filter(p => p.status === 'completed').length)
const totalMedicinesCount = computed(() => allMedicines.value.length)

const authStore = useAuthStore();
const userRole = computed(() => (authStore.user.value?.role || '').toLowerCase());
const search = ref('');

const selectedPrescription = ref<Prescription | null>(null);
const dispenseForm = ref({
  note: ''
});

const columns = computed(() => {
  const base: any[] = [
    { title: 'Mã Đơn', dataIndex: 'code', key: 'code', sorter: (a: any, b: any) => a.code.localeCompare(b.code), width: '120px' },
  ];
  if (userRole.value !== 'patient') {
    base.push({ title: 'Bệnh nhân', dataIndex: 'patient', key: 'patient' });
  }
  base.push(
    { title: 'Bác sĩ kê', dataIndex: 'doctorName', key: 'doctorName' },
    { title: 'Ngày kê', dataIndex: 'date', key: 'date', sorter: (a: any, b: any) => a.date.localeCompare(b.date), width: '120px' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', align: 'center', width: '120px' },
    { title: 'Thao tác', key: 'action', width: '80px', align: 'center' }
  );
  return base;
});

const medicationColumns = [
  { title: '#', key: 'index', width: '50px', align: 'center' },
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Số lượng', dataIndex: 'qty', key: 'qty', width: '90px', align: 'right' },
  { title: 'Liều lượng', dataIndex: 'dosage', key: 'dosage' },
];

const filteredPrescriptions = computed(() => {
  return prescriptions.value.filter(p => {
    const matchesSearch = 
      normalizeSearch(p.code).includes(normalizeSearch(search.value)) ||
      normalizeSearch(p.patient).includes(normalizeSearch(search.value));
      
    const matchesStatus = statusFilter.value === 'all' || p.status === statusFilter.value;
    
    return matchesSearch && matchesStatus;
  });
});

function customRow(record: Prescription) {
  return {
    onClick: () => selectPrescription(record),
    class: selectedPrescription.value?.id === record.id ? 'active-selected-row' : ''
  };
}

function selectPrescription(prescription: Prescription) {
  selectedPrescription.value = prescription;
  dispenseForm.value.note = '';
}

async function submitDispensation() {
  if (!selectedPrescription.value) return;

  try {
    await processPrescription(Number(selectedPrescription.value.id));
    notif.show({ type: 'success', message: `Đã cấp phát thành công đơn thuốc ${selectedPrescription.value.code} cho bệnh nhân ${selectedPrescription.value.patient}!` });
    await loadData();
  } catch (err: any) {
    notif.show({ type: 'error', message: 'Không thể thực hiện cấp phát thuốc: ' + (err.response?.data?.message || err.message || err) })
  }
}

function printPrescription() {
  if (!selectedPrescription.value) return;
  notif.show({ type: 'success', message: `Đang gửi lệnh in đơn thuốc ${selectedPrescription.value.code}...` });
}


// ==================== FLOW 2: FREE FLOW SALE STATES ====================
interface MedicineProduct {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
}

const freeFlowCustomer = ref({
  name: '',
  phone: '',
  address: ''
});

const freeCartRows = ref<any[]>([]);
const allMedicines = ref<MedicineProduct[]>([]);

// OTC Sales History Data
const otcSalesHistory = ref([
  { id: 1, code: 'OTC000101', customer: 'Nguyễn Văn Tùng', phone: '0912 345 678', items: 'Paracetamol 500mg (10), Vitamin C (20)', total: 40000, payMethod: 'cash', date: '20/05/2025 14:30', status: 'done' },
  { id: 2, code: 'OTC000102', customer: 'Trần Thị Lan', phone: '0987 654 321', items: 'Decolgen Forte (6), Panadol Extra (4)', total: 19600, payMethod: 'transfer', date: '20/05/2025 11:15', status: 'done' },
  { id: 3, code: 'OTC000103', customer: 'Phạm Quốc Bảo', phone: '0909 111 222', items: 'Amoxicillin 500mg (14), Omeprazole 20mg (7)', total: 66500, payMethod: 'cash', date: '19/05/2025 16:45', status: 'done' },
  { id: 4, code: 'OTC000104', customer: 'Hoàng Minh Châu', phone: '0933 444 555', items: 'Cetirizine 10mg (10), Vitamin C (30)', total: 65000, payMethod: 'card', date: '19/05/2025 09:20', status: 'done' },
  { id: 5, code: 'OTC000105', customer: 'Vũ Thị Thanh', phone: '0966 777 888', items: 'Ibuprofen 400mg (10), Gaviscon (6)', total: 81000, payMethod: 'cash', date: '18/05/2025 15:10', status: 'done' },
  { id: 6, code: 'OTC000106', customer: 'Đặng Hữu Phúc', phone: '0944 123 456', items: 'Paracetamol 500mg (20), Decolgen Forte (10)', total: 38000, payMethod: 'transfer', date: '18/05/2025 10:00', status: 'done' },
  { id: 7, code: 'OTC000107', customer: 'Lý Thị Ngọc', phone: '0977 888 999', items: 'Salbutamol 2mg (20), Vitamin C (15)', total: 46500, payMethod: 'cash', date: '17/05/2025 14:55', status: 'done' },
  { id: 8, code: 'OTC000108', customer: 'Bùi Văn Khánh', phone: '0922 333 444', items: 'Omeprazole 20mg (14), Panadol Extra (10)', total: 85000, payMethod: 'card', date: '17/05/2025 08:30', status: 'done' }
]);

const otcHistoryColumns = [
  { title: 'Mã HĐ', dataIndex: 'code', key: 'code', width: '120px' },
  { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
  { title: 'SĐT', dataIndex: 'phone', key: 'phone', width: '130px' },
  { title: 'Thuốc đã bán', dataIndex: 'items', key: 'items' },
  { title: 'Tổng tiền', dataIndex: 'total', key: 'total', align: 'right', width: '120px' },
  { title: 'Thanh toán', dataIndex: 'payMethod', key: 'payMethod', align: 'center', width: '120px' },
  { title: 'Ngày bán', dataIndex: 'date', key: 'date', width: '150px' },
  { title: 'Trạng thái', key: 'status', align: 'center', width: '100px' }
];
const selectedIds = ref<number[]>([]);
const medicineModalVisible = ref(false);
const discountInput = ref(0);
const freeFlowPaymentMethod = ref('cash');
const customerGivenAmount = ref(0);

const freeCartColumns = [
  { title: '#', key: 'index', width: '50px', align: 'center' },
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Đơn giá', dataIndex: 'price', key: 'price', align: 'right' },
  { title: 'Số lượng mua', key: 'qty', width: '110px', align: 'center' },
  { title: 'Thành tiền', key: 'total', align: 'right', width: '130px' },
  { title: 'Xóa', key: 'action', width: '60px', align: 'center' }
];

const selectColumns = [
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Đơn giá bán', dataIndex: 'price', key: 'price', align: 'right' },
  { title: 'Số lượng tồn', dataIndex: 'stockQuantity', key: 'stockQuantity', align: 'right' }
];

// Calculations for Cart Bill
const rawGoodsTotal = computed(() => {
  return freeCartRows.value.reduce((sum, item) => sum + (item.price * item.qty), 0);
});

const calculatedVat = computed(() => {
  return Math.round(rawGoodsTotal.value * 0.05);
});

const discountAmount = computed(() => {
  return discountInput.value || 0;
});

const netTotalPayable = computed(() => {
  return Math.max(0, rawGoodsTotal.value + calculatedVat.value - discountAmount.value);
});

const calculatedRefund = computed(() => {
  if (customerGivenAmount.value < netTotalPayable.value) return 0;
  return customerGivenAmount.value - netTotalPayable.value;
});

function openAddMedicineModal() {
  selectedIds.value = freeCartRows.value.map(c => c.id);
  medicineModalVisible.value = true;
}

function onSelectChange(keys: any[]) {
  selectedIds.value = keys.map(k => Number(k));
}

function addSelectedMedicines() {
  const selectedProducts = allMedicines.value.filter(m => selectedIds.value.includes(m.id));
  
  // Add selected ones to cart rows
  selectedProducts.forEach(prod => {
    if (!freeCartRows.value.some(row => row.id === prod.id)) {
      freeCartRows.value.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        qty: 1
      });
    }
  });

  // Keep existing items in cart that are still selected, remove unselected
  freeCartRows.value = freeCartRows.value.filter(item => selectedIds.value.includes(item.id));
  
  medicineModalVisible.value = false;
  updateCartTotal();
}

function removeCartMedicine(id: number) {
  freeCartRows.value = freeCartRows.value.filter(item => item.id !== id);
  updateCartTotal();
}

function updateCartTotal() {
  customerGivenAmount.value = netTotalPayable.value;
}

function resetFreeFlow() {
  freeFlowCustomer.value = { name: '', phone: '', address: '' };
  freeCartRows.value = [];
  discountInput.value = 0;
  customerGivenAmount.value = 0;
}

function submitFreeSale() {
  // Add this sale to history
  const newCode = `OTC${String(otcSalesHistory.value.length + 101).padStart(6, '0')}`;
  const itemsSummary = freeCartRows.value.map(r => `${r.name} (${r.qty})`).join(', ');
  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  otcSalesHistory.value.unshift({
    id: otcSalesHistory.value.length + 1,
    code: newCode,
    customer: freeFlowCustomer.value.name,
    phone: freeFlowCustomer.value.phone,
    items: itemsSummary,
    total: netTotalPayable.value,
    payMethod: freeFlowPaymentMethod.value,
    date: dateStr,
    status: 'done'
  });

  notif.show({ type: 'success', message: `Đã in hóa đơn & bán thành công đơn thuốc tự do trị giá ${netTotalPayable.value.toLocaleString()} đ cho khách hàng ${freeFlowCustomer.value.name}!` })
  resetFreeFlow();
}

async function loadData() {
  loading.value = true;
  try {
    // 1. Fetch real medications for the search / sales modal
    const mData = await getMedicines();
    if (mData && mData.length > 0) {
      allMedicines.value = mData.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price || 1500,
        stockQuantity: item.stockQuantity || 0
      }));
    } else {
      allMedicines.value = [];
    }

    // 2. Fetch prescriptions from backend
    const pData = await getPrescriptions();
    prescriptions.value = pData || [];

    if (prescriptions.value.length > 0) {
      const found = prescriptions.value.find(p => p.id === selectedPrescription.value?.id);
      if (found) {
        selectPrescription(found);
      } else {
        selectPrescription(prescriptions.value[0]);
      }
    } else {
      selectedPrescription.value = null;
    }
  } catch (e: any) {
    notif.show({ type: 'error', message: 'Lỗi khi tải dữ liệu từ server: ' + (e.message || e) })
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadData();
});
</script>

<style scoped>
:deep(.ant-card) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  color: #1e293b;
  font-weight: 700;
  border-bottom: 1px solid #f0f4f9;
}

:deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #f0f4f9;
}

:deep(.ant-table-row) {
  cursor: pointer;
  transition: background 0.2s;
}

:deep(.ant-table-row:hover) {
  background-color: #f8fafc !important;
}

:deep(.active-selected-row) {
  background-color: #e8f0fe !important;
}

.metric-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 0;
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.metric-title {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 2px;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 14px 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.main-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.checkout-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
}

.due-warning-bar {
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  font-weight: 700;
}
</style>
