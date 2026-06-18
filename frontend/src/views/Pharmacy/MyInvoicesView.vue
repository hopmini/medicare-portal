<template>
  <a-layout style="min-height: 100vh; background: #f8fafc;">
    <a-layout-sider width="260" theme="light" style="background: #ffffff; border-right: 1px solid #f0f4f9;">
      <PharmacySidebar />
    </a-layout-sider>

    <a-layout style="background: #f8fafc;">
      <AppHeader title="Tra cứu Hóa đơn &amp; Thuốc" welcome="Xem hóa đơn khám chữa bệnh và đơn thuốc của bạn." />

      <a-layout-content style="padding: 24px 28px;">

        <!-- Tab: Invoices / Prescriptions -->
        <div class="mi-tabs" style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
          <button
            class="mi-tab"
            :class="{ 'mi-tab--active': activeTab === 'invoices' }"
            @click="activeTab = 'invoices'"
          >
            <i class="fas fa-file-invoice" style="margin-right: 6px;" />
            Hóa đơn của tôi
          </button>
          <button
            class="mi-tab"
            :class="{ 'mi-tab--active': activeTab === 'prescriptions' }"
            @click="activeTab = 'prescriptions'; loadPrescriptions()"
          >
            <i class="fas fa-prescription-bottle" style="margin-right: 6px;" />
            Đơn thuốc của tôi
          </button>
        </div>

        <!-- Invoices Tab -->
        <template v-if="activeTab === 'invoices'">
        <!-- 4 Stat Cards -->
        <div class="mi-stats-row">
          <!-- Tổng hóa đơn -->
          <div class="mi-stat-card">
            <div class="mi-stat-icon" style="background: #eff6ff; color: #3b82f6;">
              <i class="fas fa-file-invoice" />
            </div>
            <div class="mi-stat-body">
              <div class="mi-stat-label">Tổng hóa đơn</div>
              <div class="mi-stat-value" style="color: #3b82f6;">{{ allInvoices.length }}</div>
              <div class="mi-stat-sub">Tất cả hóa đơn</div>
            </div>
          </div>

          <!-- Đã thanh toán -->
          <div class="mi-stat-card">
            <div class="mi-stat-icon" style="background: #ecfdf5; color: #10b981;">
              <i class="fas fa-check-circle" />
            </div>
            <div class="mi-stat-body">
              <div class="mi-stat-label">Đã thanh toán</div>
              <div class="mi-stat-value" style="color: #10b981;">{{ paidCount }}</div>
              <div class="mi-stat-sub">{{ paidPercent }}% tổng số hóa đơn</div>
            </div>
          </div>

          <!-- Chưa thanh toán -->
          <div class="mi-stat-card">
            <div class="mi-stat-icon" style="background: #fffbeb; color: #f59e0b;">
              <i class="fas fa-clock" />
            </div>
            <div class="mi-stat-body">
              <div class="mi-stat-label">Chưa thanh toán</div>
              <div class="mi-stat-value" style="color: #f59e0b;">{{ unpaidCount }}</div>
              <div class="mi-stat-sub">{{ unpaidPercent }}% tổng số hóa đơn</div>
            </div>
          </div>

          <!-- Tổng chi phí -->
          <div class="mi-stat-card">
            <div class="mi-stat-icon" style="background: #eff6ff; color: #0047AB;">
              <i class="fas fa-wallet" />
            </div>
            <div class="mi-stat-body">
              <div class="mi-stat-label">Tổng chi phí</div>
              <div class="mi-stat-value mi-stat-currency" style="color: #0047AB;">{{ formatCurrency(totalCost) }}</div>
              <div class="mi-stat-sub">Tổng chi phí hóa đơn</div>
            </div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="mi-filter-bar">
          <div class="mi-filter-left">
            <!-- Search -->
            <div class="mi-search-box">
              <i class="fas fa-search mi-search-icon" />
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Tìm kiếm theo mã hóa đơn..."
                class="mi-search-input"
              />
            </div>

            <!-- Date Range -->
            <a-range-picker
              v-model:value="dateRange"
              format="DD/MM/YYYY"
              :placeholder="['Từ ngày', 'Đến ngày']"
              class="mi-date-range"
              style="width: 260px;"
            />

            <!-- Status Filter -->
            <a-select v-model:value="filterStatus" style="width: 180px;" class="mi-status-select">
              <a-select-option value="all">Tất cả trạng thái</a-select-option>
              <a-select-option value="paid">Đã thanh toán</a-select-option>
              <a-select-option value="pending">Chưa thanh toán</a-select-option>
              <a-select-option value="partial">Thanh toán một phần</a-select-option>
            </a-select>
          </div>

          <!-- Filter Button -->
          <button class="mi-filter-btn" @click="toggleAdvancedFilter">
            <i class="fas fa-sliders-h" style="margin-right: 6px;" />
            Bộ lọc
          </button>
        </div>

        <!-- Advanced Filter Panel (collapsible) -->
        <transition name="slide">
          <div v-if="showAdvancedFilter" class="mi-advanced-filter">
            <a-select v-model:value="filterType" style="width: 200px;" placeholder="Loại hóa đơn">
              <a-select-option value="all">Tất cả loại hóa đơn</a-select-option>
              <a-select-option value="Khám bệnh">Khám bệnh</a-select-option>
              <a-select-option value="Xét nghiệm">Xét nghiệm</a-select-option>
              <a-select-option value="Siêu âm">Siêu âm</a-select-option>
              <a-select-option value="Điều trị nội trú">Điều trị nội trú</a-select-option>
              <a-select-option value="Khám chuyên khoa">Khám chuyên khoa</a-select-option>
              <a-select-option value="Thuốc">Thuốc</a-select-option>
              <a-select-option value="Vật lý trị liệu">Vật lý trị liệu</a-select-option>
            </a-select>
            <a-select v-model:value="filterMethod" style="width: 200px;" placeholder="Phương thức">
              <a-select-option value="all">Tất cả phương thức</a-select-option>
              <a-select-option value="Tiền mặt">Tiền mặt</a-select-option>
              <a-select-option value="Chuyển khoản">Chuyển khoản</a-select-option>
              <a-select-option value="Thẻ ngân hàng">Thẻ ngân hàng</a-select-option>
            </a-select>
            <a-button @click="resetFilters" style="border-radius: 8px;">
              <i class="fas fa-sync-alt" style="margin-right: 6px;" /> Đặt lại
            </a-button>
          </div>
        </transition>

        <!-- Table Card -->
        <div class="mi-table-card">
          <a-table
            :columns="columns"
            :data-source="filteredInvoices"
            row-key="id"
            :pagination="paginationConfig"
            @change="handleTableChange"
            size="middle"
            class="mi-table"
          >
            <template #bodyCell="{ text, record, column }">
              <!-- Mã hóa đơn -->
              <template v-if="column.key === 'code'">
                <span class="mi-code-link" @click="openDetail(record)">{{ record.code }}</span>
              </template>

              <!-- Loại hóa đơn -->
              <template v-else-if="column.key === 'type'">
                <span>{{ record.type }}</span>
              </template>

              <!-- Ngày lập -->
              <template v-else-if="column.key === 'date'">
                <span>{{ record.date }}</span>
              </template>

              <!-- Tổng tiền -->
              <template v-else-if="column.key === 'total'">
                <span class="mi-total-text">{{ formatCurrency(record.total) }}</span>
              </template>

              <!-- Phương thức -->
              <template v-else-if="column.key === 'method'">
                <span>{{ record.method }}</span>
              </template>

              <!-- Trạng thái -->
              <template v-else-if="column.key === 'status'">
                <span :class="['mi-badge', getBadgeClass(record.status)]">{{ getStatusText(record.status) }}</span>
              </template>

              <!-- Thao tác -->
              <template v-else-if="column.key === 'actions'">
                <div style="display: flex; gap: 12px; align-items: center;">
                  <a class="mi-action-link" @click="openDetail(record)">
                    <i class="far fa-eye" style="margin-right: 4px;" /> Chi tiết
                  </a>
                  <router-link :to="{ path: '/pharmacy/payment-status', query: { code: record.code } }" class="mi-action-link" style="color: #f59e0b;">
                    <i class="fas fa-tasks" style="margin-right: 4px;" /> Trạng thái
                  </router-link>
                </div>
              </template>
            </template>
          </a-table>
        </div>
        </template>

        <!-- Prescriptions Tab -->
        <template v-if="activeTab === 'prescriptions'">
          <div v-if="presLoading" class="mi-empty-state">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 12px;" />
            <span>Đang tải đơn thuốc...</span>
          </div>

          <template v-else-if="prescriptions.length === 0">
            <div class="mi-empty-state">
              <i class="fas fa-prescription-bottle" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 12px;" />
              <span style="font-weight: 700; font-size: 1.1rem; color: #64748b;">Không có đơn thuốc nào</span>
              <span style="font-size: 0.85rem; color: #94a3b8;">Bạn chưa được kê đơn thuốc nào từ trước đến nay.</span>
            </div>
          </template>

          <div v-else class="mi-pres-list">
            <div v-for="(pres, idx) in prescriptions" :key="pres.id || idx" class="mi-pres-card">
              <div class="mi-pres-header">
                <div class="mi-pres-header-left">
                  <i class="fas fa-prescription-bottle" style="color: #b91c1c;" />
                  <span style="font-weight: 800; font-size: 1rem; color: #0f172a;">Đơn thuốc #{{ idx + 1 }}</span>
                </div>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">
                  {{ pres.prescribedAt ? formatDateTime(pres.prescribedAt) : '' }}
                </span>
              </div>

              <div v-if="pres.instructions" class="mi-pres-instructions">
                <i class="fas fa-info-circle" style="margin-right: 6px;" />
                <strong>Lời dặn:</strong> {{ pres.instructions }}
              </div>

              <div class="mi-pres-meds">
                <div v-for="(med, mIdx) in pres.details" :key="mIdx" class="mi-pres-med">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="mi-pres-med-name">{{ mIdx + 1 }}. {{ med.medicationName }}</span>
                    <span class="mi-pres-med-qty">SL: {{ med.quantity }}</span>
                  </div>
                  <div class="mi-pres-med-dosage">
                    <i class="far fa-clock" /> {{ med.dosage }}
                  </div>
                </div>
              </div>

              <div class="mi-pres-footer">
                <span style="font-size: 0.72rem; color: #94a3b8;">Bệnh viện quốc tế Medicare</span>
                <span style="font-size: 0.75rem; font-weight: 700; color: #15803d;">
                  <i class="fas fa-signature" /> Đã ký điện tử
                </span>
              </div>
            </div>
          </div>
        </template>

      </a-layout-content>
    </a-layout>

    <!-- Detail Modal -->
    <a-modal
      v-model:open="showDetailModal"
      title="Chi tiết hóa đơn"
      :footer="null"
      width="680px"
      centered
      class="mi-detail-modal"
    >
      <div v-if="selectedInvoice" style="padding-top: 8px;">
        <!-- Header -->
        <div class="md-header">
          <span :class="['mi-badge', getBadgeClass(selectedInvoice.status)]">{{ getStatusText(selectedInvoice.status) }}</span>
          <h3 class="md-code">{{ selectedInvoice.code }}</h3>
        </div>
        <a-divider style="margin: 14px 0;" />

        <!-- Info Grid -->
        <div class="md-info-grid">
          <div class="md-info-item">
            <span class="md-lbl">Loại hóa đơn</span>
            <span class="md-val">{{ selectedInvoice.type }}</span>
          </div>
          <div class="md-info-item">
            <span class="md-lbl">Ngày lập</span>
            <span class="md-val">{{ selectedInvoice.date }}</span>
          </div>
          <div class="md-info-item">
            <span class="md-lbl">Tổng tiền</span>
            <span class="md-val" style="color: #0047AB; font-weight: 800;">{{ formatCurrency(selectedInvoice.total) }}</span>
          </div>
          <div class="md-info-item">
            <span class="md-lbl">Phương thức</span>
            <span class="md-val">{{ selectedInvoice.method }}</span>
          </div>
          <div class="md-info-item">
            <span class="md-lbl">Bác sĩ</span>
            <span class="md-val">{{ selectedInvoice.doctor }}</span>
          </div>
          <div class="md-info-item">
            <span class="md-lbl">Trạng thái</span>
            <span :class="['mi-badge', getBadgeClass(selectedInvoice.status)]">{{ getStatusText(selectedInvoice.status) }}</span>
          </div>
        </div>

        <!-- Items Table -->
        <a-divider style="margin: 14px 0;" />
        <div class="md-items-title">Chi tiết dịch vụ / thuốc</div>
        <a-table
          :columns="detailItemColumns"
          :data-source="selectedInvoice.items"
          row-key="id"
          :pagination="false"
          size="small"
          class="md-items-table"
        >
          <template #bodyCell="{ text, record, column }">
            <template v-if="column.key === 'price' || column.key === 'total'">
              <span>{{ text?.toLocaleString('vi-VN') }} đ</span>
            </template>
          </template>
        </a-table>

        <!-- Summary -->
        <div class="md-summary">
          <div class="md-summary-row">
            <span>Tạm tính:</span>
            <span>{{ formatCurrency(selectedInvoice.total) }}</span>
          </div>
          <div class="md-summary-row" v-if="selectedInvoice.discount">
            <span>Giảm giá:</span>
            <span style="color: #ef4444;">-{{ formatCurrency(selectedInvoice.discount) }}</span>
          </div>
          <div class="md-summary-row md-summary-total">
            <span>Tổng cộng:</span>
            <span>{{ formatCurrency(selectedInvoice.total - (selectedInvoice.discount || 0)) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <a-button @click="showDetailModal = false" style="border-radius: 8px;">Đóng</a-button>
          <a-button style="border-radius: 8px; border-color: #0047AB; color: #0047AB; font-weight: 600;" @click="downloadInvoice">
            <i class="fas fa-download" style="margin-right: 6px;" /> Tải xuống
          </a-button>
          <a-button type="primary" style="background: #0047AB; border-color: #0047AB; border-radius: 8px; font-weight: 600;" @click="printInvoice">
            <i class="fas fa-print" style="margin-right: 6px;" /> In hóa đơn
          </a-button>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore';
const notif = useNotificationStore();
import { ref, computed, onMounted } from 'vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import PharmacySidebar from '@/components/PharmacySidebar.vue';
import AppHeader from '@/components/AppHeader.vue';
import { pharmacyApi } from '@/services/api';
import { medicalRecordService } from '@/services/medicalRecordService';
import { useAuthStore } from '@/stores/authStore';
import { normalizeSearch } from '@/utils/search';
const authStore = useAuthStore();

interface InvoiceDetailItem {
  id: number;
  name: string;
  qty: number;
  unit: string;
  price: number;
  total: number;
}

interface PatientInvoice {
  id: number;
  code: string;
  type: string;
  date: string;
  total: number;
  method: string;
  status: 'paid' | 'pending' | 'partial';
  doctor: string;
  discount?: number;
  items: InvoiceDetailItem[];
}

// State
const searchQuery = ref('');
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(3, 'month'), dayjs()]);
const filterStatus = ref('all');
const filterType = ref('all');
const filterMethod = ref('all');
const showAdvancedFilter = ref(false);
const showDetailModal = ref(false);
const selectedInvoice = ref<PatientInvoice | null>(null);
const currentPage = ref(1);
const pageSize = ref(8);
const loading = ref(false);

const allInvoices = ref<PatientInvoice[]>([]);

// Prescriptions tab
const activeTab = ref<'invoices' | 'prescriptions'>('invoices');
const presLoading = ref(false);
const prescriptions = ref<any[]>([]);

async function loadPrescriptions() {
  if (!authStore.user.value?.id) return;
  presLoading.value = true;
  try {
    const records = await medicalRecordService.getRecordsByPatient(authStore.user.value.id);
    const result: any[] = [];
    (records || []).forEach(rec => {
      if (rec.prescription && rec.prescription.details && rec.prescription.details.length > 0) {
        result.push({
          id: rec.prescription.id || rec.id,
          instructions: rec.prescription.instructions,
          prescribedAt: rec.prescription.prescribedAt || rec.createdAt,
          details: rec.prescription.details
        });
      }
    });
    prescriptions.value = result;
  } catch (err) {
    console.error('Failed to load prescriptions:', err);
    notif.show({ type: 'error', message: 'Không thể tải đơn thuốc.' });
  } finally {
    presLoading.value = false;
  }
}

async function loadRealInvoices() {
  loading.value = true;
  try {
    const response = await pharmacyApi.get('/Bills');
    const bills = response.data || [];
    
    allInvoices.value = bills.map((b: any, idx: number) => {
      let type = 'Khám bệnh';
      if (b.examinationFee > 0 && b.medicineFee > 0) {
        type = 'Tổng hợp';
      } else if (b.medicineFee > 0) {
        type = 'Thuốc';
      } else if (b.examinationFee > 0) {
        type = 'Khám chuyên khoa';
      }
      
      const statusMap: Record<string, 'paid' | 'pending' | 'partial'> = {
        'Paid': 'paid',
        'Pending': 'pending',
        'Partial': 'partial'
      };
      
      return {
        id: b.id,
        code: `HD${new Date(b.createdAt).getFullYear().toString().substr(-2)}${(new Date(b.createdAt).getMonth()+1).toString().padStart(2, '0')}${new Date(b.createdAt).getDate().toString().padStart(2, '0')}-${b.id.toString().padStart(4, '0')}`,
        type: type,
        date: new Date(b.createdAt).toLocaleString('vi-VN'),
        total: b.totalAmount,
        method: b.status === 'Paid' ? 'Chuyển khoản' : 'Chưa thanh toán',
        status: statusMap[b.status] || 'pending',
        doctor: b.doctorName || 'Bác sĩ điều trị',
        discount: 0,
        items: [
          ...(b.examinationFee > 0 ? [{ id: 1, name: 'Chi phí khám bệnh', qty: 1, unit: 'Lần', price: b.examinationFee, total: b.examinationFee }] : []),
          ...(b.medicineFee > 0 ? [{ id: 2, name: 'Chi phí tiền thuốc', qty: 1, unit: 'Đợt', price: b.medicineFee, total: b.medicineFee }] : [])
        ]
      };
    });
  } catch (err) {
    console.error('Failed to load real invoices:', err);
    notif.show({ type: 'error', message: 'Không thể tải dữ liệu hóa đơn thực tế.' });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadRealInvoices();
});

// Computed stats
const paidCount = computed(() => allInvoices.value.filter(i => i.status === 'paid').length);
const unpaidCount = computed(() => allInvoices.value.filter(i => i.status === 'pending').length);
const paidPercent = computed(() => allInvoices.value.length ? Math.round((paidCount.value / allInvoices.value.length) * 100) : 0);
const unpaidPercent = computed(() => allInvoices.value.length ? Math.round((unpaidCount.value / allInvoices.value.length) * 100) : 0);
const totalCost = computed(() => allInvoices.value.reduce((s, i) => s + i.total, 0));

// Filtered invoices
const filteredInvoices = computed(() => {
  return allInvoices.value.filter(inv => {
    // Search filter
    if (searchQuery.value) {
      const q = normalizeSearch(searchQuery.value);
      if (!normalizeSearch(inv.code).includes(q)) return false;
    }

    // Status filter
    if (filterStatus.value !== 'all' && inv.status !== filterStatus.value) return false;

    // Type filter
    if (filterType.value !== 'all' && inv.type !== filterType.value) return false;

    // Method filter
    if (filterMethod.value !== 'all' && inv.method !== filterMethod.value) return false;

    // Date range filter
    if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
      const dateParts = inv.date.split(' ')[0].split('/');
      const invDate = dayjs(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
      const start = dateRange.value[0].startOf('day');
      const end = dateRange.value[1].endOf('day');
      if (invDate.isBefore(start) || invDate.isAfter(end)) return false;
    }

    return true;
  });
});

// Table columns
const columns = [
  { title: 'Mã hóa đơn', dataIndex: 'code', key: 'code', width: 170 },
  { title: 'Loại hóa đơn', dataIndex: 'type', key: 'type', width: 160 },
  { title: 'Ngày lập', dataIndex: 'date', key: 'date', width: 170, sorter: (a: any, b: any) => {
    const dA = a.date.split(' ')[0].split('/').reverse().join('') + a.date.split(' ')[1]?.replace(':', '') || '';
    const dB = b.date.split(' ')[0].split('/').reverse().join('') + b.date.split(' ')[1]?.replace(':', '') || '';
    return dA.localeCompare(dB);
  }},
  { title: 'Tổng tiền', dataIndex: 'total', key: 'total', width: 140, sorter: (a: any, b: any) => a.total - b.total },
  { title: 'Phương thức', dataIndex: 'method', key: 'method', width: 140 },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 170 },
  { title: 'Thao tác', key: 'actions', width: 130 }
];

// Detail modal item columns
const detailItemColumns = [
  { title: 'STT', dataIndex: 'id', key: 'id', width: 50, align: 'center' as const },
  { title: 'Nội dung', dataIndex: 'name', key: 'name' },
  { title: 'SL', dataIndex: 'qty', key: 'qty', width: 60, align: 'center' as const },
  { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: 70, align: 'center' as const },
  { title: 'Đơn giá', dataIndex: 'price', key: 'price', width: 120, align: 'right' as const },
  { title: 'Thành tiền', dataIndex: 'total', key: 'total', width: 130, align: 'right' as const }
];

// Pagination
const paginationConfig = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: filteredInvoices.value.length,
  showTotal: (total: number, range: [number, number]) => `Hiển thị ${range[0]} đến ${range[1]} trong tổng số ${total} hóa đơn`,
  locale: { items_per_page: '/ trang' },
  showSizeChanger: true,
  pageSizeOptions: ['8', '10', '20', '50']
}));

function handleTableChange(pagination: any) {
  currentPage.value = pagination.current;
  pageSize.value = pagination.pageSize;
}

// Helpers
function formatDateTime(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatCurrency(val: number) {
  return val.toLocaleString('vi-VN') + ' đ';
}

function getBadgeClass(status: string) {
  switch (status) {
    case 'paid': return 'mi-badge-paid';
    case 'pending': return 'mi-badge-pending';
    case 'partial': return 'mi-badge-partial';
    default: return '';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'paid': return 'Đã thanh toán';
    case 'pending': return 'Chưa thanh toán';
    case 'partial': return 'Thanh toán một phần';
    default: return status;
  }
}

function toggleAdvancedFilter() {
  showAdvancedFilter.value = !showAdvancedFilter.value;
}

function resetFilters() {
  searchQuery.value = '';
  filterStatus.value = 'all';
  filterType.value = 'all';
  filterMethod.value = 'all';
  dateRange.value = [dayjs('2025-05-01'), dayjs('2025-05-24')];
  currentPage.value = 1;
}

function openDetail(record: PatientInvoice) {
  selectedInvoice.value = record;
  showDetailModal.value = true;
}

function printInvoice() {
  if (selectedInvoice.value) {
    notif.show({ type: 'success', message: `Đang gửi lệnh in hóa đơn ${selectedInvoice.value.code}...` });
  }
}

function downloadInvoice() {
  if (selectedInvoice.value) {
    notif.show({ type: 'success', message: `Đang tải xuống hóa đơn ${selectedInvoice.value.code}...` });
  }
}
</script>

<style scoped>
/* Stats Row */
.mi-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}

@media (max-width: 1100px) {
  .mi-stats-row { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .mi-stats-row { grid-template-columns: 1fr; }
}

.mi-stat-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.mi-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  border-color: #cbd5e1;
}

.mi-stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.mi-stat-body {
  display: flex;
  flex-direction: column;
}

.mi-stat-label {
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 600;
}

.mi-stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  margin-top: 2px;
  line-height: 1.2;
}

.mi-stat-currency {
  font-size: 1.25rem;
}

.mi-stat-sub {
  font-size: 0.74rem;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 1px;
}

/* Filter Bar */
.mi-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.mi-filter-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.mi-search-box {
  position: relative;
  width: 280px;
}

.mi-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.9rem;
  z-index: 1;
}

.mi-search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 0.88rem;
  outline: none;
  transition: all 0.2s;
  height: 36px;
}

.mi-search-input:focus {
  border-color: #0047AB;
  box-shadow: 0 0 0 2px rgba(0, 71, 171, 0.1);
}

.mi-search-input::placeholder {
  color: #94a3b8;
}

.mi-filter-btn {
  height: 36px;
  padding: 0 18px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.mi-filter-btn:hover {
  border-color: #0047AB;
  color: #0047AB;
  background: #f8fafc;
}

/* Advanced Filter Panel */
.mi-advanced-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 14px 18px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  flex-wrap: wrap;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Table Card */
.mi-table-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  overflow: hidden;
}

.mi-table :deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid #e2e8f0;
}

.mi-table :deep(.ant-table-tbody > tr) {
  transition: background-color 0.15s;
}

.mi-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f1f5f9 !important;
}

.mi-table :deep(.ant-table-cell) {
  padding: 14px 16px !important;
  font-size: 0.88rem;
  color: #334155;
}

.mi-table :deep(.ant-table-pagination) {
  padding: 12px 16px !important;
}

/* Code Link */
.mi-code-link {
  font-weight: 700;
  color: #0047AB;
  cursor: pointer;
  transition: color 0.15s;
}

.mi-code-link:hover {
  color: #003685;
  text-decoration: underline;
}

/* Total */
.mi-total-text {
  font-weight: 700;
  color: #1e293b;
}

/* Badges */
.mi-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}

.mi-badge-paid {
  background: #ecfdf5;
  color: #10b981;
}

.mi-badge-pending {
  background: #fef2f2;
  color: #ef4444;
}

.mi-badge-partial {
  background: #fff7ed;
  color: #ea580c;
}

/* Action Link */
.mi-action-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0047AB;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: color 0.15s;
}

.mi-action-link:hover {
  color: #002e70;
}

/* Detail Modal */
.md-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.md-code {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.md-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.md-info-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.md-lbl {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
}

.md-val {
  font-size: 0.92rem;
  color: #1e293b;
  font-weight: 500;
}

.md-items-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}

.md-items-table :deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid #e2e8f0;
}

.md-items-table :deep(.ant-table-cell) {
  padding: 8px 12px !important;
  font-size: 0.85rem;
  color: #334155;
}

/* Summary */
.md-summary {
  margin-top: 14px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.md-summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  color: #475569;
  padding: 4px 0;
}

.md-summary-total {
  font-weight: 800;
  font-size: 1rem;
  color: #0047AB;
  border-top: 1px solid #e2e8f0;
  padding-top: 8px;
  margin-top: 4px;
}

/* Prescriptions Tab */
.mi-tab {
  padding: 8px 18px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
}
.mi-tab:hover {
  border-color: #0047AB;
  color: #0047AB;
  background: #f8fafc;
}
.mi-tab--active {
  background: #0047AB;
  color: white;
  border-color: #0047AB;
}
.mi-tab--active:hover {
  background: #003685;
  color: white;
}

.mi-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 6px;
  background: white;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}

.mi-pres-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mi-pres-card {
  background: white;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mi-pres-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: #fff8f8;
  border-bottom: 1px dashed #fca5a5;
}

.mi-pres-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mi-pres-instructions {
  margin: 0 18px;
  padding: 10px 14px;
  margin-top: 12px;
  background: #fef2f2;
  border-left: 3px solid #ef4444;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #7f1d1d;
}

.mi-pres-meds {
  padding: 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mi-pres-med {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mi-pres-med-name {
  font-weight: 700;
  font-size: 0.88rem;
  color: #0f172a;
}

.mi-pres-med-qty {
  font-weight: 800;
  font-size: 0.85rem;
  color: #b91c1c;
}

.mi-pres-med-dosage {
  font-size: 0.78rem;
  color: #64748b;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 4px;
}

.mi-pres-footer {
  padding: 10px 18px;
  border-top: 1px dashed #fca5a5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
}
</style>
