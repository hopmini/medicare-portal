import { ref } from 'vue'
import api from '@/services/api'

const doctors = ref([])
const loading = ref(false)

export function useDoctorStore() {
  async function fetchDoctors() {
    loading.value = true
    try {
      const response = await api.get('/Doctors')
      doctors.value = response.data
      console.log('Hút data bác sĩ thành công:', doctors.value)
    } catch (error) {
      console.error('Lỗi khi tải danh sách bác sĩ:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    doctors,
    loading,
    fetchDoctors
  }
}
