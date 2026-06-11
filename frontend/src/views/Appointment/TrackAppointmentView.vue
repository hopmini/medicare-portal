<template>
  <div class="public-page track-page">
    <Navbar />

    <!-- Sleek Header with Backdrop Pattern -->
    <div class="page-header track-header">
      <div class="container header-container">
        <div class="header-tag animate-fade-in">Medicare Smart Portal</div>
        <h1 class="animate-fade-in delay-1">Tra cứu lịch hẹn</h1>
        <p class="animate-fade-in delay-2">Nhập mã đặt lịch để quản lý trạng thái, cập nhật thông tin triệu chứng hoặc chủ động đổi ngày/giờ khám y tế trực tuyến.</p>
      </div>
      <div class="header-wave">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 32L60 42.7C120 53 240 75 360 74.7C480 75 600 53 720 48C840 43 960 53 1080 64C1200 75 1320 85 1380 90.7L1440 96V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V32Z" fill="#f8fafc"/>
        </svg>
      </div>
    </div>

    <div class="container main-content">
      <!-- Search Input Section -->
      <div class="search-section animate-scale-up">
        <div class="search-card glass-panel">
          <div class="input-wrapper">
            <i class="fas fa-ticket-alt search-icon" />
            <input
              v-model="searchCode"
              placeholder="Nhập mã tra cứu (Ví dụ: MC-123456) hoặc mã lịch hẹn..."
              type="text"
              class="search-input"
              @keyup.enter="handleSearch"
            >
            <button class="btn-cta search-btn" :disabled="loading" @click="handleSearch">
              <span v-if="loading"><i class="fas fa-spinner fa-spin" /> Đang kiểm tra...</span>
              <span v-else><i class="fas fa-search" /> Tra cứu</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Result Section (If found) -->
      <transition name="fade">
        <div v-if="appointment" class="result-section">
          <div class="appointment-detail-card animate-scale-up">
            <div class="card-top-accent" :class="getStatusClass(appointment.status)"></div>
            
            <div class="card-header-premium">
              <div class="header-left">
                <span class="appointment-id-badge">Mã tra cứu: <strong>{{ appointment.qrToken || appointment.id.toString().substring(0, 8).toUpperCase() }}</strong></span>
                <span class="created-date" v-if="appointment.qrToken">Mã hệ thống: {{ appointment.id }}</span>
                <span class="created-date" v-else style="font-size: 0.8rem; opacity: 0.8;">Mã đầy đủ: {{ appointment.id }}</span>
              </div>
              <div class="status-badge-wrapper">
                <div class="status-badge-glow" :class="getStatusClass(appointment.status)">
                  <i class="fas" :class="getStatusIcon(appointment.status)"></i>
                  {{ translateStatus(appointment.status) }}
                </div>
              </div>
            </div>

            <!-- Dynamic Medical Process Timeline -->
            <div class="timeline-wrapper">
              <h4 class="timeline-title"><i class="fas fa-stream"></i> Tiến trình khám bệnh</h4>
              <div class="process-timeline">
                <div class="timeline-step" :class="getStepClass(0, appointment.status)">
                  <div class="step-icon"><i class="fas fa-calendar-check"></i></div>
                  <div class="step-label">Đăng ký thành công</div>
                </div>
                <div class="timeline-step" :class="getStepClass(1, appointment.status)">
                  <div class="step-icon"><i class="fas fa-user-clock"></i></div>
                  <div class="step-label">Chờ duyệt lịch</div>
                </div>
                <div class="timeline-step" :class="getStepClass(2, appointment.status)">
                  <div class="step-icon"><i class="fas fa-hospital-user"></i></div>
                  <div class="step-label">Đang làm thủ tục</div>
                </div>
                <div class="timeline-step" :class="getStepClass(3, appointment.status)">
                  <div class="step-icon"><i class="fas fa-check-double"></i></div>
                  <div class="step-label">Khám hoàn thành</div>
                </div>
              </div>
            </div>

            <!-- Grid details -->
            <div class="card-body-premium">
              <div class="info-grid-premium">
                <!-- Patient info -->
                <div class="info-card-widget">
                  <div class="widget-icon bg-blue"><i class="fas fa-user-injured"></i></div>
                  <div class="widget-content">
                    <label>Thông tin Bệnh nhân</label>
                    <p class="patient-name">{{ appointment.patientName }}</p>
                    <span class="sub-label">Bảo hiểm Y tế: Có áp dụng</span>
                  </div>
                </div>

                <!-- Doctor info -->
                <div class="info-card-widget">
                  <div class="widget-icon bg-indigo"><i class="fas fa-user-md"></i></div>
                  <div class="widget-content">
                    <label>Bác sĩ khám</label>
                    <p>BS. {{ appointment.doctorName }}</p>
                    <span class="sub-label">Khoa: Khám chuyên khoa</span>
                  </div>
                </div>

                <!-- Date & Time -->
                <div class="info-card-widget">
                  <div class="widget-icon bg-emerald"><i class="fas fa-clock"></i></div>
                  <div class="widget-content">
                    <label>Thời gian hẹn khám</label>
                    <p>{{ formatTime(appointment.time) }} - {{ formatDate(appointment.date) }}</p>
                    <span class="sub-label" style="display: block; margin-bottom: 2px;">Thời lượng dự kiến: <strong>{{ appointment.examinationDuration || 30 }} phút</strong></span>
                    <span class="sub-label">Số thứ tự xếp hàng: <strong>{{ appointment.queueNumber || 'Đang chờ phát số' }}</strong></span>
                  </div>
                </div>

                <!-- Address / Location -->
                <div class="info-card-widget">
                  <div class="widget-icon bg-amber"><i class="fas fa-map-marker-alt"></i></div>
                  <div class="widget-content">
                    <label>Địa điểm khám</label>
                    <p>Tầng 2, Phòng khám 204</p>
                    <span class="sub-label">Tòa nhà B - Bệnh viện Medicare</span>
                  </div>
                </div>

                <!-- Symptoms (Fully Interactive Feature) -->
                <div class="info-card-widget full-width-widget">
                  <div class="widget-icon bg-purple"><i class="fas fa-notes-medical"></i></div>
                  <div class="widget-content">
                    <label>Triệu chứng / Ghi chú của bệnh nhân (Có thể sửa đổi)</label>
                    
                    <div v-if="isEditingReason" class="edit-reason-box">
                      <textarea v-model="editReasonText" class="edit-reason-input" placeholder="Mô tả chi tiết các triệu chứng của bạn để bác sĩ nắm rõ trước khi khám..."></textarea>
                      <div class="edit-actions">
                        <button class="btn-save-reason" :disabled="savingReason" @click="saveReason">
                          <span v-if="savingReason"><i class="fas fa-spinner fa-spin"></i> Đang lưu...</span>
                          <span v-else><i class="fas fa-save"></i> Lưu lại</span>
                        </button>
                        <button class="btn-cancel-reason" @click="isEditingReason = false">Hủy</button>
                      </div>
                    </div>
                    
                    <div v-else>
                      <p class="reason-text">{{ appointment.reason || 'Khám chuyên khoa tổng quát định kỳ' }}</p>
                      <button v-if="canAction" class="btn-edit-reason" @click="startEditReason">
                        <i class="fas fa-edit"></i> Cập nhật lý do/triệu chứng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action buttons (Print, Reschedule, Cancel) -->
            <div class="card-footer-premium">
              <div class="left-actions">
                <button class="btn-print" @click="handlePrint">
                  <i class="fas fa-print" /> In phiếu khám
                </button>
                
                <button v-if="canAction" class="btn-reschedule" @click="openReschedule">
                  <i class="fas fa-calendar-alt" /> Đổi ngày/giờ khám
                </button>
              </div>
              
              <button v-if="canAction" class="btn-danger-premium" @click="handleCancel">
                <i class="fas fa-calendar-times" /> Hủy lịch khám
              </button>
              <div v-else class="locked-banner">
                <i class="fas fa-info-circle" />
                <span>Không thể đổi/hủy lịch đã khám hoàn thành hoặc đã bị hủy. Hotline: 1900 6789</span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Reschedule Modal Overlay (Interactive Feature) -->
      <transition name="fade">
        <div v-if="showReschedule" class="modal-overlay" @click.self="showReschedule = false">
          <div class="modal-card animate-scale-up">
            <div class="modal-header">
              <h3><i class="fas fa-calendar-alt"></i> Đổi lịch khám bệnh</h3>
              <button class="btn-close" @click="showReschedule = false"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
              <p class="modal-subtitle">Đổi lịch hẹn của bạn với <strong>BS. {{ appointment.doctorName }}</strong></p>
              
              <!-- Step 1: Horizontal dates carousel -->
              <label class="section-label">1. Chọn ngày khám mới:</label>
              <div class="dates-carousel">
                <div 
                  v-for="d in next7Days" 
                  :key="d.dateStr" 
                  class="date-pill" 
                  :class="{ active: selectedDate === d.dateStr }"
                  @click="selectDate(d.dateStr)"
                >
                  <span class="day-name">{{ d.dayLabel }}</span>
                  <span class="day-number">{{ d.dayNum }}</span>
                </div>
              </div>

              <!-- Step 2: Time Slots Grid -->
              <label class="section-label">2. Chọn ca khám còn trống:</label>
              <div v-if="loadingSlots" class="slots-loading">
                <i class="fas fa-spinner fa-spin"></i> Đang tìm ca khám trống của bác sĩ...
              </div>
              <div v-else-if="slots.length === 0" class="no-slots">
                Bác sĩ không có lịch trực khả dụng trong ngày này. Vui lòng chọn ngày khác.
              </div>
              <div v-else class="slots-grid">
                <button 
                  v-for="slot in slots" 
                  :key="slot.id" 
                  class="slot-btn"
                  :class="{ active: selectedSlotId === slot.id, booked: slot.isBooked }"
                  :disabled="slot.isBooked"
                  @click="selectedSlotId = slot.id"
                >
                  <span>{{ formatTime(slot.startTime) }}</span>
                  <span class="slot-status">{{ slot.isBooked ? 'Đã đặt' : 'Còn trống' }}</span>
                </button>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" @click="showReschedule = false">Hủy bỏ</button>
              <button 
                class="btn-cta" 
                :disabled="!selectedSlotId || savingReschedule" 
                @click="submitReschedule"
              >
                <span v-if="savingReschedule"><i class="fas fa-spinner fa-spin"></i> Đang lưu lịch mới...</span>
                <span v-else><i class="fas fa-check"></i> Xác nhận đổi lịch</span>
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Error State -->
      <div v-if="error" class="error-msg-premium animate-fade-in">
        <div class="error-icon"><i class="fas fa-exclamation-triangle" /></div>
        <div class="error-details">
          <h3>Tra cứu không thành công</h3>
          <p>{{ error }}</p>
        </div>
      </div>

      <!-- Welcome / Guide Section (Visible when no search is performed yet) -->
      <div v-if="!appointment" class="welcome-guide-section">
        <h2 class="section-title-premium"><i class="fas fa-compass"></i> Hướng dẫn & Hỗ trợ tra cứu</h2>
        
        <div class="guide-steps-grid">
          <div class="guide-step-card hover-glow">
            <div class="step-badge">1</div>
            <div class="step-icon-bg"><i class="fas fa-envelope-open-text"></i></div>
            <h3>Kiểm tra Hộp thư</h3>
            <p>Mã lịch hẹn đã được gửi tự động về địa chỉ Email hoặc Số điện thoại bạn cung cấp khi đặt lịch khám thành công.</p>
          </div>

          <div class="guide-step-card hover-glow">
            <div class="step-badge">2</div>
            <div class="step-icon-bg"><i class="fas fa-paste"></i></div>
            <h3>Sao chép & Tra cứu</h3>
            <p>Điền mã lịch hẹn (dạng mã hash ngắn hoặc chuỗi ký tự) vào thanh tra cứu phía trên và nhấn nút "Tra cứu".</p>
          </div>

          <div class="guide-step-card hover-glow">
            <div class="step-badge">3</div>
            <div class="step-icon-bg"><i class="fas fa-tasks"></i></div>
            <h3>Quản lý lịch hẹn</h3>
            <p>Theo dõi tiến trình khám bệnh trực tuyến, in phiếu khám hoặc chủ động đổi ca khám và hủy lịch khám.</p>
          </div>
        </div>

        <!-- FAQs Accordion -->
        <div class="faq-container-premium">
          <h2 class="section-title-premium text-center" style="justify-content: center;"><i class="fas fa-question-circle"></i> Câu hỏi thường gặp</h2>
          
          <div class="faq-accordion">
            <div class="faq-card" v-for="(faq, index) in faqs" :key="index">
              <div class="faq-q" @click="faq.open = !faq.open">
                <span>{{ faq.q }}</span>
                <i class="fas" :class="faq.open ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </div>
              <transition name="expand">
                <div class="faq-a" v-if="faq.open">
                  <p>{{ faq.a }}</p>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Hotline Banner -->
        <div class="hotline-banner-card glass-panel-dark animate-pulse">
          <div class="hotline-content">
            <i class="fas fa-phone-alt phone-icon" />
            <div class="text-group">
              <h3>Bạn gặp khó khăn khi tìm kiếm mã lịch hẹn?</h3>
              <p>Liên hệ ngay Tổng đài Chăm sóc khách hàng của Medicare để được tổng đài viên hỗ trợ tra cứu trực tiếp và cấp lại mã khám của bạn nhanh nhất.</p>
            </div>
          </div>
          <a href="tel:19006789" class="hotline-btn">
            <i class="fas fa-headset" /> 1900 6789 (Hỗ trợ 24/7)
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import Navbar from '@/components/Navbar.vue'
  import { publicApi } from '@/services/api'

  const route = useRoute()
  const searchCode = ref('')
  const appointment = ref(null)
  const loading = ref(false)
  const error = ref('')
  const lastStatus = ref(null)
  let trackingInterval = null

  function playSuccessSound () {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const playNote = (frequency, startTime, duration) => {
        const osc = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(frequency, startTime)
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
        osc.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        osc.start(startTime)
        osc.stop(startTime + duration)
      }
      const now = audioCtx.currentTime
      playNote(523.25, now, 0.4) // C5
      playNote(659.25, now + 0.12, 0.5) // E5
    } catch (error) {
      console.error('Failed to play notification sound:', error)
    }
  }

  async function pollTrackedAppointment () {
    if (!appointment.value) return
    try {
      const res = await publicApi.get(`/Appointments/track/${appointment.value.id}`)
      const newStatus = res.data.status
      if (lastStatus.value === 0 && newStatus === 1) {
        playSuccessSound()
        const displayCode = res.data.qrToken || appointment.value.id.toString().substring(0, 8).toUpperCase()
        alert(`🔔 Thông báo Medicare: Lịch hẹn khám ${displayCode} của bạn đã được phê duyệt thành công!`)
      }
      lastStatus.value = newStatus
      appointment.value = res.data
    } catch (e) {
      console.error('Lỗi khi cập nhật trạng thái lịch hẹn:', e)
    }
  }

  // Symptom Editing Feature States
  const isEditingReason = ref(false)
  const editReasonText = ref('')
  const savingReason = ref(false)

  // Rescheduling Feature States
  const showReschedule = ref(false)
  const selectedDate = ref('')
  const loadingSlots = ref(false)
  const slots = ref([])
  const selectedSlotId = ref('')
  const savingReschedule = ref(false)

  const faqs = ref([
    {
      q: 'Lấy mã tra cứu lịch hẹn ở đâu?',
      a: 'Sau khi bạn đặt lịch trực tuyến thành công, Medicare sẽ gửi một email xác nhận có chứa Mã lịch hẹn (VD: #550E8400) đến địa chỉ email của bạn. Vui lòng kiểm tra kỹ cả hộp thư rác (Spam).',
      open: false
    },
    {
      q: 'Tôi có thể thay đổi thời gian khám bệnh trực tuyến không?',
      a: 'Hoàn toàn được! Nếu lịch của bạn ở trạng thái Chờ duyệt hoặc Đã xác nhận, bạn có thể click vào nút "Đổi ngày/giờ khám" ngay tại trang này để chọn một khung giờ mới của bác sĩ mà không cần đặt lại từ đầu.',
      open: false
    },
    {
      q: 'Có thể in phiếu khám bệnh ở đâu?',
      a: 'Sau khi tra cứu thành công lịch hẹn của mình, bạn có thể click vào nút "In phiếu khám" trên màn hình. Phiếu này có chứa đầy đủ thông tin số thứ tự giúp bạn đăng ký làm thủ tục nhanh tại quầy tự động.',
      open: false
    }
  ])

  const canAction = computed(() => {
    if (!appointment.value) return false
    const status = appointment.value.status
    return status === 0 || status === 1
  })

  // Date list for rescheduling (next 7 days starting today)
  const next7Days = computed(() => {
    const list = []
    const dayLabels = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      const dateStr = d.toISOString().split('T')[0]
      const dayLabel = i === 0 ? 'Hôm nay' : dayLabels[d.getDay()]
      const dayNum = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
      list.push({ dateStr, dayLabel, dayNum })
    }
    return list
  })

  async function handleSearch () {
    const cleanCode = searchCode.value.trim().replace('#', '')
    if (!cleanCode) return

    loading.value = true
    error.value = ''
    appointment.value = null
    if (trackingInterval) {
      clearInterval(trackingInterval)
      trackingInterval = null
    }

    try {
      const res = await publicApi.get(`/Appointments/track/${cleanCode}`)
      appointment.value = res.data
      lastStatus.value = res.data.status
      editReasonText.value = res.data.reason || ''
      
      trackingInterval = setInterval(pollTrackedAppointment, 5000)
    } catch (error_) {
      error.value = error_.response?.data || 'Không tìm thấy thông tin lịch hẹn. Vui lòng kiểm tra lại mã.'
      console.error(error_)
    } finally {
      loading.value = false
    }
  }

  // Symptom editing logic
  function startEditReason () {
    editReasonText.value = appointment.value.reason || ''
    isEditingReason.value = true
  }

  async function saveReason () {
    if (!editReasonText.value.trim()) return
    savingReason.value = true
    try {
      await publicApi.put(`/Appointments/${appointment.value.id}/reason`, {
        reason: editReasonText.value.trim()
      })
      appointment.value.reason = editReasonText.value.trim()
      isEditingReason.value = false
      alert('Đã cập nhật triệu chứng thành công!')
    } catch (e) {
      alert('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.')
      console.error(e)
    } finally {
      savingReason.value = false
    }
  }

  // Rescheduling modal and date loading logic
  function openReschedule () {
    selectedSlotId.value = ''
    slots.value = []
    selectedDate.value = next7Days.value[0].dateStr
    showReschedule.value = true
    loadSlots(selectedDate.value)
  }

  async function loadSlots (date) {
    loadingSlots.value = true
    slots.value = []
    selectedSlotId.value = ''
    try {
      const res = await publicApi.get(`/Doctors/${appointment.value.doctorId}/slots?date=${date}`)
      slots.value = res.data
    } catch (e) {
      console.error('Failed to load slots', e)
    } finally {
      loadingSlots.value = false
    }
  }

  function selectDate (dateStr) {
    selectedDate.value = dateStr
    loadSlots(dateStr)
  }

  async function submitReschedule () {
    if (!selectedSlotId.value) return
    savingReschedule.value = true
    try {
      await publicApi.put(`/Appointments/${appointment.value.id}/reschedule`, {
        newSlotId: selectedSlotId.value
      })
      alert('Đổi ngày và giờ khám thành công!')
      showReschedule.value = false
      handleSearch() // Refresh tracking page data
    } catch (e) {
      alert(e.response?.data || 'Không thể đổi lịch khám. Vui lòng chọn ca khám khác.')
      console.error(e)
    } finally {
      savingReschedule.value = false
    }
  }

  async function handleCancel () {
    if (!confirm('Bạn có chắc chắn muốn hủy lịch hẹn khám này không? Thao tác này không thể hoàn tác.')) return

    try {
      await publicApi.put(`/Appointments/${appointment.value.id}/cancel`)
      alert('Đã hủy lịch hẹn khám thành công.')
      handleSearch() // Refresh data
    } catch (e) {
      alert('Có lỗi xảy ra khi hủy lịch. Vui lòng liên hệ hotline.')
    }
  }

  function handlePrint () {
    window.print()
  }

  function translateStatus (s) {
    const map = {
      0: 'Chờ duyệt',
      1: 'Đã xác nhận',
      2: 'Đã hoàn thành',
      3: 'Đã hủy',
    }
    return map[s] || 'Không xác định'
  }

  function getStatusClass (s) {
    const map = {
      0: 'pending',
      1: 'confirmed',
      2: 'completed',
      3: 'cancelled',
    }
    return map[s] || ''
  }

  function getStatusIcon (s) {
    const map = {
      0: 'fa-hourglass-half',
      1: 'fa-check-circle',
      2: 'fa-check-double',
      3: 'fa-times-circle',
    }
    return map[s] || 'fa-info-circle'
  }

  function getStepClass (stepIndex, status) {
    if (status === 3) return 'cancelled'
    
    if (status === 2 && stepIndex <= 3) return 'active'
    if (status === 1 && stepIndex <= 2) return 'active'
    if (status === 0 && stepIndex <= 1) return 'active'

    return ''
  }

  function formatDate (dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  function formatTime (timeStr) {
    if (!timeStr) return ''
    return timeStr.substring(0, 5)
  }

  onMounted(() => {
    const code = route.query.code
    if (code) {
      searchCode.value = code
      handleSearch()
    }
  })

  onUnmounted(() => {
    if (trackingInterval) {
      clearInterval(trackingInterval)
    }
  })
</script>

<style scoped>
.track-page {
  min-height: 100vh;
  background: var(--off-white);
  padding-bottom: 6rem;
}

.track-header {
  background: #f8fafc;
  position: relative;
  overflow: hidden;
  padding: 8rem 0 6rem 0;
  text-align: center;
}

.header-container {
  position: relative;
  z-index: 2;
}

.header-tag {
  display: inline-block;
  background: var(--cobalt-pale);
  color: var(--cobalt);
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 0.5rem 1.25rem;
  border-radius: 30px;
  margin-bottom: 1.5rem;
}

.track-header h1 {
  font-size: 3rem;
  font-weight: 850;
  color: var(--gray-900);
  margin-bottom: 1rem;
  letter-spacing: -1px;
}

.track-header p {
  font-size: 1.15rem;
  color: var(--gray-600);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.7;
}

.header-wave {
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  line-height: 0;
  z-index: 1;
}

.header-wave svg {
  display: block;
  width: 100%;
  height: 40px;
}

.main-content {
  margin-top: -3.5rem;
  position: relative;
  z-index: 10;
}

/* Search Bar Card */
.search-section {
  max-width: 800px;
  margin: 0 auto 4rem auto;
}

.search-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 1.25rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.5rem 0.5rem 0.5rem 1.5rem;
  border-radius: 20px;
  border: 1px solid var(--gray-200);
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: var(--cobalt);
  box-shadow: 0 0 0 4px var(--cobalt-pale);
}

.search-icon {
  font-size: 1.4rem;
  color: var(--cobalt);
}

.search-input {
  flex: 1;
  border: none;
  font-size: 1.1rem;
  outline: none;
  font-weight: 600;
  color: var(--gray-900);
}

.search-btn {
  padding: 0.85rem 2.2rem;
  border-radius: 16px;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Premium Result Card */
.appointment-detail-card {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--gray-100);
  position: relative;
}

.card-top-accent {
  height: 6px;
  width: 100%;
  background: var(--cobalt);
}
.card-top-accent.pending { background: #f59e0b; }
.card-top-accent.confirmed { background: #10b981; }
.card-top-accent.completed { background: #3b82f6; }
.card-top-accent.cancelled { background: #ef4444; }

.card-header-premium {
  padding: 2.5rem;
  border-bottom: 1px solid var(--gray-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gray-50);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.appointment-id-badge {
  font-size: 1.15rem;
  color: var(--gray-850);
}
.appointment-id-badge strong {
  color: var(--cobalt);
  font-weight: 850;
  font-size: 1.4rem;
  letter-spacing: 0.5px;
}

.created-date {
  font-size: 0.85rem;
  color: var(--gray-500);
  font-weight: 600;
}

.status-badge-glow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.6rem 1.5rem;
  border-radius: 30px;
  font-size: 0.95rem;
  font-weight: 800;
  text-transform: uppercase;
}

.status-badge-glow.pending { background: #fffbeb; color: #d97706; box-shadow: 0 0 12px rgba(217,119,6,0.1); }
.status-badge-glow.confirmed { background: #ecfdf5; color: #059669; box-shadow: 0 0 12px rgba(5,150,105,0.1); }
.status-badge-glow.completed { background: #eff6ff; color: #2563eb; box-shadow: 0 0 12px rgba(37,99,235,0.1); }
.status-badge-glow.cancelled { background: #fef2f2; color: #dc2626; box-shadow: 0 0 12px rgba(220,38,38,0.1); }

/* Timeline design */
.timeline-wrapper {
  padding: 2.5rem 2.5rem 0 2.5rem;
}
.timeline-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--gray-800);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.process-timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 1rem;
  gap: 1rem;
}
.process-timeline::before {
  content: "";
  position: absolute;
  top: 20px;
  left: 30px;
  right: 30px;
  height: 4px;
  background: var(--gray-200);
  z-index: 1;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
  text-align: center;
}

.timeline-step .step-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  border: 4px solid var(--gray-200);
  color: var(--gray-400);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.timeline-step .step-label {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gray-400);
  transition: all 0.3s ease;
}

.timeline-step.active .step-icon {
  border-color: var(--cobalt);
  background: var(--cobalt);
  color: white;
  box-shadow: 0 0 15px rgba(0,71,171,0.3);
}

.timeline-step.active .step-label {
  color: var(--cobalt);
}

.timeline-step.cancelled .step-icon {
  border-color: var(--red);
  background: var(--red);
  color: white;
}
.timeline-step.cancelled .step-label {
  color: var(--red);
}

/* Card Body Widgets */
.card-body-premium {
  padding: 2.5rem;
}

.info-grid-premium {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.info-card-widget {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  background: var(--gray-50);
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid var(--gray-100);
}

.full-width-widget {
  grid-column: span 2;
}

.widget-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.widget-icon.bg-blue { background: rgba(0, 71, 171, 0.1); color: var(--cobalt); }
.widget-icon.bg-indigo { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
.widget-icon.bg-emerald { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.widget-icon.bg-amber { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.widget-icon.bg-purple { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }

.widget-content {
  flex: 1;
}

.widget-content label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--gray-500);
  letter-spacing: 0.5px;
  margin-bottom: 0.4rem;
}

.widget-content p {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
}

.widget-content .patient-name {
  color: var(--cobalt);
}

.widget-content .sub-label {
  font-size: 0.8rem;
  color: var(--gray-500);
  font-weight: 600;
}

.reason-text {
  font-size: 1rem !important;
  font-weight: 500 !important;
  color: var(--gray-700) !important;
  line-height: 1.6;
}

/* Footer style */
.card-footer-premium {
  padding: 2rem 2.5rem;
  background: var(--gray-50);
  border-top: 1px solid var(--gray-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-actions {
  display: flex;
  gap: 1rem;
}

.btn-print {
  background: white;
  border: 1.5px solid var(--gray-300);
  padding: 0.85rem 1.8rem;
  border-radius: 14px;
  font-weight: 700;
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-print:hover {
  border-color: var(--cobalt);
  color: var(--cobalt);
  box-shadow: 0 4px 12px rgba(0,71,171,0.06);
}

.btn-reschedule {
  background: var(--cobalt-pale);
  border: none;
  padding: 0.85rem 1.8rem;
  border-radius: 14px;
  font-weight: 700;
  color: var(--cobalt);
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-reschedule:hover {
  background: rgba(0, 71, 171, 0.15);
  transform: translateY(-1px);
}

.btn-danger-premium {
  background: var(--red-light);
  color: var(--red);
  border: none;
  padding: 0.85rem 1.8rem;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-danger-premium:hover {
  background: #fecaca;
  transform: translateY(-1px);
}

.locked-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b45309;
  font-weight: 600;
  font-size: 0.85rem;
  background: #fffbeb;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: 1px solid #fde68a;
}

/* Modal overlay styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 600px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--gray-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.3rem;
  font-weight: 850;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--gray-400);
  cursor: pointer;
  transition: 0.2s;
}
.btn-close:hover { color: var(--gray-900); }

.modal-body {
  padding: 2rem;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-subtitle {
  font-size: 1.05rem;
  color: var(--gray-600);
  margin-bottom: 1.5rem;
}

.section-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--gray-500);
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
}

/* Date Pill Carousel */
.dates-carousel {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}
.dates-carousel::-webkit-scrollbar {
  height: 4px;
}
.dates-carousel::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 4px;
}

.date-pill {
  flex: 0 0 85px;
  background: var(--gray-50);
  border: 1.5px solid var(--gray-200);
  border-radius: 16px;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}
.date-pill:hover { border-color: var(--gray-400); }
.date-pill.active {
  background: var(--cobalt-pale);
  border-color: var(--cobalt);
  box-shadow: 0 4px 12px rgba(0,71,171,0.08);
}
.date-pill .day-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gray-500);
  margin-bottom: 0.25rem;
}
.date-pill.active .day-name { color: var(--cobalt); }
.date-pill .day-number {
  font-size: 1rem;
  font-weight: 800;
  color: var(--gray-800);
}
.date-pill.active .day-number { color: var(--cobalt); }

/* Slots Grid */
.slots-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.slot-btn {
  background: white;
  border: 1.5px solid var(--gray-200);
  border-radius: 12px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.slot-btn:hover:not(.booked) {
  border-color: var(--cobalt);
  background: var(--gray-50);
}
.slot-btn.active {
  background: var(--cobalt) !important;
  border-color: var(--cobalt) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(0,71,171,0.2);
}
.slot-btn.booked {
  background: var(--gray-100);
  border-color: var(--gray-200);
  color: var(--gray-400);
  cursor: not-allowed;
}
.slot-status {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}
.slot-btn.active .slot-status { color: rgba(255,255,255,0.8); }

.slots-loading, .no-slots {
  text-align: center;
  padding: 2.5rem;
  color: var(--gray-500);
  font-weight: 600;
  border: 1.5px dashed var(--gray-200);
  border-radius: 16px;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--gray-100);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  background: white;
  border: 1.5px solid var(--gray-300);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  color: var(--gray-600);
  cursor: pointer;
  transition: 0.2s;
}
.btn-cancel:hover { border-color: var(--gray-500); color: var(--gray-800); }

/* Symptoms Editing */
.btn-edit-reason {
  background: transparent;
  border: none;
  color: var(--cobalt);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 0.75rem;
  transition: 0.2s;
}
.btn-edit-reason:hover {
  color: var(--cobalt-dark);
  text-decoration: underline;
}

.edit-reason-box {
  width: 100%;
  margin-top: 0.5rem;
}

.edit-reason-input {
  width: 100%;
  height: 85px;
  border: 1.5px solid var(--gray-200);
  border-radius: 12px;
  padding: 0.75rem;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  outline: none;
  resize: none;
  transition: 0.2s;
}
.edit-reason-input:focus {
  border-color: var(--cobalt);
  box-shadow: 0 0 0 3px var(--cobalt-pale);
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-save-reason {
  background: var(--cobalt);
  color: white;
  border: none;
  padding: 0.4rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}
.btn-save-reason:hover { background: var(--cobalt-dark); }

.btn-cancel-reason {
  background: var(--gray-200);
  color: var(--gray-700);
  border: none;
  padding: 0.4rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}
.btn-cancel-reason:hover { background: var(--gray-300); }

/* Welcome & Guide */
.welcome-guide-section {
  margin-top: 5rem;
}

.section-title-premium {
  font-size: 1.8rem;
  font-weight: 850;
  color: var(--gray-900);
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.guide-steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-bottom: 5rem;
}

.guide-step-card {
  background: white;
  border: 1px solid var(--gray-100);
  border-radius: 24px;
  padding: 2.5rem;
  position: relative;
  transition: all 0.3s ease;
}

.step-badge {
  position: absolute;
  top: -15px;
  left: 30px;
  width: 36px;
  height: 36px;
  background: var(--cobalt);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  box-shadow: 0 4px 10px rgba(0,71,171,0.25);
}

.step-icon-bg {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: var(--cobalt-pale);
  color: var(--cobalt);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.guide-step-card h3 {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: 0.75rem;
}

.guide-step-card p {
  color: var(--gray-500);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Collapsible FAQ accordion styling */
.faq-container-premium {
  max-width: 800px;
  margin: 0 auto 5rem auto;
}

.faq-accordion {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-card {
  background: white;
  border: 1px solid var(--gray-100);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.25s ease;
}
.faq-card:hover { border-color: var(--gray-300); }

.faq-q {
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 750;
  font-size: 1.05rem;
  color: var(--gray-800);
  user-select: none;
}

.faq-a {
  padding: 0 2rem 1.5rem 2rem;
  color: var(--gray-500);
  font-size: 0.95rem;
  line-height: 1.6;
  border-top: 1px solid var(--gray-50);
  background: var(--gray-50);
}

/* Hotline Card styling */
.hotline-banner-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3rem;
  border-radius: var(--radius-xl);
  margin-bottom: 2rem;
  gap: 2rem;
}

.hotline-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.phone-icon {
  font-size: 3rem;
  color: var(--cobalt-pale);
}

.hotline-content h3 {
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
}

.hotline-content p {
  color: rgba(255,255,255,0.7);
  font-size: 1rem;
  line-height: 1.5;
  max-width: 600px;
}

.hotline-btn {
  background: white;
  color: var(--gray-900);
  padding: 1rem 2rem;
  border-radius: 16px;
  font-weight: 800;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.hotline-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255,255,255,0.25);
  background: var(--cobalt-pale);
  color: var(--cobalt);
}

/* Error details */
.error-msg-premium {
  max-width: 600px;
  margin: 3rem auto;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.error-icon {
  font-size: 2.5rem;
  color: var(--red);
}

.error-details h3 {
  font-weight: 800;
  color: var(--red-dark);
  margin-bottom: 0.25rem;
}

.error-details p {
  color: #991b1b;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Page transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.expand-enter-active, .expand-leave-active { transition: all 0.25s ease-out; max-height: 200px; overflow: hidden; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }

/* Responsive */
@media (max-width: 992px) {
  .process-timeline { flex-direction: column; gap: 2rem; }
  .process-timeline::before { display: none; }
  .info-grid-premium { grid-template-columns: 1fr; }
  .full-width-widget { grid-column: span 1; }
  .guide-steps-grid { grid-template-columns: 1fr; }
  .hotline-banner-card { flex-direction: column; text-align: center; }
  .hotline-content { flex-direction: column; }
  .card-footer-premium { flex-direction: column; gap: 1rem; align-items: stretch; }
  .left-actions { flex-direction: column; }
}

/* Print styling optimization */
@media print {
  .navbar, .search-section, .card-footer-premium, .welcome-guide-section { display: none !important; }
  .appointment-detail-card { box-shadow: none !important; border: none !important; }
  .track-header { padding: 2rem 0 !important; }
  .card-body-premium { padding: 0 !important; }
}
</style>
