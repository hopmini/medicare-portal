const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || ''

let cachedServices: any[] | null = null

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

export async function chatWithGroq(messages: { role: string; content: string }[], services: any[] = []) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) {
    return fallbackAnalysis(messages[messages.length - 1]?.content || '', services)
  }

  const serviceList = services.length > 0
    ? `Danh sách dịch vụ khám đang có:\n${services.map(s => `- ID: ${s.id}, Tên: ${s.name}, Giá: ${s.price}đ, Mô tả: ${s.description || 'Không có'}`).join('\n')}`
    : ''

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
            content: `Bạn là trợ lý y tế AI thân thiện của Medicare, nói tiếng Việt.
Bạn có thể trả lời các câu hỏi về sức khỏe, bệnh lý, thuốc men, dinh dưỡng, tập luyện...
Nếu người dùng hỏi thăm hoặc chuyện phiếm, hãy trả lời tự nhiên như một người bạn.

${serviceList}

Khi người dùng mô tả TRIỆU CHỨNG bệnh, hãy phân tích và chọn dịch vụ PHÙ HỢP NHẤT từ danh sách trên, trả lời ở dạng JSON:
{ "reply": "câu trả lời tư vấn bằng markdown", "serviceId": "ID của dịch vụ phù hợp nhất", "specialty": "tên chuyên khoa", "urgency": "Nhẹ / Trung bình / Khẩn cấp", "recommendedService": "tên dịch vụ đề xuất" }

Khi không có triệu chứng (hỏi thăm, hỏi kiến thức, tán gẫu), trả lời text thuần đơn giản, KHÔNG cần JSON.`
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

    if (content.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(content)
        const lastMsg = messages.filter(m => m.role === 'user').pop()?.content || ''
        const hasSymp = hasSymptoms(lastMsg)
        return {
          reply: parsed.reply || content,
          serviceId: hasSymp ? (parsed.serviceId || null) : null,
          specialty: hasSymp ? (parsed.specialty || null) : null,
          urgency: hasSymp ? (parsed.urgency || null) : null,
          recommendedService: hasSymp ? (parsed.recommendedService || null) : null
        }
      } catch {
        return { reply: content, serviceId: null, specialty: null, urgency: null, recommendedService: null }
      }
    }

    return { reply: content, serviceId: null, specialty: null, urgency: null, recommendedService: null }
  } catch (err) {
    console.error('Groq API failed, using fallback:', err)
    return fallbackAnalysis(messages[messages.length - 1]?.content || '', services)
  }
}

function hasSymptoms(query: string) {
  const q = query.toLowerCase()
  return q.includes('đau') || q.includes('sốt') || q.includes('ho') || q.includes('nôn') ||
    q.includes('mệt') || q.includes('chóng') || q.includes('buồn') || q.includes('ngứa') ||
    q.includes('sưng') || q.includes('khó') || q.includes('rối loạn') || q.includes('triệu chứng')
}

function fallbackAnalysis(query: string, services: any[] = []) {
  if (!hasSymptoms(query)) {
    return { reply: 'Chào bạn! Tôi là trợ lý AI của Medicare. Bạn có thể hỏi tôi bất kỳ điều gì về sức khỏe, bệnh lý, thuốc men, hoặc đặt câu hỏi về dịch vụ của phòng khám. Tôi sẵn sàng trợ giúp! 😊', serviceId: null, specialty: null, urgency: null, recommendedService: null }
  }
  const q = query.toLowerCase()
  if (q.includes('dạ dày') || q.includes('bụng') || q.includes('tiêu hóa') || q.includes('nôn') || q.includes('bao tử') || q.includes('đi ngoài') || q.includes('tiêu chảy'))
    return { reply: 'Dựa trên các triệu chứng liên quan đến tiêu hóa...', serviceId: null, specialty: 'Khoa Tiêu Hóa', urgency: 'Trung bình - Cần đi khám sớm', recommendedService: 'Khám Tiêu hóa & Siêu âm bụng tổng quát' }
  if (q.includes('ho') || q.includes('sốt') || q.includes('họng') || q.includes('cúm') || q.includes('khó thở'))
    return { reply: 'Bạn đang có các biểu hiện của nhiễm trùng hô hấp...', serviceId: null, specialty: 'Khoa Nội Tổng Quát', urgency: q.includes('khó thở') ? 'Khẩn cấp - Cần khám ngay' : 'Trung bình - Cần đi khám', recommendedService: 'Khám Nội tổng quát & Chụp X-Quang Phổi thẳng' }
  if (q.includes('tim') || q.includes('ngực') || q.includes('huyết áp'))
    return { reply: 'Triệu chứng liên quan tim mạch...', serviceId: null, specialty: 'Khoa Tim Mạch', urgency: 'Khẩn cấp - Cần kiểm tra ngay', recommendedService: 'Khám Tim Mạch & Đo ECG' }
  if (q.includes('răng') || q.includes('nướu') || q.includes('sâu') || q.includes('buốt'))
    return { reply: 'Các vấn đề răng nướu...', serviceId: null, specialty: 'Khoa Răng Hàm Mặt', urgency: 'Nhẹ - Hẹn khám thường quy', recommendedService: 'Khám răng miệng & Chụp X-Quang' }
  if (q.includes('mắt') || q.includes('mờ') || q.includes('đỏ mắt') || q.includes('nhức mắt'))
    return { reply: 'Triệu chứng về mắt...', serviceId: null, specialty: 'Khoa Mắt', urgency: 'Nhẹ - Cần đi khám', recommendedService: 'Đo thị lực & Khám đáy mắt' }
  if (q.includes('tai') || q.includes('mũi') || q.includes('ù tai') || q.includes('xoang'))
    return { reply: 'Triệu chứng tai mũi họng...', serviceId: null, specialty: 'Khoa Tai Mũi Họng', urgency: 'Nhẹ - Hẹn khám thường quy', recommendedService: 'Khám Tai Mũi Họng & Nội soi' }
  if (q.includes('trẻ') || q.includes('bé') || q.includes('con tôi') || q.includes('nhi'))
    return { reply: 'Triệu chứng của trẻ nhỏ...', serviceId: null, specialty: 'Khoa Nhi', urgency: 'Trung bình - Cần đi khám', recommendedService: 'Khám Nhi tổng quát' }
  return { reply: 'Đã tiếp nhận triệu chứng...', serviceId: null, specialty: 'Khoa Nội Tổng Quát', urgency: 'Trung bình - Cần đi khám', recommendedService: 'Khám sức khỏe tổng quát' }
}
