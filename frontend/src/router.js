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
    meta: { requiresAuth: true }
  },
  {
    path: '/doctor',
    name: 'Doctor',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/receptionist',
    name: 'Receptionist',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/patient',
    name: 'PatientBooking',
    component: PatientView,
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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

// Route guard to check auth status
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router

