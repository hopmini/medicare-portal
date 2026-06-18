const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || ''

let cachedServices: any[] | null = null
let cachedDoctors: any[] | null = null

export async function fetchServices(): Promise<any[]> {
  if (cachedServices) return cachedServices
  try {
    const res = await fetch(`${GATEWAY_URL}/api/appointment/MedicalServices`)
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

function hasBookingIntent(query: string): boolean {
  const q = query.toLowerCase()
  return q.includes('đặt lịch') || q.includes('đặt khám') || q.includes('hẹn khám') ||
    q.includes('đăng ký') || q.includes('đi khám') || q.includes('muốn khám') ||
    q.includes('cần khám') || q.includes('tư vấn khám') || q.includes('đặt')
}

function hasSymptoms(query: string): boolean {
  const q = query.toLowerCase()
  return q.includes('đau') || q.includes('sốt') || q.includes('ho') || q.includes('nôn') ||
    q.includes('mệt') || q.includes('chóng') || q.includes('buồn') || q.includes('ngứa') ||
    q.includes('sưng') || q.includes('khó') || q.includes('rối loạn') || q.includes('triệu chứng') ||
    q.includes('bị') && (q.includes('bụng') || q.includes('họng') || q.includes('đầu') || q.includes('răng'))
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

function buildSystemPrompt(services: any[], doctors: any[], role: string): string {
  const serviceList = services.length > 0
    ? `Danh sách dịch vụ khám đang có:\n${services.map(s => `- ID: ${s.id}, Tên: ${s.name}, Giá: ${s.price}đ, Mô tả: ${s.description || 'Không có'}`).join('\n')}`
    : ''

  const doctorList = doctors.length > 0
    ? `Danh sách bác sĩ:\n${doctors.map(d => `- ${d.fullName} - Chuyên khoa: ${d.specialty || 'Đa khoa'}, Học vị: ${d.degree || 'Không có'}`).join('\n')}`
    : ''

  let roleContext = ''
  switch (role) {
    case 'Admin':
      roleContext = 'Người dùng là Quản trị viên hệ thống.'
      break
    case 'Doctor':
      roleContext = 'Người dùng là Bác sĩ.'
      break
    case 'Receptionist':
      roleContext = 'Người dùng là Lễ tân.'
      break
    default:
      roleContext = 'Người dùng là Bệnh nhân.'
  }

  return `Bạn là trợ lý AI của Medicare, nói tiếng Việt. ${roleContext}

${serviceList}

${doctorList}

QUY TẮC XỬ LÝ:
1. Nếu người dùng hỏi về bác sĩ hoặc dịch vụ: trả lời text thuần dựa trên danh sách thật bên trên, KHÔNG thêm JSON, KHÔNG gợi ý đặt lịch.
2. Nếu người dùng hỏi kiến thức sức khỏe chung: trả lời text thuần tự nhiên, KHÔNG JSON, KHÔNG gợi ý đặt lịch.
3. Nếu người dùng mô tả TRIỆU CHỨNG bệnh (đau, sốt, ho...): CHỈ trả lời MỘT JSON duy nhất, TUYỆT ĐỐI KHÔNG thêm text nào khác ngoài JSON:
{ "reply": "câu tư vấn ngắn gọn", "serviceId": "ID dịch vụ phù hợp nhất (số)", "specialty": "tên chuyên khoa", "urgency": "Nhẹ / Trung bình / Khẩn cấp", "recommendedService": "tên dịch vụ" }
Không giải thích, không chào hỏi, không thêm text. Chỉ JSON.`
}

export async function chatWithGroq(
  messages: { role: string; content: string }[],
  services: any[] = [],
  doctors: any[] = [],
  role: string = 'Patient'
) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) {
    return fallbackAnalysis(messages[messages.length - 1]?.content || '', services)
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
          {
            role: 'system',
            content: buildSystemPrompt(services, doctors, role)
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error('Groq API error body:', errText)
      throw new Error(`Groq API error: ${res.status} - ${errText}`)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || ''
    const lastMsg = messages.filter(m => m.role === 'user').pop()?.content || ''
    const showDiag = hasBookingIntent(lastMsg) || hasSymptoms(lastMsg)

    const parsedJson = extractJson(content)
    if (parsedJson && parsedJson.reply) {
      return {
        reply: parsedJson.reply,
        serviceId: showDiag ? (parsedJson.serviceId || null) : null,
        specialty: showDiag ? (parsedJson.specialty || null) : null,
        urgency: showDiag ? (parsedJson.urgency || null) : null,
        recommendedService: showDiag ? (parsedJson.recommendedService || null) : null,
        showDiagnostics: showDiag
      }
    }

    return { reply: content, serviceId: null, specialty: null, urgency: null, recommendedService: null, showDiagnostics: false }
  } catch (err) {
    console.error('Groq API failed, using fallback:', err)
    return fallbackAnalysis(messages[messages.length - 1]?.content || '', services)
  }
}

function fallbackAnalysis(query: string, services: any[] = []) {
  const q = query.toLowerCase()
  const needsBooking = hasBookingIntent(q) || hasSymptoms(q)

  function findServiceId(nameHint: string): string | null {
    if (!services || services.length === 0) return null
    const svc = services.find((s: any) => {
      const sn = (s.name || '').toLowerCase()
      return sn.includes(nameHint.toLowerCase()) || nameHint.toLowerCase().includes(sn)
    })
    return svc ? String(svc.id) : null
  }

  if (q.includes('bác sĩ') || q.includes('ai khám') || q.includes('chuyên khoa') || q.includes('bs')) {
    return {
      reply: 'Chúng tôi có đội ngũ bác sĩ đa khoa và chuyên khoa giàu kinh nghiệm. Bạn muốn tìm bác sĩ theo chuyên khoa nào?',
      serviceId: null, specialty: null, urgency: null, recommendedService: null,
      showDiagnostics: false
    }
  }

  if (!needsBooking) {
    return {
      reply: 'Chào bạn! Tôi là trợ lý AI của Medicare. Bạn có thể hỏi tôi về tình trạng sức khỏe, bác sĩ, dịch vụ khám, hoặc các thông tin khác liên quan đến phòng khám. Tôi sẵn sàng trợ giúp! 😊',
      serviceId: null, specialty: null, urgency: null, recommendedService: null,
      showDiagnostics: false
    }
  }

  if (q.includes('dạ dày') || q.includes('bụng') || q.includes('tiêu hóa') || q.includes('nôn') || q.includes('bao tử') || q.includes('đi ngoài') || q.includes('tiêu chảy'))
    return { reply: 'Dựa trên các triệu chứng liên quan đến tiêu hóa, tôi đề nghị bạn nên khám chuyên khoa Tiêu Hóa để được thăm khám cụ thể.', serviceId: findServiceId('Tiêu hóa'), specialty: 'Khoa Tiêu Hóa', urgency: 'Trung bình - Cần đi khám sớm', recommendedService: 'Khám Tiêu hóa & Siêu âm bụng tổng quát', showDiagnostics: true }
  if (q.includes('ho') || q.includes('sốt') || q.includes('họng') || q.includes('cúm') || q.includes('khó thở'))
    return { reply: 'Bạn đang có các biểu hiện của nhiễm trùng hô hấp.', serviceId: findServiceId('Nội tổng quát'), specialty: 'Khoa Nội Tổng Quát', urgency: q.includes('khó thở') ? 'Khẩn cấp - Cần khám ngay' : 'Trung bình - Cần đi khám', recommendedService: 'Khám Nội tổng quát & Chụp X-Quang Phổi thẳng', showDiagnostics: true }
  if (q.includes('tim') || q.includes('ngực') || q.includes('huyết áp'))
    return { reply: 'Triệu chứng liên quan tim mạch cần được kiểm tra sớm.', serviceId: findServiceId('Tim mạch'), specialty: 'Khoa Tim Mạch', urgency: 'Khẩn cấp - Cần kiểm tra ngay', recommendedService: 'Khám Tim Mạch & Đo ECG', showDiagnostics: true }
  if (q.includes('răng') || q.includes('nướu') || q.includes('sâu') || q.includes('buốt'))
    return { reply: 'Các vấn đề răng nướu nên được thăm khám nha khoa.', serviceId: findServiceId('Răng'), specialty: 'Khoa Răng Hàm Mặt', urgency: 'Nhẹ - Hẹn khám thường quy', recommendedService: 'Khám răng miệng & Chụp X-Quang', showDiagnostics: true }
  if (q.includes('mắt') || q.includes('mờ') || q.includes('đỏ mắt') || q.includes('nhức mắt'))
    return { reply: 'Triệu chứng về mắt cần được kiểm tra.', serviceId: findServiceId('Mắt'), specialty: 'Khoa Mắt', urgency: 'Nhẹ - Cần đi khám', recommendedService: 'Đo thị lực & Khám đáy mắt', showDiagnostics: true }
  if (q.includes('tai') || q.includes('mũi') || q.includes('ù tai') || q.includes('xoang'))
    return { reply: 'Triệu chứng tai mũi họng nên được thăm khám.', serviceId: findServiceId('Tai Mũi Họng'), specialty: 'Khoa Tai Mũi Họng', urgency: 'Nhẹ - Hẹn khám thường quy', recommendedService: 'Khám Tai Mũi Họng & Nội soi', showDiagnostics: true }
  if (q.includes('trẻ') || q.includes('bé') || q.includes('con tôi') || q.includes('nhi'))
    return { reply: 'Triệu chứng của trẻ nhỏ cần được thăm khám nhi khoa.', serviceId: findServiceId('Nhi'), specialty: 'Khoa Nhi', urgency: 'Trung bình - Cần đi khám', recommendedService: 'Khám Nhi tổng quát', showDiagnostics: true }
  return { reply: 'Đã tiếp nhận thông tin của bạn. Bạn có muốn đặt lịch khám không?', serviceId: findServiceId('Nội tổng quát'), specialty: 'Khoa Nội Tổng Quát', urgency: 'Trung bình - Cần đi khám', recommendedService: 'Khám sức khỏe tổng quát', showDiagnostics: true }
}
