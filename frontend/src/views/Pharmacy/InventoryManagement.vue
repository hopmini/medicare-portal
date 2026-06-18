<template>
  <a-layout :style="inline ? 'background: transparent; min-height: auto;' : 'min-height: 100vh; background: #f8fafc;'">
    <!-- Sidebar -->
    <a-layout-sider v-if="!inline" width="260" theme="light" style="background: #ffffff; border-right: 1px solid #f0f4f9;">
      <PharmacySidebar />
    </a-layout-sider>

    <!-- Main Layout -->
    <a-layout :style="inline ? 'background: transparent;' : 'background: #f8fafc;'">
      <AppHeader v-if="!inline" title="Lịch sử kho" welcome="Theo dõi và tra cứu các giao dịch nhập, xuất, điều chỉnh và hủy trong kho thuốc." />

      <!-- Main Content Area -->
      <a-layout-content :style="inline ? 'padding: 0;' : 'padding: 24px 28px;'">

        <!-- 5 Stats Cards -->
        <div class="metrics-grid" style="margin-bottom: 24px;">
          <!-- Card: Total -->
          <div class="stat-card" :class="{ 'stat-active': activeFilter === 'all' }" @click="selectFilter('all')">
            <div class="stat-icon-wrapper" style="background: #eff6ff; color: #2563eb;">
              <i class="fas fa-exchange-alt" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Tổng giao dịch</div>
              <div class="stat-value" style="color: #1e293b;">{{ totalTransactionsCount }}</div>
              <div class="stat-unit">Giao dịch</div>
            </div>
          </div>

          <!-- Card: Import -->
          <div class="stat-card" :class="{ 'stat-active': activeFilter === 'Nhập kho' }" @click="selectFilter('Nhập kho')">
            <div class="stat-icon-wrapper" style="background: #eff6ff; color: #3b82f6;">
              <i class="fas fa-file-import" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Nhập kho</div>
              <div class="stat-value" style="color: #2563eb;">{{ importCount }}</div>
              <div class="stat-unit">Giao dịch</div>
            </div>
          </div>

          <!-- Card: Export -->
          <div class="stat-card" :class="{ 'stat-active': activeFilter === 'Xuất kho' }" @click="selectFilter('Xuất kho')">
            <div class="stat-icon-wrapper" style="background: #fff7ed; color: #ea580c;">
              <i class="fas fa-arrow-up" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Xuất kho</div>
              <div class="stat-value" style="color: #ea580c;">{{ exportCount }}</div>
              <div class="stat-unit">Giao dịch</div>
            </div>
          </div>

          <!-- Card: Adjust -->
          <div class="stat-card" :class="{ 'stat-active': activeFilter === 'Điều chỉnh' }" @click="selectFilter('Điều chỉnh')">
            <div class="stat-icon-wrapper" style="background: #f1f5f9; color: #64748b;">
              <i class="fas fa-sliders-h" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Điều chỉnh</div>
              <div class="stat-value" style="color: #475569;">{{ adjustCount }}</div>
              <div class="stat-unit">Giao dịch</div>
            </div>
          </div>

          <!-- Card: Destroy -->
          <div class="stat-card" :class="{ 'stat-active': activeFilter === 'Hủy' }" @click="selectFilter('Hủy')">
            <div class="stat-icon-wrapper" style="background: #fef2f2; color: #dc2626;">
              <i class="fas fa-times" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Hủy</div>
              <div class="stat-value" style="color: #dc2626;">{{ destroyCount }}</div>
              <div class="stat-unit">Giao dịch</div>
            </div>
          </div>
        </div>

        <!-- Filter bar -->
        <div class="filter-panel" style="margin-bottom: 20px;">
          <div class="filter-left">
            <!-- Search -->
            <div style="position: relative; width: 340px;">
              <i class="fas fa-search search-icon-input" />
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Tìm theo mã giao dịch hoặc tên thuốc" 
                class="custom-search-input"
              />
            </div>

            <!-- Date range pickers -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <div class="date-picker-box">
                <span class="date-label">Từ ngày</span>
                <a-date-picker 
                  v-model:value="startDate" 
                  format="DD/MM/YYYY" 
                  placeholder="01/05/2024" 
                  class="custom-datepicker"
                  :allow-clear="false"
                />
              </div>
              <div class="date-picker-box">
                <span class="date-label">Đến ngày</span>
                <a-date-picker 
                  v-model:value="endDate" 
                  format="DD/MM/YYYY" 
                  placeholder="31/05/2024" 
                  class="custom-datepicker"
                  :allow-clear="false"
                />
              </div>
            </div>
          </div>

          <!-- Action buttons for Admin: Export Excel & Refresh -->
          <div class="filter-right">
            <a-button 
              class="action-export-btn" 
              @click="exportExcel"
            >
              <i class="fas fa-file-excel" style="margin-right: 6px;" /> Xuất Excel
            </a-button>
            <a-button 
              class="action-refresh-btn" 
              @click="refreshData"
            >
              <i class="fas fa-sync-alt" style="margin-right: 6px;" /> Làm mới
            </a-button>
          </div>
        </div>

        <!-- Table Card -->
        <a-card :bordered="false" class="table-container-card">
          <a-spin :spinning="loading">
          <a-empty v-if="!loading && filteredTransactions.length === 0" description="Không có giao dịch nào" />
          <a-table v-if="filteredTransactions.length > 0"
            :columns="columns"
            :data-source="filteredTransactions"
            row-key="id"
            :pagination="paginationConfig"
            @change="handleTableChange"
            size="middle"
            class="history-table"
            :customRow="customRowClick"
          >
            <template #bodyCell="{ text, record, column }">
              <!-- Code Column -->
              <template v-if="column.key === 'code'">
                <span class="code-link" @click.stop="viewDetails(record)">{{ record.code }}</span>
              </template>

              <!-- Type Column -->
              <template v-else-if="column.key === 'type'">
                <span :class="['custom-badge', getBadgeClass(record.type)]">
                  {{ record.type }}
                </span>
              </template>

              <!-- Qty Column -->
              <template v-else-if="column.key === 'qty'">
                <span :class="['qty-text', record.qty >= 0 ? 'qty-pos' : 'qty-neg']">
                  {{ record.qty >= 0 ? '+' : '' }}{{ record.qty.toLocaleString() }}
                </span>
              </template>

              <!-- Before stock -->
              <template v-else-if="column.key === 'tonTruoc'">
                <span>{{ record.tonTruoc.toLocaleString() }}</span>
              </template>

              <!-- After stock -->
              <template v-else-if="column.key === 'tonSau'">
                <span>{{ record.tonSau.toLocaleString() }}</span>
              </template>

              <!-- Related document link -->
              <template v-else-if="column.key === 'document'">
                <span 
                  :class="['doc-link', record.type === 'Nhập kho' ? 'doc-import' : record.type === 'Xuất kho' ? 'doc-export' : 'doc-other']"
                  @click.stop="openDocument(record)"
                >
                  {{ record.document }}
                </span>
              </template>

              <!-- Transaction Date -->
              <template v-else-if="column.key === 'date'">
                <span>{{ record.date }}</span>
              </template>

              <!-- Action Column -->
              <template v-else-if="column.key === 'action'">
                <a-tooltip title="Xem chi tiết">
                  <a-button 
                    type="text" 
                    size="small" 
                    class="action-view-btn"
                    @click.stop="viewDetails(record)"
                  >
                    <i class="fas fa-eye" />
                  </a-button>
                </a-tooltip>
              </template>
            </template>
          </a-table>
          </a-spin>
        </a-card>
      </a-layout-content>
    </a-layout>

    <!-- Modal: View Details -->
    <a-modal
      v-model:open="showDetailsModal"
      title="Chi tiết giao dịch kho"
      :footer="null"
      width="780px"
      centered
      class="detail-modal"
    >
      <div v-if="enrichedSelectedTransaction" style="padding-top: 12px;">
        <!-- Nhóm 1: Thông tin giao dịch -->
        <div class="detail-section">
          <div class="detail-section-title">
            <i class="fas fa-receipt" /> 1. Thông tin giao dịch
          </div>
          <div class="detail-grid-3">
            <div class="info-item">
              <span class="lbl">Mã giao dịch</span>
              <span class="val font-semibold">{{ enrichedSelectedTransaction.code }}</span>
            </div>
            <div class="info-item">
              <span class="lbl">Loại giao dịch</span>
              <div>
                <span :class="['custom-badge', getBadgeClass(enrichedSelectedTransaction.type)]">
                  {{ enrichedSelectedTransaction.type }}
                </span>
              </div>
            </div>
            <div class="info-item">
              <span class="lbl">Ngày giao dịch</span>
              <span class="val">{{ enrichedSelectedTransaction.date }}</span>
            </div>
            <div class="info-item">
              <span class="lbl">Trạng thái</span>
              <div>
                <span class="custom-badge" style="background: #e6f7ff; color: #1890ff; font-weight: 700;">
                  {{ enrichedSelectedTransaction.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Nhóm 2: Thông tin thuốc & lô -->
        <div class="detail-section">
          <div class="detail-section-title">
            <i class="fas fa-pills" /> 2. Thông tin thuốc & lô sản xuất
          </div>
          <div class="detail-grid-3">
            <div class="info-item">
              <span class="lbl">Tên thuốc</span>
              <span class="val font-semibold text-primary" style="color: #0047AB;">{{ enrichedSelectedTransaction.medicine }}</span>
            </div>
            <div class="info-item">
              <span class="lbl">Mã thuốc</span>
              <span class="val font-medium">{{ enrichedSelectedTransaction.medicineCode }}</span>
            </div>
            <div class="info-item">
              <span class="lbl">Hoạt chất</span>
              <span class="val">{{ enrichedSelectedTransaction.activeIngredient }}</span>
            </div>
            <div class="info-item">
              <span class="lbl">Số lô</span>
              <span class="val font-medium">{{ enrichedSelectedTransaction.batch }}</span>
            </div>
            <div class="info-item">
              <span class="lbl">Hạn dùng</span>
              <span class="val">{{ enrichedSelectedTransaction.expiryDate }}</span>
            </div>
            <div class="info-item">
              <span class="lbl">Kho chứa thuốc</span>
              <span class="val"><i class="fas fa-warehouse" style="color: #64748b; margin-right: 4px;" /> {{ enrichedSelectedTransaction.warehouse }}</span>
            </div>
          </div>
        </div>

        <!-- Nhóm 3: Biến động kho -->
        <div class="detail-section">
          <div class="detail-section-title">
            <i class="fas fa-exchange-alt" /> 3. Biến động kho & tồn kho
          </div>
          <div class="detail-grid-3">
            <div class="info-item">
              <span class="lbl">Số lượng biến động</span>
              <span :class="['val font-bold', enrichedSelectedTransaction.qty >= 0 ? 'qty-pos' : 'qty-neg']">
                {{ enrichedSelectedTransaction.qty >= 0 ? '+' : '' }}{{ enrichedSelectedTransaction.qty.toLocaleString() }}
              </span>
            </div>
            <div class="info-item">
              <span class="lbl">Tồn trước biến động</span>
              <span class="val">{{ enrichedSelectedTransaction.tonTruoc.toLocaleString() }}</span>
            </div>
            <div class="info-item">
              <span class="lbl">Tồn sau biến động</span>
              <span class="val font-semibold">{{ enrichedSelectedTransaction.tonSau.toLocaleString() }}</span>
            </div>
            <div class="info-item">
              <span class="lbl">Đơn vị tính</span>
              <span class="val">{{ enrichedSelectedTransaction.unit }}</span>
            </div>
          </div>
        </div>

        <!-- Nhóm 4: Chứng từ & người thực hiện -->
        <div class="detail-section" style="margin-bottom: 12px;">
          <div class="detail-section-title">
            <i class="fas fa-user-shield" /> 4. Thông tin chứng từ & người thực hiện
          </div>
          <div class="detail-grid-3">
            <div class="info-item">
              <span class="lbl">Chứng từ liên quan</span>
              <span class="val code-blue">{{ enrichedSelectedTransaction.document }}</span>
            </div>
            <div class="info-item">
              <span class="lbl">Loại chứng từ</span>
              <span class="val">{{ enrichedSelectedTransaction.documentType }}</span>
            </div>
            <div class="info-item">
              <span class="lbl">Thời gian thực hiện</span>
              <span class="val">{{ enrichedSelectedTransaction.date }}</span>
            </div>
            <div class="info-item">
              <span class="lbl">Người thực hiện</span>
              <span class="val font-medium">{{ enrichedSelectedTransaction.pharmacist }}</span>
            </div>
            <div class="info-item">
              <span class="lbl">Vai trò</span>
              <span class="val" style="color: #475569; font-weight: 500;">{{ enrichedSelectedTransaction.pharmacistRole }}</span>
            </div>
            <div class="info-item detail-full-width" v-if="enrichedSelectedTransaction.note" style="margin-top: 4px;">
              <span class="lbl">Ghi chú / Lý do giao dịch</span>
              <span class="val note-block">{{ enrichedSelectedTransaction.note }}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 28px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          <a-button @click="showDetailsModal = false" style="border-radius: 8px; font-weight: 500;">Đóng</a-button>
          <a-button type="primary" style="background: #0047AB; border-color: #0047AB; border-radius: 8px; display: flex; align-items: center; gap: 6px; font-weight: 500;" @click="printReceipt(enrichedSelectedTransaction)">
            <i class="fas fa-print" /> In chứng từ
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
import dayjs, { Dayjs } from 'dayjs';
import PharmacySidebar from '@/components/PharmacySidebar.vue';
import AppHeader from '@/components/AppHeader.vue';
import { getInventoryTransactions, getMedicines } from '@/services/pharmacyService';

const props = withDefaults(
  defineProps<{
    inline?: boolean
  }>(),
  {
    inline: false
  }
)
const loading = ref(false)
const LOCAL_MEDS = [
  { id: 1, code: 'MED001', name: 'Paracetamol 500mg', unit: 'Viên' },
  { id: 2, code: 'MED002', name: 'Amoxicillin 500mg', unit: 'Viên' },
  { id: 3, code: 'MED003', name: 'Vitamin C 500mg', unit: 'Viên' },
  { id: 4, code: 'MED004', name: 'Decolgen Forte', unit: 'Viên' },
  { id: 5, code: 'MED005', name: 'Panadol Extra', unit: 'Viên' },
  { id: 6, code: 'MED006', name: 'Ibuprofen 400mg', unit: 'Viên' },
  { id: 7, code: 'MED007', name: 'Omeprazole 20mg', unit: 'Viên' },
  { id: 8, code: 'MED008', name: 'Cetirizine 10mg', unit: 'Viên' },
  { id: 9, code: 'MED009', name: 'Gaviscon Dual Action', unit: 'Gói' },
  { id: 10, code: 'MED010', name: 'Salbutamol 2mg', unit: 'Viên' }
];

interface StockTransaction {
  id: number;
  code: string;
  type: 'Nhập kho' | 'Xuất kho' | 'Điều chỉnh' | 'Hủy';
  medicine: string;
  batch: string;
  qty: number;
  tonTruoc: number;
  tonSau: number;
  document: string;
  date: string;
  pharmacist: string;
  note?: string;
}

const searchQuery = ref('');
const activeFilter = ref<'all' | 'Nhập kho' | 'Xuất kho' | 'Điều chỉnh' | 'Hủy'>('all');

// Default date range matching the image: 01/05/2025 to 31/05/2025
const startDate = ref<Dayjs>(dayjs('2025-05-01'));
const endDate = ref<Dayjs>(dayjs('2025-05-31'));

const transactions = ref<StockTransaction[]>([]);

// Table Columns
const columns = [
  { title: 'Mã GD', dataIndex: 'code', key: 'code', width: '130px', sorter: (a: any, b: any) => a.code.localeCompare(b.code) },
  { title: 'Loại giao dịch', dataIndex: 'type', key: 'type', width: '130px' },
  { title: 'Tên thuốc', dataIndex: 'medicine', key: 'medicine', sorter: (a: any, b: any) => a.medicine.localeCompare(b.medicine) },
  { title: 'Số lô', dataIndex: 'batch', key: 'batch', width: '110px' },
  { title: 'Số lượng', dataIndex: 'qty', key: 'qty', width: '110px', align: 'right' as const, sorter: (a: any, b: any) => a.qty - b.qty },
  { title: 'Tồn trước', dataIndex: 'tonTruoc', key: 'tonTruoc', width: '110px', align: 'right' as const },
  { title: 'Tồn sau', dataIndex: 'tonSau', key: 'tonSau', width: '110px', align: 'right' as const },
  { title: 'Chứng từ liên quan', dataIndex: 'document', key: 'document', width: '170px' },
  { title: 'Ngày giao dịch', dataIndex: 'date', key: 'date', width: '160px', sorter: (a: any, b: any) => a.date.localeCompare(b.date) },
  { title: 'Người thực hiện', dataIndex: 'pharmacist', key: 'pharmacist', width: '150px' },
  { title: 'Thao tác', key: 'action', width: '90px', align: 'center' as const, fixed: 'right' as const }
];

// Detail Modal state
const showDetailsModal = ref(false);
const selectedTransaction = ref<StockTransaction | null>(null);

const enrichedSelectedTransaction = computed(() => {
  if (!selectedTransaction.value) return null;
  const tx = selectedTransaction.value;
  
  // Find match in LOCAL_MEDS
  const matchingMed = LOCAL_MEDS.find(m => m.name.toLowerCase() === tx.medicine.toLowerCase()) || 
                      LOCAL_MEDS.find(m => tx.medicine.toLowerCase().includes(m.name.toLowerCase())) ||
                      LOCAL_MEDS.find(m => m.name.toLowerCase().includes(tx.medicine.toLowerCase()));
  
  const medicineCode = matchingMed ? matchingMed.code : 'MED001';
  const unit = matchingMed ? matchingMed.unit : 'Viên';
  
  // Active ingredient mapping
  let activeIngredient = 'N/A';
  if (tx.medicine.includes('Paracetamol') || tx.medicine.includes('Panadol')) {
    activeIngredient = 'Paracetamol';
  } else if (tx.medicine.includes('Amoxicillin')) {
    activeIngredient = 'Amoxicillin';
  } else if (tx.medicine.includes('Vitamin C')) {
    activeIngredient = 'Acid Ascorbic (Vitamin C)';
  } else if (tx.medicine.includes('Omeprazole')) {
    activeIngredient = 'Omeprazole';
  } else if (tx.medicine.includes('Ibuprofen')) {
    activeIngredient = 'Ibuprofen';
  } else if (tx.medicine.includes('Cetirizine')) {
    activeIngredient = 'Cetirizine';
  } else if (tx.medicine.includes('Decolgen')) {
    activeIngredient = 'Acetaminophen + Phenylephrine + Chlorpheniramine';
  } else if (tx.medicine.includes('Gaviscon')) {
    activeIngredient = 'Sodium alginate + Sodium bicarbonate + Calcium carbonate';
  } else if (tx.medicine.includes('Salbutamol')) {
    activeIngredient = 'Salbutamol';
  }

  // Determine warehouse
  let warehouse = 'Kho chính';
  if (tx.type === 'Xuất kho') {
    warehouse = 'Quầy thuốc số 1 (Kho lẻ)';
  } else if (tx.type === 'Hủy') {
    warehouse = 'Khu vực chờ hủy thuốc';
  }

  // Expiry date (deterministic based on batch or ID)
  let expiryDate = '31/12/2026';
  if (tx.batch.includes('2404')) {
    expiryDate = '30/04/2026';
  } else if (tx.batch.includes('2403')) {
    expiryDate = '31/03/2026';
  }

  // Document type
  let documentType = 'Khác';
  if (tx.type === 'Nhập kho') {
    documentType = 'Hóa đơn nhập thuốc';
  } else if (tx.type === 'Xuất kho') {
    documentType = 'Hóa đơn bán lẻ';
  } else if (tx.type === 'Điều chỉnh') {
    documentType = 'Phiếu điều kho';
  } else if (tx.type === 'Hủy') {
    documentType = 'Phiếu hủy thuốc';
  }

  // Pharmacist role
  let pharmacistRole = 'Dược sĩ';
  if (tx.pharmacist.includes('Nguyễn Văn An')) {
    pharmacistRole = 'Thủ kho';
  } else if (tx.pharmacist.includes('Trần Thị Bình')) {
    pharmacistRole = 'Trưởng khoa dược';
  }

  // Reason / Note if empty
  let note = tx.note;
  if (!note) {
    if (tx.type === 'Nhập kho') {
      note = 'Nhập kho lô thuốc mới từ nhà cung cấp';
    } else if (tx.type === 'Xuất kho') {
      note = 'Xuất thuốc theo đơn cho bệnh nhân';
    } else {
      note = 'Giao dịch kho hệ thống';
    }
  }

  return {
    ...tx,
    medicineCode,
    activeIngredient,
    unit,
    warehouse,
    expiryDate,
    documentType,
    pharmacistRole,
    status: 'Hoàn thành',
    note
  };
});



async function loadTransactions() {
  loading.value = true
  try {
    const txData = await getInventoryTransactions()
    const medData = await getMedicines()
    const medMap = new Map<number, { name: string; code: string }>()
    medData.forEach((m: any) => medMap.set(m.id, { name: m.name, code: m.code || `MED${String(m.id).padStart(3, '0')}` }))

    transactions.value = (txData || []).map((tx: any, idx: number) => {
      const medInfo = medMap.get(Number(tx.medicine?.replace(/\D/g, '')) || 0) || { name: tx.medicine || 'Thuốc', code: 'MED000' }
      const qty = Math.abs(tx.qty || 0)
      return {
        id: tx.id || idx + 1,
        code: `GD${String(tx.id || idx + 1).padStart(8, '0')}`,
        type: tx.type || 'Xuất kho',
        medicine: medInfo.name,
        batch: tx.batch || `LO${String(idx + 1).padStart(3, '0')}`,
        qty: tx.qty || 0,
        tonTruoc: tx.beforeStock || 1000,
        tonSau: tx.afterStock || 1000,
        document: tx.document || `HD-${String(tx.id || idx + 1).padStart(6, '0')}`,
        date: tx.date ? new Date(tx.date).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
        pharmacist: tx.staff || 'Hệ thống',
        note: tx.note || ''
      }
    })
  } catch (err) {
    console.error('Failed to load inventory transactions:', err)
    notif.show({ type: 'error', message: 'Không thể tải dữ liệu lịch sử kho!' })
    transactions.value = []
  } finally {
    loading.value = false
  }
}

// Stats Calculations
const totalTransactionsCount = computed(() => transactions.value.length);
const importCount = computed(() => transactions.value.filter(t => t.type === 'Nhập kho').length);
const exportCount = computed(() => transactions.value.filter(t => t.type === 'Xuất kho').length);
const adjustCount = computed(() => transactions.value.filter(t => t.type === 'Điều chỉnh').length);
const destroyCount = computed(() => transactions.value.filter(t => t.type === 'Hủy').length);

// Pagination config
const currentPage = ref(1);
const pageSize = ref(10);

const paginationConfig = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: filteredTransactions.value.length,
  showTotal: (total: number, range: [number, number]) => `Hiển thị ${range[0]} đến ${range[1]} của ${total} giao dịch`,
  locale: { items_per_page: '/ trang' },
  showSizeChanger: true
}));

function handleTableChange(pagination: any) {
  currentPage.value = pagination.current;
  pageSize.value = pagination.pageSize;
}

// Filtered transactions
const filteredTransactions = computed(() => {
  return transactions.value.filter(t => {
    // Search filter
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      if (!(t.code.toLowerCase().includes(q) || t.medicine.toLowerCase().includes(q))) return false;
    }

    // Type filter
    if (activeFilter.value !== 'all' && t.type !== activeFilter.value) {
      return false;
    }

    // Date range filter
    if (startDate.value && endDate.value) {
      const dateParts = t.date.split(' ')[0].split('/');
      const itemDate = dayjs(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
      
      const start = startDate.value.startOf('day');
      const end = endDate.value.endOf('day');
      
      if (itemDate.isBefore(start) || itemDate.isAfter(end)) {
        return false;
      }
    }

    return true;
  });
});

function selectFilter(filter: 'all' | 'Nhập kho' | 'Xuất kho' | 'Điều chỉnh' | 'Hủy') {
  activeFilter.value = filter;
  currentPage.value = 1;
}

function getBadgeClass(type: string) {
  switch (type) {
    case 'Nhập kho': return 'badge-import';
    case 'Xuất kho': return 'badge-export';
    case 'Điều chỉnh': return 'badge-adjust';
    case 'Hủy': return 'badge-destroy';
    default: return '';
  }
}

// Detail handlers
function viewDetails(record: StockTransaction) {
  selectedTransaction.value = record;
  showDetailsModal.value = true;
}

function customRowClick(record: StockTransaction) {
  return {
    onClick: () => {
      viewDetails(record);
    }
  };
}

function openDocument(record: StockTransaction) {
  notif.show({ type: 'info', message: `Xem chứng từ liên quan: ${record.document}` });
}

function printReceipt(record: StockTransaction) {
  notif.show({ type: 'success', message: `Đang gửi lệnh in phiếu giao dịch ${record.code}...` });
}

// Admin action handlers
function exportExcel() {
  notif.show({ type: 'success', message: 'Đang xuất file Excel danh sách giao dịch kho...' });
}

function refreshData() {
  loadTransactions();
  currentPage.value = 1;
  searchQuery.value = '';
  activeFilter.value = 'all';
  notif.show({ type: 'success', message: 'Đã làm mới dữ liệu lịch sử kho!' });
}

// Initialize
onMounted(() => {
  loadTransactions();
});
</script>

<style scoped>
/* Metrics Cards grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .metrics-grid {
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
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 2px rgba(0,0,0,0.01);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  text-align: center;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04);
  border-color: #cbd5e1;
}

.stat-active {
  border-color: #3b82f6 !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08) !important;
  background: #fdfeff;
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

.stat-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  margin-top: 2px;
  line-height: 1.1;
}

.stat-unit {
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 1px;
}

/* Filter panel */
.filter-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-icon-input {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.9rem;
}

.custom-search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 0.88rem;
  outline: none;
  transition: all 0.2s;
}

.custom-search-input:focus {
  border-color: #0047AB;
  box-shadow: 0 0 0 2px rgba(0, 71, 171, 0.1);
}

.date-picker-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 2px 8px;
}

.date-label {
  font-size: 0.76rem;
  color: #64748b;
  font-weight: 600;
  margin-right: 6px;
  white-space: nowrap;
}

.custom-datepicker :deep(.ant-picker) {
  border: none !important;
  box-shadow: none !important;
  padding: 4px 0 !important;
}

.custom-datepicker :deep(.ant-picker-input > input) {
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  color: #1e293b !important;
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-btn {
  border: none;
  background: transparent;
  padding: 6px 14px;
  border-radius: 7px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

/* Active Segmented Buttons */
.btn-all-active {
  background: #2563eb !important;
  color: #ffffff !important;
}

.btn-import-active {
  background: #eff6ff !important;
  color: #2563eb !important;
  border: 1px solid #bfdbfe;
}

.btn-export-active {
  background: #fff7ed !important;
  color: #ea580c !important;
  border: 1px solid #ffedd5;
}

.btn-adjust-active {
  background: #f1f5f9 !important;
  color: #475569 !important;
  border: 1px solid #cbd5e1;
}

.btn-destroy-active {
  background: #fef2f2 !important;
  color: #dc2626 !important;
  border: 1px solid #fca5a5;
}

.action-add-btn {
  height: 34px;
  border-radius: 7px;
  font-weight: 600;
  background: #0047AB;
  border-color: #0047AB;
}

.action-add-btn:hover {
  background: #003685 !important;
  border-color: #003685 !important;
}

/* Table Card */
.table-container-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  border: 1px solid #e2e8f0;
}

.table-container-card :deep(.ant-card-body) {
  padding: 16px 0 !important;
}

.history-table :deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid #e2e8f0;
}

.history-table :deep(.ant-table-tbody > tr) {
  cursor: pointer;
  transition: background-color 0.15s;
}

.history-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f1f5f9 !important;
}

.history-table :deep(.ant-table-cell) {
  padding: 12px 16px !important;
  font-size: 0.88rem;
  color: #334155;
}

/* Badges */
.custom-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: center;
}

.badge-import {
  background: #eff6ff;
  color: #2563eb;
}

.badge-export {
  background: #fff7ed;
  color: #ea580c;
}

.badge-adjust {
  background: #f1f5f9;
  color: #475569;
}

.badge-destroy {
  background: #fef2f2;
  color: #dc2626;
}

/* Code & Doc Links */
.code-link {
  font-weight: 700;
  color: #1e293b;
  transition: color 0.15s;
}

.code-link:hover {
  color: #0047AB;
  text-decoration: underline;
}

.doc-link {
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.doc-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.doc-import {
  color: #2563eb;
}

.doc-export {
  color: #ea580c;
}

.doc-other {
  color: #64748b;
}

/* Quantities */
.qty-text {
  font-weight: 700;
  font-size: 0.9rem;
}

.qty-pos {
  color: #2563eb;
}

.qty-neg {
  color: #dc2626;
}

/* Details modal info styling */
.modal-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.modal-title-code {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.lbl {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
}

.val {
  font-size: 0.92rem;
  color: #1e293b;
}

.font-semibold {
  font-weight: 600;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.code-blue {
  color: #0047AB;
  font-weight: 700;
}

.note-block {
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-top: 2px;
  font-style: italic;
  font-size: 0.86rem;
  color: #475569;
}

/* Admin Action Buttons */
.action-export-btn {
  height: 36px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  color: #16a34a;
  border-color: #bbf7d0;
  background: #f0fdf4;
  display: flex;
  align-items: center;
}

.action-export-btn:hover {
  background: #dcfce7 !important;
  border-color: #86efac !important;
  color: #15803d !important;
}

.action-refresh-btn {
  height: 36px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  color: #2563eb;
  border-color: #bfdbfe;
  background: #eff6ff;
  display: flex;
  align-items: center;
}

.action-refresh-btn:hover {
  background: #dbeafe !important;
  border-color: #93c5fd !important;
  color: #1d4ed8 !important;
}

/* View Details Action Button in Table */
.action-view-btn {
  color: #64748b;
  font-size: 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.action-view-btn:hover {
  color: #0047AB !important;
  background: #eff6ff !important;
}

/* Redesigned 4-group View Details Modal Styles */
.detail-section {
  margin-bottom: 24px;
}

.detail-section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0047AB;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 6px;
}

.detail-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.detail-full-width {
  grid-column: span 3;
}
</style>
