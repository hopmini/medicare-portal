<template>
  <!-- Inline wrapper for Dashboard integration -->
  <div v-if="inline" style="background: transparent; padding: 0;">
    <!-- Breadcrumbs at top -->
    <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 20px; font-weight: 500; display: flex; align-items: center; justify-content: space-between;">
      <div>
        Trang chủ <span style="margin: 0 4px; color: #cbd5e1;">&gt;</span> <span style="color: #0f172a; font-weight: 600;">Nhà cung cấp</span>
      </div>
      <a-button type="primary" @click="openModal('add')" style="background: #0047AB; border-color: #0047AB; border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px; height: 38px;">
        <i class="fas fa-plus" /> Thêm nhà cung cấp
      </a-button>
    </div>

    <div style="font-size: 0.85rem; color: #64748b; font-weight: 500; margin-top: -12px; margin-bottom: 20px;">
      Quản lý danh sách nhà cung cấp thuốc và vật tư y tế.
    </div>

    <!-- Filter Row mimicking design mockup -->
    <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); border: 1px solid #e2e8f0; margin-bottom: 24px;">
      <a-row :gutter="[16, 16]" align="middle">
        <a-col :xs="24" :sm="8">
          <a-input-search v-model:value="searchQuery" placeholder="Tìm kiếm theo mã, tên, số điện thoại..." allow-clear />
        </a-col>
        <a-col :xs="12" :sm="5">
          <a-select v-model:value="statusFilter" style="width: 100%;">
            <a-select-option value="all">Tất cả trạng thái</a-select-option>
            <a-select-option value="active">Hoạt động</a-select-option>
            <a-select-option value="inactive">Ngừng hoạt động</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="12" :sm="5">
          <a-select v-model:value="groupFilter" style="width: 100%;">
            <a-select-option value="all">Nhóm nhà cung cấp</a-select-option>
            <a-select-option value="Dược phẩm">Dược phẩm</a-select-option>
            <a-select-option value="Thiết bị y tế">Thiết bị y tế</a-select-option>
            <a-select-option value="Vật tư y tế">Vật tư y tế</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="6" style="display: flex; gap: 8px;">
          <a-range-picker style="flex: 1;" :placeholder="['Từ ngày', 'Đến ngày']" />
          <a-button style="border-radius: 6px; font-weight: 600; color: #596780; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-filter" /> Bộ lọc
          </a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- Suppliers List Table -->
    <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); border: 1px solid #e2e8f0; margin-bottom: 24px;">
      <a-table 
        :columns="tableColumns" 
        :data-source="filteredSuppliers" 
        row-key="id" 
        :pagination="{ pageSize: 8, showSizeChanger: true, locale: { items_per_page: '/ trang' } }" 
        size="middle"
        class="custom-table"
      >
        <template #bodyCell="{ text, record, column }">
          <!-- Name Column styling -->
          <template v-if="column.key === 'name'">
            <span style="font-weight: 700; color: #1e293b;">{{ record.name }}</span>
          </template>

          <!-- Address Column styling with truncation -->
          <template v-else-if="column.key === 'address'">
            <div style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="record.address">
              {{ record.address }}
            </div>
          </template>

          <!-- Status Tag column -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'active' ? 'success' : 'error'" style="font-weight: 700; border-radius: 4px; padding: 2px 8px;">
              {{ record.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
            </a-tag>
          </template>

          <!-- Actions column -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" style="padding: 0; color: #0047AB;" title="Xem chi tiết" @click="openModal('view', record)">
                <i class="far fa-eye" />
              </a-button>
              <a-button type="link" style="padding: 0; color: #0047AB;" title="Sửa" @click="openModal('edit', record)">
                <i class="far fa-edit" />
              </a-button>
              <a-popconfirm title="Xóa nhà cung cấp này?" ok-text="Có" cancel-text="Không" @confirm="deleteSupplier(record.id)">
                <a-button type="link" danger style="padding: 0;" title="Xóa">
                  <i class="far fa-trash-alt" />
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Modal Form (Add/Edit Supplier) -->
    <a-modal v-model:open="modalVisible" :title="modalTitle" @ok="handleModalOk" ok-text="Lưu lại" cancel-text="Hủy" style="border-radius: 8px;" :footer="modalMode === 'view' ? null : undefined">
      <a-form :model="form" layout="vertical">
        <a-form-item label="Mã nhà cung cấp" required>
          <a-input v-model:value="form.code" placeholder="VD: NCC008" :disabled="modalMode === 'edit' || modalMode === 'view'" />
        </a-form-item>
        <a-form-item label="Tên nhà cung cấp" required>
          <a-input v-model:value="form.name" placeholder="Nhập tên nhà cung cấp..." :disabled="modalMode === 'view'" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Số điện thoại" required>
              <a-input v-model:value="form.phone" placeholder="VD: 024 xxxx xxxx" :disabled="modalMode === 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Email">
              <a-input v-model:value="form.email" placeholder="VD: info@company.com" :disabled="modalMode === 'view'" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Nhóm nhà cung cấp">
              <a-select v-model:value="form.group" style="width: 100%;" :disabled="modalMode === 'view'">
                <a-select-option value="Dược phẩm">Dược phẩm</a-select-option>
                <a-select-option value="Thiết bị y tế">Thiết bị y tế</a-select-option>
                <a-select-option value="Vật tư y tế">Vật tư y tế</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Trạng thái hoạt động">
              <a-select v-model:value="form.status" style="width: 100%;" :disabled="modalMode === 'view'">
                <a-select-option value="active">Hoạt động</a-select-option>
                <a-select-option value="inactive">Ngừng hoạt động</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Địa chỉ">
          <a-input v-model:value="form.address" placeholder="Nhập địa chỉ nhà cung cấp..." :disabled="modalMode === 'view'" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

  <a-layout v-else style="min-height: 100vh; background: #f8fafc;">
    <!-- Sidebar -->
    <a-layout-sider width="260" theme="light" style="background: #ffffff; border-right: 1px solid #f0f4f9;">
      <PharmacySidebar />
    </a-layout-sider>

    <!-- Main Content Layout -->
    <a-layout style="background: #f8fafc;">
      <!-- App Header with page context title -->
      <AppHeader title="Nhà cung cấp" />

      <!-- Content Area -->
      <a-layout-content style="padding: 24px 28px;">
        <!-- Breadcrumbs at top -->
        <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 20px; font-weight: 500; display: flex; align-items: center; justify-content: space-between;">
          <div>
            Trang chủ <span style="margin: 0 4px; color: #cbd5e1;">&gt;</span> <span style="color: #0f172a; font-weight: 600;">Nhà cung cấp</span>
          </div>
          <a-button type="primary" @click="openModal('add')" style="background: #0047AB; border-color: #0047AB; border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px; height: 38px;">
            <i class="fas fa-plus" /> Thêm nhà cung cấp
          </a-button>
        </div>

        <div style="font-size: 0.85rem; color: #64748b; font-weight: 500; margin-top: -12px; margin-bottom: 20px;">
          Quản lý danh sách nhà cung cấp thuốc và vật tư y tế.
        </div>

        <!-- Filter Row mimicking design mockup -->
        <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <a-row :gutter="[16, 16]" align="middle">
            <a-col :xs="24" :sm="8">
              <a-input-search v-model:value="searchQuery" placeholder="Tìm kiếm theo mã, tên, số điện thoại..." allow-clear />
            </a-col>
            <a-col :xs="12" :sm="5">
              <a-select v-model:value="statusFilter" style="width: 100%;">
                <a-select-option value="all">Tất cả trạng thái</a-select-option>
                <a-select-option value="active">Hoạt động</a-select-option>
                <a-select-option value="inactive">Ngừng hoạt động</a-select-option>
              </a-select>
            </a-col>
            <a-col :xs="12" :sm="5">
              <a-select v-model:value="groupFilter" style="width: 100%;">
                <a-select-option value="all">Nhóm nhà cung cấp</a-select-option>
                <a-select-option value="Dược phẩm">Dược phẩm</a-select-option>
                <a-select-option value="Thiết bị y tế">Thiết bị y tế</a-select-option>
                <a-select-option value="Vật tư y tế">Vật tư y tế</a-select-option>
              </a-select>
            </a-col>
            <a-col :xs="24" :sm="6" style="display: flex; gap: 8px;">
              <a-range-picker style="flex: 1;" :placeholder="['Từ ngày', 'Đến ngày']" />
              <a-button style="border-radius: 6px; font-weight: 600; color: #596780; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-filter" /> Bộ lọc
              </a-button>
            </a-col>
          </a-row>
        </a-card>

        <!-- Suppliers List Table -->
        <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <a-spin :spinning="loading">
          <a-empty v-if="!loading && filteredSuppliers.length === 0" description="Không có nhà cung cấp nào" />
          <a-table v-if="filteredSuppliers.length > 0"
            :columns="tableColumns" 
            :data-source="filteredSuppliers" 
            row-key="id" 
            :pagination="{ pageSize: 8, showSizeChanger: true, locale: { items_per_page: '/ trang' } }" 
            size="middle"
            class="custom-table"
          >
            <template #bodyCell="{ text, record, column }">
              <!-- Name Column styling -->
              <template v-if="column.key === 'name'">
                <span style="font-weight: 700; color: #1e293b;">{{ record.name }}</span>
              </template>

              <!-- Address Column styling with truncation -->
              <template v-else-if="column.key === 'address'">
                <div style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="record.address">
                  {{ record.address }}
                </div>
              </template>

              <!-- Status Tag column -->
              <template v-else-if="column.key === 'status'">
                <a-tag :color="record.status === 'active' ? 'success' : 'error'" style="font-weight: 700; border-radius: 4px; padding: 2px 8px;">
                  {{ record.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </a-tag>
              </template>

              <!-- Actions column -->
              <template v-else-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" style="padding: 0; color: #0047AB;" title="Xem chi tiết" @click="openModal('view', record)">
                    <i class="far fa-eye" />
                  </a-button>
                  <a-button type="link" style="padding: 0; color: #0047AB;" title="Sửa" @click="openModal('edit', record)">
                    <i class="far fa-edit" />
                  </a-button>
                  <a-popconfirm title="Xóa nhà cung cấp này?" ok-text="Có" cancel-text="Không" @confirm="deleteSupplier(record.id)">
                    <a-button type="link" danger style="padding: 0;" title="Xóa">
                      <i class="far fa-trash-alt" />
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
          </a-spin>
        </a-card>
      </a-layout-content>
    </a-layout>

    <!-- Modal Form (Add/Edit Supplier) -->
    <a-modal v-model:open="modalVisible" :title="modalTitle" @ok="handleModalOk" ok-text="Lưu lại" cancel-text="Hủy" style="border-radius: 8px;" :footer="modalMode === 'view' ? null : undefined">
      <a-form :model="form" layout="vertical">
        <a-form-item label="Mã nhà cung cấp" required>
          <a-input v-model:value="form.code" placeholder="VD: NCC008" :disabled="modalMode === 'edit' || modalMode === 'view'" />
        </a-form-item>
        <a-form-item label="Tên nhà cung cấp" required>
          <a-input v-model:value="form.name" placeholder="Nhập tên nhà cung cấp..." :disabled="modalMode === 'view'" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Số điện thoại" required>
              <a-input v-model:value="form.phone" placeholder="VD: 024 xxxx xxxx" :disabled="modalMode === 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Email">
              <a-input v-model:value="form.email" placeholder="VD: info@company.com" :disabled="modalMode === 'view'" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Nhóm nhà cung cấp">
              <a-select v-model:value="form.group" style="width: 100%;" :disabled="modalMode === 'view'">
                <a-select-option value="Dược phẩm">Dược phẩm</a-select-option>
                <a-select-option value="Thiết bị y tế">Thiết bị y tế</a-select-option>
                <a-select-option value="Vật tư y tế">Vật tư y tế</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Trạng thái hoạt động">
              <a-select v-model:value="form.status" style="width: 100%;" :disabled="modalMode === 'view'">
                <a-select-option value="active">Hoạt động</a-select-option>
                <a-select-option value="inactive">Ngừng hoạt động</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Địa chỉ">
          <a-input v-model:value="form.address" placeholder="Nhập địa chỉ nhà cung cấp..." :disabled="modalMode === 'view'" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore';
const notif = useNotificationStore();
import { ref, computed, onMounted } from 'vue'
import PharmacySidebar from '@/components/PharmacySidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier as apiDeleteSupplier } from '@/services/pharmacyService'

const props = withDefaults(
  defineProps<{
    inline?: boolean
  }>(),
  {
    inline: false
  }
)

interface Supplier {
  id: number;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  group: string;
  status: 'active' | 'inactive';
  createdDate: string;
}

const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const groupFilter = ref('all')

const modalVisible = ref(false)
const modalMode = ref<'add' | 'edit' | 'view'>('add')
const selectedId = ref<number | null>(null)

const form = ref({
  code: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  group: 'Dược phẩm',
  status: 'active' as 'active' | 'inactive'
})

const tableColumns = [
  { title: 'Mã NCC', dataIndex: 'code', key: 'code', width: '110px' },
  { title: 'Tên nhà cung cấp', dataIndex: 'name', key: 'name' },
  { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: '130px' },
  { title: 'Email', dataIndex: 'email', key: 'email', width: '180px' },
  { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
  { title: 'Nhóm NCC', dataIndex: 'group', key: 'group', width: '130px' },
  { title: 'Trạng thái', key: 'status', width: '130px', align: 'center' },
  { title: 'Ngày tạo', dataIndex: 'createdDate', key: 'createdDate', width: '120px' },
  { title: 'Thao tác', key: 'action', width: '120px', align: 'center' }
]

const supplierList = ref<Supplier[]>([])

const filteredSuppliers = computed(() => {
  let list = [...supplierList.value]

  if (statusFilter.value !== 'all') {
    list = list.filter(s => s.status === statusFilter.value)
  }

  if (groupFilter.value !== 'all') {
    list = list.filter(s => s.group === groupFilter.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.code.toLowerCase().includes(q) || 
      s.phone.includes(q)
    )
  }

  return list
})

const modalTitle = computed(() => modalMode.value === 'add' ? 'Thêm nhà cung cấp mới' : (modalMode.value === 'view' ? 'Chi tiết nhà cung cấp' : 'Chỉnh sửa nhà cung cấp'))

async function loadSuppliers() {
  loading.value = true
  try {
    const data = await getSuppliers()
    supplierList.value = data.map((s: any) => ({
      id: s.id,
      code: s.code,
      name: s.name,
      phone: s.phone,
      email: s.email,
      address: s.address,
      group: s.group,
      status: s.status,
      createdDate: s.createdDate ? new Date(s.createdDate).toLocaleDateString('vi-VN') : 'Vừa xong'
    }))
  } catch (e) {
    console.error('Failed to load suppliers:', e)
    supplierList.value = []
  } finally {
    loading.value = false
  }
}

function openModal(mode: 'add' | 'edit' | 'view', record?: Supplier) {
  modalMode.value = mode
  if ((mode === 'edit' || mode === 'view') && record) {
    selectedId.value = record.id
    form.value = {
      code: record.code,
      name: record.name,
      phone: record.phone,
      email: record.email,
      address: record.address,
      group: record.group,
      status: record.status
    }
  } else {
    selectedId.value = null
    const nextCodeNum = supplierList.value.length + 1
    form.value = {
      code: `NCC${String(nextCodeNum).padStart(3, '0')}`,
      name: '',
      phone: '',
      email: '',
      address: '',
      group: 'Dược phẩm',
      status: 'active'
    }
  }
  modalVisible.value = true
}

async function handleModalOk() {
  if (!form.value.code || !form.value.name || !form.value.phone) {
    notif.show({ type: 'error', message: 'Vui lòng điền đầy đủ các thông tin bắt buộc (Mã, Tên, SĐT)' })
    return
  }

  try {
    if (modalMode.value === 'edit' && selectedId.value !== null) {
      await updateSupplier(selectedId.value, {
        code: form.value.code,
        name: form.value.name,
        phone: form.value.phone,
        email: form.value.email,
        address: form.value.address,
        group: form.value.group,
        status: form.value.status
      })
      notif.show({ type: 'success', message: 'Cập nhật thông tin nhà cung cấp thành công!' })
    } else {
      await createSupplier({
        code: form.value.code,
        name: form.value.name,
        phone: form.value.phone,
        email: form.value.email,
        address: form.value.address,
        group: form.value.group,
        status: form.value.status
      })
      notif.show({ type: 'success', message: 'Thêm nhà cung cấp mới thành công!' })
    }
    await loadSuppliers()
    modalVisible.value = false
  } catch (err) {
    notif.show({ type: 'error', message: 'Thao tác thất bại!' })
  }
}

async function deleteSupplier(id: number) {
  try {
    await apiDeleteSupplier(id)
    notif.show({ type: 'success', message: 'Đã xóa nhà cung cấp khỏi hệ thống!' })
    await loadSuppliers()
  } catch (err) {
    notif.show({ type: 'error', message: 'Xóa nhà cung cấp thất bại!' })
  }
}

onMounted(() => {
  loadSuppliers()
})
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
</style>
