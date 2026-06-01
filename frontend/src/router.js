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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard to check auth status and roles
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
      const userRole = user?.role
      if (!userRole || !to.meta.roles.includes(userRole)) {
        // Not authorized for this role, redirect to their default dashboard or page
        if (userRole === 'Patient') {
          next({ path: '/patient' })
        } else if (userRole === 'Doctor') {
          next({ path: '/doctor' })
        } else if (userRole === 'Receptionist') {
          next({ path: '/receptionist' })
        } else if (userRole === 'Admin') {
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

