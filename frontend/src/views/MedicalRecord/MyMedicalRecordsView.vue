<template>
  <div class="public-page">
    <Navbar />

    <div class="page-header" style="background: linear-gradient(135deg, #002244 0%, #0047AB 100%); color: white; padding: 2.5rem 0; text-align: left;">
      <div class="container" style="max-width: 1100px; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="margin: 0; font-size: 2.25rem; font-weight: 800; letter-spacing: -0.5px;">Lịch sử khám & Đơn thuốc</h1>
          <p style="margin: 0.5rem 0 0 0; font-size: 1rem; color: rgba(255,255,255,0.85); font-weight: 500;">
            Tra cứu toàn bộ lịch sử bệnh án và các toa thuốc y khoa do bác sĩ chỉ định.
          </p>
        </div>
        <router-link to="/patient" class="btn-book-now" style="background: white; color: #0047AB; padding: 0.8rem 1.6rem; border-radius: 8px; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transition: 0.2s;">
          <i class="fas fa-calendar-plus" /> Đặt lịch khám mới
        </router-link>
      </div>
    </div>

    <div class="container" style="padding: 2rem 1rem 4rem 1rem; max-width: 1100px; margin: 0 auto;">
      
      <!-- Patient Information Summary Card (Read-only) -->
      <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; margin-bottom: 2.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.01); display: grid; grid-template-columns: auto 1fr; gap: 2rem; align-items: center;">
        <div style="background: #eff6ff; color: #0047AB; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800;">
          {{ (patientInfo.fullName || authStore.user.value?.fullName || 'BN').substring(0, 2).toUpperCase() }}
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Bệnh nhân</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-top: 2px;">{{ patientInfo.fullName || authStore.user.value?.fullName || 'Đang tải...' }}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Ngày sinh / Giới tính</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #334155; margin-top: 2px;">
              {{ patientInfo.dateOfBirth ? formatDateShort(patientInfo.dateOfBirth) : '--' }} / {{ patientInfo.gender || '--' }}
            </div>
          </div>
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Tiền sử bệnh lý</div>
            <div style="font-size: 0.9rem; font-weight: 600; color: #475569; margin-top: 2px;">{{ patientInfo.medicalHistory || 'Chưa ghi nhận' }}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #b91c1c; text-transform: uppercase;">Dị ứng thuốc/Thức ăn</div>
            <div style="font-size: 0.9rem; font-weight: 700; color: #991b1b; margin-top: 2px;">{{ patientInfo.allergies || 'Không dị ứng' }}</div>
          </div>
        </div>
      </div>

      <!-- MEDICAL RECORD HISTORY SECTION -->
      <div class="history-section">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin: 0 0 1.5rem 0; display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-history" style="color: #0047AB;" /> Nhật ký lịch sử điều trị
        </h2>

        <div v-if="loading" class="loading-state" style="text-align: center; padding: 4rem 0;">
          <i class="fas fa-circle-notch fa-spin fa-2x" style="color: #0047AB; margin-bottom: 1rem;" />
          <p style="color: #64748b; font-weight: 600;">Đang tải hồ sơ bệnh án của quý khách...</p>
        </div>

        <div v-else-if="records.length === 0" class="empty-state" style="background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 4rem 2rem; text-align: center;">
          <div class="empty-icon" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"><i class="fas fa-folder-open" /></div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">Chưa có hồ sơ bệnh án</h3>
          <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1.5rem;">Quý khách chưa có hồ sơ bệnh án nào được ghi nhận trên hệ thống Medicare.</p>
          <router-link class="btn-primary-action" to="/patient" style="display: inline-block; background: #0047AB; color: white; padding: 0.75rem 2rem; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 0.9rem; transition: 0.15s;">Đăng ký khám ngay</router-link>
        </div>

        <div v-else class="records-list animate-fade-in" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div v-for="rec in records" :key="rec.id" class="record-card" style="background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: 0.2s;">
            <!-- Card Header -->
            <div class="card-header" style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="background: #eff6ff; color: #0047AB; width: 42px; height: 42px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                  <i class="fas fa-file-prescription" />
                </div>
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Bệnh án ngày</div>
                  <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">{{ formatDateFull(rec.createdAt) }}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-family: monospace; font-size: 0.75rem; background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 6px; font-weight: 700;">
                  Mã BA: #{{ rec.id?.substring(0, 8).toUpperCase() }}
                </span>
                <button v-if="rec.prescription" class="btn-print" style="background: white; border: 1px solid #cbd5e1; color: #475569; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: 0.15s;" @click="printPrescription(rec)">
                  <i class="fas fa-print" /> In toa thuốc
                </button>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body" style="padding: 1.5rem; display: grid; grid-template-columns: 3fr 2fr; gap: 1.5rem;">
              <!-- Left column: Clinical history -->
              <div class="clinical-details" style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div>
                  <h4 style="margin: 0 0 6px 0; font-size: 0.85rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Triệu chứng lâm sàng</h4>
                  <p style="margin: 0; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.9rem; color: #334155; line-height: 1.5; white-space: pre-wrap;">{{ rec.symptoms }}</p>
                </div>

                <div>
                  <h4 style="margin: 0 0 6px 0; font-size: 0.85rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Chẩn đoán của bác sĩ</h4>
                  <p style="margin: 0; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.9rem; color: #15803d; font-weight: 700; line-height: 1.5;">{{ rec.diagnosis }}</p>
                </div>

                <div>
                  <h4 style="margin: 0 0 6px 0; font-size: 0.85rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Lời dặn y khoa</h4>
                  <p style="margin: 0; font-size: 0.9rem; color: #475569; line-height: 1.5;">{{ rec.notes || 'Không có ghi chú thêm.' }}</p>
                </div>
              </div>

              <!-- Right column: Prescription slip -->
              <div class="prescription-column">
                <div v-if="rec.prescription" class="prescription-slip" style="background: #fff8f8; border: 1.5px dashed #fca5a5; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; position: relative;">
                  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed #fca5a5; padding-bottom: 6px;">
                    <span style="font-weight: 800; font-size: 0.85rem; color: #b91c1c; text-transform: uppercase; display: flex; align-items: center; gap: 6px;">
                      <i class="fas fa-prescription-bottle" /> Đơn thuốc y khoa
                    </span>
                    <span style="font-size: 0.75rem; color: #7f1d1d; font-weight: 600;">
                      Medicare Pharmacy
                    </span>
                  </div>

                  <div v-if="rec.prescription.instructions" style="font-size: 0.8rem; color: #7f1d1d; background: #fee2e2; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #ef4444;">
                     <strong>Lời dặn:</strong> {{ rec.prescription.instructions }}
                  </div>

                  <!-- Medicines List -->
                  <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
                    <div v-for="(med, idx) in rec.prescription.details" :key="idx" style="background: white; border: 1px solid #fee2e2; border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700; font-size: 0.85rem; color: #1e293b;">{{ idx + 1 }}. {{ med.medicationName }}</span>
                        <span style="font-weight: 800; font-size: 0.85rem; color: #b91c1c;">x{{ med.quantity }} Viên</span>
                      </div>
                      <div style="font-size: 0.75rem; color: #64748b; font-style: italic; display: flex; align-items: center; gap: 4px;">
                        <i class="far fa-clock" /> Cách dùng: {{ med.dosage }}
                      </div>
                    </div>
                  </div>

                  <!-- Doctor signature visual -->
                  <div style="margin-top: auto; border-top: 1px dashed #fca5a5; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 4px;">
                    <div style="display: flex; flex-direction: column; font-size: 0.7rem; color: #94a3b8;">
                      <span>Hệ thống bệnh án điện tử</span>
                      <span>Bệnh viện quốc tế Medicare</span>
                    </div>
                    <div style="text-align: right; font-size: 0.75rem; font-weight: 700; color: #15803d; display: flex; align-items: center; gap: 4px; background: #f0fdf4; padding: 3px 6px; border-radius: 4px; border: 1px solid #bbf7d0;">
                      <i class="fas fa-signature" /> Đã ký điện tử
                    </div>
                  </div>
                </div>

                <!-- No prescription visual -->
                <div v-else style="height: 100%; min-height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 12px; color: #64748b; padding: 1.5rem; text-align: center;">
                  <i class="fas fa-info-circle" style="font-size: 1.5rem; margin-bottom: 6px; color: #94a3b8;" />
                  <span style="font-size: 0.85rem; font-weight: 600;">Không có đơn thuốc chỉ định</span>
                  <span style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Bác sĩ khám không chỉ định dùng thuốc hoặc khuyên dùng thuốc ngoài.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- PRINTABLE PRESCRIPTION TEMPLATE (HIDDEN UNTIL PRINT) -->
    <div id="print-area" style="display: none;">
      <div v-if="printTarget" style="padding: 2.5cm; font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: black; line-height: 1.4;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 20px;">
          <div>
            <h3 style="margin: 0; font-size: 16pt; font-weight: bold; text-transform: uppercase;">Bệnh viện quốc tế Medicare</h3>
            <p style="margin: 3px 0; font-size: 10pt; font-style: italic;">Địa chỉ: 78 Giải Phóng, Đống Đa, Hà Nội</p>
            <p style="margin: 0; font-size: 10pt; font-style: italic;">Điện thoại: 1900 6789</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 10pt; font-weight: bold;">Mã số BA: #{{ printTarget.id?.substring(0, 8).toUpperCase() }}</p>
            <p style="margin: 3px 0; font-size: 10pt;">Ngày khám: {{ formatDateFull(printTarget.createdAt) }}</p>
          </div>
        </div>

        <h2 style="text-align: center; text-transform: uppercase; font-size: 20pt; font-weight: bold; margin: 30px 0;">Đơn thuốc y khoa</h2>

        <div style="margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>Họ và tên bệnh nhân:</strong> {{ patientInfo.fullName || authStore.user.value?.fullName || 'Bệnh nhân Medicare' }}</p>
          <p style="margin: 5px 0;"><strong>Chẩn đoán:</strong> {{ printTarget.diagnosis }}</p>
          <p style="margin: 5px 0;"><strong>Triệu chứng lâm sàng:</strong> {{ printTarget.symptoms }}</p>
        </div>

        <h3 style="font-size: 13pt; font-weight: bold; border-bottom: 1px solid black; padding-bottom: 4px; margin-top: 30px; margin-bottom: 10px;">Thuốc chỉ định</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="border-bottom: 1px solid black; text-align: left;">
              <th style="padding: 6px 0; width: 50px;">STT</th>
              <th style="padding: 6px 0;">Tên thuốc / Biệt dược</th>
              <th style="padding: 6px 0; text-align: right; width: 100px;">Số lượng</th>
              <th style="padding: 6px 0; padding-left: 20px;">Cách dùng (Liều lượng)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(med, idx) in printTarget.prescription?.details" :key="idx" style="border-bottom: 1px dashed #ccc;">
              <td style="padding: 8px 0;">{{ idx + 1 }}</td>
              <td style="padding: 8px 0; font-weight: bold;">{{ med.medicationName }}</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">{{ med.quantity }} Viên</td>
              <td style="padding: 8px 0; padding-left: 20px; font-style: italic;">{{ med.dosage }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="printTarget.prescription?.instructions" style="margin-bottom: 30px; border: 1px solid black; padding: 10px; font-style: italic;">
          <strong>Lời dặn của bác sĩ:</strong> {{ printTarget.prescription.instructions }}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 50px;">
          <div>
            <p style="margin: 0; font-size: 10pt; font-style: italic;">(Toa thuốc có giá trị sử dụng trong 5 ngày kể từ ngày kê đơn)</p>
          </div>
          <div style="text-align: center; width: 250px;">
            <p style="margin: 0; font-style: italic;">Hà Nội, ngày {{ new Date(printTarget.createdAt).getDate() }} tháng {{ new Date(printTarget.createdAt).getMonth() + 1 }} năm {{ new Date(printTarget.createdAt).getFullYear() }}</p>
            <p style="margin: 5px 0 40px 0; font-weight: bold; text-transform: uppercase;">Bác sĩ điều trị</p>
            <p style="margin: 0; font-weight: bold; color: green; border: 2px solid green; display: inline-block; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">Đã ký điện tử</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Navbar from '@/components/Navbar.vue'
  import { medicalRecordService, MedicalRecord } from '@/services/medicalRecordService'
  import { useAuthStore } from '@/stores/authStore'

  const router = useRouter()
  const authStore = useAuthStore()
  
  const loading = ref(false)
  const profileLoading = ref(false)
  
  const records = ref<MedicalRecord[]>([])
  const printTarget = ref<MedicalRecord | null>(null)

  const patientInfo = ref({
    fullName: '',
    dateOfBirth: '',
    gender: '--',
    medicalHistory: '',
    allergies: ''
  })

  // Load Patient Profile (MedicalRecordDB -> Patients)
  async function fetchProfile() {
    if (!authStore.user.value?.id) return
    profileLoading.value = true
    try {
      const res = await medicalRecordService.getPatientProfile(authStore.user.value.id)
      if (res) {
        patientInfo.value.fullName = res.fullName || authStore.user.value.fullName || ''
        patientInfo.value.gender = res.gender || 'Nam'
        patientInfo.value.medicalHistory = res.medicalHistory || ''
        patientInfo.value.allergies = res.allergies || ''
        patientInfo.value.dateOfBirth = res.dateOfBirth || ''
      }
    } catch (e) {
      console.error('Lỗi tải hồ sơ bệnh nhân:', e)
    } finally {
      profileLoading.value = false
    }
  }

  // Load Clinical history records
  async function fetchRecords() {
    if (!authStore.user.value?.id) return
    loading.value = true
    try {
      const res = await medicalRecordService.getRecordsByPatient(authStore.user.value.id)
      records.value = res || []
    } catch (e) {
      console.error('Không tải được danh sách bệnh án:', e)
    } finally {
      loading.value = false
    }
  }

  function printPrescription(rec: MedicalRecord) {
    printTarget.value = rec
    setTimeout(() => {
      const printContents = document.getElementById('print-area')?.innerHTML
      if (printContents) {
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>In Toa Thuoc - Medicare Hospital</title>
                <style>
                  body { margin: 0; padding: 0; font-family: 'Times New Roman', serif; }
                  @media print {
                    @page { margin: 1.5cm; }
                  }
                </style>
              </head>
              <body onload="window.print(); window.close();">
                ${printContents}
              </body>
            </html>
          `)
          printWindow.document.close()
        }
      }
    }, 100)
  }

  function formatDateFull(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  function formatDateShort(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  onMounted(async () => {
    if (!authStore.isAuthenticated.value) {
      router.push('/login')
      return
    }
    await fetchProfile()
    await fetchRecords()
  })
</script>

<style scoped>
@import '@/styles/public-pages.css';

.record-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
}

.btn-print:hover {
  border-color: #0047AB !important;
  color: #0047AB !important;
  background-color: #f0f7ff !important;
}

.btn-book-now:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15) !important;
  background-color: #f8fafc !important;
}

@media (max-width: 768px) {
  .card-body {
    grid-template-columns: 1fr !important;
  }
}
</style>
