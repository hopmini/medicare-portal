<template>
  <div class="ai-consultant-wrapper">
    <!-- Floating Chat Trigger Button -->
    <button class="ai-floating-btn shadow-lg" :class="{ 'ai-floating-btn--active': isOpen }" @click="toggleChat">
      <div class="ai-icon-inner">
        <i v-if="!isOpen" class="fas fa-robot animate-pulse-gentle" />
        <i v-else class="fas fa-times" />
      </div>
      <span v-if="!isOpen && showTooltip" class="ai-tooltip">Tư vấn khám AI 🤖</span>
    </button>

    <!-- Chat Panel Window -->
    <transition name="chat-slide">
      <div v-if="isOpen" class="ai-chat-window glass-panel shadow-2xl">
        <!-- Chat Header -->
        <div class="ai-chat-header">
          <div class="ai-header-info">
            <div class="ai-avatar-glow">
              <i class="fas fa-brain" />
            </div>
            <div>
              <h3>Medicare AI Assistant</h3>
              <span class="status-online"><span class="dot"></span>Sẵn sàng tư vấn lâm sàng</span>
            </div>
          </div>
          <button class="btn-close-chat" @click="toggleChat">&times;</button>
        </div>

        <!-- Chat Messages Area -->
        <div ref="messagesContainer" class="ai-chat-messages">
          <div v-for="(msg, idx) in messages" :key="idx" :class="['message-row', msg.sender === 'user' ? 'msg-user' : 'msg-ai']">
            <div class="message-bubble shadow-sm">
              <!-- Text response -->
              <span v-html="msg.text"></span>

              <!-- Diagnostics card if present -->
              <div v-if="msg.diagnostics" class="diagnostics-card animate-scale-up">
                <div class="diag-header">
                  <i class="fas fa-stethoscope" />
                  <strong>KẾT QUẢ PHÂN TÍCH LÂM SÀNG (AI)</strong>
                </div>
                <div class="diag-body">
                  <div class="diag-item">
                    <span class="diag-label">Chuyên khoa đề xuất:</span>
                    <strong class="diag-value text-blue">{{ msg.diagnostics.specialty }}</strong>
                  </div>
                  <div class="diag-item">
                    <span class="diag-label">Mức độ khẩn cấp:</span>
                    <span :class="['urgency-badge', getUrgencyClass(msg.diagnostics.urgency)]">
                      <i class="fas fa-exclamation-triangle" style="margin-right: 4px;" />
                      {{ msg.diagnostics.urgency }}
                    </span>
                  </div>
                  <div class="diag-item">
                    <span class="diag-label">Dịch vụ đề nghị:</span>
                    <strong class="diag-value">{{ msg.diagnostics.recommendedService }}</strong>
                  </div>
                  <div class="diag-note">
                    <i class="fas fa-info-circle" />
                    Kết quả phân tích dựa trên triệu chứng lâm sàng sơ bộ và không thay thế chỉ định trực tiếp từ bác sĩ chuyên khoa.
                  </div>
                </div>
                <div class="diag-actions">
                  <button class="btn-book-now" @click="redirectToBooking(msg.diagnostics.specialty, msg.diagnostics.serviceId)">
                    Đặt lịch khám ngay <i class="fas fa-arrow-right" />
                  </button>
                </div>
              </div>
            </div>
            <span class="message-time">{{ msg.time }}</span>
          </div>

          <!-- Typing indicator loader -->
          <div v-if="isTyping" class="message-row msg-ai">
            <div class="message-bubble typing-bubble">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>

        <!-- Chat Input Area -->
        <div class="ai-chat-input-area">
          <div class="quick-prompts">
            <button v-for="(q, idx) in suggestedQuestions" :key="idx" class="btn-quick-prompt" @click="sendQuickPrompt(q.prompt)">{{ q.text }}</button>
          </div>
          <div class="input-container">
            <input
              v-model="userInput"
              placeholder="Nhập triệu chứng của bạn (Ví dụ: đau bụng, ho sốt...)"
              type="text"
              class="ai-input"
              @keyup.enter="handleSend"
            />
            <button class="btn-send-chat" :disabled="!userInput.trim()" @click="handleSend">
              <i class="fas fa-paper-plane" />
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { chatWithGroq, fetchServices, fetchDoctors } from '@/services/groqService'

const router = useRouter()
const authStore = useAuthStore()
const isOpen = ref(false)
const showTooltip = ref(true)
const userInput = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)
const medicalServices = ref([])
const doctors = ref([])

const userRole = computed(() => {
  return authStore.user?.role || 'Patient'
})

const suggestedQuestions = computed(() => {
  const role = userRole.value
  if (role === 'Admin') {
    return [
      { text: 'Tổng quan hoạt động hôm nay?', prompt: 'Tổng quan hoạt động phòng khám hôm nay thế nào?' },
      { text: 'Lịch hẹn chờ duyệt', prompt: 'Có bao nhiêu lịch hẹn đang chờ duyệt?' },
      { text: 'Danh sách dịch vụ', prompt: 'Phòng khám có những dịch vụ gì?' },
      { text: 'Bác sĩ đang làm việc', prompt: 'Danh sách bác sĩ đang làm việc tại phòng khám?' }
    ]
  }
  if (role === 'Doctor') {
    return [
      { text: 'Lịch hẹn hôm nay', prompt: 'Lịch hẹn khám hôm nay của tôi thế nào?' },
      { text: 'Bác sĩ cùng khoa', prompt: 'Ai là bác sĩ tim mạch?' },
      { text: 'Triệu chứng đau bụng', prompt: 'Tôi bị đau bụng và ợ chua' },
      { text: 'Tra cứu thuốc', prompt: 'Paracetamol có tác dụng gì?' }
    ]
  }
  if (role === 'Receptionist') {
    return [
      { text: 'Lịch hẹn hôm nay', prompt: 'Danh sách lịch hẹn hôm nay thế nào?' },
      { text: 'Bác sĩ trực', prompt: 'Bác sĩ nào đang trực hôm nay?' },
      { text: 'Dịch vụ khám', prompt: 'Các dịch vụ khám đang có?' },
      { text: 'Hỗ trợ đặt lịch', prompt: 'Hướng dẫn đặt lịch khám cho bệnh nhân' }
    ]
  }
  return [
    { text: 'Đau bụng, ợ chua', prompt: 'Tôi bị đau dạ dày và ợ chua' },
    { text: 'Sốt, ho kéo dài', prompt: 'Bị sốt ho kéo dài 3 ngày nay' },
    { text: 'Đau răng buốt', prompt: 'Bị đau răng đau nướu buốt' },
    { text: 'Bác sĩ tim mạch', prompt: 'Có bác sĩ tim mạch nào không?' }
  ]
})

onMounted(async () => {
  medicalServices.value = await fetchServices()
  doctors.value = await fetchDoctors()
})

const messages = ref([
  {
    sender: 'ai',
    text: 'Xin chào! Tôi là Trợ lý AI của Medicare. Hãy đặt câu hỏi về sức khỏe, bác sĩ, dịch vụ hoặc hệ thống để tôi hỗ trợ nhé!',
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }
])

function toggleChat() {
  isOpen.value = !isOpen.value
  showTooltip.value = false
  if (isOpen.value) {
    scrollToBottom()
  }
}

function sendQuickPrompt(promptText) {
  userInput.value = promptText
  handleSend()
}

function getUrgencyClass(urgency) {
  if (!urgency) return 'urgency-low'
  if (urgency.includes('Khẩn cấp')) return 'urgency-high'
  if (urgency.includes('Trung bình')) return 'urgency-medium'
  return 'urgency-low'
}

function redirectToBooking(specialty, serviceId) {
  isOpen.value = false
  const query = { autoSpecialty: specialty }
  if (serviceId) query.serviceId = serviceId
  router.push({ path: '/patient', query })
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

async function handleSend() {
  const text = userInput.value.trim()
  if (!text) return

  messages.value.push({
    sender: 'user',
    text: text,
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  })

  userInput.value = ''
  isTyping.value = true
  scrollToBottom()

  const groqMessages = messages.value
    .filter(m => m.sender === 'ai' || m.sender === 'user')
    .slice(-10)
    .map(m => ({ role: m.sender === 'ai' ? 'assistant' : 'user', content: m.text }))

  const result = await chatWithGroq(groqMessages, medicalServices.value, doctors.value, userRole.value)

  isTyping.value = false
  messages.value.push({
    sender: 'ai',
    text: result.reply,
    diagnostics: result.specialty ? {
      specialty: result.specialty,
      urgency: result.urgency || 'Trung bình',
      recommendedService: result.recommendedService || 'Khám tổng quát',
      serviceId: result.serviceId || undefined
    } : null,
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  })
  scrollToBottom()
}
</script>

<style scoped>
.ai-consultant-wrapper {
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 9999;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.ai-floating-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0047AB 0%, #1e40af 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 25px rgba(0, 71, 171, 0.4);
}

.ai-floating-btn:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 15px 30px rgba(0, 71, 171, 0.5);
}

.ai-floating-btn--active {
  background: #1e293b;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.3);
}

.ai-icon-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-tooltip {
  position: absolute;
  right: 75px;
  background: #0f172a;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: tooltipFadeIn 0.3s forwards;
}

.ai-tooltip::after {
  content: '';
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 5px 0 5px 5px;
  border-style: solid;
  border-color: transparent transparent transparent #0f172a;
}

.ai-chat-window {
  position: absolute;
  bottom: 75px;
  right: 0;
  width: 380px;
  height: 520px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: bottom right;
}

.ai-chat-header {
  padding: 16px;
  background: linear-gradient(135deg, #0047AB 0%, #1e40af 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar-glow {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.ai-header-info h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.status-online {
  font-size: 0.75rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-online .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
  box-shadow: 0 0 8px #10b981;
}

.btn-close-chat {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.btn-close-chat:hover {
  opacity: 1;
}

.ai-chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #f8fafc;
}

.message-row {
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.msg-user {
  align-self: flex-end;
  align-items: flex-end;
}

.msg-ai {
  align-self: flex-start;
  align-items: flex-start;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 0.9rem;
  line-height: 1.5;
}

.msg-user .message-bubble {
  background: #0047AB;
  color: white;
  border-bottom-right-radius: 4px;
}

.msg-ai .message-bubble {
  background: white;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 0.7rem;
  color: #94a3b8;
  margin-top: 4px;
  font-weight: 600;
}

/* Diagnostics Card */
.diagnostics-card {
  margin-top: 12px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  overflow: hidden;
  text-align: left;
}

.diag-header {
  background: #e0f2fe;
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 800;
  color: #0369a1;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid #bae6fd;
}

.diag-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.diag-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
}

.diag-label {
  color: #64748b;
  font-weight: 500;
}

.diag-value {
  color: #0f172a;
  font-weight: 700;
}

.text-blue {
  color: #0047AB;
}

.urgency-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
}

.urgency-low {
  background: #d1fae5;
  color: #065f46;
}

.urgency-medium {
  background: #fef3c7;
  color: #d97706;
}

.urgency-high {
  background: #fee2e2;
  color: #b91c1c;
}

.diag-note {
  font-size: 0.72rem;
  color: #64748b;
  line-height: 1.4;
  border-top: 1px dashed #bae6fd;
  padding-top: 8px;
  margin-top: 4px;
  display: flex;
  gap: 4px;
}

.diag-actions {
  padding: 8px 12px;
  background: #e0f2fe;
  border-top: 1px solid #bae6fd;
  text-align: center;
}

.btn-book-now {
  width: 100%;
  background: linear-gradient(135deg, #0047AB 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: opacity 0.2s;
}

.btn-book-now:hover {
  opacity: 0.9;
}

/* Typing indicator bubble */
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px !important;
}

.typing-bubble .dot {
  width: 6px;
  height: 6px;
  background: #94a3b8;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-bubble .dot:nth-child(1) { animation-delay: -0.32s; }
.typing-bubble .dot:nth-child(2) { animation-delay: -0.16s; }

/* Input area styling */
.ai-chat-input-area {
  padding: 12px;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-prompts {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.quick-prompts::-webkit-scrollbar {
  height: 0;
}

.btn-quick-prompt {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.btn-quick-prompt:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.input-container {
  display: flex;
  gap: 8px;
}

.ai-input {
  flex: 1;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
}

.ai-input:focus {
  border-color: #0047AB;
}

.btn-send-chat {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #0047AB;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-send-chat:hover:not(:disabled) {
  background: #1e40af;
}

.btn-send-chat:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* Animations */
@keyframes tooltipFadeIn {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}

.chat-slide-enter-active, .chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.chat-slide-enter-from, .chat-slide-leave-to {
  opacity: 0;
  transform: scale(0.8) translate(20px, 20px);
}
</style>
