import { ref, computed } from 'vue'
import { publicApi } from '@/services/api'

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const token = ref(localStorage.getItem('token') || null)

const isAuthenticated = computed(() => !!token.value)
const isPatient = computed(() => user.value?.role === 'Patient')
const isReceptionist = computed(() => user.value?.role === 'Receptionist')
const isDoctor = computed(() => user.value?.role === 'Doctor')
const isAdmin = computed(() => user.value?.role === 'Admin')
const canAccessDashboard = computed(() => user.value?.role === 'Admin' || user.value?.role === 'Receptionist')
const canAccessDoctorDashboard = computed(() => user.value?.role === 'Doctor')

export function useAuthStore() {
  async function login(credentials) {
    try {
      const response = await publicApi.post('/auth/login', credentials)
      const { token: t, user: u } = response.data

      token.value = t
      user.value = u

      localStorage.setItem('token', t)
      localStorage.setItem('user', JSON.stringify(u))

      return true
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async function register(userData) {
    try {
      await publicApi.post('/auth/register', userData)
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return {
    user,
    token,
    isAuthenticated,
    isPatient,
    isReceptionist,
    isDoctor,
    isAdmin,
    canAccessDashboard,
    canAccessDoctorDashboard,
    login,
    register,
    logout
  }
}
