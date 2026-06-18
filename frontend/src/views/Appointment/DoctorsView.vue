<template>
  <div class="public-page doctors-page">
    <Navbar />

    <div class="page-header">
      <div class="container">
        <h1>Đội ngũ chuyên gia</h1>
        <p>Hội tụ những bác sĩ hàng đầu, tận tâm và giàu kinh nghiệm từ các bệnh viện tuyến đầu.</p>
      </div>
    </div>

    <section class="doctors-filters container">
      <div class="filter-bar">
        <div class="search-box">
          <i class="fas fa-search" />
          <input v-model="searchQuery" placeholder="Tìm tên bác sĩ hoặc chuyên khoa..." type="text">
        </div>

        <div class="tabs">
          <button v-for="cat in categories" :key="cat" :class="{ active: activeCat === cat }" @click="activeCat = cat">
            {{ cat }}
          </button>
        </div>
      </div>
    </section>

    <section class="doctors-list container">
      <!-- Stats bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
        <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
          Hiển thị <strong style="color: #0f172a;">{{ filteredDoctors.length }}</strong> bác sĩ
          <span v-if="activeCat !== 'Tất cả'"> chuyên khoa <strong style="color: #0047AB;">{{ activeCat }}</strong></span>
        </p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" style="display: flex; align-items: center; justify-content: center; padding: 6rem 0; color: #94a3b8; gap: 12px;">
        <i class="fas fa-spinner fa-spin" style="font-size: 1.5rem;" />
        <span style="font-size: 1.1rem;">Đang tải danh sách bác sĩ...</span>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredDoctors.length === 0" style="text-align: center; padding: 6rem 0;">
        <i class="fas fa-user-md" style="font-size: 4rem; color: #e2e8f0; margin-bottom: 1.5rem; display: block;" />
        <h3 style="color: #475569; margin-bottom: 0.5rem;">Không tìm thấy bác sĩ</h3>
        <p style="color: #94a3b8;">Thử thay đổi từ khóa tìm kiếm hoặc chọn chuyên khoa khác.</p>
      </div>

      <!-- Doctors grid -->
      <div v-else class="doctors-grid">
        <div v-for="(doc, index) in filteredDoctors" :key="doc.id" class="doc-card" :style="{ animationDelay: (index * 80) + 'ms' }">
          <div class="doc-card__image">
            <img :src="getDoctorImage(doc.fullName, doc.id)" :alt="'BS. ' + doc.fullName" loading="lazy" />
            <div class="doc-card__specialty-badge">{{ doc.specialty }}</div>
          </div>

          <div class="doc-card__body">
            <h3 class="doc-card__name">BS. {{ doc.fullName }}</h3>
            <p class="doc-card__desc">Chuyên gia chuyên khoa {{ doc.specialty }}. Tận tâm và giàu kinh nghiệm trong lĩnh vực y tế.</p>

            <div class="doc-card__stats">
              <div class="doc-card__stat">
                <i class="fas fa-star" style="color: #f59e0b;" />
                <span>4.9</span>
              </div>
              <div class="doc-card__stat">
                <i class="fas fa-briefcase-medical" style="color: #3b82f6;" />
                <span>{{ doc.degree || 'Chuyên khoa' }}</span>
              </div>
            </div>

            <div class="doc-card__footer">
              <div class="doc-card__fee">
                <span class="fee-label">Phí khám</span>
                <span class="fee-value">{{ (doc.consultationFee || 0).toLocaleString('vi-VN') }}đ</span>
              </div>
              <button class="doc-card__btn" @click="$router.push('/patient')">
                <i class="fas fa-calendar-check" /> Đặt hẹn
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import Navbar from '@/components/Navbar.vue'
  import api from '@/services/api'
  import { normalizeSearch } from '@/utils/search'

  const searchQuery = ref('')
  const activeCat = ref('Tất cả')
  const categories = ref(['Tất cả'])
  const doctors = ref([])
  const loading = ref(true)

  async function fetchDoctors () {
    loading.value = true
    try {
      const res = await api.get('/Doctors')
      doctors.value = res.data

      // Trích xuất danh sách chuyên khoa duy nhất
      const specs = [...new Set(res.data.map(d => d.specialty))]
      categories.value = ['Tất cả', ...specs]
    } catch (error) {
      console.error('Lỗi khi tải danh sách bác sĩ:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchDoctors()
  })

  function getDoctorImage(fullName, id) {
    const nameLower = (fullName || '').toLowerCase()
    
    // Heuristic for female Vietnamese names
    const isFemale = nameLower.includes('thị') || 
                     nameLower.includes('hương') || 
                     nameLower.includes('lan') || 
                     nameLower.includes('trang') ||
                     nameLower.includes('phương') || 
                     nameLower.includes('dương') ||
                     nameLower.includes('vy') ||
                     nameLower.includes('ngọc') ||
                     nameLower.includes('my') ||
                     nameLower.includes('huyền') ||
                     nameLower.includes('thảo')

    // Convert id to string safely for seed generation
    const idStr = String(id || '0')
    const seed = idStr.charCodeAt(0) + (idStr.length > 1 ? idStr.charCodeAt(idStr.length - 1) : 0)
    
    if (isFemale) {
      const femalePics = [
        'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=400&q=80'
      ]
      return femalePics[seed % femalePics.length]
    } else {
      const malePics = [
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80'
      ]
      return malePics[seed % malePics.length]
    }
  }

  const filteredDoctors = computed(() => {
    return doctors.value.filter(doc => {
      const matchSearch = normalizeSearch(doc.fullName).includes(normalizeSearch(searchQuery.value))
        || normalizeSearch(doc.specialty).includes(normalizeSearch(searchQuery.value))
      const matchCat = activeCat.value === 'Tất cả' || doc.specialty === activeCat.value
      return matchSearch && matchCat
    })
  })
</script>

<style scoped>
@import '@/styles/doctors.css';

/* Doctor Card - Modern Flat Design */
.doc-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  animation: fadeInUp 0.5s ease both;
}
.doc-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 71, 171, 0.1);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.doc-card__image {
  position: relative;
  height: 240px;
  overflow: hidden;
  background: #f1f5f9;
}
.doc-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.doc-card:hover .doc-card__image img {
  transform: scale(1.05);
}

.doc-card__specialty-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 71, 171, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
}

.doc-card__body {
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.doc-card__name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.doc-card__desc {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  flex: 1;
}

.doc-card__stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}
.doc-card__stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}

.doc-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.doc-card__fee {
  display: flex;
  flex-direction: column;
}
.fee-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}
.fee-value {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0047AB;
}

.doc-card__btn {
  background: #0047AB;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s ease;
}
.doc-card__btn:hover {
  background: #003080;
}

/* Override grid for new cards */
.doctors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
}
</style>
