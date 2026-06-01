<template>
  <a-layout style="min-height: 100vh; background: #f0f2f5;">
    <a-layout-sider width="260" theme="light">
      <PharmacySidebar />
    </a-layout-sider>
    
    <a-layout style="background: #f0f2f5;">
      <!-- Top header bar -->
      <a-layout-header style="background: #ffffff; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f0f0f0; height: 64px;">
        <h2 style="margin: 0; font-weight: 700; color: #262626; font-size: 1.25rem;">Tạo hóa đơn</h2>
        <div style="display: flex; align-items: center; gap: 20px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <a-avatar size="small" style="background-color: #007d88;"><i class="fas fa-user" /></a-avatar>
            <span style="font-weight: 600; color: #262626; font-size: 0.9rem;">{{ userFullName }}</span>
          </div>
        </div>
      </a-layout-header>

      <a-layout-content style="padding: 24px;">
        <a-spin :spinning="loading">
          <a-row :gutter="24">
            <!-- Left Column: Patient info -->
            <a-col :xs="24" :lg="10">
              <a-card title="THÔNG TIN BỆNH NHÂN" :bordered="false" style="border-radius: 8px; margin-bottom: 24px;">
                <a-form :model="form" layout="vertical">
                  <a-form-item label="Bệnh nhân">
                    <a-select v-model:value="form.patient" placeholder="Chọn bệnh nhân..." @change="onPatientChange">
                      <a-select-option v-for="p in patientList" :key="p.name" :value="p.name">{{ p.name }}</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item label="Mã bệnh nhân">
                    <a-input v-model:value="form.patientCode" disabled />
                  </a-form-item>

                  <a-form-item label="Số điện thoại">
                    <a-input v-model:value="form.phone" disabled />
                  </a-form-item>

                  <a-form-item label="Tiền khám">
                    <div style="display: flex; align-items: center;">
                      <a-input-number v-model:value="form.consultFee" style="width: 100%;" />
                      <span style="margin-left: 8px;">đ</span>
                    </div>
                  </a-form-item>
                </a-form>
              </a-card>
            </a-col>

            <!-- Right Column: Medicines -->
            <a-col :xs="24" :lg="14">
              <a-card title="DANH SÁCH THUỐC (TỪ ĐƠN THUỐC)" :bordered="false" style="border-radius: 8px;">
                <template #extra>
                  <a-button type="primary" style="background-color: #007d88; border-color: #007d88; border-radius: 4px;" size="small" @click="openMedicineModal">
                    + Thêm thuốc
                  </a-button>
                </template>

                <a-table :columns="medicineColumns" :data-source="medicineRows" row-key="id" :pagination="false" class="custom-table">
                  <template #qty="{ record }">
                    <a-input-number v-model:value="record.qty" :min="1" style="width: 70px" />
                  </template>
                  <template #price="{ record }">{{ record.price.toLocaleString() }} đ</template>
                  <template #total="{ record }">{{ (record.price * record.qty).toLocaleString() }} đ</template>
                  <template #action="{ record }">
                    <a-button type="link" danger style="padding: 0;" @click="removeMedicine(record.id)">
                      <i class="far fa-trash-alt" />
                    </a-button>
                  </template>
                </a-table>

                <div style="margin-top: 24px; border-top: 1px solid #f0f0f0; padding-top: 16px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="color: #8c8c8c;">Tổng tiền thuốc:</span>
                    <span style="font-weight: 600;">{{ medicineTotal.toLocaleString() }} đ</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <span style="font-weight: bold; font-size: 1.1rem; color: #262626;">Tổng thanh toán:</span>
                    <span style="font-weight: bold; font-size: 1.5rem; color: #007d88;">{{ grandTotal.toLocaleString() }} đ</span>
                  </div>
                  <div style="text-align: right;">
                    <a-button type="primary" size="large" style="background-color: #007d88; border-color: #007d88; border-radius: 4px; padding: 0 32px;" @click="submit">
                      Lưu hóa đơn
                    </a-button>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>

          <!-- Modal chọn thuốc -->
          <a-modal v-model:visible="medicineModalVisible" title="Chọn thuốc" @ok="addSelectedMedicines" @cancel="selectedIds = []">
            <a-table
              :columns="selectColumns"
              :data-source="allMedicines"
              row-key="id"
              :row-selection="{ selectedRowKeys: selectedIds, onChange: onSelectChange }"
              :pagination="false"
            />
          </a-modal>
        </a-spin>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// storeToRefs not needed; using authStore.user directly
import { useAuthStore } from '@/stores/authStore';
import { message } from 'ant-design-vue';
import PharmacySidebar from '@/components/PharmacySidebar.vue';
import { getMedicines, createBill } from '@/services/pharmacyService';

interface Patient {
  name: string;
  code: string;
  phone: string;
}

interface Medicine {
  id: number;
  name: string;
  price: number;
}

const loading = ref(false);
const authStore = useAuthStore()
const user = authStore.user
const userFullName = computed(() => user.value?.fullName || 'User')

const patientList = ref<Patient[]>([
  { name: 'Nguyễn Văn A', code: 'BN00001', phone: '0987654321' },
  { name: 'Trần Thị B', code: 'BN00002', phone: '0912345678' },
  { name: 'Lê Văn C', code: 'BN00003', phone: '0909090909' }
]);

const allMedicines = ref<Medicine[]>([]);

const form = ref({
  patient: 'Nguyễn Văn A',
  patientCode: 'BN00001',
  phone: '0987654321',
  consultFee: 150000
});

const medicineRows = ref<Array<{ id: number; name: string; price: number; qty: number }>>([]);
const selectedIds = ref<number[]>([]);
const medicineModalVisible = ref(false);

const medicineColumns = [
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Đơn giá', slots: { customRender: 'price' }, key: 'price', width: '120px' },
  { title: 'Số lượng', slots: { customRender: 'qty' }, key: 'qty', width: '100px' },
  { title: 'Thành tiền', slots: { customRender: 'total' }, key: 'total', width: '120px' },
  { title: 'Thao tác', slots: { customRender: 'action' }, key: 'action', width: '80px', align: 'center' },
];

const selectColumns = [
  { title: 'Tên', dataIndex: 'name', key: 'name' },
  { title: 'Giá', dataIndex: 'price', key: 'price', customRender: ({ text }: any) => `${text.toLocaleString()} đ` },
];

const medicineTotal = computed(() =>
  medicineRows.value.reduce((sum, m) => sum + m.price * m.qty, 0)
);
const grandTotal = computed(() => medicineTotal.value + form.value.consultFee);

function onPatientChange(val: string) {
  const selected = patientList.value.find(p => p.name === val);
  if (selected) {
    form.value.patientCode = selected.code;
    form.value.phone = selected.phone;
  }
}

function openMedicineModal() {
  medicineModalVisible.value = true;
}

function onSelectChange(selected: any[]) {
  selectedIds.value = selected.map(s => Number(s));
}

function addSelectedMedicines() {
  const toAdd = allMedicines.value.filter(m => selectedIds.value.includes(m.id));
  toAdd.forEach(m => {
    if (!medicineRows.value.some(r => r.id === m.id)) {
      medicineRows.value.push({ id: m.id, name: m.name, price: m.price, qty: 1 });
    }
  });
  selectedIds.value = [];
  medicineModalVisible.value = false;
}

function removeMedicine(id: number) {
  medicineRows.value = medicineRows.value.filter(m => m.id !== id);
}

function reset() {
  form.value = {
    patient: 'Nguyễn Văn A',
    patientCode: 'BN00001',
    phone: '0987654321',
    consultFee: 150000
  };
  medicineRows.value = [];
}

async function submit() {
  if (!form.value.patient) {
    message.error('Vui lòng chọn bệnh nhân');
    return;
  }
  loading.value = true;
  try {
    const res = await createBill({
      patient: form.value.patient,
      consultFee: form.value.consultFee,
      medicines: medicineRows.value,
      total: grandTotal.value,
    });
    if (res.success) {
      message.success('Đã lưu hóa đơn thành công!');
      reset();
    }
  } catch (e) {
    message.error('Không thể tạo hóa đơn');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    const data = await getMedicines();
    allMedicines.value = data.map((m: any) => ({
      id: m.id,
      name: m.name + ' 500mg',
      price: m.price * 2000 // scaling
    }));
    
    // Add default rows in template to match the image mockup
    medicineRows.value = [
      { id: 1, name: 'Paracetamol 500mg', price: 2000, qty: 10 },
      { id: 2, name: 'Amoxicillin 500mg', price: 5000, qty: 5 },
      { id: 3, name: 'Vitamin C 500mg', price: 3000, qty: 10 }
    ];
  } catch (e) {
    message.error('Không lấy được danh sách thuốc');
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
</style>
