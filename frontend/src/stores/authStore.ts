import { ref, computed } from 'vue'
import { publicApi } from '@/services/api'

// Define User interface for auth store
export interface User {
  id?: number | string
  username?: string
  fullName?: string
  role?: string
  email?: string
  phoneNumber?: string
  address?: string
  // Add other fields as needed
}

// Reactive state
const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
const token = ref<string | null>(localStorage.getItem('token') || null)

// Computed helpers
export const isAuthenticated = computed(() => !!token.value)
export const isPatient = computed(() => (user.value?.role || '').toLowerCase() === 'patient')
export const isReceptionist = computed(() => (user.value?.role || '').toLowerCase() === 'receptionist')
export const isDoctor = computed(() => (user.value?.role || '').toLowerCase() === 'doctor')
export const isAdmin = computed(() => (user.value?.role || '').toLowerCase() === 'admin')
export const isPharmacist = computed(() => (user.value?.role || '').toLowerCase() === 'pharmacist')
export const canAccessDashboard = computed(() => {
  const role = (user.value?.role || '').toLowerCase()
  return role === 'admin' || role === 'receptionist' || role === 'pharmacist'
})
export const canAccessDoctorDashboard = computed(() => (user.value?.role || '').toLowerCase() === 'doctor')
export const canAccessPharmacyDashboard = computed(() => {
  const role = (user.value?.role || '').toLowerCase()
  return role === 'admin' || role === 'pharmacist' || role === 'receptionist'
})

export const canManageMedicine = computed(() => {
  const role = (user.value?.role || '').toLowerCase()
  return role === 'admin' || role === 'pharmacist'
})
export const canManageInventory = computed(() => {
  const role = (user.value?.role || '').toLowerCase()
  return role === 'admin' || role === 'pharmacist'
})
export const canManageBilling = computed(() => {
  const role = (user.value?.role || '').toLowerCase()
  return role === 'admin' || role === 'receptionist' || role === 'cashier'
})
export const isCashier = computed(() => (user.value?.role || '').toLowerCase() === 'cashier')
export const canAccessPayment = computed(() => {
  const role = (user.value?.role || '').toLowerCase()
  return role === 'admin' || role === 'cashier' || role === 'receptionist'
})

export function useAuthStore() {
  async function login(credentials: { username: string; password: string }) {
    const response = await publicApi.post('/auth/login', credentials)
    const { token: t, user: u } = response.data
    
    // Normalize user object fields to camelCase and standard lowercase role
    const normalizedUser: User = {
      id: u.id ?? u.Id,
      username: u.username ?? u.Username,
      fullName: u.fullName ?? u.FullName,
      role: (u.role ?? u.Role ?? '').toLowerCase(),
      email: u.email ?? u.Email,
      phoneNumber: u.phoneNumber ?? u.PhoneNumber,
      address: u.address ?? u.Address
    }

    token.value = t
    user.value = normalizedUser
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(normalizedUser))
    return true
  }

  async function register(userData: any) {
    await publicApi.post('/auth/register', userData)
    return true
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return {
    user,
    token,
    isAuthenticated,
    isPatient,
    isReceptionist,
    isDoctor,
    isAdmin,
    isPharmacist,
    canAccessDashboard,
    canAccessDoctorDashboard,
    canAccessPharmacyDashboard,
    canManageMedicine,
    canManageInventory,
    canManageBilling,
    login,
    register,
    logout,
  }
}
