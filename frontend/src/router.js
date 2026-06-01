// Updated router with pharmacy routes
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import DashboardView from './views/Dashboard/DashboardView.vue'
import PatientView from './views/Appointment/PatientView.vue'
import TrackAppointmentView from './views/Appointment/TrackAppointmentView.vue'
import MyAppointmentsView from './views/Appointment/MyAppointmentsView.vue'
import ServicesView from './views/Appointment/ServicesView.vue'
import DoctorsView from './views/Appointment/DoctorsView.vue'
import ContactView from './views/Appointment/ContactView.vue'
import GuideView from './views/Appointment/GuideView.vue'
import ProfileView from './views/ProfileView.vue'
// Pharmacy components
import MedicineManagement from './views/Pharmacy/MedicineManagement.vue'
import InventoryManagement from './views/Pharmacy/InventoryManagement.vue'
import BillingManagement from './views/Pharmacy/BillingManagement.vue'
import CreateBill from './views/Pharmacy/CreateBill.vue'
import PrescriptionManagement from './views/Pharmacy/PrescriptionManagement.vue'
import PharmacyDashboard from './views/Pharmacy/PharmacyDashboard.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/doctor', name: 'Doctor', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/receptionist', name: 'Receptionist', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/patient', name: 'PatientBooking', component: PatientView, meta: { requiresAuth: true } },
  { path: '/track', name: 'TrackAppointment', component: TrackAppointmentView },
  { path: '/my-appointments', name: 'MyAppointments', component: MyAppointmentsView, meta: { requiresAuth: true } },
  { path: '/services', name: 'Services', component: ServicesView },
  { path: '/doctors', name: 'Doctors', component: DoctorsView },
  { path: '/contact', name: 'Contact', component: ContactView },
  { path: '/guide', name: 'Guide', component: GuideView },
  { path: '/profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true } },
  // Pharmacy routes
  { path: '/pharmacy/medicines', name: 'PharmacyMedicines', component: MedicineManagement, meta: { requiresAuth: true, roles: ['admin', 'doctor'] } },
  { path: '/pharmacy/inventory', name: 'PharmacyInventory', component: InventoryManagement, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/pharmacy/billing', name: 'PharmacyBilling', component: BillingManagement, meta: { requiresAuth: true, roles: ['admin', 'receptionist', 'patient'] } },
  { path: '/pharmacy/create-bill', name: 'PharmacyCreateBill', component: CreateBill, meta: { requiresAuth: true, roles: ['receptionist'] } },
  { path: '/pharmacy/prescriptions', name: 'PharmacyPrescriptions', component: PrescriptionManagement, meta: { requiresAuth: true, roles: ['admin', 'doctor', 'receptionist', 'patient'] } },
  { path: '/pharmacy/dashboard', name: 'PharmacyDashboard', component: PharmacyDashboard, meta: { requiresAuth: true } },
]

const router = createRouter({ history: createWebHistory(), routes })
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      const allowedRoles = to.meta.roles
      const userRole = (user?.role || '').toLowerCase()
      if (allowedRoles && !allowedRoles.includes(userRole)) {
        next({ path: '/' })
      } else {
        next()
      }
    }
  } else {
    next()
  }
})
export default router
