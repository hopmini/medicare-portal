// Updated router with pharmacy routes
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import DashboardView from './views/Dashboard/DashboardView.vue'
import DoctorDashboard from './views/Dashboard/DoctorDashboard.vue'
import ReceptionistDashboard from './views/Dashboard/ReceptionistDashboard.vue'
import PatientView from './views/Appointment/PatientView.vue'
import TrackAppointmentView from './views/Appointment/TrackAppointmentView.vue'
import MyAppointmentsView from './views/Appointment/MyAppointmentsView.vue'
import ServicesView from './views/Appointment/ServicesView.vue'
import DoctorsView from './views/Appointment/DoctorsView.vue'
import ContactView from './views/Appointment/ContactView.vue'
import GuideView from './views/Appointment/GuideView.vue'
import ProfileView from './views/ProfileView.vue'
import MedicalRecordsListView from './views/MedicalRecord/MedicalRecordsListView.vue'
import MyMedicalRecordsView from './views/MedicalRecord/MyMedicalRecordsView.vue'
// Pharmacy components
import MedicineManagement from './views/Pharmacy/MedicineManagement.vue'
import InventoryManagement from './views/Pharmacy/InventoryManagement.vue'
import BillingManagement from './views/Pharmacy/BillingManagement.vue'
import CreateBill from './views/Pharmacy/CreateBill.vue'
import PrescriptionManagement from './views/Pharmacy/PrescriptionManagement.vue'
import ImportBill from './views/Pharmacy/ImportBill.vue'
import BatchStock from './views/Pharmacy/BatchStock.vue'
import SupplierManagement from './views/Pharmacy/SupplierManagement.vue'
import UserManagement from './views/Pharmacy/UserManagement.vue'
import PaymentManagement from './views/Pharmacy/PaymentManagement.vue'
import PaymentStatusView from './views/Pharmacy/PaymentStatusView.vue'
import MyInvoicesView from './views/Pharmacy/MyInvoicesView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, roles: ['Admin', 'Receptionist', 'Pharmacist', 'Cashier'] }
  },
  {
    path: '/doctor',
    name: 'Doctor',
    component: DoctorDashboard,
    meta: { requiresAuth: true, roles: ['Doctor'] }
  },
  {
    path: '/receptionist',
    name: 'Receptionist',
    component: ReceptionistDashboard,
    meta: { requiresAuth: true, roles: ['Receptionist', 'Admin'] }
  },
  {
    path: '/patient',
    name: 'PatientBooking',
    component: PatientView,
    meta: { requiresAuth: true, roles: ['Patient'] }
  },
  {
    path: '/track',
    name: 'TrackAppointment',
    component: TrackAppointmentView
  },
  {
    path: '/my-appointments',
    name: 'MyAppointments',
    component: MyAppointmentsView,
    meta: { requiresAuth: true, roles: ['Patient'] }
  },
  { path: '/my-medical-records', name: 'MyMedicalRecords', component: MyMedicalRecordsView, meta: { requiresAuth: true, roles: ['Patient'] } },
  {
    path: '/medical-records',
    name: 'MedicalRecords',
    component: MyMedicalRecordsView,
    meta: { requiresAuth: true, roles: ['Patient'] }
  },
  { path: '/patient-profile', redirect: '/dashboard?tab=patient-profile' },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  // Redirection for consolidated Pharmacy sub-modules in DashboardView SPA
  { path: '/pharmacy/medicines', redirect: '/dashboard?tab=pharmacy-medicines' },
  { path: '/pharmacy/suppliers', redirect: '/dashboard?tab=pharmacy-suppliers' },
  { path: '/pharmacy/inventory', redirect: '/dashboard?tab=pharmacy-stock-history' },
  { path: '/pharmacy/billing', redirect: '/dashboard?tab=pharmacy-billing' },
  { path: '/pharmacy/create-bill', redirect: '/dashboard?tab=pharmacy-billing' },
  { path: '/pharmacy/import-bill', redirect: '/dashboard?tab=pharmacy-import-bills' },
  { path: '/pharmacy/batches', redirect: '/dashboard?tab=pharmacy-batches' },
  { path: '/pharmacy/prescriptions', redirect: '/dashboard?tab=pharmacy-prescriptions' },
  { path: '/pharmacy/dashboard', redirect: '/dashboard?tab=overview' },
  { path: '/pharmacy/payments', redirect: '/dashboard?tab=pharmacy-payments' },
  { path: '/pharmacy/payments/list', redirect: '/dashboard?tab=pharmacy-payments' },
  { path: '/pharmacy/payments/history', redirect: '/dashboard?tab=pharmacy-payments' },
  { path: '/pharmacy/payments/report', redirect: '/dashboard?tab=pharmacy-payments' },
  { path: '/pharmacy/users', name: 'PharmacyUsers', component: UserManagement, meta: { requiresAuth: true, roles: ['Admin'] } },
  { path: '/pharmacy/payment-status', name: 'PaymentStatus', component: PaymentStatusView, meta: { requiresAuth: true, roles: ['Patient', 'Admin', 'Cashier', 'Receptionist'] } },
  { path: '/pharmacy/my-invoices', name: 'PatientMyInvoices', component: MyInvoicesView, meta: { requiresAuth: true, roles: ['Patient', 'Admin'] } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path) {
      // Return false to prevent scrolling when only query parameters or hash change
      return false
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }

    // Role verification
    if (to.meta.roles && to.meta.roles.length > 0) {
      const userRole = (user?.role || '').toLowerCase()
      const allowedRoles = to.meta.roles.map(r => r.toLowerCase())
      if (!userRole || !allowedRoles.includes(userRole)) {
        // Not authorized for this role, redirect to their default dashboard or page
        if (userRole === 'patient') {
          next({ path: '/patient' })
        } else if (userRole === 'doctor') {
          next({ path: '/doctor' })
        } else if (userRole === 'receptionist' || userRole === 'cashier') {
          next({ path: '/dashboard' })
        } else if (userRole === 'pharmacist') {
          next({ path: '/dashboard' })
        } else if (userRole === 'admin') {
          next({ path: '/dashboard' })
        } else {
          next({ path: '/' })
        }
        return
      }
    }
  }
  next()
})

export default router
