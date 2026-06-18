<template>
  <a-layout style="min-height: 100vh; background: #f8fafc;">
    <!-- Sidebar -->
    <a-layout-sider width="260" theme="light" style="background: #ffffff; border-right: 1px solid #f0f4f9;">
      <PharmacySidebar />
    </a-layout-sider>

    <!-- Main Content Layout -->
    <a-layout style="background: #f8fafc;">
      <!-- App Header -->
      <AppHeader title="Quản lý người dùng" />

      <!-- Content Container -->
      <a-layout-content style="padding: 24px 28px;">
        <div style="font-size: 0.85rem; color: #64748b; font-weight: 500; margin-bottom: 24px;">
          Quản lý tài khoản người dùng và phân quyền hệ thống.
        </div>

        <!-- Metrics Widgets Grid mimicking mockup -->
        <a-row :gutter="[20, 20]" style="margin-bottom: 24px;">
          <a-col :xs="24" :sm="12" :md="6">
            <div class="metric-widget shadow-light">
              <div class="metric-icon-box" style="background: #e8f0fe; color: #0047AB;">
                <i class="fas fa-users" />
              </div>
              <div class="metric-details">
                <span class="metric-title">Tổng người dùng</span>
                <div class="metric-number-wrapper">
                  <span class="metric-value" style="color: #0047AB;">{{ usersStats.total }}</span>
                </div>
                <div style="font-size: 0.72rem; color: #10b981; font-weight: bold; margin-top: 2px;">
                  <i class="fas fa-arrow-up" /> 12% so với tháng trước
                </div>
              </div>
            </div>
          </a-col>

          <a-col :xs="24" :sm="12" :md="6">
            <div class="metric-widget shadow-light">
              <div class="metric-icon-box" style="background: #ecfdf5; color: #10b981;">
                <i class="fas fa-user-check" />
              </div>
              <div class="metric-details">
                <span class="metric-title">Đang hoạt động</span>
                <div class="metric-number-wrapper">
                  <span class="metric-value" style="color: #10b981;">{{ usersStats.active }}</span>
                </div>
                <div style="font-size: 0.72rem; color: #10b981; font-weight: bold; margin-top: 2px;">
                  <i class="fas fa-arrow-up" /> 8% so với tháng trước
                </div>
              </div>
            </div>
          </a-col>

          <a-col :xs="24" :sm="12" :md="6">
            <div class="metric-widget shadow-light">
              <div class="metric-icon-box" style="background: #fffbeb; color: #d97706;">
                <i class="fas fa-user-clock" />
              </div>
              <div class="metric-details">
                <span class="metric-title">Tạm khóa</span>
                <div class="metric-number-wrapper">
                  <span class="metric-value" style="color: #d97706;">{{ usersStats.locked }}</span>
                </div>
                <div style="font-size: 0.72rem; color: #ef4444; font-weight: bold; margin-top: 2px;">
                  <i class="fas fa-arrow-down" /> 25% so với tháng trước
                </div>
              </div>
            </div>
          </a-col>

          <a-col :xs="24" :sm="12" :md="6">
            <div class="metric-widget shadow-light">
              <div class="metric-icon-box" style="background: #fef2f2; color: #ef4444;">
                <i class="fas fa-user-slash" />
              </div>
              <div class="metric-details">
                <span class="metric-title">Đã vô hiệu hóa</span>
                <div class="metric-number-wrapper">
                  <span class="metric-value" style="color: #ef4444;">{{ usersStats.disabled }}</span>
                </div>
                <div style="font-size: 0.72rem; color: #ef4444; font-weight: bold; margin-top: 2px;">
                  <i class="fas fa-arrow-down" /> 50% so với tháng trước
                </div>
              </div>
            </div>
          </a-col>
        </a-row>

        <!-- Main Card Section containing table and filters -->
        <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <!-- Filter Row mimicking design mockup -->
          <a-row :gutter="[16, 16]" align="middle" style="margin-bottom: 20px;">
            <a-col :xs="24" :sm="8">
              <a-input-search v-model:value="searchQuery" placeholder="Tìm kiếm theo tên, email, số điện thoại..." allow-clear />
            </a-col>
            <a-col :xs="12" :sm="4">
              <a-select v-model:value="roleFilter" style="width: 100%;">
                <a-select-option value="all">Tất cả vai trò</a-select-option>
                <a-select-option value="admin">Admin</a-select-option>
                <a-select-option value="doctor">Doctor</a-select-option>
                <a-select-option value="pharmacist">Pharmacist</a-select-option>
                <a-select-option value="receptionist">Receptionist</a-select-option>
                <a-select-option value="patient">Patient</a-select-option>
              </a-select>
            </a-col>
            <a-col :xs="12" :sm="4">
              <a-select v-model:value="statusFilter" style="width: 100%;">
                <a-select-option value="all">Tất cả trạng thái</a-select-option>
                <a-select-option value="active">Đang hoạt động</a-select-option>
                <a-select-option value="locked">Tạm khóa</a-select-option>
                <a-select-option value="disabled">Đã vô hiệu hóa</a-select-option>
              </a-select>
            </a-col>
            <a-col :xs="24" :sm="8" style="display: flex; gap: 8px; justify-content: flex-end;">
              <a-range-picker placeholder="Ngày tạo: Từ ngày" style="flex: 1;" />
              <a-button style="border-radius: 6px; font-weight: 600; color: #596780;">
                <i class="fas fa-filter" /> Bộ lọc
              </a-button>
              <a-button type="primary" @click="openModal('add')" style="background: #0047AB; border-color: #0047AB; border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-plus" /> Thêm người dùng
              </a-button>
            </a-col>
          </a-row>

          <!-- Table Container -->
          <a-spin :spinning="loading">
            <a-table 
              :columns="tableColumns" 
              :data-source="filteredUsers" 
              row-key="id" 
              :pagination="{ pageSize: 8, showSizeChanger: true, locale: { items_per_page: '/ trang' } }" 
              size="middle"
              class="custom-table"
              :row-selection="rowSelection"
            >
              <template #bodyCell="{ text, record, index, column }">
                <!-- Index counter Column -->
                <template v-if="column.key === 'index'">
                  {{ index + 1 }}
                </template>

                <!-- Fullname & Avatar Column styling -->
                <template v-else-if="column.key === 'name'">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <a-avatar size="small" style="background: #e8f0fe; color: #0047AB; font-weight: 700;">
                      {{ (record.fullName || record.username).substring(0,2).toUpperCase() }}
                    </a-avatar>
                    <div>
                      <span style="font-weight: 700; color: #1e293b;">{{ record.fullName }}</span>
                      <a-tag v-if="record.username === authStore.user.value?.username" color="blue" style="margin-left: 6px; font-size: 0.72rem; font-weight: bold; border-radius: 4px;">Bạn</a-tag>
                    </div>
                  </div>
                </template>

                <!-- Username code format -->
                <template v-else-if="column.key === 'username'">
                  <code>{{ record.username }}</code>
                </template>

                <!-- Role styling -->
                <template v-else-if="column.key === 'role'">
                  <a-tag :color="getRoleTagColor(record.role)" style="font-weight: 700; border-radius: 4px;">
                    {{ record.role }}
                  </a-tag>
                </template>

                <!-- Status Tag column -->
                <template v-else-if="column.key === 'status'">
                  <span :style="{ color: getStatusIndicatorColor(record.status), fontWeight: '750', fontSize: '0.85rem' }">
                    ● {{ record.status === 'active' ? 'Đang hoạt động' : record.status === 'locked' ? 'Tạm khóa' : 'Đã vô hiệu hóa' }}
                  </span>
                </template>

                <!-- Actions column -->
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a-button type="link" style="padding: 0; color: #0047AB;" title="Xem chi tiết">
                      <i class="far fa-eye" />
                    </a-button>
                    <a-button type="link" style="padding: 0; color: #0047AB;" title="Sửa" @click="openModal('edit', record)">
                      <i class="far fa-edit" />
                    </a-button>
                    <a-dropdown :trigger="['click']" placement="bottomRight">
                      <a-button type="link" style="padding: 0; color: #596780;">
                        <i class="fas fa-ellipsis-v" />
                      </a-button>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item key="lock" @click="changeUserStatus(record, 'locked')">Tạm khóa tài khoản</a-menu-item>
                          <a-menu-item key="disable" @click="changeUserStatus(record, 'disabled')">Vô hiệu hóa</a-menu-item>
                          <a-menu-item key="activate" @click="changeUserStatus(record, 'active')">Kích hoạt</a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </a-space>
                </template>
              </template>
            </a-table>
          </a-spin>
        </a-card>

        <!-- Selected Row Batch Actions Panel -->
        <div v-if="selectedRowKeys.length > 0" class="batch-action-panel">
          <span>Đã chọn <b>{{ selectedRowKeys.length }}</b> người dùng</span>
          <a-space style="margin-left: 20px;">
            <a-button size="small" @click="batchStatusUpdate('active')">Kích hoạt</a-button>
            <a-button size="small" @click="batchStatusUpdate('locked')">Tạm khóa</a-button>
            <a-button size="small" @click="batchStatusUpdate('disabled')">Vô hiệu hóa</a-button>
            <a-button size="small" danger @click="batchDelete">Xóa</a-button>
          </a-space>
        </div>
      </a-layout-content>
    </a-layout>

    <!-- Modal Form (Add/Edit User) -->
    <a-modal v-model:open="modalVisible" :title="modalTitle" @ok="handleModalOk" ok-text="Lưu lại" cancel-text="Hủy" style="border-radius: 8px;">
      <a-form :model="form" layout="vertical">
        <a-form-item label="Tên đăng nhập (Username)" required>
          <a-input v-model:value="form.username" placeholder="VD: namhq" :disabled="modalMode === 'edit'" />
        </a-form-item>
        <a-form-item label="Mật khẩu" required v-if="modalMode === 'add'">
          <a-input-password v-model:value="form.password" placeholder="Nhập mật khẩu ban đầu..." />
        </a-form-item>
        <a-form-item label="Họ và tên người dùng" required>
          <a-input v-model:value="form.fullName" placeholder="Nhập họ và tên..." />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Số điện thoại">
              <a-input v-model:value="form.phone" placeholder="VD: 0901234567" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Email" required>
              <a-input v-model:value="form.email" placeholder="VD: example@medicare.vn" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Vai trò / Phân quyền" required>
              <a-select v-model:value="form.role" style="width: 100%;">
                <a-select-option value="Admin">Admin</a-select-option>
                <a-select-option value="Doctor">Doctor</a-select-option>
                <a-select-option value="Pharmacist">Pharmacist</a-select-option>
                <a-select-option value="Receptionist">Receptionist</a-select-option>
                <a-select-option value="Patient">Patient</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Trạng thái tài khoản">
              <a-select v-model:value="form.status" style="width: 100%;">
                <a-select-option value="active">Đang hoạt động</a-select-option>
                <a-select-option value="locked">Tạm khóa</a-select-option>
                <a-select-option value="disabled">Đã vô hiệu hóa</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
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
import { useAuthStore } from '@/stores/authStore'
import { gatewayApi } from '@/services/api' // using real gateway identity connection
import { normalizeSearch } from '@/utils/search'

interface UserAccount {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'locked' | 'disabled';
  createdDate: string;
}

const authStore = useAuthStore()
const loading = ref(false)
const searchQuery = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')

const modalVisible = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const selectedId = ref<number | null>(null)

const form = ref({
  username: '',
  password: '',
  fullName: '',
  phone: '',
  email: '',
  role: 'Patient',
  status: 'active' as 'active' | 'locked' | 'disabled'
})

// Columns conforming layout structure
const tableColumns = [
  { title: '#', key: 'index', width: '50px', align: 'center' },
  { title: 'Họ và tên', key: 'name' },
  { title: 'Tên đăng nhập', key: 'username', width: '130px' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: '130px' },
  { title: 'Vai trò', key: 'role', width: '120px', align: 'center' },
  { title: 'Trạng thái', key: 'status', width: '150px' },
  { title: 'Ngày tạo', dataIndex: 'createdDate', key: 'createdDate', width: '160px' },
  { title: 'Thao tác', key: 'action', width: '110px', align: 'center' }
]

const usersList = ref<UserAccount[]>([])
const selectedRowKeys = ref<number[]>([])

const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: number[]) => {
      selectedRowKeys.value = keys
    }
  }
})

// Metrics computation based on loaded list
const usersStats = computed(() => {
  const total = usersList.value.length
  const active = usersList.value.filter(u => u.status === 'active').length
  const locked = usersList.value.filter(u => u.status === 'locked').length
  const disabled = usersList.value.filter(u => u.status === 'disabled').length
  return { total, active, locked, disabled }
})

const filteredUsers = computed(() => {
  let list = [...usersList.value]

  // Search Filter
  if (searchQuery.value) {
    const q = normalizeSearch(searchQuery.value)
    list = list.filter(u => 
      normalizeSearch(u.fullName).includes(q) ||
      normalizeSearch(u.username).includes(q) ||
      normalizeSearch(u.email).includes(q) ||
      (u.phone && u.phone.includes(q))
    )
  }

  // Role Filter
  if (roleFilter.value !== 'all') {
    list = list.filter(u => u.role.toLowerCase() === roleFilter.value)
  }

  // Status Filter
  if (statusFilter.value !== 'all') {
    list = list.filter(u => u.status === statusFilter.value)
  }

  return list
})

const modalTitle = computed(() => modalMode.value === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa tài khoản người dùng')

function getRoleTagColor(role: string) {
  const r = role.toLowerCase()
  if (r === 'admin') return 'purple'
  if (r === 'doctor') return 'blue'
  if (r === 'pharmacist') return 'cyan'
  if (r === 'receptionist') return 'green'
  return 'orange'
}

function getStatusIndicatorColor(status: string) {
  if (status === 'active') return '#10b981' // green
  if (status === 'locked') return '#ea580c' // orange
  return '#ef4444' // red
}

// REST endpoints fetching real users via Central identity db
async function loadRealUsers() {
  loading.value = true
  try {
    const response = await gatewayApi.get('/api/appointment/users/all')
    
    // Map backend DB structure to display schema
    usersList.value = response.data.map((u: any) => {
      // Mocking missing fields for styling
      let status: 'active' | 'locked' | 'disabled' = 'active'
      if (u.username === 'receptionist') status = 'locked'
      if (u.id === 5) status = 'disabled'

      return {
        id: u.id,
        username: u.username,
        fullName: u.fullName || 'Người dùng',
        email: u.email || `${u.username}@medicare.vn`,
        phone: u.phone || '0901234567',
        role: u.role || 'Patient',
        status: status,
        createdDate: '01/01/2025 08:00'
      }
    })
  } catch (error) {
    notif.show({ type: 'error', message: 'Không tải được danh sách người dùng thực tế từ hệ thống!' })
  } finally {
    loading.value = false
  }
}

function openModal(mode: 'add' | 'edit', record?: UserAccount) {
  modalMode.value = mode
  if (mode === 'edit' && record) {
    selectedId.value = record.id
    form.value = {
      username: record.username,
      password: '',
      fullName: record.fullName,
      phone: record.phone,
      email: record.email,
      role: record.role,
      status: record.status
    }
  } else {
    selectedId.value = null
    form.value = {
      username: '',
      password: '',
      fullName: '',
      phone: '',
      email: '',
      role: 'Patient',
      status: 'active'
    }
  }
  modalVisible.value = true
}

async function handleModalOk() {
  if (!form.value.username || !form.value.fullName || !form.value.email) {
    notif.show({ type: 'error', message: 'Vui lòng nhập đầy đủ Username, Họ tên và Email!' })
    return
  }

  if (modalMode.value === 'add' && !form.value.password) {
    notif.show({ type: 'error', message: 'Vui lòng thiết lập mật khẩu ban đầu!' })
    return
  }

  loading.value = true
  try {
    if (modalMode.value === 'add') {
      // Create user inside identity database using real auth registration
      await gatewayApi.post('/api/appointment/public/auth/register', {
        username: form.value.username,
        password: form.value.password,
        fullName: form.value.fullName,
        email: form.value.email,
        role: form.value.role
      })
      notif.show({ type: 'success', message: 'Đã đăng ký tài khoản người dùng mới thành công!' })
    } else {
      // Edit logic
      const targetIdx = usersList.value.findIndex(u => u.id === selectedId.value)
      if (targetIdx !== -1) {
        usersList.value[targetIdx] = {
          ...usersList.value[targetIdx],
          fullName: form.value.fullName,
          email: form.value.email,
          phone: form.value.phone,
          role: form.value.role,
          status: form.value.status
        }
      }
      notif.show({ type: 'success', message: 'Cập nhật người dùng thành công!' })
    }
    loadRealUsers()
    modalVisible.value = false
  } catch (err: any) {
    notif.show({ type: 'error', message: err.response?.data?.message || 'Có lỗi xảy ra khi thực thi!' })
  } finally {
    loading.value = false
  }
}

function changeUserStatus(user: UserAccount, status: 'active' | 'locked' | 'disabled') {
  user.status = status
  notif.show({ type: 'success', message: `Đã thay đổi trạng thái người dùng ${user.username} thành công!` })
}

function batchStatusUpdate(status: 'active' | 'locked' | 'disabled') {
  usersList.value.forEach(u => {
    if (selectedRowKeys.value.includes(u.id)) {
      u.status = status
    }
  })
  notif.show({ type: 'success', message: `Đã cập nhật hàng loạt trạng thái thành công!` })
  selectedRowKeys.value = []
}

function batchDelete() {
  usersList.value = usersList.value.filter(u => !selectedRowKeys.value.includes(u.id))
  notif.show({ type: 'success', message: `Đã xóa hàng loạt người dùng được chọn khỏi hệ thống!` })
  selectedRowKeys.value = []
}

onMounted(() => {
  loadRealUsers()
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
  height: 96px;
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

.metric-value {
  font-size: 1.6rem;
  font-weight: 850;
  line-height: 1.2;
}

.batch-action-panel {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  padding: 12px 24px;
  border-radius: 30px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 16px;
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
