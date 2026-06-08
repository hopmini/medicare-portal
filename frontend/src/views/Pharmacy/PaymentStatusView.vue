<template>
  <a-layout style="min-height: 100vh; background: #f8fafc;">
    <a-layout-sider width="260" theme="light" style="background: #ffffff; border-right: 1px solid #f0f4f9;">
      <PharmacySidebar />
    </a-layout-sider>

    <a-layout style="background: #f8fafc;">
      <AppHeader title="Trạng thái thanh toán" welcome="Theo dõi và cập nhật tình trạng thanh toán của các hóa đơn" />

      <a-layout-content style="padding: 24px 28px; position: relative;">

        <!-- 4 Stat Cards -->
        <div class="stats-row">
          <!-- Đã thanh toán -->
          <div class="pst-stat-card" :class="{ 'pst-active': activeStatFilter === 'paid' }" @click="activeStatFilter = activeStatFilter === 'paid' ? 'all' : 'paid'">
            <div class="pst-stat-icon" style="background: #ecfdf5; color: #10b981;">
              <i class="fas fa-check-circle" />
            </div>
            <div class="pst-stat-body">
              <div class="pst-stat-label">Đã thanh toán</div>
              <div class="pst-stat-value" style="color: #10b981;">{{ formatCurrency(paidTotal) }}</div>
              <div class="pst-stat-sub">{{ paidInvoices.length }} hóa đơn</div>
            </div>
          </div>

          <!-- Chờ thanh toán -->
          <div class="pst-stat-card" :class="{ 'pst-active': activeStatFilter === 'pending' }" @click="activeStatFilter = activeStatFilter === 'pending' ? 'all' : 'pending'">
            <div class="pst-stat-icon" style="background: #fffbeb; color: #f59e0b;">
              <i class="fas fa-clock" />
            </div>
            <div class="pst-stat-body">
              <div class="pst-stat-label">Chờ thanh toán</div>
              <div class="pst-stat-value" style="color: #f59e0b;">{{ formatCurrency(pendingTotal) }}</div>
              <div class="pst-stat-sub">{{ pendingInvoices.length }} hóa đơn</div>
            </div>
          </div>

          <!-- Thanh toán một phần -->
          <div class="pst-stat-card" :class="{ 'pst-active': activeStatFilter === 'partial' }" @click="activeStatFilter = activeStatFilter === 'partial' ? 'all' : 'partial'">
            <div class="pst-stat-icon" style="background: #eff6ff; color: #3b82f6;">
              <i class="fas fa-adjust" />
            </div>
            <div class="pst-stat-body">
              <div class="pst-stat-label">Thanh toán một phần</div>
              <div class="pst-stat-value" style="color: #3b82f6;">{{ formatCurrency(partialTotal) }}</div>
              <div class="pst-stat-sub">{{ partialInvoices.length }} hóa đơn</div>
            </div>
          </div>

          <!-- Tổng còn lại -->
          <div class="pst-stat-card">
            <div class="pst-stat-icon" style="background: #eff6ff; color: #0047AB;">
              <i class="fas fa-wallet" />
            </div>
            <div class="pst-stat-body">
              <div class="pst-stat-label">Tổng còn lại</div>
              <div class="pst-stat-value" style="color: #0047AB;">{{ formatCurrency(remainingTotal) }}</div>
              <div class="pst-stat-sub">{{ remainingInvoicesCount }} hóa đơn</div>
            </div>
          </div>
        </div>

        <!-- Invoice Info Card -->
        <div class="invoice-info-card">
          <div class="invoice-info-row">
            <!-- Left: Invoice code + date -->
            <div class="inv-col inv-col-main">
              <div class="inv-header-label">Thông tin hóa đơn</div>
              <div class="inv-code-row">
                <span class="inv-code-text">{{ selectedInvoice.code }}</span>
                <button class="copy-btn" @click="copyInvoiceCode" title="Sao chép mã">
                  <i class="far fa-copy" />
                </button>
              </div>
              <div class="inv-date-text">Ngày tạo: {{ selectedInvoice.createdDate }}</div>
            </div>

            <!-- Tổng tiền -->
            <div class="inv-col">
              <div class="inv-detail-label">Tổng tiền</div>
              <div class="inv-detail-value inv-highlight">{{ formatCurrency(selectedInvoice.totalAmount) }}</div>
            </div>

            <!-- Đã thanh toán -->
            <div class="inv-col">
              <div class="inv-detail-label">Đã thanh toán</div>
              <div class="inv-detail-value">{{ formatCurrency(selectedInvoice.paidAmount) }}</div>
            </div>

            <!-- Còn lại -->
            <div class="inv-col">
              <div class="inv-detail-label">Còn lại</div>
              <div class="inv-detail-value inv-red">{{ formatCurrency(selectedInvoice.remainingAmount) }}</div>
            </div>

            <!-- Phương thức -->
            <div class="inv-col">
              <div class="inv-detail-label">Phương thức</div>
              <div class="inv-detail-value-method">
                <strong>{{ selectedInvoice.paymentMethod }}</strong>
                <span class="inv-method-sub">{{ selectedInvoice.paymentMethodSub }}</span>
              </div>
            </div>

            <!-- Trạng thái hiện tại -->
            <div class="inv-col">
              <div class="inv-detail-label">Trạng thái hiện tại</div>
              <span :class="['pst-badge', getBadgeClass(selectedInvoice.status)]">{{ getStatusText(selectedInvoice.status) }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Progress Timeline -->
        <div class="timeline-card">
          <div class="timeline-title">Tiến trình thanh toán</div>
          <div class="timeline-track">
            <!-- Step 1: Hóa đơn đã tạo -->
            <div class="timeline-step" :class="{ 'step-done': selectedInvoice.progressStep >= 1 }">
              <div class="step-circle" :class="{ 'circle-done': selectedInvoice.progressStep >= 1 }">
                <i class="fas fa-file-invoice" />
              </div>
              <div class="step-line" :class="{ 'line-done': selectedInvoice.progressStep >= 2 }"></div>
              <div class="step-label">Hóa đơn đã tạo</div>
              <div class="step-date">{{ selectedInvoice.progressStep >= 1 ? selectedInvoice.createdDate + ' ' + selectedInvoice.createdTime : 'Chưa hoàn tất' }}</div>
            </div>

            <!-- Step 2: Chờ thanh toán -->
            <div class="timeline-step" :class="{ 'step-done': selectedInvoice.progressStep >= 2 }">
              <div class="step-circle" :class="{ 'circle-pending': selectedInvoice.progressStep === 2, 'circle-done': selectedInvoice.progressStep >= 3 }">
                <i class="fas fa-clock" />
              </div>
              <div class="step-line" :class="{ 'line-done': selectedInvoice.progressStep >= 3 }"></div>
              <div class="step-label">Chờ thanh toán</div>
              <div class="step-date">{{ selectedInvoice.progressStep >= 2 ? selectedInvoice.pendingDate : 'Chưa hoàn tất' }}</div>
            </div>

            <!-- Step 3: Đã thanh toán -->
            <div class="timeline-step" :class="{ 'step-done': selectedInvoice.progressStep >= 3 }">
              <div class="step-circle" :class="{ 'circle-done': selectedInvoice.progressStep >= 3, 'circle-inactive': selectedInvoice.progressStep < 3 }">
                <i class="fas fa-money-bill-wave" />
              </div>
              <div class="step-label">Đã thanh toán</div>
              <div class="step-date">{{ selectedInvoice.progressStep >= 3 ? selectedInvoice.paidDate : 'Chưa hoàn tất' }}</div>
            </div>
          </div>
        </div>

        <!-- Payment History Table -->
        <div class="history-card">
          <div class="history-header">
            <div class="history-title">Lịch sử thanh toán</div>
          </div>
          <a-table
            :columns="historyColumns"
            :data-source="displayedHistory"
            row-key="id"
            :pagination="false"
            size="middle"
            class="pst-history-table"
          >
            <template #bodyCell="{ text, record, column }">
              <template v-if="column.key === 'code'">
                <span class="hist-code">{{ record.code }}</span>
              </template>
              <template v-else-if="column.key === 'invoiceCode'">
                <span class="hist-invoice-code">{{ record.invoiceCode }}</span>
              </template>
              <template v-else-if="column.key === 'amount'">
                <span class="hist-amount">{{ formatCurrency(record.amount) }}</span>
              </template>
              <template v-else-if="column.key === 'method'">
                <span>{{ record.method }}</span>
              </template>
              <template v-else-if="column.key === 'time'">
                <span>{{ record.time }}</span>
              </template>
              <template v-else-if="column.key === 'status'">
                <span :class="['pst-badge', getBadgeClass(record.status)]">{{ getStatusText(record.status) }}</span>
              </template>
            </template>
          </a-table>

        </div>

        <!-- Info Banner -->
        <div class="info-banner">
          <div class="info-banner-left">
            <div class="info-banner-icon">
              <i class="fas fa-info-circle" />
            </div>
            <div>
              <div class="info-banner-title">Hóa đơn chưa thanh toán?</div>
              <div class="info-banner-desc">Vui lòng thanh toán đúng hạn để tránh gián đoạn quyền lợi và phát sinh phí phạt (nếu có).</div>
            </div>
          </div>
          <a-button type="primary" class="info-banner-btn" @click="viewInvoiceDetail">
            Xem chi tiết hóa đơn <i class="fas fa-arrow-right" style="margin-left: 6px;" />
          </a-button>
        </div>



      </a-layout-content>
    </a-layout>

    <!-- Invoice Detail Modal -->
    <a-modal
      v-model:open="showDetailModal"
      title="Chi tiết hóa đơn"
      :footer="null"
      width="640px"
      centered
      class="pst-detail-modal"
    >
      <div v-if="selectedInvoice" style="padding-top: 8px;">
        <div class="modal-code-row">
          <span :class="['pst-badge', getBadgeClass(selectedInvoice.status)]">{{ getStatusText(selectedInvoice.status) }}</span>
          <h3 class="modal-invoice-code">{{ selectedInvoice.code }}</h3>
        </div>
        <a-divider style="margin: 14px 0;" />

        <div class="modal-info-grid">
          <div class="modal-info-item">
            <span class="modal-lbl">Ngày tạo</span>
            <span class="modal-val">{{ selectedInvoice.createdDate }}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-lbl">Tổng tiền</span>
            <span class="modal-val font-bold" style="color: #0047AB;">{{ formatCurrency(selectedInvoice.totalAmount) }}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-lbl">Đã thanh toán</span>
            <span class="modal-val" style="color: #10b981; font-weight: 700;">{{ formatCurrency(selectedInvoice.paidAmount) }}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-lbl">Còn lại</span>
            <span class="modal-val" style="color: #ef4444; font-weight: 700;">{{ formatCurrency(selectedInvoice.remainingAmount) }}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-lbl">Phương thức</span>
            <span class="modal-val">{{ selectedInvoice.paymentMethod }} {{ selectedInvoice.paymentMethodSub }}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-lbl">Trạng thái</span>
            <span :class="['pst-badge', getBadgeClass(selectedInvoice.status)]">{{ getStatusText(selectedInvoice.status) }}</span>
          </div>
        </div>

        <!-- Items breakdown -->
        <a-divider style="margin: 14px 0;" />
        <div class="modal-items-title">Chi tiết thuốc</div>
        <a-table
          :columns="itemColumns"
          :data-source="selectedInvoice.items"
          row-key="id"
          :pagination="false"
          size="small"
          class="modal-items-table"
        />

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <a-button @click="showDetailModal = false" style="border-radius: 8px;">Đóng</a-button>
          <a-button type="primary" style="background: #0047AB; border-color: #0047AB; border-radius: 8px;" @click="printInvoice">
            <i class="fas fa-print" style="margin-right: 6px;" /> In hóa đơn
          </a-button>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import PharmacySidebar from '@/components/PharmacySidebar.vue';
import AppHeader from '@/components/AppHeader.vue';
import { useAuthStore } from '@/stores/authStore';
import { pharmacyApi } from '@/services/api';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

interface InvoiceItem {
  id: number;
  name: string;
  qty: number;
  unit: string;
  price: number;
  total: number;
}

interface Invoice {
  id: number;
  code: string;
  createdDate: string;
  createdTime: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: string;
  paymentMethodSub: string;
  status: 'paid' | 'pending' | 'partial';
  progressStep: number; // 1=created, 2=pending, 3=paid
  pendingDate: string;
  paidDate: string;
  items: InvoiceItem[];
}

interface PaymentHistoryItem {
  id: number;
  code: string;
  invoiceCode: string;
  amount: number;
  method: string;
  time: string;
  status: 'paid' | 'pending' | 'partial';
}

// State
const activeStatFilter = ref<'all' | 'paid' | 'pending' | 'partial'>('all');
const showAllHistory = ref(false);
const showDetailModal = ref(false);
const selectedInvoiceIndex = ref(0);
const loading = ref(false);

const invoices = ref<Invoice[]>([]);
const paymentHistory = ref<PaymentHistoryItem[]>([]);

async function loadRealInvoices() {
  loading.value = true;
  try {
    const response = await pharmacyApi.get('/Bills');
    const bills = response.data || [];
    
    invoices.value = bills.map((b: any) => {
      const statusMap: Record<string, 'paid' | 'pending' | 'partial'> = {
        'Paid': 'paid',
        'Pending': 'pending',
        'Partial': 'partial'
      };
      
      const status = statusMap[b.status] || 'pending';
      const isPaid = status === 'paid';
      
      return {
        id: b.id,
        code: `HD${new Date(b.createdAt).getFullYear().toString().substr(-2)}${(new Date(b.createdAt).getMonth()+1).toString().padStart(2, '0')}${new Date(b.createdAt).getDate().toString().padStart(2, '0')}-${b.id.toString().padStart(4, '0')}`,
        createdDate: new Date(b.createdAt).toLocaleDateString('vi-VN'),
        createdTime: new Date(b.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        totalAmount: b.totalAmount,
        paidAmount: isPaid ? b.totalAmount : 0,
        remainingAmount: isPaid ? 0 : b.totalAmount,
        paymentMethod: isPaid ? 'Chuyển khoản' : 'Chưa chọn',
        paymentMethodSub: isPaid ? 'Ngân hàng' : '',
        status: status,
        progressStep: isPaid ? 3 : 2,
        pendingDate: new Date(b.createdAt).toLocaleString('vi-VN'),
        paidDate: isPaid ? new Date(b.createdAt).toLocaleString('vi-VN') : '',
        items: b.medicineFee > 0 ? [
          { id: 1, name: 'Chi phí tiền thuốc', qty: 1, unit: 'Đợt', price: b.medicineFee, total: b.medicineFee }
        ] : [
          { id: 1, name: 'Chi phí khám bệnh', qty: 1, unit: 'Lần', price: b.examinationFee, total: b.examinationFee }
        ]
      };
    });

    // Populate payment history based on paid invoices
    paymentHistory.value = invoices.value
      .filter(i => i.status === 'paid')
      .map((i, idx) => ({
        id: idx + 1,
        code: `TT${idx + 1000}`,
        invoiceCode: i.code,
        amount: i.totalAmount,
        method: i.paymentMethod,
        time: i.paidDate,
        status: 'paid'
      }));

    // Find requested invoice from query param 'code' or default to first pending
    const codeQuery = route.query.code;
    if (codeQuery) {
      const foundIdx = invoices.value.findIndex(i => i.code === codeQuery);
      if (foundIdx >= 0) {
        selectedInvoiceIndex.value = foundIdx;
        return;
      }
    }

    const pendingIdx = invoices.value.findIndex(i => i.status === 'pending');
    if (pendingIdx >= 0) {
      selectedInvoiceIndex.value = pendingIdx;
    } else {
      selectedInvoiceIndex.value = 0;
    }
  } catch (err) {
    console.error('Failed to load real invoices in status view:', err);
    message.error('Không thể tải thông tin trạng thái thanh toán.');
  } finally {
    loading.value = false;
  }
}

// Selected invoice (currently displayed in the info card)
const selectedInvoice = computed(() => invoices.value[selectedInvoiceIndex.value] || {
  id: 0,
  code: '–',
  createdDate: '–',
  createdTime: '–',
  totalAmount: 0,
  paidAmount: 0,
  remainingAmount: 0,
  paymentMethod: '–',
  paymentMethodSub: '',
  status: 'pending',
  progressStep: 1,
  pendingDate: '–',
  paidDate: '–',
  items: []
});

// Filtered invoices by stat card clicks
const paidInvoices = computed(() => invoices.value.filter(i => i.status === 'paid'));
const pendingInvoices = computed(() => invoices.value.filter(i => i.status === 'pending'));
const partialInvoices = computed(() => invoices.value.filter(i => i.status === 'partial'));

const paidTotal = computed(() => paidInvoices.value.reduce((s, i) => s + i.paidAmount, 0));
const pendingTotal = computed(() => pendingInvoices.value.reduce((s, i) => s + i.totalAmount, 0));
const partialTotal = computed(() => partialInvoices.value.reduce((s, i) => s + i.totalAmount, 0));
const remainingTotal = computed(() => invoices.value.reduce((s, i) => s + i.remainingAmount, 0));
const remainingInvoicesCount = computed(() => invoices.value.filter(i => i.remainingAmount > 0).length);

// History display: always show all items
const displayedHistory = computed(() => paymentHistory.value);

// History table columns
const historyColumns = [
  { title: 'Mã thanh toán', dataIndex: 'code', key: 'code', width: '160px' },
  { title: 'Mã hóa đơn', dataIndex: 'invoiceCode', key: 'invoiceCode', width: '160px' },
  { title: 'Số tiền', dataIndex: 'amount', key: 'amount', width: '140px', align: 'right' as const },
  { title: 'Phương thức', dataIndex: 'method', key: 'method' },
  { title: 'Thời gian', dataIndex: 'time', key: 'time', width: '180px' },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: '130px', align: 'center' as const }
];

// Item columns for detail modal
const itemColumns = [
  { title: 'STT', dataIndex: 'id', key: 'id', width: '50px', align: 'center' as const },
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'SL', dataIndex: 'qty', key: 'qty', width: '60px', align: 'center' as const },
  { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: '70px', align: 'center' as const },
  { title: 'Đơn giá', dataIndex: 'price', key: 'price', width: '110px', align: 'right' as const, customRender: ({ text }: any) => text?.toLocaleString() + ' đ' },
  { title: 'Thành tiền', dataIndex: 'total', key: 'total', width: '120px', align: 'right' as const, customRender: ({ text }: any) => text?.toLocaleString() + ' đ' }
];

// Helpers
function formatCurrency(value: number) {
  return value.toLocaleString('vi-VN') + ' đ';
}

// Helpers
function getBadgeClass(status: string) {
  switch (status) {
    case 'paid': return 'badge-paid';
    case 'pending': return 'badge-pending';
    case 'partial': return 'badge-partial';
    default: return '';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'paid': return 'Thành công';
    case 'pending': return 'Chờ thanh toán';
    case 'partial': return 'Một phần';
    default: return status;
  }
}

function copyInvoiceCode() {
  if (selectedInvoice.value && selectedInvoice.value.code !== '–') {
    navigator.clipboard.writeText(selectedInvoice.value.code);
    message.success('Đã sao chép mã hóa đơn: ' + selectedInvoice.value.code);
  }
}

function viewInvoiceDetail() {
  if (selectedInvoice.value && selectedInvoice.value.code !== '–') {
    showDetailModal.value = true;
  }
}

function printInvoice() {
  if (selectedInvoice.value && selectedInvoice.value.code !== '–') {
    message.success('Đang gửi lệnh in hóa đơn ' + selectedInvoice.value.code + '...');
  }
}

onMounted(() => {
  loadRealInvoices();
});
</script>

<style scoped>
/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

@media (max-width: 1100px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
}

.pst-stat-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.pst-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  border-color: #cbd5e1;
}

.pst-active {
  border-color: #3b82f6 !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.10) !important;
  background: #fdfeff;
}

.pst-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.pst-stat-body {
  display: flex;
  flex-direction: column;
}

.pst-stat-label {
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 600;
}

.pst-stat-value {
  font-size: 1.35rem;
  font-weight: 800;
  margin-top: 2px;
  line-height: 1.2;
}

.pst-stat-sub {
  font-size: 0.74rem;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 1px;
}

/* Invoice Info Card */
.invoice-info-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 22px 28px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
}

.invoice-info-row {
  display: flex;
  align-items: flex-start;
  gap: 0;
  flex-wrap: wrap;
}

.inv-col {
  flex: 1;
  min-width: 130px;
  padding: 0 16px;
  border-left: 1px solid #f0f4f9;
}

.inv-col:first-child {
  border-left: none;
  padding-left: 0;
}

.inv-col-main {
  flex: 1.5;
  min-width: 200px;
}

.inv-header-label {
  font-size: 0.78rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 4px;
}

.inv-code-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.inv-code-text {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.3px;
}

.copy-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.15s;
  font-size: 0.95rem;
}

.copy-btn:hover {
  color: #0047AB;
  background: #eff6ff;
}

.inv-date-text {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.inv-detail-label {
  font-size: 0.78rem;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 6px;
}

.inv-detail-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e293b;
}

.inv-highlight {
  color: #0047AB !important;
}

.inv-red {
  color: #ef4444 !important;
}

.inv-detail-value-method {
  display: flex;
  flex-direction: column;
  font-size: 0.92rem;
  color: #1e293b;
}

.inv-detail-value-method strong {
  font-weight: 700;
}

.inv-method-sub {
  font-size: 0.78rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Badges */
.pst-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}

.badge-paid {
  background: #ecfdf5;
  color: #10b981;
}

.badge-pending {
  background: #fffbeb;
  color: #f59e0b;
}

.badge-partial {
  background: #eff6ff;
  color: #3b82f6;
}

/* Timeline Card */
.timeline-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 24px 28px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
}

.timeline-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 24px;
}

.timeline-track {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  text-align: center;
}

.step-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  background: #f1f5f9;
  color: #94a3b8;
  border: 3px solid #e2e8f0;
  z-index: 2;
  transition: all 0.3s ease;
}

.circle-done {
  background: #ecfdf5;
  color: #10b981;
  border-color: #10b981;
}

.circle-pending {
  background: #fffbeb;
  color: #f59e0b;
  border-color: #f59e0b;
  animation: pulse-glow 2s infinite;
}

.circle-inactive {
  background: #f8fafc;
  color: #cbd5e1;
  border-color: #e2e8f0;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.3); }
  50% { box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
}

.step-line {
  position: absolute;
  top: 24px;
  left: calc(50% + 28px);
  width: calc(100% - 56px);
  height: 3px;
  background: #e2e8f0;
  z-index: 1;
  border-radius: 2px;
}

.line-done {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
}

.timeline-step:last-child .step-line {
  display: none;
}

.step-label {
  margin-top: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
}

.step-date {
  font-size: 0.76rem;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 2px;
}

/* History Card */
.history-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
  overflow: hidden;
}

.history-header {
  padding: 18px 24px 12px;
}

.history-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.pst-history-table :deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid #e2e8f0;
}

.pst-history-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f1f5f9 !important;
}

.pst-history-table :deep(.ant-table-cell) {
  padding: 12px 16px !important;
  font-size: 0.88rem;
  color: #334155;
}

.hist-code {
  font-weight: 700;
  color: #1e293b;
}

.hist-invoice-code {
  font-weight: 600;
  color: #475569;
}

.hist-amount {
  font-weight: 700;
  color: #0047AB;
}

.history-footer {
  padding: 14px 24px;
  text-align: center;
  border-top: 1px solid #f0f4f9;
}

.view-all-link {
  font-size: 0.88rem;
  font-weight: 700;
  color: #3b82f6;
  cursor: pointer;
  transition: color 0.15s;
  display: inline-flex;
  align-items: center;
}

.view-all-link:hover {
  color: #0047AB;
}

/* Info Banner */
.info-banner {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.info-banner-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.info-banner-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #dbeafe;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.info-banner-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2px;
}

.info-banner-desc {
  font-size: 0.82rem;
  color: #475569;
  font-weight: 500;
}

.info-banner-btn {
  background: #dc2626 !important;
  border-color: #dc2626 !important;
  border-radius: 10px !important;
  font-weight: 700 !important;
  height: 40px !important;
  padding: 0 20px !important;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-banner-btn:hover {
  background: #b91c1c !important;
  border-color: #b91c1c !important;
}

/* Support Widget - bottom right fixed */
.support-widget {
  position: fixed;
  bottom: 28px;
  right: 28px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.10);
  border: 1px solid #e2e8f0;
  z-index: 100;
  min-width: 200px;
  transition: transform 0.2s;
}

.support-widget:hover {
  transform: translateY(-2px);
}

.support-icon-circle {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #0047AB 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.support-body {
  display: flex;
  flex-direction: column;
}

.support-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1e293b;
}

.support-desc {
  font-size: 0.76rem;
  color: #64748b;
  font-weight: 500;
}

.support-phone {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0047AB;
  margin-top: 2px;
}

/* Detail Modal */
.modal-code-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-invoice-code {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.modal-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.modal-info-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.modal-lbl {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
}

.modal-val {
  font-size: 0.92rem;
  color: #1e293b;
}

.font-bold {
  font-weight: 700;
}

.modal-items-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}

.modal-items-table :deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-items-table :deep(.ant-table-cell) {
  padding: 8px 12px !important;
  font-size: 0.85rem;
  color: #334155;
}
</style>
