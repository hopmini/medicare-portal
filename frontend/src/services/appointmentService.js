import api from './api'

export const appointmentService = {
  async getAllAppointments () {
    const response = await api.get('/Appointments/all')
    return response.data
  },

  async getPendingAppointments () {
    const response = await api.get('/Appointments/pending')
    return response.data
  },

  async bookAppointment (data) {
    const response = await api.post('/Appointments/book', data)
    return response.data
  },

  async approveAppointment (id) {
    const response = await api.put(`/Appointments/${id}/approve`)
    return response.data
  },

  async generateSlots (doctorId, date) {
    const response = await api.post('/Appointments/generate-slots', { doctorId, date })
    return response.data
  },

  async getAvailableSlots (doctorId, date) {
    const response = await api.get(`/Doctors/${doctorId}/slots?date=${date}`)
    return response.data
  },

  async cancelAppointment (id) {
    const response = await api.put(`/Appointments/${id}/cancel`)
    return response.data
  },

  async updateAppointment (id, data) {
    const response = await api.put(`/Appointments/${id}`, data)
    return response.data
  },
}
