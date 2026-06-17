<template>
  <a-layout :style="inline ? 'background: transparent; min-height: auto;' : 'min-height: 100vh; background: #f8fafc;'">
    <!-- Sidebar -->
    <a-layout-sider v-if="!inline" width="260" theme="light" style="background: #ffffff; border-right: 1px solid #f0f4f9;">
      <PharmacySidebar />
    </a-layout-sider>

    <!-- Main Content Layout -->
    <a-layout :style="inline ? 'background: transparent;' : 'background: #f8fafc;'">
      <!-- App Header -->
      <AppHeader v-if="!inline" title="Tôn kho theo lô" />

      <!-- Content Container -->
      <a-layout-content :style="inline ? 'padding: 0;' : 'padding: 24px 28px;'">
        <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 20px; font-weight: 500;">
          Theo dõi số lượng tồn, hạn sử dụng và trạng thái từng lô thuốc trong kho
        </div>

        <!-- Metrics Widgets Cards mimicking design mockup -->
        <a-row :gutter="[20, 20]" style="margin-bottom: 24px;">
          <a-col :xs="24" :sm="12" :md="6">
            <div class="metric-widget shadow-light">
              <div class="metric-icon-box" style="background: #e8f0fe; color: #0047AB;">
                <i class="fas fa-boxes" />
              </div>
              <div class="metric-details">
                <span class="metric-title">Tổng số lô</span>
                <div class="metric-number-wrapper">
                  <span class="metric-value" style="color: #0047AB;">{{ totalLots }}</span>
                  <span class="metric-unit">lô</span>
                </div>
              </div>
            </div>
          </a-col>

          <a-col :xs="24" :sm="12" :md="6">
            <div class="metric-widget shadow-light">
              <div class="metric-icon-box" style="background: #fff7ed; color: #ea580c;">
                <i class="far fa-clock" />
              </div>
              <div class="metric-details">
                <span class="metric-title">Sắp hết hạn</span>
                <div class="metric-number-wrapper">
                  <span class="metric-value" style="color: #ea580c;">{{ nearExpiryLots }}</span>
                  <span class="metric-unit">lô</span>
                </div>
              </div>
            </div>
          </a-col>

          <a-col :xs="24" :sm="12" :md="6">
            <div class="metric-widget shadow-light">
              <div class="metric-icon-box" style="background: #fef2f2; color: #ef4444;">
                <i class="fas fa-exclamation-triangle" />
              </div>
              <div class="metric-details">
                <span class="metric-title">Đã hết hạn</span>
                <div class="metric-number-wrapper">
                  <span class="metric-value" style="color: #ef4444;">{{ expiredLots }}</span>
                  <span class="metric-unit">lô</span>
                </div>
              </div>
            </div>
          </a-col>

          <a-col :xs="24" :sm="12" :md="6">
            <div class="metric-widget shadow-light">
              <div class="metric-icon-box" style="background: #fffbeb; color: #d97706;">
                <i class="fas fa-exclamation-circle" />
              </div>
              <div class="metric-details">
                <span class="metric-title">Tôn thấp</span>
                <div class="metric-number-wrapper">
                  <span class="metric-value" style="color: #d97706;">{{ lowStockLots }}</span>
                  <span class="metric-unit">lô</span>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>

        <!-- Main Card Section containing table and filters -->
        <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <!-- Filter Tabs Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f0f0f0; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
            <div style="display: flex; gap: 32px;">
              <div 
                v-for="tab in filterTabs" 
                :key="tab.key" 
                :class="['filter-tab-item', activeFilter === tab.key ? 'active' : '']"
                @click="activeFilter = tab.key"
                style="padding: 12px 4px; font-weight: 700; cursor: pointer; position: relative; font-size: 0.92rem;"
              >
                {{ tab.title }}
                <div v-if="activeFilter === tab.key" class="active-indicator" style="position: absolute; bottom: -2px; left: 0; right: 0; height: 2px; background: #0047AB;" />
              </div>
            </div>

            <div style="display: flex; gap: 12px; margin-bottom: 8px;">
              <a-button @click="refreshData" style="border-radius: 6px; font-weight: 600; color: #596780; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-sync-alt" /> Làm mới
              </a-button>
              <a-button type="primary" style="background: #0047AB; border-color: #0047AB; border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-download" /> Xuất Excel
              </a-button>
            </div>
          </div>

          <!-- Secondary Filters Row mimicking mockup -->
          <a-row :gutter="[16, 16]" align="middle" style="margin-bottom: 24px;">
            <a-col :xs="24" :sm="8">
              <div style="font-size: 0.8rem; font-weight: 700; color: #475569; margin-bottom: 6px;">Tìm kiếm</div>
              <a-input-search v-model:value="searchQuery" placeholder="Tìm theo tên thuốc, mã thuốc, số lô..." allow-clear />
            </a-col>
            <a-col :xs="12" :sm="5">
              <div style="font-size: 0.8rem; font-weight: 700; color: #475569; margin-bottom: 6px;">Trạng thái</div>
              <a-select v-model:value="statusFilter" style="width: 100%;">
                <a-select-option value="all">Tất cả</a-select-option>
                <a-select-option value="normal">Còn hạn</a-select-option>
                <a-select-option value="near">Sắp hết hạn</a-select-option>
                <a-select-option value="expired">Hết hạn</a-select-option>
                <a-select-option value="low">Tồn thấp</a-select-option>
              </a-select>
            </a-col>
            <a-col :xs="12" :sm="5">
              <div style="font-size: 0.8rem; font-weight: 700; color: #475569; margin-bottom: 6px;">Thuốc</div>
              <a-select v-model:value="medFilter" style="width: 100%;">
                <a-select-option value="all">Tất cả thuốc</a-select-option>
                <a-select-option v-for="m in uniqueMeds" :key="m" :value="m">{{ m }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :xs="24" :sm="6">
              <div style="font-size: 0.8rem; font-weight: 700; color: #475569; margin-bottom: 6px;">Hạn sử dụng</div>
              <a-range-picker style="width: 100%;" />
            </a-col>
          </a-row>

          <!-- Table Container -->
          <a-table 
            :columns="tableColumns" 
            :data-source="filteredBatches" 
            row-key="id" 
            :pagination="{ pageSize: 8, showSizeChanger: true, locale: { items_per_page: '/ trang' } }" 
            size="middle"
            class="custom-table"
          >
            <template #bodyCell="{ text, record, column }">
              <!-- Expiry date styling -->
              <template v-if="column.key === 'expiry'">
                <span :style="{ color: getExpiryColor(record.status), fontWeight: '700' }">{{ record.expiryDate }}</span>
              </template>

              <!-- Stock color indicator -->
              <template v-else-if="column.key === 'stock'">
                <span :style="{ color: record.stock <= 75 ? '#ef4444' : '#1e293b', fontWeight: '700' }">
                  {{ record.stock.toLocaleString() }}
                </span>
              </template>

              <!-- Status Tag column -->
              <template v-else-if="column.key === 'status'">
                <a-tag :color="getStatusTagColor(record.status)" style="font-weight: 700; border-radius: 4px; padding: 2px 8px;">
                  {{ getStatusText(record.status) }}
                </a-tag>
              </template>

              <!-- Actions column -->
              <template v-else-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" style="padding: 0; color: #0047AB;" title="Xem chi tiết">
                    <i class="far fa-eye" />
                  </a-button>
                  <a-button type="link" style="padding: 0; color: #596780;" title="Nhật ký lô">
                    <i class="far fa-file-alt" />
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore';
const notif = useNotificationStore();
import { ref, computed, onMounted } from 'vue'
import PharmacySidebar from '@/components/PharmacySidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import { getMedicines, getImportBills } from '@/services/pharmacyService'

const props = withDefaults(
  defineProps<{
    inline?: boolean
  }>(),
  {
    inline: false
  }
)

interface BatchStock {
  id: number;
  medCode: string;
  name: string;
  batch: string;
  expiryDate: string;
  stock: number;
  unit: string;
  importDate: string;
  importCode: string;
  status: 'normal' | 'near' | 'expired' | 'low';
}

const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const medFilter = ref('all')
const activeFilter = ref('all')

const filterTabs = [
  { key: 'all', title: 'Tất cả' },
  { key: 'near', title: 'Sắp hết hạn' },
  { key: 'expired', title: 'Hết hạn' },
  { key: 'low', title: 'Tôn thấp' }
]

const tableColumns = [
  { title: 'Mã thuốc', dataIndex: 'medCode', key: 'medCode', width: '110px' },
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Số lô', dataIndex: 'batch', key: 'batch', width: '100px' },
  { title: 'Hạn sử dụng', dataIndex: 'expiryDate', key: 'expiry', width: '130px' },
  { title: 'Số lượng còn', dataIndex: 'stock', key: 'stock', width: '120px', align: 'right' },
  { title: 'Đơn vị', dataIndex: 'unit', key: 'unit', width: '90px' },
  { title: 'Ngày nhập', dataIndex: 'importDate', key: 'importDate', width: '120px' },
  { title: 'Mã phiếu nhập', dataIndex: 'importCode', key: 'importCode', width: '130px' },
  { title: 'Trạng thái', key: 'status', width: '130px', align: 'center' },
  { title: 'Thao tác', key: 'action', width: '100px', align: 'center' }
]

const batchList = ref<BatchStock[]>([])

const totalLots = computed(() => batchList.value.length)
const nearExpiryLots = computed(() => batchList.value.filter(b => b.status === 'near').length)
const expiredLots = computed(() => batchList.value.filter(b => b.status === 'expired').length)
const lowStockLots = computed(() => batchList.value.filter(b => b.status === 'low').length)

const uniqueMeds = computed(() => {
  return Array.from(new Set(batchList.value.map(b => b.name)))
})

const filteredBatches = computed(() => {
  let list = [...batchList.value]

  // Filter Tab Key
  if (activeFilter.value !== 'all') {
    list = list.filter(b => b.status === activeFilter.value)
  }

  // Filter dropdown state
  if (statusFilter.value !== 'all') {
    list = list.filter(b => b.status === statusFilter.value)
  }

  // Filter medicine name dropdown
  if (medFilter.value !== 'all') {
    list = list.filter(b => b.name === medFilter.value)
  }

  // Text search query
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(b => 
      b.name.toLowerCase().includes(q) || 
      b.medCode.toLowerCase().includes(q) || 
      b.batch.toLowerCase().includes(q)
    )
  }

  return list
})

function getExpiryColor(status: string) {
  if (status === 'expired') return '#ef4444' // red
  if (status === 'near') return '#d97706' // orange
  if (status === 'low') return '#ef4444' // red
  return '#10b981' // green
}

function getStatusTagColor(status: string) {
  if (status === 'expired') return 'error'
  if (status === 'near') return 'warning'
  if (status === 'low') return 'orange'
  return 'success'
}

function getStatusText(status: string) {
  if (status === 'expired') return 'Hết hạn'
  if (status === 'near') return 'Sắp hết hạn'
  if (status === 'low') return 'Tôn thấp'
  return 'Còn hạn'
}

async function loadRealBatches() {
  loading.value = true
  try {
    const [medicinesData, importBillsData] = await Promise.all([
      getMedicines(),
      getImportBills()
    ])

    const medicineStockMap: Record<string, { stock: number; code: string }> = {}
    medicinesData.forEach((m: any) => {
      if (m.name) {
        medicineStockMap[m.name.toLowerCase()] = {
          stock: m.stockQuantity ?? m.stock ?? 0,
          code: m.code
        }
      }
    })

    const list: BatchStock[] = []
    let tempId = 1

    if (importBillsData && importBillsData.length > 0) {
      importBillsData.forEach((bill: any) => {
        const billCode = bill.code || `PN${bill.id}`;
        const billDate = bill.date ? new Date(bill.date).toLocaleDateString('vi-VN') : '';
        
        (bill.medications || []).forEach((med: any) => {
          const medKey = med.name ? med.name.toLowerCase() : '';
          const currentStock = medicineStockMap[medKey]?.stock ?? med.qty;
          const medCode = med.code || medicineStockMap[medKey]?.code || 'MED001';

          let status: 'normal' | 'near' | 'expired' | 'low' = 'normal'
          if (currentStock <= 10) {
            status = 'low'
          } else if (med.expiryDate) {
            const expiry = new Date(med.expiryDate)
            const now = new Date()
            const diffTime = expiry.getTime() - now.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            if (diffDays < 0) {
              status = 'expired'
            } else if (diffDays <= 30) {
              status = 'near'
            }
          }

          list.push({
            id: med.id || tempId++,
            medCode: medCode,
            name: med.name,
            batch: med.batch || 'LO001',
            expiryDate: med.expiryDate ? new Date(med.expiryDate).toLocaleDateString('vi-VN') : '30/08/2026',
            stock: currentStock,
            unit: med.unit || 'Viên',
            importDate: billDate,
            importCode: billCode,
            status: status
          })
        })
      })
    }

    if (list.length === 0) {
      medicinesData.forEach((m: any, idx: number) => {
        let status: 'normal' | 'near' | 'expired' | 'low' = 'normal'
        const stockVal = m.stockQuantity ?? m.stock ?? 0
        if (stockVal <= 10) {
          status = 'low'
        } else if (m.expiryDate) {
          const expiry = new Date(m.expiryDate)
          const now = new Date()
          const diffTime = expiry.getTime() - now.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          if (diffDays < 0) {
            status = 'expired'
          } else if (diffDays <= 30) {
            status = 'near'
          }
        }

        list.push({
          id: m.id,
          medCode: m.code || `MED${String(m.id).padStart(3, '0')}`,
          name: m.name,
          batch: `LO${String(m.id).padStart(3, '0')}`,
          expiryDate: m.expiryDate ? new Date(m.expiryDate).toLocaleDateString('vi-VN') : '30/08/2026',
          stock: stockVal,
          unit: m.unit || 'Viên',
          importDate: '12/03/2025',
          importCode: `PN${String(100 + m.id)}`,
          status: status
        })
      })
    }

    batchList.value = list
  } catch (err) {
    console.error(err)
    notif.show({ type: 'error', message: 'Không tải được dữ liệu tồn kho theo lô từ máy chủ!' })
  } finally {
    loading.value = false
  }
}

function refreshData() {
  loadRealBatches()
  notif.show({ type: 'success', message: 'Đã cập nhật dữ liệu tồn kho theo lô mới nhất!' })
}

onMounted(() => {
  loadRealBatches()
})
</script>

<style scoped>
.metric-widget {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 90px;
  transition: all 0.2s;
}

.metric-widget:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 71, 171, 0.04);
}

.metric-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
}

.metric-details {
  display: flex;
  flex-direction: column;
}

.metric-title {
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 600;
}

.metric-number-wrapper {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.metric-value {
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.2;
}

.metric-unit {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
}

.filter-tab-item {
  color: #596780;
  transition: all 0.3s;
}

.filter-tab-item.active {
  color: #0047AB;
}

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
</style>
