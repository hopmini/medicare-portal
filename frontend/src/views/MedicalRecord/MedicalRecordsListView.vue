<template>
  <div class="public-page" style="padding-top: 100px;">
    <Navbar />

    <div class="page-header" style="background: #0047AB; color: white; padding: 2.5rem 0; text-align: left;">
      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="margin: 0; font-size: 2.25rem; font-weight: 800; color: #ffffff !important;">
            <i class="fas fa-file-medical" /> Hồ sơ Bệnh án điện tử
          </h1>
          <p style="margin: 0.5rem 0 0 0; font-size: 1rem; color: rgba(255,255,255,0.9) !important; font-weight: 500;">
            {{ isAdmin ? 'Quản lý toàn bộ bệnh án trên hệ thống' : 'Tra cứu lịch sử khám chữa bệnh của bạn' }}
          </p>
        </div>
        <div style="display: flex; gap: 10px;">
          <router-link v-if="isAdmin" to="/dashboard?tab=medical-records" class="btn-book-now" style="background: white; color: #0047AB; padding: 0.8rem 1.6rem; border-radius: 8px; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <i class="fas fa-tachometer-alt" /> Dashboard
          </router-link>
          <router-link v-if="!isAdmin" to="/patient" class="btn-book-now" style="background: white; color: #0047AB; padding: 0.8rem 1.6rem; border-radius: 8px; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <i class="fas fa-calendar-plus" /> Đặt lịch khám mới
          </router-link>
        </div>
      </div>
    </div>

    <div class="container" style="padding: 2rem 1rem 4rem; max-width: 1200px; margin: 0 auto;">

      <!-- Search & Filter Bar -->
      <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end;">
          <div style="flex: 2; min-width: 200px;">
            <label style="font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 4px; display: block;">Tìm kiếm</label>
            <input v-model="searchQuery" type="text" class="form-input" placeholder="Tìm theo triệu chứng, chẩn đoán, bệnh nhân..." @input="onSearchDebounce" />
          </div>
          <div style="flex: 1; min-width: 140px;">
            <label style="font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 4px; display: block;">Mã ICD-10</label>
            <input v-model="filterDiagnosisCode" type="text" class="form-input" placeholder="Ví dụ: J45" @input="onSearchDebounce" />
          </div>
          <div style="min-width: 130px;">
            <label style="font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 4px; display: block;">Trạng thái</label>
            <select v-model="filterStatus" class="form-input" @change="loadRecords">
              <option value="">Tất cả</option>
              <option value="Active">Đang hoạt động</option>
              <option value="Completed">Hoàn tất</option>
              <option value="Closed">Đã đóng</option>
              <option value="Locked">Đã khóa</option>
            </select>
          </div>
          <div style="min-width: 120px;">
            <label style="font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 4px; display: block;">Từ ngày</label>
            <input v-model="filterDateFrom" type="date" class="form-input" @change="loadRecords" />
          </div>
          <div style="min-width: 120px;">
            <label style="font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 4px; display: block;">Đến ngày</label>
            <input v-model="filterDateTo" type="date" class="form-input" @change="loadRecords" />
          </div>
                  <div style="display: flex; gap: 8px; align-items: flex-end; padding-bottom: 1px;">
            <button class="btn-filter" @click="loadRecords"><i class="fas fa-search" /> Tìm</button>
            <button class="btn-filter btn-clear" @click="clearFilters"><i class="fas fa-undo" /> Reset</button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" style="text-align: center; padding: 4rem 0; color: #64748b;">
        <i class="fas fa-circle-notch fa-spin fa-2x" style="margin-bottom: 1rem;" />
        <p>Đang tải dữ liệu bệnh án...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" style="text-align: center; padding: 3rem 0; color: #dc2626;">
        <i class="fas fa-exclamation-circle fa-2x" style="margin-bottom: 1rem;" />
        <p>{{ error }}</p>
      </div>

      <!-- Empty -->
      <div v-else-if="records.length === 0" style="text-align: center; padding: 4rem 0; color: #94a3b8;">
        <i class="fas fa-folder-open fa-3x" style="margin-bottom: 1rem; color: #cbd5e1;" />
        <p style="font-size: 1.1rem;">{{ isAdmin ? 'Chưa có bệnh án nào trên hệ thống.' : 'Bạn chưa có bệnh án nào.' }}</p>
        <p v-if="!isAdmin" style="font-size: 0.9rem; margin-top: 0.5rem;">Sau khi đi khám, bác sĩ sẽ ghi nhận bệnh án tại đây.</p>
      </div>

      <!-- Records Table -->
      <div v-else style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
              <th style="padding: 12px 16px; text-align: left; font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Ngày</th>
              <th v-if="isAdmin" style="padding: 12px 16px; text-align: left; font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Bệnh nhân</th>
              <th style="padding: 12px 16px; text-align: left; font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Chẩn đoán</th>
              <th style="padding: 12px 16px; text-align: left; font-size: 0.75rem; color: #64748b; text-transform: uppercase;">ICD-10</th>
              <th style="padding: 12px 16px; text-align: center; font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Trạng thái</th>
              <th style="padding: 12px 16px; text-align: center; font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Đơn thuốc</th>
              <th style="padding: 12px 16px; text-align: center; font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rec in records" :key="rec.id" style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" @mouseenter="hover = rec.id" @mouseleave="hover = null">
              <td style="padding: 14px 16px; font-weight: 600; color: #334155;">
                {{ rec.createdAt ? formatDate(rec.createdAt) : '--' }}
              </td>
              <td v-if="isAdmin" style="padding: 14px 16px;">
                <div style="font-weight: 700; color: #0f172a;">{{ lookupPatientName(rec) }}</div>
                <div style="font-size: 0.75rem; color: #64748b; font-family: monospace;">{{ getPatientCode(rec) }}</div>
              </td>
              <td style="padding: 14px 16px; max-width: 250px;">
                <div style="font-weight: 700; color: #15803d; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ rec.diagnosis }}</div>
                <div v-if="rec.symptoms" style="font-size: 0.78rem; color: #64748b; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ rec.symptoms }}</div>
              </td>
              <td style="padding: 14px 16px;">
                <span v-if="rec.diagnosisCode" style="background: #eff6ff; color: #2563eb; padding: 2px 10px; border-radius: 12px; font-weight: 700; font-size: 0.8rem; font-family: monospace;">
                  {{ rec.diagnosisCode }}
                </span>
                <span v-else style="color: #cbd5e1; font-size: 0.8rem;">--</span>
              </td>
              <td style="padding: 14px 16px; text-align: center;">
                <span :style="statusBadgeStyle(rec.status || 'Active')">{{ rec.status || 'Active' }}</span>
              </td>
              <td style="padding: 14px 16px; text-align: center;">
                <span v-if="rec.prescription" :style="prescriptionBadgeStyle(rec.prescription.status)">
                  {{ prescriptionStatusText(rec.prescription.status) }}
                </span>
                <span v-else style="color: #cbd5e1; font-size: 0.8rem;">Không</span>
              </td>
              <td style="padding: 14px 16px; text-align: center;">
                <button class="btn-table-action btn-detail" @click="viewDetail(rec)">
                  <i class="fas fa-eye" /> Chi tiết
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="totalPages > 1" style="padding: 1rem; display: flex; justify-content: center; align-items: center; gap: 8px; border-top: 1px solid #e2e8f0;">
          <button class="pagination-btn" :disabled="page === 1" @click="page--; loadRecords()"><i class="fas fa-chevron-left" /> Trước</button>
          <span style="font-size: 0.85rem; color: #64748b; font-weight: 600; padding: 0 8px;">
            Trang {{ page }} / {{ totalPages }}
          </span>
          <button class="pagination-btn" :disabled="page === totalPages" @click="page++; loadRecords()">Sau <i class="fas fa-chevron-right" /></button>
        </div>
      </div>
    </div>

    <!-- Record Detail Modal -->
    <div v-if="selectedRecord" class="detail-modal-overlay" @click.self="selectedRecord = null">
      <div class="detail-modal-card animate-scale-up" style="width: 680px;">
        <div class="modal-header">
          <div class="modal-header__title">
            <span class="ref-code-lg">MÃ BỆNH ÁN #{{ String(selectedRecord.id || '').substring(0, 8).toUpperCase() }}</span>
            <h3>{{ selectedRecord.title || 'Chi tiết hồ sơ bệnh án' }}</h3>
          </div>
          <button class="modal-close-btn" @click="selectedRecord = null">&times;</button>
        </div>

        <div class="modal-body" style="gap: 1rem;">
          <!-- Patient Info (for admin) -->
          <div v-if="isAdmin" class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-user" /> Bệnh nhân</h4>
            <div class="symptom-box">
              <span class="cell-label">Họ tên:</span>
              <p class="symptom-text" style="font-weight: 700;">
                {{ lookupPatientName(selectedRecord) }}
              </p>
            </div>
            <div class="symptom-box">
              <span class="cell-label">Mã BN:</span>
              <p class="symptom-text" style="font-weight: 700; font-family: monospace;">
                {{ getPatientCode(selectedRecord) }}
              </p>
            </div>
            <div class="symptom-box">
              <span class="cell-label">Ngày khám:</span>
              <p class="symptom-text">{{ formatDate(selectedRecord.createdAt) }}</p>
            </div>
          </div>

          <!-- Vitals -->
          <div v-if="selectedRecord.weight || selectedRecord.height || selectedRecord.bloodPressure || selectedRecord.heartRate || selectedRecord.temperature" class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-heartbeat" /> Chỉ số sinh tồn</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px;">
              <div v-if="selectedRecord.weight" class="vital-chip"><strong>Cân nặng:</strong> {{ selectedRecord.weight }} kg</div>
              <div v-if="selectedRecord.height" class="vital-chip"><strong>Chiều cao:</strong> {{ selectedRecord.height }} cm</div>
              <div v-if="selectedRecord.bloodPressure" class="vital-chip"><strong>Huyết áp:</strong> {{ selectedRecord.bloodPressure }} mmHg</div>
              <div v-if="selectedRecord.heartRate" class="vital-chip"><strong>Nhịp tim:</strong> {{ selectedRecord.heartRate }} bpm</div>
              <div v-if="selectedRecord.temperature" class="vital-chip"><strong>Nhiệt độ:</strong> {{ selectedRecord.temperature }} °C</div>
            </div>
          </div>

          <!-- Clinical -->
          <div class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-stethoscope" /> Ghi nhận lâm sàng</h4>
            <div class="symptom-box">
              <span class="cell-label">Triệu chứng:</span>
              <p class="symptom-text">{{ selectedRecord.symptoms }}</p>
            </div>
            <div class="symptom-box" v-if="selectedRecord.diagnosis">
              <span class="cell-label">Chẩn đoán:</span>
              <p class="symptom-text" style="font-weight: 700; color: #15803d;">{{ selectedRecord.diagnosis }}</p>
            </div>
            <div class="symptom-box" v-if="selectedRecord.diagnosisCode">
              <span class="cell-label">Mã ICD-10:</span>
              <p class="symptom-text"><strong>{{ selectedRecord.diagnosisCode }}</strong><span v-if="selectedRecord.diagnosisCodeName" style="margin-left: 4px;">- {{ selectedRecord.diagnosisCodeName }}</span></p>
            </div>
            <div class="symptom-box" v-if="selectedRecord.notes">
              <span class="cell-label">Ghi chú:</span>
              <p class="symptom-text">{{ selectedRecord.notes }}</p>
            </div>
          </div>

          <!-- Custom Metrics -->
          <div v-if="selectedRecord.customMetricsJson && safeParseJson(selectedRecord.customMetricsJson).length > 0" class="clinical-section">
            <h4 class="section-heading"><i class="fas fa-file-medical-alt" /> Chỉ số dịch vụ khám</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 6px;">
              <div v-for="(metric, idx) in safeParseJson(selectedRecord.customMetricsJson)" :key="idx" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px;">
                <span style="font-size: 0.78rem; color: #64748b;">{{ metric.name }}:</span>
                <span style="font-weight: 800; color: #0047AB; margin-left: 4px;">{{ metric.value }}</span>
              </div>
            </div>
          </div>

          <!-- Prescription -->
          <div class="clinical-section" v-if="selectedRecord.prescription">
            <h4 class="section-heading"><i class="fas fa-prescription-bottle" /> Đơn thuốc</h4>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
              <span v-if="selectedRecord.prescription.status" :style="prescriptionBadgeStyle(selectedRecord.prescription.status)">{{ prescriptionStatusText(selectedRecord.prescription.status) }}</span>
              <span v-if="selectedRecord.prescription.expiryDate" style="font-size: 0.8rem; color: #64748b;">HSD: {{ formatDate(selectedRecord.prescription.expiryDate) }}</span>
            </div>
            <div v-if="selectedRecord.prescription.instructions" style="font-size: 0.85rem; color: #b91c1c; font-weight: 600; margin-bottom: 8px;">
              Lời dặn: {{ selectedRecord.prescription.instructions }}
            </div>
            <div v-for="(med, idx) in selectedRecord.prescription.details" :key="idx" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-weight: 800;">{{ idx + 1 }}. {{ med.medicationName }}</span>
                <span style="font-size: 0.8rem; color: #64748b; margin-left: 6px;">{{ med.dosage }}</span>
              </div>
              <span style="font-weight: 800; color: #b91c1c;">x{{ med.quantity }}</span>
            </div>
          </div>

          <!-- Discharge Summary -->
          <div class="clinical-section" v-if="selectedRecord.dischargeDate || selectedRecord.dischargeDiagnosis">
            <h4 class="section-heading"><i class="fas fa-hospital" /> Giấy ra viện</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div v-if="selectedRecord.admissionDate" class="symptom-box"><span class="cell-label">Nhập viện:</span><p class="symptom-text">{{ formatDate(selectedRecord.admissionDate) }}</p></div>
              <div v-if="selectedRecord.dischargeDate" class="symptom-box"><span class="cell-label">Xuất viện:</span><p class="symptom-text">{{ formatDate(selectedRecord.dischargeDate) }}</p></div>
            </div>
            <div v-if="selectedRecord.dischargeDiagnosis" class="symptom-box"><span class="cell-label">Chẩn đoán xuất viện:</span><p class="symptom-text">{{ selectedRecord.dischargeDiagnosis }}</p></div>
            <div v-if="selectedRecord.dischargeInstructions" class="symptom-box"><span class="cell-label">Lời dặn:</span><p class="symptom-text">{{ selectedRecord.dischargeInstructions }}</p></div>
            <div v-if="selectedRecord.followUpDate || selectedRecord.followUpClinic" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div v-if="selectedRecord.followUpClinic" class="symptom-box"><span class="cell-label">Phòng tái khám:</span><p class="symptom-text">{{ selectedRecord.followUpClinic }}</p></div>
              <div v-if="selectedRecord.followUpDate" class="symptom-box"><span class="cell-label">Ngày tái khám:</span><p class="symptom-text">{{ formatDate(selectedRecord.followUpDate) }}</p></div>
            </div>
          </div>

          <!-- Attachments -->
          <div class="clinical-section" v-if="selectedRecord.attachmentsJson && safeParseJson(selectedRecord.attachmentsJson).length > 0">
            <h4 class="section-heading"><i class="fas fa-paperclip" /> Tài liệu đính kèm</h4>
            <div v-for="(file, idx) in safeParseJson(selectedRecord.attachmentsJson)" :key="idx" style="margin-top: 6px;">
              <a :href="file.data" :download="file.name" style="background: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 8px 12px; display: flex; justify-content: space-between; text-decoration: none; color: #0047AB; font-weight: 700; font-size: 0.85rem;">
                <span><i class="far fa-file-alt" /> {{ file.name }}</span>
                <span style="font-size: 0.75rem;"><i class="fas fa-download" /> Tải về</span>
              </a>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-modal-close" @click="selectedRecord = null">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { medicalRecordService, mapUserIdToGuid } from '@/services/medicalRecordService'
import { medicalApi } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')
const records = ref<any[]>([])
const selectedRecord = ref<any>(null)
const patientMap = ref(new Map<string, any>())
const searchQuery = ref('')
const filterDiagnosisCode = ref('')
const filterStatus = ref('')
const filterDateFrom = ref('')
const filterDateTo = ref('')
const page = ref(1)
const totalPages = ref(1)
const pageSize = 20

const isAdmin = computed(() => (authStore.user?.role || '').toLowerCase() === 'admin')
const userPatientId = computed(() => {
  if (!isAdmin.value) {
    const id = authStore.user?.id
    return id ? mapUserIdToGuid(id) : null
  }
  return null
})

let searchTimer: any = null
function onSearchDebounce () {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { page.value = 1; loadRecords() }, 400)
}

async function loadRecords () {
  loading.value = true
  error.value = ''
  try {
    if (isAdmin.value) {
      const params: any = {}
      if (searchQuery.value) params.q = searchQuery.value
      if (filterDiagnosisCode.value) params.diagnosisCode = filterDiagnosisCode.value
      if (filterStatus.value) params.status = filterStatus.value
      if (filterDateFrom.value) params.dateFrom = filterDateFrom.value
      if (filterDateTo.value) params.dateTo = filterDateTo.value
      const qs = new URLSearchParams(params).toString()
      const res = await medicalApi.get(`/MedicalRecords?${qs}`)
      records.value = res.data || []
      totalPages.value = Math.max(1, Math.ceil(records.value.length / pageSize))
    } else {
      if (userPatientId.value) {
        records.value = await medicalRecordService.getRecordsByPatient(userPatientId.value)
      }
      totalPages.value = 1
    }
    records.value.sort((a: any, b: any) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return db - da
    })
    await loadPatientNames()
  } catch (e: any) {
    error.value = e.response?.data || 'Không thể tải dữ liệu bệnh án.'
    records.value = []
  } finally {
    loading.value = false
  }
}

function lookupPatientName (rec: any): string {
  if (rec.patientName) return rec.patientName
  if (rec.patient?.fullName) return rec.patient.fullName
  const key = rec.patientId?.toLowerCase()
  if (key && patientMap.value.has(key)) {
    return patientMap.value.get(key).fullName || '--'
  }
  if (rec.gatewayPatientId != null) {
    const gidKey = mapUserIdToGuid(String(rec.gatewayPatientId)).toLowerCase()
    if (patientMap.value.has(gidKey)) {
      return patientMap.value.get(gidKey).fullName || '--'
    }
    const rawKey = String(rec.gatewayPatientId)
    if (patientMap.value.has(rawKey)) {
      return patientMap.value.get(rawKey).fullName || '--'
    }
  }
  const numericId = parseInt(String(rec.patientId || '').split('-').pop() || '0', 10)
  if (numericId) {
    for (const [, p] of patientMap.value.entries()) {
      if (p.gatewayPatientId === numericId || p.id === numericId || String(p.id) === String(numericId)) {
        return p.fullName || '--'
      }
    }
  }
  return '--'
}

async function loadPatientNames () {
  try {
    const patients = await medicalRecordService.getAllPatients()
    const map = new Map<string, any>()
    patients.forEach((p: any) => {
      const normalized = {
        ...p,
        id: p.id || p.Id,
        fullName: p.fullName || p.FullName || p.full_name || '',
        gatewayPatientId: p.gatewayPatientId ?? p.GatewayPatientId
      }
      const pId = normalized.id
      if (pId) {
        const id = String(pId).toLowerCase()
        map.set(id, normalized)
        const gid = normalized.gatewayPatientId
        if (gid != null) {
          map.set(mapUserIdToGuid(String(gid)).toLowerCase(), normalized)
          map.set(String(gid), normalized)
        }
        const lastSeg = (id.split('-').pop() || '').replace(/^0+/, '')
        if (lastSeg && /^\d+$/.test(lastSeg)) {
          map.set(mapUserIdToGuid(lastSeg).toLowerCase(), normalized)
          map.set(lastSeg, normalized)
        }
        const numFromId = parseInt(id.split('-').pop() || '0', 10)
        if (numFromId) {
          map.set(mapUserIdToGuid(String(numFromId)).toLowerCase(), normalized)
          map.set(String(numFromId), normalized)
        }
      }
    })
    patientMap.value = map
  } catch (e) {
    console.error('Failed to load patient names:', e)
  }
}

function getPatientCode (rec: any): string {
  if (rec.gatewayPatientId) return `#${rec.gatewayPatientId}`
  const lastSeg = (rec.patientId || '').split('-').pop() || ''
  const num = parseInt(lastSeg, 10)
  return num ? `#${num}` : '--'
}

function viewDetail (rec: any) {
  selectedRecord.value = rec
}

function formatDate (d: string | Date) {
  if (!d) return '--'
  const date = new Date(d)
  return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function safeParseJson (json: string) {
  try { return JSON.parse(json) || [] } catch { return [] }
}

function prescriptionBadgeStyle (status: string) {
  const styles: Record<string, { background: string; color: string }> = {
    active: { background: '#dcfce7', color: '#16a34a' },
    completed: { background: '#dbeafe', color: '#2563eb' },
    cancelled: { background: '#fee2e2', color: '#dc2626' },
    expired: { background: '#f3f4f6', color: '#6b7280' }
  }
  return { padding: '2px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, ...(styles[status] || styles.expired) }
}

function statusBadgeStyle (status: string) {
  const s: Record<string, any> = {
    Active: { background: '#dcfce7', color: '#16a34a' },
    Completed: { background: '#dbeafe', color: '#2563eb' },
    Closed: { background: '#f3f4f6', color: '#6b7280' },
    Locked: { background: '#fee2e2', color: '#dc2626' },
    Draft: { background: '#fef3c7', color: '#d97706' }
  }
  const st = s[status] || s.Active
  return { padding: '2px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, ...st }
}

function prescriptionStatusText (status: string) {
  const texts: Record<string, string> = { active: 'Đang dùng', completed: 'Đã hoàn tất', cancelled: 'Đã hủy', expired: 'Hết hạn' }
  return texts[status] || 'Không xác định'
}

function clearFilters () {
  searchQuery.value = ''
  filterDiagnosisCode.value = ''
  filterStatus.value = ''
  filterDateFrom.value = ''
  filterDateTo.value = ''
  page.value = 1
  loadRecords()
}

onMounted(loadRecords)
</script>

<style scoped>
.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.88rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

.btn-filter {
  padding: 8px 16px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  height: 38px;
}
.btn-filter:hover { background: #1d4ed8; }
.btn-clear {
  background: white;
  color: #64748b;
  border-color: #d1d5db;
}
.btn-clear:hover { background: #f1f5f9; color: #334155; }

.btn-table-action {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  background: white;
  color: #374151;
}
.btn-table-action:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.detail-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(3px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.detail-modal-card {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 820px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(0,0,0,0.2);
}
.modal-header {
  background: #0047AB;
  color: white;
  padding: 1.25rem 1.75rem;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header__title h3 { margin: 4px 0 0; font-size: 1.1rem; font-weight: 700; color: white; }
.ref-code-lg { font-size: 0.7rem; font-weight: 700; opacity: 0.8; letter-spacing: 1px; }
.modal-close-btn { background: rgba(255,255,255,0.2); border: none; color: white; font-size: 1.5rem; cursor: pointer; border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transition: 0.15s; }
.modal-close-btn:hover { background: rgba(255,255,255,0.35); }
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.modal-footer {
  padding: 1rem 1.75rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.btn-modal-close {
  padding: 0.5rem 1.25rem;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.15s;
}
.btn-modal-close:hover { background: #e2e8f0; }

.clinical-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.25rem;
}
.section-heading {
  margin: 0 0 12px;
  font-size: 0.9rem;
  font-weight: 800;
  color: #0047AB;
  display: flex;
  align-items: center;
  gap: 6px;
}
.symptom-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 10px 14px;
}
.symptom-box + .symptom-box {
  margin-top: 8px;
}
.cell-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}
.symptom-text {
  margin: 4px 0 0;
  font-size: 0.88rem;
  color: #1f2937;
  line-height: 1.5;
}
.vital-chip {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 0.82rem;
}
.vital-chip strong { color: #64748b; }

.animate-scale-up {
  animation: scaleUp 0.25s ease;
}
@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

tbody tr:hover {
  background: #f8fafc;
}

.pagination-btn {
  padding: 6px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  transition: all 0.15s;
  font-size: 0.85rem;
}
.pagination-btn:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #94a3b8;
}
.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
