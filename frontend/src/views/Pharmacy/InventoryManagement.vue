<template>
  <a-layout style="min-height: 100vh; background: #f0f2f5;">
    <a-layout-sider width="260" theme="light">
      <PharmacySidebar />
    </a-layout-sider>
    
    <a-layout style="background: #f0f2f5;">
      <!-- Top header bar -->
      <a-layout-header style="background: #ffffff; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f0f0f0; height: 64px;">
        <h2 style="margin: 0; font-weight: 700; color: #262626; font-size: 1.25rem;">Quản lý kho</h2>
        <div style="display: flex; align-items: center; gap: 20px;">
          <a-input-search v-model:value="search" placeholder="Tìm kiếm..." style="width: 240px;" @search="onSearch" allow-clear />
          <a-badge :count="3" dot>
            <i class="far fa-bell" style="font-size: 1.2rem; cursor: pointer; color: #8c8c8c;" />
          </a-badge>
          <div style="display: flex; align-items: center; gap: 8px;">
            <a-avatar size="small" style="background-color: #007d88;"><i class="fas fa-user" /></a-avatar>
            <span style="font-weight: 600; color: #262626; font-size: 0.9rem;">{{ authStore.user?.value?.fullName || 'Người dùng' }}</span>
          </div>
        </div>
      </a-layout-header>

      <a-layout-content style="padding: 24px;">
        <a-spin :spinning="loading">
          <a-card :bordered="false" style="border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <!-- Custom Tabs mirroring design style -->
            <div class="tabs-header" style="display: flex; border-bottom: 2px solid #f0f0f0; margin-bottom: 20px; gap: 32px;">
              <div 
                v-for="tab in tabs" 
                :key="tab.key" 
                :class="['tab-item', activeTab === tab.key ? 'active' : '']"
                @click="activeTab = tab.key"
                style="padding: 12px 4px; font-weight: 600; cursor: pointer; position: relative;"
              >
                {{ tab.title }}
                <div v-if="activeTab === tab.key" class="active-indicator" style="position: absolute; bottom: -2px; left: 0; right: 0; height: 2px; background: #007d88;" />
              </div>
            </div>

            <!-- Tab Content: Nhập thuốc / Xuất thuốc -->
            <div v-if="activeTab === 'in' || activeTab === 'out'" style="max-width: 600px; padding: 12px 0;">
              <h3 style="margin-bottom: 20px; font-weight: bold;">{{ activeTab === 'in' ? 'Nhập kho thuốc' : 'Xuất kho thuốc' }}</h3>
              <a-form :model="form" layout="vertical" @submit.prevent="submitForm">
                <a-form-item label="Chọn thuốc">
                  <a-select v-model:value="form.medicine" placeholder="Chọn thuốc..." show-search>
                    <a-select-option v-for="m in medicineOptions" :key="m" :value="m">{{ m }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="Số lượng">
                  <a-input-number v-model:value="form.qty" :min="1" style="width: 100%;" />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" style="background: #007d88; border-color: #007d88;" html-type="submit">
                    {{ activeTab === 'in' ? 'Xác nhận nhập kho' : 'Xác nhận xuất kho' }}
                  </a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- Tab Content: Lịch sử giao dịch -->
            <div v-else>
              <a-row :gutter="[16, 16]" align="middle" style="margin-bottom: 16px;">
                <a-col :xs="24" :sm="14" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                  <a-input-search v-model:value="search" placeholder="Tìm kiếm giao dịch..." style="max-width: 280px;" allow-clear />
                  <a-select v-model:value="typeFilter" style="width: 130px">
                    <a-select-option value="all">Tất cả loại</a-select-option>
                    <a-select-option value="in">Nhập kho</a-select-option>
                    <a-select-option value="out">Xuất kho</a-select-option>
                  </a-select>
                  <a-range-picker style="width: 260px;" />
                </a-col>
              </a-row>

              <a-table
                :columns="columns"
                :data-source="filteredTransactions"
                row-key="id"
                :pagination="{ pageSize: 8 }"
                class="custom-table"
              >
                <template #bodyCell="{ text, record, column }">
                  <template v-if="column.key === 'type'">
                    {{ record.type === 'in' ? 'Nhập' : 'Xuất' }}
                  </template>
                </template>
              </a-table>
            </div>
          </a-card>
        </a-spin>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useAuthStore } from '@/stores/authStore'
import { getInventoryTransactions } from '@/services/pharmacyService';
import PharmacySidebar from '@/components/PharmacySidebar.vue';

interface Transaction {
  id: number;
  code: string;
  type: 'in' | 'out';
  medicine: string;
  qty: number;
  date: string;
  pharmacist: string;
}

const authStore = useAuthStore()
const loading = ref(false);

const transactions = ref<Transaction[]>([]);
const search = ref('');
const typeFilter = ref('all');
const activeTab = ref('history');

const tabs = [
  { key: 'in', title: 'Nhập thuốc' },
  { key: 'out', title: 'Xuất thuốc' },
  { key: 'history', title: 'Lịch sử giao dịch' }
];

const medicineOptions = ['Paracetamol 500mg', 'Amoxicillin 500mg', 'Vitamin C 500mg', 'Ibuprofen 400mg', 'Cetirizine 10mg'];

const form = ref({
  medicine: '',
  qty: 1
});

const columns = [
  { title: 'Mã GD', dataIndex: 'code', key: 'code', width: '120px' },
  { title: 'Loại', dataIndex: 'type', key: 'type', width: '100px' },
  { title: 'Tên thuốc', dataIndex: 'medicine', key: 'medicine' },
  { title: 'Số lượng', dataIndex: 'qty', key: 'qty', width: '120px' },
  { title: 'Ngày giao dịch', dataIndex: 'date', key: 'date', width: '180px' },
  { title: 'Người thực hiện', dataIndex: 'pharmacist', key: 'pharmacist', width: '150px' }
];

const filteredTransactions = computed(() => {
  let list = transactions.value;
  if (typeFilter.value !== 'all') {
    list = list.filter(t => t.type === typeFilter.value);
  }
  if (search.value) {
    const term = search.value.toLowerCase();
    list = list.filter(t => t.medicine.toLowerCase().includes(term) || t.code.toLowerCase().includes(term));
  }
  return list;
});

function onSearch(value: string) {
  search.value = value;
}

function submitForm() {
  if (!form.value.medicine) {
    message.error('Vui lòng chọn thuốc');
    return;
  }
  const newId = transactions.value.length ? Math.max(...transactions.value.map(t => t.id)) + 1 : 1;
  const newTx: Transaction = {
    id: newId,
    code: `GD000${40 + newId}`,
    type: activeTab.value as 'in' | 'out',
    medicine: form.value.medicine,
    qty: form.value.qty,
    date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour12: false }).substring(0, 5),
    pharmacist: authStore.user?.value?.fullName || 'User'
  };
  transactions.value.unshift(newTx);
  message.success('Đã ghi nhận giao dịch kho thành công!');
  form.value = { medicine: '', qty: 1 };
  activeTab.value = 'history';
}

onMounted(async () => {
  loading.value = true;
  try {
    const data = await getInventoryTransactions();
    transactions.value = data.map((t: any, idx: number) => ({
      id: t.id,
      code: `GD0004${t.id}`,
      type: t.type,
      medicine: t.medicine + ' 500mg',
      qty: t.qty < 0 ? -t.qty : t.qty,
      date: '18/05/2025 ' + (idx === 0 ? '10:00' : '09:30'),
      pharmacist: authStore.user?.value?.fullName || 'User'
    }));
  } catch (e) {
    message.error('Không tải được giao dịch kho');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.custom-table :deep(.ant-table-thead > tr > th) {
  background-color: #fcfcfc;
  font-weight: 600;
  color: #595959;
}
.tab-item {
  color: #595959;
  transition: all 0.3s;
}
.tab-item.active {
  color: #007d88;
}
</style>
