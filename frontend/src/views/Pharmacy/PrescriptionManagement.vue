<template>
  <a-layout style="min-height: 100vh;">
    <a-layout-sider collapsible>
      <PharmacySidebar />
    </a-layout-sider>
    <a-layout-content style="padding: 24px;">
      <a-spin :spinning="loading">
        <a-card title="Quản lý đơn thuốc" class="prescription-management">
          <a-row :gutter="[16, 16]" align="middle" class="search-row">
            <a-col :xs="24" :sm="12">
              <a-input-search v-model:value="search" placeholder="Tìm bệnh nhân hoặc thuốc..." @search="onSearch" allow-clear />
            </a-col>
          </a-row>
          <a-table :columns="columns" :data-source="filteredPrescriptions" row-key="id" :pagination="{ pageSize: 8 }" style="margin-top: 16px" />
        </a-card>
      </a-spin>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import PharmacySidebar from '@/components/PharmacySidebar.vue';
import { getPrescriptions } from '@/services/pharmacyService';

interface Prescription {
  id: number;
  patient: string;
  medicine: string;
  dosage: string;
  date: string;
}

const loading = ref(false);
const prescriptions = ref<Prescription[]>([]);
const search = ref('');

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Bệnh nhân', dataIndex: 'patient', key: 'patient' },
  { title: 'Thuốc', dataIndex: 'medicine', key: 'medicine' },
  { title: 'Liều lượng', dataIndex: 'dosage', key: 'dosage' },
  { title: 'Ngày kê đơn', dataIndex: 'date', key: 'date' },
];

const filteredPrescriptions = computed(() => {
  if (!search.value) return prescriptions.value;
  const term = search.value.toLowerCase();
  return prescriptions.value.filter(
    p => p.patient.toLowerCase().includes(term) || p.medicine.toLowerCase().includes(term)
  );
});

function onSearch(val: string) {
  search.value = val;
}

onMounted(async () => {
  loading.value = true;
  try {
    const data = await getPrescriptions();
    prescriptions.value = data;
  } catch (e) {
    message.error('Không tải được danh sách đơn thuốc');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.prescription-management { max-width: 1200px; margin: 0 auto; }
.search-row { margin-bottom: 12px; }
</style>
