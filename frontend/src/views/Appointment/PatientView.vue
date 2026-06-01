<template>
  <div class="patient-booking">
    <!-- BACKGROUND LIGHT BLUR ACCENTS -->
    <div class="booking-bg-glows">
      <div class="bg-glow bg-glow-1" />
      <div class="bg-glow bg-glow-2" />
    </div>

    <div class="booking-layout">
      <!-- SIDEBAR PROGRESS PANEL (Glassmorphism inspired) -->
      <aside class="booking-sidebar shadow-light">
        <div class="sidebar-brand">
          <div class="brand-logo" @click="$router.push('/')">
            <svg fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="height: 32px; width: 32px;">
              <rect fill="#0047AB" height="32" rx="8" width="32" />
              <path d="M16 6v20M6 16h20" stroke="white" stroke-linecap="round" stroke-width="4" />
            </svg>
            <span class="brand-text">Medicare<small style="color: #ef4444; font-weight: 900;">.</small></span>
          </div>
          <p class="brand-sub">Đặt lịch khám chuyên khoa trực tuyến</p>
        </div>

        <nav class="progress-steps-v">
          <div class="step-v" :class="{ 'step-v--active': currentStep === 1, 'step-v--completed': currentStep > 1 }">
            <div class="step-v__num">
              <i class="fas fa-check" v-if="currentStep > 1" />
              <span v-else>1</span>
            </div>
            <div class="step-v__content">
              <span class="step-v__label">Dịch vụ y tế</span>
              <span class="step-v__desc">Chọn gói khám lâm sàng</span>
            </div>
          </div>

          <div class="step-v" :class="{ 'step-v--active': currentStep === 2, 'step-v--completed': currentStep > 2 }">
            <div class="step-v__num">
              <i class="fas fa-check" v-if="currentStep > 2" />
              <span v-else>2</span>
            </div>
            <div class="step-v__content">
              <span class="step-v__label">Bác sĩ khám</span>
              <span class="step-v__desc">Chọn chuyên gia phụ trách</span>
            </div>
          </div>

          <div class="step-v" :class="{ 'step-v--active': currentStep === 3, 'step-v--completed': currentStep > 3 }">
            <div class="step-v__num">
              <i class="fas fa-check" v-if="currentStep > 3" />
              <span v-else>3</span>
            </div>
            <div class="step-v__content">
              <span class="step-v__label">Chọn thời gian</span>
              <span class="step-v__desc">Ngày & slot giờ khám</span>
            </div>
          </div>

          <div class="step-v" :class="{ 'step-v--active': currentStep === 4, 'step-v--completed': currentStep > 4 }">
            <div class="step-v__num">4</div>
            <div class="step-v__content">
              <span class="step-v__label">Xác nhận</span>
              <span class="step-v__desc">Hoàn tất lịch hẹn</span>
            </div>
          </div>
        </nav>

        <div class="sidebar-footer">
          <button class="btn-sidebar-back" @click="$router.push('/')">
            <i class="fas fa-home" /> Quay lại Cổng chính
          </button>
        </div>
      </aside>

      <!-- MAIN BOOKING CONTENT AREA -->
      <main class="booking-main">
        <div class="booking-content-card shadow-light animate-fade-in">
          
          <!-- STEP 1: SELECT CLINICAL SERVICE -->
          <section v-if="currentStep === 1">
            <div class="section-title">
              <h2>Chọn dịch vụ khám y khoa</h2>
              <p>Medicare tự động sắp xếp danh sách chuyên gia phù hợp với nhu cầu y tế của bạn.</p>
            </div>

            <div v-if="loadingServices" class="loading-state">
              <i class="fas fa-spinner fa-spin fa-2x text-blue" style="margin-bottom: 1rem;" />
              <p>Đang tải danh sách dịch vụ y tế...</p>
            </div>

            <div v-else class="grid-container">
              <div
                v-for="service in medicalServices"
                :key="service.id"
                class="card-item"
                :class="{ 'card-item--active': selectedService?.id === service.id }"
                @click="selectService(service)"
              >
                <div class="card-item__icon"><i class="fas fa-stethoscope" /></div>
                <div class="card-item__info">
                  <h3>{{ service.name }}</h3>
                  <p>{{ service.description }}</p>
                  <div class="card-item__price">{{ formatPrice(service.price) }}</div>
                </div>
              </div>
            </div>

            <div class="action-footer">
              <button class="btn-main btn-back-v" @click="$router.push('/')">
                <i class="fas fa-chevron-left" /> Quay lại trang chủ
              </button>
              <button class="btn-main btn-primary-v" :disabled="!selectedService" @click="currentStep = 2">
                Chọn bác sĩ <i class="fas fa-chevron-right" />
              </button>
            </div>
          </section>

          <!-- STEP 2: SELECT SPECIALIST DOCTOR -->
          <section v-if="currentStep === 2">
            <div class="section-title">
              <h2>Chọn bác sĩ chuyên khoa phụ trách</h2>
              <p>Dịch vụ đã chọn: <b style="color: #0047AB;">{{ selectedService?.name }}</b></p>
            </div>

            <div v-if="loadingDoctors" class="loading-state">
              <i class="fas fa-spinner fa-spin fa-2x text-blue" style="margin-bottom: 1rem;" />
              <p>Đang tải đội ngũ bác sĩ chuyên khoa lâm sàng...</p>
            </div>

            <div v-else class="grid-container">
              <div
                v-for="doc in filteredDoctors"
                :key="doc.id"
                class="card-item"
                :class="{ 'card-item--active': selectedDoctor?.id === doc.id }"
                @click="selectDoctor(doc)"
              >
                <div class="card-item__icon"><i class="fas fa-user-md" /></div>
                <div class="card-item__info">
                  <h3>BS. {{ doc.fullName }}</h3>
                  <span class="doc-spec-badge">{{ doc.specialty }}</span>
                </div>
              </div>
            </div>

            <div class="action-footer">
              <button class="btn-main btn-back-v" @click="currentStep = 1">
                <i class="fas fa-chevron-left" /> Quay lại
              </button>
              <button class="btn-main btn-primary-v" :disabled="!selectedDoctor" @click="currentStep = 3">
                Chọn giờ khám <i class="fas fa-chevron-right" />
              </button>
            </div>
          </section>

          <!-- STEP 3: SELECT WORK DAY & SLOTS -->
          <section v-if="currentStep === 3">
            <div class="section-title">
              <h2>Lựa chọn thời gian khám bệnh</h2>
              <p>Bác sĩ lâm sàng: <b style="color: #0047AB;">BS. {{ selectedDoctor?.fullName }}</b></p>
            </div>

            <!-- Horizontal Dates Slider -->
            <div class="date-scroll-v" style="align-items: stretch;">
              <div
                v-for="date in nextFourteenDays"
                :key="date.iso"
                class="date-card-v"
                :class="{ 'date-card-v--active': selectedDate === date.iso }"
                @click="selectDate(date.iso)"
              >
                <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">{{ date.dayName }}</span>
                <span class="date-day-num">{{ date.dayNum }}</span>
                <span style="font-size: 0.72rem; opacity: 0.85;">Tháng {{ date.month }}</span>
              </div>

              <!-- Sleek Modern Calendar Date Picker Card -->
              <div
                class="date-card-v"
                style="min-width: 95px; background: rgba(37, 99, 235, 0.05); border: 1.5px dashed rgba(37, 99, 235, 0.4); justify-content: center; align-items: center; color: var(--primary); gap: 6px; position: relative; cursor: pointer;"
                @click="openDatePicker"
              >
                <i class="fas fa-calendar-plus" style="font-size: 1.35rem;" />
                <span style="font-size: 0.8rem; font-weight: 800; white-space: nowrap;">Chọn ngày</span>
                <input
                  type="date"
                  ref="customDatePicker"
                  style="position: absolute; opacity: 0; width: 0; height: 0; top: 0; left: 0; pointer-events: none;"
                  :min="minSelectableDate"
                  @change="handleCustomDateChange"
                />
              </div>
            </div>

            <!-- Time Slots Grid -->
            <div v-if="selectedDate" class="slot-container">
              <div v-if="loadingSlots" class="loading-state">
                <i class="fas fa-spinner fa-spin fa-2x text-blue" style="margin-bottom: 1rem;" />
                <p>Đang tra cứu lịch trực bác sĩ...</p>
              </div>

              <div v-else-if="availableSlots.length === 0" class="empty-slots">
                <i class="far fa-calendar-times" style="font-size: 2.5rem; color: #cbd5e1; margin-bottom: 1rem; display: block;" />
                <p>Bác sĩ hiện không có ca khám trực nào khả dụng hoặc các ca hôm nay đã qua giờ.</p>
              </div>

              <div v-else class="slot-grid-v">
                <div
                  v-for="slot in availableSlots"
                  :key="slot.id"
                  class="slot-v"
                  :class="{ 'slot-v--active': selectedSlot?.id === slot.id, 'slot-v--disabled': slot.isBooked }"
                  @click="!slot.isBooked && (selectedSlot = slot)"
                >
                  <i class="far fa-clock" /> {{ formatTime(slot.startTime) }}
                </div>
              </div>
            </div>

            <div class="action-footer">
              <button class="btn-main btn-back-v" @click="currentStep = 2">
                <i class="fas fa-chevron-left" /> Quay lại
              </button>
              <button class="btn-main btn-primary-v" :disabled="!selectedSlot" @click="currentStep = 4">
                Đi tới xác nhận <i class="fas fa-chevron-right" />
              </button>
            </div>
          </section>

          <!-- STEP 4: FINAL SPLIT SCREEN CONFIRMATION -->
          <section v-if="currentStep === 4" class="step-final" style="margin-top: -1rem;">
            <div class="section-title" style="margin-bottom: 1rem; text-align: center;">
              <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem;">Xác nhận thủ tục đăng ký</h2>
              <p style="font-size: 0.85rem; margin: 0; opacity: 0.85;">Hồ sơ lịch hẹn sẽ được duyệt tức thời bởi lễ tân lâm sàng.</p>
            </div>

            <div class="final-grid" style="gap: 1.5rem; align-items: stretch;">
              <!-- Left Column: Patient Profile Form Details -->
              <div class="final-form-col" style="background: white; border: 1.5px solid var(--slate-200); border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--shadow-sm);">
                <div class="summary-section" style="border: none; padding: 0;">
                  <h3 style="font-size: 1.05rem; font-weight: 850; color: #0f172a; margin-top: 0; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-id-card text-blue" /> Thông tin bệnh nhân trực tuyến
                  </h3>
                  
                  <div class="final-form-fields" style="gap: 0.75rem; margin-top: 0;">
                    <div class="form-field">
                      <label style="font-size: 0.78rem; font-weight: 750;">Họ và tên bệnh nhân:</label>
                      <input v-model="patientForm.fullName" placeholder="Nhập họ và tên..." type="text" class="final-input" style="height: 38px; font-size: 0.85rem;" />
                    </div>
                    <div class="form-field">
                      <label style="font-size: 0.78rem; font-weight: 750;">Số điện thoại liên hệ:</label>
                      <input v-model="patientForm.phone" placeholder="Số điện thoại di động..." type="tel" class="final-input" style="height: 38px; font-size: 0.85rem;" />
                    </div>
                    <div class="form-field">
                      <label style="font-size: 0.78rem; font-weight: 750;">Địa chỉ Email nhận kết quả:</label>
                      <input v-model="patientForm.email" placeholder="Nhập địa chỉ email nhận kết quả..." type="email" class="final-input" style="height: 38px; font-size: 0.85rem;" />
                    </div>
                    <div class="form-field">
                      <label style="font-size: 0.78rem; font-weight: 750;">Ngày tháng năm sinh:</label>
                      <input v-model="patientForm.dob" type="date" class="final-input" style="height: 38px; font-size: 0.85rem;" />
                    </div>
                    <div class="form-field">
                      <label style="font-size: 0.78rem; font-weight: 750;">Giới tính sinh học:</label>
                      <select v-model="patientForm.gender" class="final-input" style="height: 38px; font-size: 0.85rem; padding: 0 1rem; background: white;">
                        <option value="">-- Chọn giới tính --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div class="form-field">
                      <label style="font-size: 0.78rem; font-weight: 750;">Địa chỉ thường trú:</label>
                      <input v-model="patientForm.address" placeholder="Nơi ở hiện tại của bệnh nhân..." type="text" class="final-input" style="height: 38px; font-size: 0.85rem;" />
                    </div>
                    <div class="form-field full-width" style="margin-top: 0.25rem;">
                      <label style="font-size: 0.78rem; font-weight: 750;">Triệu chứng & Lý do khám bệnh:</label>
                      <textarea v-model="reason" placeholder="Ví dụ: Đau đầu kéo dài, sốt nhẹ vào chiều tối..." rows="2" class="final-textarea" style="height: 52px; font-size: 0.85rem; padding: 0.5rem 1rem;" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Receipt Summary and Book Button Integrated -->
              <div class="final-summary-col">
                <div class="summary-card shadow-light" style="padding: 1.25rem; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; border: 1.5px solid var(--slate-200); border-radius: var(--radius-lg); overflow: hidden;">
                  <div>
                    <h3 style="font-size: 1.05rem; font-weight: 850; color: #0f172a; margin-top: 0; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
                      <i class="fas fa-receipt text-blue" /> Phiếu đặt lịch khám
                    </h3>
                    
                    <div class="summary-row" style="padding: 0.6rem 0; font-size: 0.85rem; border-bottom: 1px dashed var(--slate-200);">
                      <span class="summary-label" style="color: var(--slate-600); font-weight: 550;">Chuyên khoa khám</span>
                      <span class="summary-value" style="font-weight: 800; color: var(--dark-slate);">{{ selectedService?.name }}</span>
                    </div>
                    <div class="summary-row" style="padding: 0.6rem 0; font-size: 0.85rem; border-bottom: 1px dashed var(--slate-200);">
                      <span class="summary-label" style="color: var(--slate-600); font-weight: 550;">Bác sĩ phụ trách</span>
                      <span class="summary-value" style="font-weight: 800; color: var(--dark-slate);">BS. {{ selectedDoctor?.fullName }}</span>
                    </div>
                    <div class="summary-row" style="padding: 0.6rem 0; font-size: 0.85rem; border-bottom: 1px dashed var(--slate-200);">
                      <span class="summary-label" style="color: var(--slate-600); font-weight: 550;">Thời gian khám</span>
                      <span class="summary-value" style="font-weight: 800; color: var(--dark-slate);">{{ formatDateFull(selectedDate) }} - {{ formatTime(selectedSlot?.startTime) }}</span>
                    </div>
                    
                    <div class="summary-row total-row" style="margin-top: 0.5rem; padding-top: 0.75rem; border-top: 2px dashed var(--slate-300);">
                      <span class="summary-label" style="font-weight: 750; color: var(--slate-800);">Phí tạm tính</span>
                      <span class="summary-value total-value" style="font-size: 1.35rem; font-weight: 900; color: var(--primary);">
                        {{ formatPrice(selectedService?.price || 0) }}
                      </span>
                    </div>
                  </div>

                  <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--slate-200);">
                    <p class="confirm-note" style="margin-bottom: 0.75rem; font-size: 0.76rem; color: var(--slate-600); line-height: 1.4; display: flex; align-items: flex-start; gap: 6px;">
                      <i class="fas fa-info-circle text-blue" style="margin-top: 2px;" /> Lịch hẹn sẽ được gửi tức thời đến Cổng tiếp nhận. Bạn sẽ được cấp số thứ tự ngay khi duyệt.
                    </p>
                    <button class="btn-book-final shadow-light" :disabled="submitting" @click="bookAppointment" style="padding: 0.8rem 1.25rem; font-size: 0.92rem; width: 100%; border-radius: var(--radius-md); font-weight: 850; background: linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%);">
                      <span v-if="submitting"><i class="fas fa-spinner fa-spin" /> ĐANG TRUYỀN DỮ LIỆU...</span>
                      <span v-else><i class="fas fa-check-double" /> XÁC NHẬN ĐẶT LỊCH NGAY</span>
                    </button>
                    <button 
                      style="width: 100%; margin-top: 0.5rem; background: #f8fafc; border: 1.5px solid var(--slate-300); color: var(--slate-600); padding: 0.6rem; border-radius: var(--radius-md); font-weight: 750; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;"
                      @click="currentStep = 3"
                    >
                      <i class="fas fa-chevron-left" /> Quay lại chọn ngày
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>

    <!-- TOAST POPUPS -->
    <div class="toast-container">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="'toast--' + toast.type">
        <div class="toast-body">
          <span class="toast-title">{{ toast.title }}</span>
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button class="toast-close" @click="removeToast(toast.id)">&times;</button>
        <div class="toast-progress" :style="{ animationDuration: '4s' }" />
      </div>
    </div>

    <!-- SUCCESS RECEIPT MODAL OVERLAY -->
    <div v-if="successData" class="success-overlay">
      <div class="success-card shadow-lg">
        <div class="success-icon"><i class="fas fa-check-circle" /></div>
        <h2>Đăng Ký Thành Công!</h2>
        <div class="appointment-id">Mã đơn: #{{ (successData.appointmentId || successData.id || '').slice(0,8).toUpperCase() }}</div>
        
        <p style="margin: 1.25rem 0; color: #475569; font-weight: 500;">
          Medicare đã gửi thông tin xác nhận qua hòm thư <b>{{ authStore.user.value?.email }}</b>. Bạn có thể theo dõi tiến độ khám tại lịch sử đặt hẹn bất cứ lúc nào.
        </p>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 1.25rem;">
          <button class="btn-primary" style="background: var(--primary);" @click="$router.push('/my-appointments')">XEM LỊCH SỬ ĐẶT HẸN</button>
          <button class="btn-primary" style="background: var(--slate-600);" @click="$router.push('/')">VỀ TRANG CHỦ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/services/api'
  import { appointmentService } from '@/services/appointmentService'
  import { useAuthStore } from '@/stores/authStore'
  import { useDoctorStore } from '@/stores/doctorStore'

  const router = useRouter()
  const authStore = useAuthStore()
  const doctorStore = useDoctorStore()

  onMounted(() => {
    if (!authStore.isAuthenticated.value || !authStore.isPatient.value) {
      router.push('/login')
    }
  })

  const currentStep = ref(1)
  const medicalServices = ref([])
  const loadingServices = ref(false)
  const selectedService = ref(null)
  const selectedDoctor = ref(null)
  const selectedDate = ref('')
  const selectedSlot = ref(null)
  const reason = ref('')
  const loadingSlots = ref(false)
  const submitting = ref(false)
  const successData = ref(null)
  const slots = ref([])
  const toasts = ref([])

  const availableSlots = computed(() => {
    if (!slots.value) return []
    
    // Check if the selected date is today in local time
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}` // Local YYYY-MM-DD
    
    if (selectedDate.value === todayStr) {
      const currentHours = today.getHours()
      const currentMinutes = today.getMinutes()
      
      return slots.value.filter(slot => {
        if (!slot.startTime) return false
        
        // Parse startTime (e.g. "08:30:00" or "08:30")
        const parts = slot.startTime.split(':')
        const slotHours = parseInt(parts[0], 10)
        const slotMinutes = parseInt(parts[1], 10)
        
        if (slotHours > currentHours) return true
        if (slotHours === currentHours && slotMinutes > currentMinutes) return true
        
        return false // Past time slot
      })
    }
    
    return slots.value
  })

  const patientForm = ref({
    fullName: '',
    phone: '',
    address: '',
    email: '',
    dob: '',
    gender: '',
    insurance: '',
    history: '',
  })

  function addToast (title, message, type = 'success') {
    const id = Date.now()
    toasts.value.push({ id, title, message, type })
    setTimeout(() => removeToast(id), 4000)
  }

  function removeToast (id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const loadingDoctors = computed(() => doctorStore.loading.value)
  const filteredDoctors = computed(() => doctorStore.doctors.value)

  const customDatePicker = ref(null)
  const customDate = ref('')

  const minSelectableDate = computed(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })

  function handleCustomDateChange(e) {
    const val = e.target.value
    if (val) {
      customDate.value = val
      selectDate(val)
    }
  }

  function openDatePicker() {
    if (customDatePicker.value) {
      try {
        customDatePicker.value.showPicker();
      } catch (e) {
        customDatePicker.value.click();
      }
    }
  }

  const nextFourteenDays = computed(() => {
    const days = []
    const today = new Date()
    const dayNames = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
    // Default 7 days of this week
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(today.getDate() + i)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      days.push({
        iso: `${year}-${month}-${day}`,
        dayNum: d.getDate(),
        month: d.getMonth() + 1,
        dayName: i === 0 ? 'Hôm nay' : dayNames[d.getDay()],
      })
    }

    // Dynamic union: Append selected custom date if it's outside this week's 7 days
    if (customDate.value) {
      const exists = days.some(d => d.iso === customDate.value)
      if (!exists) {
        const d = new Date(customDate.value)
        days.push({
          iso: customDate.value,
          dayNum: d.getDate(),
          month: d.getMonth() + 1,
          dayName: dayNames[d.getDay()],
        })
      }
    }
    return days
  })

  async function fetchServices () {
    loadingServices.value = true
    try {
      const res = await api.get('/MedicalServices')
      medicalServices.value = res.data
    } catch (e) {
      addToast('Lỗi tải dịch vụ', 'Không thể kết nối danh mục y tế', 'error')
    } finally {
      loadingServices.value = false
    }
  }

  function selectService (service) {
    selectedService.value = service
    addToast('Đã chọn chuyên khoa', service.name)
  }

  function selectDoctor (doc) {
    selectedDoctor.value = doc
    addToast('Đã chọn bác sĩ', `BS. ${doc.fullName}`)
  }

  async function selectDate (dateIso) {
    selectedDate.value = dateIso
    selectedSlot.value = null
    fetchSlots()
  }

  async function fetchSlots () {
    if (!selectedDoctor.value || !selectedDate.value) return
    loadingSlots.value = true
    try {
      slots.value = await appointmentService.getAvailableSlots(selectedDoctor.value.id, selectedDate.value)
    } catch (e) {
      addToast('Lỗi tải slot', 'Không thể tải lịch khám bác sĩ', 'error')
    } finally {
      loadingSlots.value = false
    }
  }

  async function bookAppointment () {
    submitting.value = true
    try {
      // Compile rich clinical details to the reason field to pass seamlessly to the backend DB without database schema breakage
      const richReason = `[KHÁM CHUYÊN KHOA]
- Lý do khám: ${reason.value || 'Khám tổng quát'}
- Bệnh nhân: ${patientForm.value.fullName}
- Ngày sinh: ${patientForm.value.dob || 'Chưa cung cấp'}
- Giới tính: ${patientForm.value.gender || 'Chưa cung cấp'}
- SĐT liên hệ: ${patientForm.value.phone}
- Địa chỉ thường trú: ${patientForm.value.address}`

      const data = {
        patientId: authStore.user.value?.id,
        slotId: selectedSlot.value?.id || '',
        medicalServiceId: selectedService.value?.id || '',
        reason: richReason,
      }
      const response = await appointmentService.bookAppointment(data)
      successData.value = { ...response, patientName: patientForm.value.fullName }
    } catch (error) {
      addToast('Đặt lịch thất bại', error.response?.data?.message || 'Có lỗi xảy ra trong quá trình đặt lịch', 'error')
    } finally {
      submitting.value = false
    }
  }

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
  const formatTime = (t) => t?.slice(0, 5) || ''
  function formatDateFull (iso) {
    if (!iso) return ''
    const d = new Date(iso)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  onMounted(() => {
    fetchServices()
    doctorStore.fetchDoctors()
    // Pre-populate fields from the logged in user store safely and robustly
    const u = authStore.user.value || authStore.user
    if (u) {
      patientForm.value.fullName = u.fullName || u.username || ''
      patientForm.value.email = u.email || (u.username && u.username.includes('@') ? u.username : '') || ''
      patientForm.value.phone = u.phoneNumber || u.phone || ''
      patientForm.value.address = u.address || ''
      patientForm.value.dob = u.dob ? u.dob.split('T')[0] : '2000-01-01'
      patientForm.value.gender = u.gender || 'Nam'
      patientForm.value.insurance = u.insurance || ''
      patientForm.value.history = u.history || ''
    }
  })
</script>

<style src="@/styles/patient.css"></style>
