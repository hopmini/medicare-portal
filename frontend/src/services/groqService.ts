const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || ''

let cachedServices: any[] | null = null
let cachedDoctors: any[] | null = null

export async function fetchServices(): Promise<any[]> {
  if (cachedServices) return cachedServices
  try {
    const res = await fetch(`${GATEWAY_URL}/api/appointment/public/MedicalServices`)
    if (res.ok) {
      cachedServices = await res.json()
      return cachedServices || []
    }
  } catch (e) {
    console.error('Failed to fetch services:', e)
  }
  return []
}

export async function fetchDoctors(): Promise<any[]> {
  if (cachedDoctors) return cachedDoctors
  try {
    const res = await fetch(`${GATEWAY_URL}/api/appointment/public/Doctors`)
    if (res.ok) {
      cachedDoctors = await res.json()
      return cachedDoctors || []
    }
  } catch (e) {
    console.error('Failed to fetch doctors:', e)
  }
  return []
}

function extractJson(text: string): any | null {
  const match = text.match(/\{[\s\S]*\}/)
  if (match) {
    try {
      return JSON.parse(match[0])
    } catch { /* ignore */ }
  }
  return null
}

function formatAppointments(appointments: any[]): string {
  if (appointments.length === 0) return ''
  return '\nLịch hẹn của bạn:\n' + appointments.map(a => {
    const today = new Date()
    const appDate = a.date ? new Date(a.date) : null
    const isPast = appDate && appDate < today
    const statusMap: Record<number, string> = { 0: 'Chờ duyệt', 1: 'Đã duyệt', 2: 'Đã hoàn thành', 3: 'Đã hủy' }
    const status = statusMap[a.status] ?? 'Không xác định'
    const prefix = a.date ? `Ngày ${a.date}${a.time ? ' ' + a.time : ''}` : ''
    const pastLabel = isPast ? ' (đã qua)' : ''
    return `  - Mã: #${a.id}, Dịch vụ: ${a.serviceName || 'N/A'}, Bác sĩ: ${a.doctorName || 'N/A'}, ${prefix}, Trạng thái: ${status}${pastLabel}`
  }).join('\n')
}

function buildSystemPrompt(services: any[], doctors: any[], role: string, appointments: any[] = []): string {
  const serviceList = services.length > 0
    ? `Danh sách dịch vụ khám đang có:\n${services.map(s => `- ID: ${s.id}, Tên: ${s.name}, Giá: ${s.price}đ, Mô tả: ${s.description || 'Không có'}`).join('\n')}`
    : ''

  const doctorList = doctors.length > 0
    ? `Danh sách bác sĩ:\n${doctors.map(d => `- ${d.fullName} - Chuyên khoa: ${d.specialty || 'Đa khoa'}, Học vị: ${d.degree || 'Không có'}`).join('\n')}`
    : ''

  const appointmentList = formatAppointments(appointments)

  let roleContext = ''
  switch (role) {
    case 'Admin': roleContext = 'Người dùng là Quản trị viên.'; break
    case 'Doctor': roleContext = 'Người dùng là Bác sĩ.'; break
    case 'Receptionist': roleContext = 'Người dùng là Lễ tân.'; break
    default: roleContext = 'Người dùng là Bệnh nhân.'
  }

  return `Bạn là trợ lý AI của Medicare, luôn trả lời bằng tiếng Việt. ${roleContext}

${serviceList}

${doctorList}
${appointmentList}

HƯỚNG DẪN:
- Trả lời tự nhiên, thân thiện, hữu ích dựa trên ngữ cảnh.
- Nếu người dùng hỏi về dịch vụ: dùng danh sách dịch vụ thật bên trên để tư vấn.
- Nếu người dùng hỏi về bác sĩ: dùng danh sách bác sĩ thật bên trên để giới thiệu.
- Nếu người dùng hỏi về lịch hẹn: dùng danh sách lịch hẹn thật bên trên để trả lời.
- Nếu người dùng hỏi kiến thức sức khỏe hoặc triệu chứng: trả lời bằng kiến thức y khoa phổ thông.
- Nếu người dùng mô tả TRIỆU CHỨNG và muốn đặt lịch: tư vấn và đề xuất dịch vụ phù hợp. Khi có đề xuất, KẾT THÚC câu trả lời bằng MỘT dòng JSON duy nhất (không xuống dòng):
{"serviceId":"ID","specialty":"tên chuyên khoa","urgency":"Nhẹ / Trung bình / Khẩn cấp","recommendedService":"tên dịch vụ"}
- Nếu không có đề xuất đặt lịch, KHÔNG thêm JSON.`
}

export async function chatWithGroq(
  messages: { role: string; content: string }[],
  services: any[] = [],
  doctors: any[] = [],
  role: string = 'Patient',
  appointments: any[] = []
) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) {
    return { reply: 'Xin lỗi, AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.', serviceId: null, specialty: null, urgency: null, recommendedService: null, showDiagnostics: false }
  }

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt(services, doctors, role, appointments) },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error('Groq API error body:', errText)
      throw new Error(`Groq API error: ${res.status}`)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || ''
    const lastLine = content.trim().split('\n').pop() || ''
    const parsedJson = extractJson(lastLine)

    if (parsedJson && parsedJson.serviceId) {
      const textWithoutJson = content.substring(0, content.lastIndexOf('{')).trim()
      return {
        reply: textWithoutJson || `Tôi đề xuất bạn nên khám ${parsedJson.specialty}.`,
        serviceId: parsedJson.serviceId || null,
        specialty: parsedJson.specialty || null,
        urgency: parsedJson.urgency || null,
        recommendedService: parsedJson.recommendedService || null,
        showDiagnostics: true
      }
    }

    return { reply: content, serviceId: null, specialty: null, urgency: null, recommendedService: null, showDiagnostics: false }
  } catch (err) {
    console.error('Groq API failed:', err)
    return { reply: 'Rất tiếc, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.', serviceId: null, specialty: null, urgency: null, recommendedService: null, showDiagnostics: false }
  }
}
