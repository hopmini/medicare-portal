<template>
  <a-layout style="min-height: 100vh; background: #f0f2f5;">
    <a-layout-sider width="260" theme="light">
      <PharmacySidebar />
    </a-layout-sider>
    
    <a-layout style="background: #f0f2f5;">
      <!-- Top header bar mimicking image -->
      <a-layout-header style="background: #ffffff; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f0f0f0; height: 64px;">
        <h2 style="margin: 0; font-weight: 700; color: #262626; font-size: 1.25rem;">Quản lý thuốc</h2>
        <div style="display: flex; align-items: center; gap: 20px;">
          <a-input-search v-model:value="search" placeholder="Tìm kiếm..." style="width: 240px;" @search="onSearch" allow-clear />
          <a-badge :count="3" dot>
            <i class="far fa-bell" style="font-size: 1.2rem; cursor: pointer; color: #8c8c8c;" />
          </a-badge>
          <div style="display: flex; align-items: center; gap: 8px;">
            <a-avatar size="small" style="background-color: #007d88;"><i class="fas fa-user" /></a-avatar>
            <span style="font-weight: 600; color: #262626; font-size: 0.9rem;">{{ userRole }}</span>
          </div>
        </div>
      </a-layout-header>

      <a-layout-content style="padding: 24px;">
        <a-spin :spinning="loading">
          <a-card :bordered="false" style="border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <a-row :gutter="[16, 16]" align="middle" style="margin-bottom: 16px;">
              <a-col :xs="24" :sm="14" style="display: flex; gap: 8px; flex-wrap: wrap;">
                <a-input-search v-model:value="search" placeholder="Tìm kiếm thuốc..." style="max-width: 320px;" allow-clear />
                <a-select v-model:value="selectedCategory" style="width: 140px" placeholder="Tất cả">
                  <a-select-option value="All">Tất cả</a-select-option>
                  <a-select-option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</a-select-option>
                </a-select>
              </a-col>
              <a-col :xs="24" :sm="10" style="text-align: right">
                <a-button type="primary" style="background-color: #007d88; border-color: #007d88; border-radius: 4px;" @click="openModal('add')">
                  <i class="fas fa-plus" style="margin-right: 6px;" /> Thêm thuốc
                </a-button>
              </a-col>
            </a-row>

            <a-table 
              :columns="columns" 
              :data-source="filteredMedicines" 
              row-key="id" 
              :pagination="{ pageSize: 8 }" 
              style="margin-top: 16px"
              class="custom-table"
            >
              <template #bodyCell="{ text, record, column }">
                <template v-if="column.key === 'price'">
                  {{ record.price.toLocaleString() }} đ
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a-button type="link" style="color: #007d88; padding: 0;" @click="openModal('edit', record)">
                      <i class="far fa-edit" />
                    </a-button>
                    <a-popconfirm title="Xóa thuốc này?" ok-text="Có" cancel-text="Không" @confirm="deleteMedicine(record.id)">
                      <a-button type="link" danger style="padding: 0;">
                        <i class="far fa-trash-alt" />
                      </a-button>
                    </a-popconfirm>
                  </a-space>
                </template>
              </template>
            </a-table>

            <!-- Modal Thêm/Sửa thuốc -->
            <a-modal v-model:visible="visible" :title="modalTitle" @ok="handleOk" @cancel="resetForm" ok-text="Xác nhận" cancel-text="Hủy">
              <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" layout="horizontal">
                <a-form-item label="Mã thuốc" :rules="[{ required: true }]">
                  <a-input v-model:value="form.code" placeholder="MED001" />
                </a-form-item>
                <a-form-item label="Tên thuốc" :rules="[{ required: true }]">
                  <a-input v-model:value="form.name" />
                </a-form-item>
                <a-form-item label="Danh mục">
                  <a-input v-model:value="form.category" />
                </a-form-item>
                <a-form-item label="Đơn giá">
                  <a-input-number v-model:value="form.price" :min="0" style="width: 100%" />
                </a-form-item>
                <a-form-item label="Tồn kho">
                  <a-input-number v-model:value="form.stock" :min="0" style="width: 100%" />
                </a-form-item>
                <a-form-item label="Đơn vị">
                  <a-input v-model:value="form.unit" placeholder="Viên" />
                </a-form-item>
              </a-form>
            </a-modal>
          </a-card>
        </a-spin>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue';
import { getMedicines } from '@/services/pharmacyService';
import PharmacySidebar from '@/components/PharmacySidebar.vue';

const authStore = useAuthStore()
const { user } = authStore
const userRole = computed(() => user.value?.role || 'Pharmacist')

interface Medicine {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
}

const loading = ref(false);
const medicines = ref<Medicine[]>([]);
const search = ref('');
const selectedCategory = ref('All');
const categories = ref<string[]>([]);

const visible = ref(false);
const isEdit = ref(false);
const editId = ref<number | null>(null);

const form = ref({
  code: '',
  name: '',
  category: '',
  price: 0,
  stock: 0,
  unit: 'Viên'
});

const modalTitle = computed(() => (isEdit.value ? 'Sửa thuốc' : 'Thêm thuốc mới'));

const columns = [
  { title: 'Mã thuốc', dataIndex: 'code', key: 'code', width: '120px' },
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Đơn giá', dataIndex: 'price', key: 'price', width: '120px' },
  { title: 'Tồn kho', dataIndex: 'stock', key: 'stock', width: '100px' },
  { title: 'Đơn vị', dataIndex: 'unit', key: 'unit', width: '100px' },
  { title: 'Thao tác', key: 'action', width: '100px', align: 'center' },
];

const filteredMedicines = computed(() => {
  let list = medicines.value;
  if (selectedCategory.value !== 'All') {
    list = list.filter(m => m.category === selectedCategory.value);
  }
  if (search.value) {
    const term = search.value.toLowerCase();
    list = list.filter(m => m.name.toLowerCase().includes(term) || m.code.toLowerCase().includes(term));
  }
  return list;
});

function onSearch(val: string) {
  search.value = val;
}

function openModal(mode: 'add' | 'edit', record?: Medicine) {
  isEdit.value = mode === 'edit';
  if (isEdit.value && record) {
    editId.value = record.id;
    form.value = { 
      code: record.code || `MED00${record.id}`,
      name: record.name, 
      category: record.category, 
      price: record.price, 
      stock: record.stock,
      unit: record.unit || 'Viên'
    };
  } else {
    editId.value = null;
    form.value = { code: '', name: '', category: '', price: 0, stock: 0, unit: 'Viên' };
  }
  visible.value = true;
}

function resetForm() {
  visible.value = false;
  editId.value = null;
}

function handleOk() {
  if (!form.value.name || !form.value.code) {
    message.error('Vui lòng điền mã và tên thuốc');
    return;
  }
  if (isEdit.value && editId.value !== null) {
    const idx = medicines.value.findIndex(m => m.id === editId.value);
    if (idx !== -1) {
      medicines.value[idx] = { id: editId.value, ...form.value };
    }
    message.success('Cập nhật thuốc thành công');
  } else {
    const newId = medicines.value.length ? Math.max(...medicines.value.map(m => m.id)) + 1 : 1;
    medicines.value.push({ id: newId, ...form.value });
    message.success('Thêm thuốc thành công');
  }
  resetForm();
}

function deleteMedicine(id: number) {
  medicines.value = medicines.value.filter(m => m.id !== id);
  message.success('Xóa thuốc thành công');
}

onMounted(async () => {
  loading.value = true;
  try {
    const data = await getMedicines();
    // Map existing structure to UI design schema
    medicines.value = data.map((item: any, idx: number) => ({
      id: item.id,
      code: `MED00${item.id}`,
      name: item.name + ' 500mg',
      category: item.category,
      price: item.price * 2000, // scaling price
      stock: item.stock,
      unit: 'Viên'
    }));
    
    // Extract unique categories
    const cats = new Set(medicines.value.map(m => m.category));
    categories.value = Array.from(cats);
  } catch (e) {
    message.error('Không tải được danh sách thuốc');
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
.search-row {
  margin-bottom: 12px;
}
</style>
