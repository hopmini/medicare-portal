<template>
  <div class="home">

    <!-- PRELOADER OVERLAY -->
    <div class="preloader" :class="{ 'preloader--hidden': loaded }">
      <div class="preloader__cross">
        <span /><span />
      </div>

      <p class="preloader__text">MediCare Clinic</p>
    </div>

    <!-- NAVBAR -->
    <Navbar />

    <!-- FLOATING DARK MODE TOGGLE -->
    <button class="theme-toggle-btn" @click="toggleTheme" title="Chuyển chế độ sáng/tối">
      <i v-if="isDarkMode" class="fas fa-sun" />
      <i v-else class="fas fa-moon" />
    </button>

    <!-- ─── HERO ─── -->
    <section class="hero">
      <!-- Background elements -->
      <div class="hero__bg">
        <div class="hero__bg-grid" />
        <div class="hero__bg-blob blob-1" />
        <div class="hero__bg-blob blob-2" />
        <div class="hero__bg-blob blob-3" />
        <div class="hero__cross cross-1">+</div>
        <div class="hero__cross cross-2">+</div>
        <div class="hero__cross cross-3">✕</div>
      </div>

      <div class="hero__inner">
        <!-- Left content -->
        <div class="hero__content" :class="{ 'hero__content--visible': loaded }">
          <div class="hero__eyebrow">
            <span class="hero__eyebrow-dot" />
            Hệ thống bệnh viện thông minh
          </div>

          <h1 class="hero__title">
            Chăm sóc <br>
            <span class="hero__title">sức khỏe</span><br>
            của bạn
          </h1>

          <p class="hero__subtitle">
            Đặt lịch khám trực tuyến trong vài giây. Đội ngũ bác sĩ chuyên khoa
            giàu kinh nghiệm, hệ thống quản lý hiện đại — tất cả vì sức khỏe của bạn.
          </p>

          <div class="hero__actions">
            <button class="btn-cta btn-cta--large" @click="redirectToBooking">
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="20"
              >
                <rect
                  height="18"
                  rx="2"
                  width="18"
                  x="3"
                  y="4"
                />

                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Đặt lịch ngay
            </button>

            <button class="btn-outline btn-outline--large" @click="smoothScroll('#doctors')">
              Xem bác sĩ
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="16"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </button>
          </div>

          <!-- Stats bar -->
          <div class="hero__stats animate-on-scroll">
            <div v-for="(s, i) in heroStats" :key="i" class="stat-item">
              <span class="stat-item__num">{{ s.num }}</span>
              <span class="stat-item__label">{{ s.label }}</span>
            </div>
          </div>
        </div>

        <!-- Right card cluster -->
        <div class="hero__visual" :class="{ 'hero__visual--visible': loaded }">
          <!-- Main card -->
          <div class="hcard hcard--main">
            <div class="hcard__header">
              <div class="hcard__avatar">
                <i class="fas fa-user-md" />
              </div>

              <div>
                <p class="hcard__name">BS. Nguyễn Văn An</p>
                <p class="hcard__role">Nội tổng quát</p>
              </div>

              <div class="hcard__badge hcard__badge--available">Trống</div>
            </div>

            <div class="hcard__slots">
              <p class="hcard__slots-label">Slot hôm nay</p>

              <div class="hcard__slot-grid">
                <span class="slot slot--taken">08:00</span>
                <span class="slot slot--taken">08:30</span>
                <span class="slot slot--free">09:00</span>
                <span class="slot slot--free">09:30</span>
                <span class="slot slot--taken">10:00</span>
                <span class="slot slot--free">10:30</span>
              </div>
            </div>
          </div>

          <!-- Floating cards -->
          <div class="hcard hcard--float hcard--confirm">
            <div class="hcard__icon"><i class="fas fa-check-circle" style="color: #10b981;" /></div>

            <div>
              <p class="hcard__mini-title">Đặt lịch thành công!</p>
              <p class="hcard__mini-sub">Số thứ tự: <strong>#047</strong></p>
            </div>
          </div>

          <div class="hcard hcard--float hcard--stat">
            <div class="hcard__stat-ring">
              <svg viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  fill="none"
                  r="25"
                  stroke="#e8edf8"
                  stroke-width="5"
                />

                <circle
                  cx="30"
                  cy="30"
                  fill="none"
                  r="25"
                  stroke="#0047AB"
                  stroke-dasharray="157"
                  stroke-dashoffset="22"
                  stroke-linecap="round"
                  stroke-width="5"
                  transform="rotate(-90 30 30)"
                />
              </svg>

              <span>98%</span>
            </div>

            <p class="hcard__stat-label">Bệnh nhân<br>hài lòng</p>
          </div>

          <!-- Decorative lines -->
          <svg class="hero__deco" fill="none" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="200"
              cy="200"
              r="180"
              stroke="#0047AB"
              stroke-dasharray="8 6"
              stroke-opacity="0.12"
              stroke-width="1"
            />

            <circle
              cx="200"
              cy="200"
              r="130"
              stroke="#0047AB"
              stroke-opacity="0.08"
              stroke-width="1"
            />
          </svg>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="hero__scroll" @click="smoothScroll('#services')">
        <div class="hero__scroll-mouse">
          <div class="hero__scroll-wheel" />
        </div>

        <span>Cuộn xuống</span>
      </div>
    </section>

    <!-- ─── MARQUEE TICKER ─── -->
    <div class="ticker animate-fade-in">
      <div class="ticker__track">
        <span v-for="t in tickerItems.concat(tickerItems)" :key="Math.random()" class="ticker__item">
          <i :class="t.icon" style="margin-right: 0.5rem;" /> {{ t.text }}
        </span>
      </div>
    </div>

    <!-- ─── SERVICES ─── -->
    <section id="services" class="services">
      <div class="section-container">
        <div class="section-header animate-on-scroll">
          <div class="section-eyebrow">
            <span class="eyebrow-line" />
            Tại sao chọn chúng tôi
          </div>

          <h2 class="section-title">
            Dịch vụ nổi bật
          </h2>

          <p class="section-sub">
            Hệ thống quản lý phòng khám hiện đại, minh bạch và hiệu quả — được xây dựng để phục vụ bệnh nhân tốt nhất.
          </p>
        </div>

        <div class="services-grid">
          <div
            v-for="(svc, i) in services"
            :key="i"
            class="service-card animate-on-scroll"
            :style="{ '--delay': `${i * 80}ms`, transitionDelay: `${i * 100}ms` }"
          >
            <div class="service-card__num">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="service-card__icon"><i :class="svc.icon" /></div>
            <h3 class="service-card__title">{{ svc.title }}</h3>
            <p class="service-card__desc">{{ svc.desc }}</p>
            <div class="service-card__tag">{{ svc.tag }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── DOCTORS ─── -->
    <section id="doctors" class="doctors">
      <div class="section-container">
        <div class="section-header animate-on-scroll">
          <div class="section-eyebrow">
            <span class="eyebrow-line" />
            Đội ngũ y tế
          </div>

          <h2 class="section-title">
            Gặp gỡ bác sĩ của chúng tôi
          </h2>

          <p class="section-sub">
            Đội ngũ bác sĩ chuyên khoa có nhiều năm kinh nghiệm, tận tâm và chuyên nghiệp.
          </p>
        </div>

        <div class="doctors-grid">
          <div v-for="(doc, i) in displayedDoctors" :key="i" class="doctor-card animate-on-scroll" :style="{ transitionDelay: (i * 100) + 'ms' }">
            <div class="doctor-card__bg" />
            <div class="doctor-card__avatar"><i :class="doc.avatar" /></div>

            <div class="doctor-card__body">
              <h3 class="doctor-card__name">{{ doc.name }}</h3>
              <span class="doctor-card__specialty">{{ doc.specialty }}</span>

              <div class="doctor-card__meta">
                <div class="meta-item">
                  <svg
                    fill="none"
                    height="14"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    width="14"
                  >
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                  {{ doc.experience }}
                </div>

                <div class="meta-item">
                  <svg
                    fill="none"
                    height="14"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    width="14"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {{ doc.rating }}
                </div>
              </div>

              <div class="doctor-card__fee">
                <span>Phí khám:</span>
                <strong>{{ doc.fee }}</strong>
              </div>

              <button class="btn-cta btn-cta--block" @click="redirectToBooking">
                Đặt lịch
                <svg
                  fill="none"
                  height="14"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  width="14"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- View all CTA -->
        <div class="doctors-more">
          <p>Và <strong>17 bác sĩ</strong> chuyên khoa khác đang chờ phục vụ bạn</p>
          <button class="btn-outline" @click="router.push('/doctors')">Xem tất cả bác sĩ</button>
        </div>
      </div>
    </section>

    <!-- ─── HOW IT WORKS ─── -->
    <section id="how" class="how">
      <div class="section-container">
        <div class="section-header animate-on-scroll">
          <div class="section-eyebrow">
            <span class="eyebrow-line" />
            Quy trình đặt lịch
          </div>

          <h2 class="section-title">
            Chỉ 3 bước đơn giản
          </h2>
        </div>

        <div class="how-steps">
          <div v-for="(step, i) in steps" :key="i" class="how-step animate-on-scroll" :style="{ transitionDelay: `${i * 150}ms` }">
            <div v-if="i < steps.length - 1" class="how-step__line" />

            <div class="how-step__bubble">
              <div class="how-step__num">{{ String(i + 1).padStart(2, '0') }}</div>
              <div class="how-step__icon"><i :class="step.icon" /></div>
            </div>

            <div class="how-step__body">
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>

              <ul class="how-step__checklist">
                <li v-for="c in step.checks" :key="c">
                  <span class="check-dot" />{{ c }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Mini timeline -->
        <div class="timeline-bar">
          <div class="timeline-bar__label">Tổng thời gian đặt lịch:</div>

          <div class="timeline-bar__track">
            <div class="timeline-segment" style="width: 20%; --c: #0047AB">
              <span>Chọn BS</span><small>30s</small>
            </div>

            <div class="timeline-segment" style="width: 30%; --c: #1565C0">
              <span>Chọn slot</span><small>45s</small>
            </div>

            <div class="timeline-segment" style="width: 50%; --c: #E53935">
              <span>Xác nhận</span><small>45s</small>
            </div>
          </div>

          <div class="timeline-bar__total">≈ 2 phút</div>
        </div>
      </div>
    </section>

    <!-- ─── TRUST STRIP ─── -->
    <section class="trust">
      <div class="section-container">
        <div class="trust-grid">
          <div v-for="(t, i) in trustItems" :key="i" class="trust-item animate-zoom-in" :style="{ transitionDelay: `${i * 100}ms` }">
            <div class="trust-item__icon"><i :class="t.icon" /></div>

            <div>
              <p class="trust-item__title">{{ t.title }}</p>
              <p class="trust-item__sub">{{ t.sub }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── TESTIMONIALS ─── -->
    <section class="testimonials">
      <div class="section-container">
        <div class="section-header animate-on-scroll">
          <div class="section-eyebrow">
            <span class="eyebrow-line" />
            Bệnh nhân nói gì
          </div>

          <h2 class="section-title">
            Hàng nghìn bệnh nhân tin tưởng
          </h2>
        </div>

        <div class="testi-grid">
          <div v-for="(t, i) in testimonials" :key="i" class="testi-card animate-on-scroll" :style="{ transitionDelay: (i * 150) + 'ms' }">
            <div class="testi-card__stars">
              <i v-for="s in 5" :key="s" class="fas fa-star" style="color: #fbbf24; margin-right: 2px;" />
            </div>

            <p class="testi-card__text">"{{ t.text }}"</p>

            <div class="testi-card__author">
              <div class="testi-card__avatar"><i :class="t.avatar" /></div>

              <div>
                <p class="testi-card__name">{{ t.name }}</p>
                <p class="testi-card__info">{{ t.info }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CTA BANNER ─── -->
    <section class="cta-banner animate-zoom-in">
      <div class="cta-banner__inner">
        <div class="cta-banner__deco">
          <span class="cta-banner__cross">+</span>
          <span class="cta-banner__cross">+</span>
          <span class="cta-banner__cross">+</span>
        </div>

        <div class="cta-banner__content">
          <h2>Sẵn sàng chăm sóc sức khỏe?</h2>
          <p>Đặt lịch chỉ mất 2 phút — không cần tài khoản, không cần chờ đợi.</p>

          <div class="cta-banner__actions">
            <button class="btn-cta btn-cta--large btn-cta--white" @click="redirectToBooking">
              <i class="fas fa-calendar-alt" style="margin-right: 0.5rem;" /> Đặt lịch ngay
            </button>

            <button class="btn-outline btn-outline--white" @click="navigateToReceptionist">
              <i class="fas fa-hospital" style="margin-right: 0.5rem;" /> Cổng tiếp tân
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CONTACT ─── -->
    <section id="contact" class="contact">
      <div class="section-container">
        <div class="contact-grid">
          <div class="contact-info animate-on-scroll">
            <div class="section-eyebrow">
              <span class="eyebrow-line" />
              Liên hệ
            </div>

            <h2 class="section-title" style="text-align:left">
              Chúng tôi luôn sẵn sàng hỗ trợ
            </h2>

            <div class="contact-items">
              <div v-for="c in contactInfo" :key="c.label" class="contact-item">
                <div class="contact-item__icon"><i :class="c.icon" /></div>

                <div>
                  <p class="contact-item__label">{{ c.label }}</p>
                  <p class="contact-item__value">{{ c.value }}</p>
                </div>
              </div>
            </div>

            <div class="contact-hours">
              <h4>Giờ làm việc</h4>

              <div class="hours-row">
                <span>Thứ 2 – Thứ 6</span>
                <span class="hours-time">07:30 – 17:00</span>
              </div>

              <div class="hours-row">
                <span>Thứ 7 – Chủ nhật</span>
                <span class="hours-time">07:30 – 11:30</span>
              </div>
            </div>
          </div>

          <div class="contact-map animate-on-scroll" style="transition-delay: 200ms; overflow: hidden; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
            <iframe
              height="100%"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=B%E1%BB%87nh%20vi%E1%BB%87n%20B%E1%BA%A1ch%20Mai,%2078%20Gi%E1%BA%A3i%20Ph%C3%B3ng,%20H%C3%A0%20N%E1%BB%99i&t=&z=16&ie=UTF8&iwloc=&output=embed"
              style="border:0; min-height: 400px; display: block;"
              width="100%"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FOOTER ─── -->
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__top">
          <div class="footer__brand">
            <div class="logo">
              <div class="logo__icon">
                <svg fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <rect fill="#0047AB" height="32" rx="8" width="32" />
                  <path d="M16 6v20M6 16h20" stroke="white" stroke-linecap="round" stroke-width="4" />
                </svg>
              </div>

              <div class="logo__text">Medicare<span class="logo__dot">.</span></div>
            </div>

            <p class="footer__tagline">
              Hệ thống quản lý phòng khám thông minh —<br>
              sức khỏe của bạn là ưu tiên số một.
            </p>
          </div>

          <div class="footer__links">
            <div class="footer__col">
              <h5>Dịch vụ</h5>
              <a href="#">Đặt lịch khám</a>
              <a href="#">Khám tổng quát</a>
              <a href="#">Khám chuyên khoa</a>
              <a href="#">Tư vấn trực tuyến</a>
            </div>

            <div class="footer__col">
              <h5>Thông tin</h5>
              <a href="#">Về chúng tôi</a>
              <a href="#">Đội ngũ bác sĩ</a>
              <a href="#">Tin tức y tế</a>
              <a href="#">Cẩm nang sức khỏe</a>
            </div>

            <div class="footer__col">
              <h5>Hỗ trợ</h5>
              <a href="#">Câu hỏi thường gặp</a>
              <a href="#">Chính sách bảo mật</a>
              <a href="#">Điều khoản sử dụng</a>
              <a href="#">Liên hệ</a>
            </div>
          </div>
        </div>

        <div class="footer__bottom">
          <p>© 2026 MediCare Clinic · Appointment Service (N1) · FullStack Project</p>

          <div class="footer__badges">
            <span class="badge"><i class="fas fa-lock" style="margin-right: 0.3rem;" /> JWT Auth</span>
            <span class="badge"><i class="fas fa-bolt" style="margin-right: 0.3rem;" /> Vue 3</span>
            <span class="badge"><i class="fab fa-docker" style="margin-right: 0.3rem;" /> Docker</span>
            <span class="badge"><i class="fas fa-shield-alt" style="margin-right: 0.3rem;" /> ASP.NET Core</span>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Navbar from '@/components/Navbar.vue'
  import { useAuthStore } from '@/stores/authStore'
  import { publicApi } from '@/services/api'
  const router = useRouter()
  const authStore = useAuthStore()

  const isDarkMode = ref(localStorage.getItem('theme') === 'dark')

  function toggleTheme () {
    isDarkMode.value = !isDarkMode.value
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  function redirectToBooking () {
    if (authStore.isAuthenticated.value) {
      const user = authStore.user.value
      const role = (user?.role || '').toLowerCase()
      if (role === 'admin') {
        router.push('/dashboard')
        return
      }
      if (role === 'receptionist') {
        router.push('/receptionist')
        return
      }
      if (role === 'doctor') {
        router.push('/doctor')
        return
      }
      // Patients go directly to internal patient booking page
      router.push('/patient')
    } else {
      // If not logged in, route to patient booking (route guard will redirect to login)
      router.push('/patient')
    }
  }

  function navigateToReceptionist () {
    if (authStore.isAuthenticated.value) {
      const role = (authStore.user.value?.role || '').toLowerCase()
      if (role !== 'receptionist' && role !== 'admin') {
        alert('Bạn không có quyền truy cập Cổng tiếp tân. Vui lòng đăng nhập bằng tài khoản Lễ tân!')
        return
      }
    }
    router.push('/receptionist')
  }

  // ── State ──────────────────────────────────────────────────────────
  const loaded = ref(false)
  const observer = ref(null)
  const realDoctors = ref([])

  const displayedDoctors = computed(() => {
    if (realDoctors.value && realDoctors.value.length > 0) {
      return realDoctors.value.slice(0, 3).map(doc => ({
        avatar: 'fas fa-user-md',
        name: `BS. ${doc.fullName}`,
        specialty: doc.specialty,
        experience: doc.degree || 'Chuyên khoa lâm sàng',
        rating: '5.0 / 5.0',
        fee: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(doc.consultationFee || 150000),
      }))
    }
    return mockDoctors
  })

  async function fetchRealDoctors() {
    try {
      const res = await publicApi.get('/Doctors')
      realDoctors.value = res.data
    } catch (e) {
      console.error('Failed to load real doctors:', e)
    }
  }

  // ── Lifecycle ──────────────────────────────────────────────────────
  onMounted(() => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    fetchRealDoctors()
    setTimeout(() => {
      loaded.value = true
    }, 600)

    setTimeout(() => {
      observer.value = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.value?.unobserve(entry.target)
          }
        }
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

      for (const el of document.querySelectorAll('.animate-on-scroll, .animate-fade-in, .animate-zoom-in')) {
        observer.value?.observe(el)
      }
    }, 100)
  })

  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect()
    }
  })

  // ── Methods ────────────────────────────────────────────────────────
  function smoothScroll (selector) {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
  }

  // ── Data ───────────────────────────────────────────────────────────
  const heroStats = [
    { num: '500+', label: 'Bệnh nhân / tháng' },
    { num: '20+', label: 'Bác sĩ chuyên khoa' },
    { num: '98%', label: 'Hài lòng dịch vụ' },
    { num: '0', label: 'Đặt trùng lịch' },
  ]

  const tickerItems = [
    { icon: 'fas fa-stethoscope', text: 'Khám tổng quát' },
    { icon: 'fas fa-heart', text: 'Tim mạch' },
    { icon: 'fas fa-bone', text: 'Cơ xương khớp' },
    { icon: 'fas fa-eye', text: 'Nhãn khoa' },
    { icon: 'fas fa-tooth', text: 'Nha khoa' },
    { icon: 'fas fa-brain', text: 'Thần kinh' },
    { icon: 'fas fa-lungs', text: 'Hô hấp' },
    { icon: 'fas fa-microscope', text: 'Xét nghiệm' },
    { icon: 'fas fa-pills', text: 'Nội khoa' },
    { icon: 'fas fa-ear-listen', text: 'Tai Mũi Họng' },
  ]

  const services = [
    {
      icon: 'fas fa-stethoscope',
      title: 'Khoa Nội Tổng Quát',
      desc: 'Khám và điều trị toàn diện các bệnh lý tim mạch, hô hấp, tiêu hóa, gan mật và nội tiết cho người lớn.',
      tag: 'Chuyên sâu',
    },
    {
      icon: 'fas fa-baby',
      title: 'Nhi Khoa & Tiêm Chủng',
      desc: 'Theo dõi sự phát triển của trẻ, khám điều trị bệnh nhi khoa và cung cấp vắc xin trọn gói an toàn.',
      tag: 'Tận tâm',
    },
    {
      icon: 'fas fa-female',
      title: 'Sản Phụ Khoa & Thai Sản',
      desc: 'Chăm sóc thai kỳ trọn gói, tầm soát dị tật thai nhi, khám phụ khoa và hỗ trợ tư vấn sức khỏe sinh sản.',
      tag: 'Hiện đại',
    },
    {
      icon: 'fas fa-heartbeat',
      title: 'Khoa Tim Mạch Chuyên Sâu',
      desc: 'Tầm soát xơ vữa động mạch, đo điện tim, siêu âm tim chuẩn đoán các bệnh lý suy tim, tăng huyết áp.',
      tag: 'Kỹ thuật cao',
    },
    {
      icon: 'fas fa-ear-listen',
      title: 'Nhãn Khoa & Tai Mũi Họng',
      desc: 'Khám khúc xạ mắt chuyên sâu, điều trị nội ngoại khoa tai mũi họng bằng thiết bị hiện đại tiên tiến.',
      tag: 'Công nghệ mới',
    },
    {
      icon: 'fas fa-microscope',
      title: 'Xét Nghiệm & Chẩn Đoán',
      desc: 'Xét nghiệm sinh hóa máu chuẩn xác, siêu âm 4D thế hệ mới và X-Quang kỹ thuật số liều thấp.',
      tag: 'Nhanh & Chuẩn xác',
    },
  ]

  const mockDoctors = [
    {
      avatar: 'fas fa-user-md',
      name: 'BS. Nguyễn Văn An',
      specialty: 'Nội tổng quát',
      experience: '12 năm kinh nghiệm',
      rating: '4.9 / 5.0',
      fee: '200.000đ / lần',
    },
    {
      avatar: 'fas fa-user-nurse',
      name: 'BS. Trần Thị Bình',
      specialty: 'Tim mạch',
      experience: '15 năm kinh nghiệm',
      rating: '5.0 / 5.0',
      fee: '350.000đ / lần',
    },
    {
      avatar: 'fas fa-user-md',
      name: 'BS. Lê Minh Cường',
      specialty: 'Tai Mũi Họng',
      experience: '8 năm kinh nghiệm',
      rating: '4.8 / 5.0',
      fee: '250.000đ / lần',
    },
  ]

  const steps = [
    {
      icon: 'fas fa-search',
      title: 'Chọn bác sĩ & chuyên khoa',
      desc: 'Duyệt danh sách bác sĩ theo chuyên khoa, xem hồ sơ, kinh nghiệm và phí khám.',
      checks: ['Lọc theo chuyên khoa', 'Xem lịch sử đánh giá', 'So sánh phí khám'],
    },
    {
      icon: 'fas fa-calendar-alt',
      title: 'Chọn ngày & giờ trống',
      desc: 'Xem trực tiếp các slot còn trống trong ngày, chọn thời gian phù hợp với lịch của bạn.',
      checks: ['Slot 30 phút linh hoạt', 'Hiển thị real-time', 'Ca sáng & ca chiều'],
    },
    {
      icon: 'fas fa-check-circle',
      title: 'Xác nhận & nhận số thứ tự',
      desc: 'Gửi đơn đặt lịch, tiếp tân xác nhận và phát số thứ tự hàng đợi cho bạn.',
      checks: ['Tiếp tân duyệt nhanh', 'Nhận số thứ tự ngay', 'Thông báo xác nhận'],
    },
  ]

  const trustItems = [
    { icon: 'fas fa-hospital', title: 'Phòng khám đạt chuẩn', sub: 'Được Bộ Y tế cấp phép hoạt động' },
    { icon: 'fas fa-user-md', title: '20+ Bác sĩ chuyên khoa', sub: 'Có bằng cấp và chứng chỉ hành nghề' },
    { icon: 'fas fa-lock', title: 'Bảo mật dữ liệu', sub: 'Mã hoá end-to-end, JWT chuẩn công nghiệp' },
    { icon: 'fas fa-bolt', title: 'Hệ thống 99.9% uptime', sub: 'Microservices, Docker, luôn hoạt động' },
  ]

  const testimonials = [
    {
      avatar: 'fas fa-user',
      name: 'Nguyễn Thị Lan',
      info: 'Bệnh nhân • TP.HCM',
      text: 'Đặt lịch rất nhanh và tiện lợi. Tôi không phải chờ đợi lâu, hệ thống số thứ tự rất khoa học. Bác sĩ nhiệt tình và chuyên nghiệp.',
    },
    {
      avatar: 'fas fa-user',
      name: 'Trần Văn Hùng',
      info: 'Bệnh nhân • Bình Dương',
      text: 'Giao diện dễ dùng, đặt lịch từ điện thoại rất mượt. Slot giờ rõ ràng, không bị trùng lịch. Rất hài lòng với dịch vụ.',
    },
    {
      avatar: 'fas fa-user',
      name: 'Phạm Thị Mai',
      info: 'Bệnh nhân • Đồng Nai',
      text: 'Hệ thống hiện đại, thông tin bác sĩ đầy đủ. Tôi có thể chọn bác sĩ theo chuyên khoa và phí khám phù hợp túi tiền. Rất tiện!',
    },
  ]

  const contactInfo = [
    { icon: 'fas fa-map-marker-alt', label: 'Địa chỉ', value: '78 Giải Phóng, Đống Đa, Hà Nội' },
    { icon: 'fas fa-phone', label: 'Hotline', value: '1900 1234 56 (8h–17h)' },
    { icon: 'fas fa-envelope', label: 'Email', value: 'support@medicare-clinic.vn' },
  ]
</script>

<style scoped>
@import '@/styles/home.css';
</style>

<style>
/* [ignoring loop detection] */
html.dark {
  --white:         #1e293b;
  --off-white:     #0f172a;
  --gray-50:       #0f172a;
  --gray-100:      #1e293b;
  --gray-200:      #334155;
  --gray-300:      #475569;
  --gray-400:      #64748b;
  --gray-500:      #94a3b8;
  --gray-600:      #cbd5e1;
  --gray-700:      #e2e8f0;
  --gray-800:      #f1f5f9;
  --gray-900:      #ffffff;
  --text:          #f1f5f9;
  --text-muted:    #94a3b8;
  --cobalt-pale:   #1e3a8a;
  --cobalt-faint:  #172554;
}

html.dark body {
  background-color: #0f172a;
  color: #f1f5f9;
}

html.dark .home {
  background-color: #1e293b;
}

/* Navbar */
html.dark .navbar {
  background: rgba(15, 23, 42, 0.8) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
html.dark .navbar--scrolled {
  background: #0f172a !important;
}
html.dark .nav-links li a,
html.dark .dropdown-toggle {
  color: #cbd5e1 !important;
}
html.dark .nav-links li a:hover,
html.dark .nav-links li a.router-link-active,
html.dark .dropdown:hover .dropdown-toggle {
  color: #3b82f6 !important;
}
html.dark .dropdown-menu {
  background: #1e293b !important;
  border-color: #334155 !important;
}
html.dark .dropdown-menu a {
  color: #e2e8f0 !important;
}
html.dark .dropdown-menu a:hover {
  background: #334155 !important;
  color: #3b82f6 !important;
}
html.dark .user-pill {
  background: #1e293b !important;
  border-color: #334155 !important;
}
html.dark .user-pill__name {
  color: #f1f5f9 !important;
}

/* Hero / Sections */
html.dark .hero {
  background: #0f172a !important;
}
html.dark .hero__title {
  color: #ffffff !important;
}
html.dark .hero__subtitle {
  color: #94a3b8 !important;
}
html.dark .hero__eyebrow {
  background: #1e293b !important;
  border-color: #334155 !important;
  color: #3b82f6 !important;
}
html.dark .hero__stats,
html.dark .hcard {
  background: #1e293b !important;
  border-color: #334155 !important;
}
html.dark .stat-item {
  border-right-color: #334155 !important;
}
html.dark .stat-item__num {
  color: #3b82f6 !important;
}
html.dark .hcard__name {
  color: #ffffff !important;
}
html.dark .hcard__avatar {
  background: #1e3a8a !important;
  color: #3b82f6 !important;
}
html.dark .slot--taken {
  background: #334155 !important;
  color: #94a3b8 !important;
}
html.dark .hcard__mini-title {
  color: #ffffff !important;
}

/* Services / How / Doctors */
html.dark .services {
  background: #1e293b !important;
}
html.dark .section-title {
  color: #ffffff !important;
}
html.dark .section-sub {
  color: #94a3b8 !important;
}
html.dark .service-card {
  background: #0f172a !important;
  border-color: #334155 !important;
}
html.dark .service-card:hover {
  background: #1e293b !important;
}
html.dark .service-card__num {
  color: #1e293b !important;
}
html.dark .service-card:hover .service-card__num {
  color: #1e3a8a !important;
}
html.dark .service-card__title {
  color: #f1f5f9 !important;
}
html.dark .service-card__desc {
  color: #94a3b8 !important;
}
html.dark .doctors {
  background: #0f172a !important;
}
html.dark .doctor-card {
  background: #1e293b !important;
  border-color: #334155 !important;
}
html.dark .doctor-card__avatar {
  background: #1e293b !important;
  border-color: #1e293b !important;
}
html.dark .doctor-card__name {
  color: #ffffff !important;
}
html.dark .doctor-card__specialty {
  background: #1e3a8a !important;
  color: #3b82f6 !important;
}
html.dark .doctor-card__fee {
  background: #0f172a !important;
  color: #94a3b8 !important;
}
html.dark .doctor-card__fee strong {
  color: #3b82f6 !important;
}
html.dark .doctors-more p {
  color: #cbd5e1 !important;
}
html.dark .doctors-more strong {
  color: #ffffff !important;
}
html.dark .how {
  background: #1e293b !important;
}
html.dark .how-step__bubble {
  background: #1e293b !important;
  border-color: #334155 !important;
}
html.dark .how-step__body h3 {
  color: #ffffff !important;
}
html.dark .how-step__body p {
  color: #94a3b8 !important;
}
html.dark .timeline-bar {
  background: #0f172a !important;
  border-color: #334155 !important;
}
html.dark .timeline-bar__label {
  color: #94a3b8 !important;
}
html.dark .timeline-bar__total {
  color: #3b82f6 !important;
}
html.dark .testimonials {
  background: #0f172a !important;
}
html.dark .testi-card {
  background: #1e293b !important;
  border-color: #334155 !important;
}
html.dark .testi-card__text {
  color: #cbd5e1 !important;
}
html.dark .testi-card__name {
  color: #ffffff !important;
}
html.dark .contact {
  background: #1e293b !important;
}
html.dark .contact-item__label {
  color: #94a3b8 !important;
}
html.dark .contact-item__value {
  color: #ffffff !important;
}
html.dark .contact-hours {
  background: #0f172a !important;
}
html.dark .contact-hours h4 {
  color: #ffffff !important;
}
html.dark .hours-row {
  border-bottom-color: #1e293b !important;
}
html.dark .hours-row span {
  color: #cbd5e1 !important;
}
html.dark .hours-time {
  color: #ffffff !important;
}
html.dark .footer {
  background: #0f172a !important;
  border-top: 1px solid #1e293b !important;
}
html.dark .footer__col h5 {
  color: #ffffff !important;
}
html.dark .footer__col a {
  color: #94a3b8 !important;
}
html.dark .footer__col a:hover {
  color: #3b82f6 !important;
}
html.dark .footer__bottom {
  border-top-color: #1e293b !important;
}
html.dark .footer__bottom p {
  color: #64748b !important;
}
html.dark .badge {
  background: #1e293b !important;
  color: #cbd5e1 !important;
}

/* Floating theme switch button */
.theme-toggle-btn {
  position: fixed;
  bottom: 24px;
  right: 96px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 71, 171, 0.15);
  color: #0047AB;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(0, 71, 171, 0.15);
  z-index: 9999;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.theme-toggle-btn:hover {
  transform: scale(1.1) rotate(15deg);
  background: white;
  box-shadow: 0 12px 40px rgba(0, 71, 171, 0.25);
  border-color: #0047AB;
}
html.dark .theme-toggle-btn {
  background: rgba(30, 41, 59, 0.85);
  border-color: rgba(255, 255, 255, 0.15);
  color: #fbbf24;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
}
html.dark .theme-toggle-btn:hover {
  background: #1e293b;
  border-color: #fbbf24;
  box-shadow: 0 12px 40px rgba(251, 191, 36, 0.25);
}
</style>
