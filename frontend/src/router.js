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
import MyMedicalRecordsView from './views/MedicalRecord/MyMedicalRecordsView.vue'
// Pharmacy components
import MedicineManagement from './views/Pharmacy/MedicineManagement.vue'
import InventoryManagement from './views/Pharmacy/InventoryManagement.vue'
import BillingManagement from './views/Pharmacy/BillingManagement.vue'
import CreateBill from './views/Pharmacy/CreateBill.vue'
import PrescriptionManagement from './views/Pharmacy/PrescriptionManagement.vue'
import PharmacyDashboard from './views/Pharmacy/PharmacyDashboard.vue'

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
    meta: { requiresAuth: true, roles: ['Admin', 'Receptionist'] }
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
  {
    path: '/my-medical-records',
    name: 'MyMedicalRecords',
    component: MyMedicalRecordsView,
    meta: { requiresAuth: true, roles: ['Patient'] }
  },
  {
    path: '/services',
    name: 'Services',
    component: ServicesView
  },
  {
    path: '/doctors',
    name: 'Doctors',
    component: DoctorsView
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView
  },
  {
    path: '/guide',
    name: 'Guide',
    component: GuideView
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  // Pharmacy routes
  { path: '/pharmacy/medicines', name: 'PharmacyMedicines', component: MedicineManagement, meta: { requiresAuth: true, roles: ['Admin', 'Doctor'] } },
  { path: '/pharmacy/inventory', name: 'PharmacyInventory', component: InventoryManagement, meta: { requiresAuth: true, roles: ['Admin'] } },
  { path: '/pharmacy/billing', name: 'PharmacyBilling', component: BillingManagement, meta: { requiresAuth: true, roles: ['Admin', 'Receptionist', 'Patient'] } },
  { path: '/pharmacy/create-bill', name: 'PharmacyCreateBill', component: CreateBill, meta: { requiresAuth: true, roles: ['Receptionist'] } },
  { path: '/pharmacy/prescriptions', name: 'PharmacyPrescriptions', component: PrescriptionManagement, meta: { requiresAuth: true, roles: ['Admin', 'Doctor', 'Receptionist', 'Patient'] } },
  { path: '/pharmacy/dashboard', name: 'PharmacyDashboard', component: PharmacyDashboard, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
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
        } else if (userRole === 'receptionist') {
          next({ path: '/receptionist' })
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
