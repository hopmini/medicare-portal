<template>
  <div class="patient-booking">
    <!-- BACKGROUND LIGHT BLUR ACCENTS -->
    <div class="booking-bg-glows">
      <div class="bg-glow bg-glow-1" />
      <div class="bg-glow bg-glow-2" />
    </div>

    <div class="booking-layout">
      <!-- SIDEBAR PROGRESS PANEL (Glassmorphism inspired) -->
      <aside class="booking-sidebar shadow-light">
        <div class="sidebar-brand">
          <div class="brand-logo" @click="$router.push('/')">
            <svg fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="height: 32px; width: 32px;">
              <rect fill="#0047AB" height="32" rx="8" width="32" />
              <path d="M16 6v20M6 16h20" stroke="white" stroke-linecap="round" stroke-width="4" />
            </svg>
            <span class="brand-text">Medicare<small style="color: #ef4444; font-weight: 900;">.</small></span>
          </div>
          <p class="brand-sub">Đặt lịch khám chuyên khoa trực tuyến</p>
        </div>

        <nav class="progress-steps-v">
          <div class="step-v" :class="{ 'step-v--active': currentStep === 1, 'step-v--completed': currentStep > 1 }">
            <div class="step-v__num">
              <i class="fas fa-check" v-if="currentStep > 1" />
              <span v-else>1</span>
            </div>
            <div class="step-v__content">
              <span class="step-v__label">Dịch vụ y tế</span>
              <span class="step-v__desc">Chọn gói khám lâm sàng</span>
            </div>
          </div>

          <div class="step-v" :class="{ 'step-v--active': currentStep === 2, 'step-v--completed': currentStep > 2 }">
            <div class="step-v__num">
              <i class="fas fa-check" v-if="currentStep > 2" />
              <span v-else>2</span>
            </div>
            <div class="step-v__content">
              <span class="step-v__label">Bác sĩ khám</span>
              <span class="step-v__desc">Chọn chuyên gia phụ trách</span>
            </div>
          </div>

          <div class="step-v" :class="{ 'step-v--active': currentStep === 3, 'step-v--completed': currentStep > 3 }">
            <div class="step-v__num">
              <i class="fas fa-check" v-if="currentStep > 3" />
              <span v-else>3</span>
            </div>
            <div class="step-v__content">
              <span class="step-v__label">Chọn thời gian</span>
              <span class="step-v__desc">Ngày & slot giờ khám</span>
            </div>
          </div>

          <div class="step-v" :class="{ 'step-v--active': currentStep === 4, 'step-v--completed': currentStep > 4 }">
            <div class="step-v__num">4</div>
            <div class="step-v__content">
              <span class="step-v__label">Xác nhận</span>
              <span class="step-v__desc">Hoàn tất lịch hẹn</span>
            </div>
          </div>
        </nav>

        <div class="sidebar-footer">
          <button class="btn-sidebar-back" @click="$router.push('/')">
            <i class="fas fa-home" /> Quay lại Cổng chính
          </button>
        </div>
      </aside>

      <!-- MAIN BOOKING CONTENT AREA -->
      <main class="booking-main">
        <div class="booking-content-card shadow-light animate-fade-in">
          
          <!-- STEP 1: SELECT CLINICAL SERVICE -->
          <section v-if="currentStep === 1">
            <div class="section-title">
              <h2>Chọn dịch vụ khám y khoa</h2>
              <p>Medicare tự động sắp xếp danh sách chuyên gia phù hợp với nhu cầu y tế của bạn.</p>
            </div>

            <div v-if="loadingServices" class="loading-state">
              <i class="fas fa-spinner fa-spin fa-2x text-blue" style="margin-bottom: 1rem;" />
              <p>Đang tải danh sách dịch vụ y tế...</p>
            </div>

            <div v-else>
              <!-- Search and Filter Bar -->
              <div class="search-box-container-v" style="margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1rem; text-align: left;">
                <div style="position: relative; display: flex; align-items: center; width: 100%;">
                  <i class="fas fa-search" style="position: absolute; left: 1rem; color: #94a3b8; font-size: 1.1rem;" />
                  <input
                    v-model="searchServiceQuery"
                    placeholder="Tìm dịch vụ khám (Nội soi, Khám tổng quát, Siêu âm...)"
                    type="text"
                    class="final-input"
                    style="padding-left: 2.75rem; width: 100%; height: 46px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-weight: 500; outline: none; transition: all 0.25s;"
                  />
                </div>
                
                <!-- Category tabs -->
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <button
                    v-for="cat in categories"
                    :key="cat"
                    @click="selectedCategory = cat"
                    class="cat-tab-btn"
                    :class="{ 'cat-tab-btn--active': selectedCategory === cat }"
                    style="padding: 0.5rem 1.1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 750; border: 1.5px solid #cbd5e1; cursor: pointer; transition: all 0.2s;"
                  >
                    {{ cat }}
                  </button>
                </div>
              </div>

              <!-- Services Grid -->
              <div class="grid-container">
                <div
                  v-for="service in filteredServices"
                  :key="service.id"
                  class="card-item"
                  :class="{ 'card-item--active': selectedServices.some(s => s.id === service.id) }"
                  @click="toggleService(service)"
                  style="display: flex; flex-direction: column; height: auto;"
                >
                  <div style="display: flex; gap: 12px; align-items: flex-start; width: 100%;">
                    <div class="card-item__icon">
                      <i v-if="selectedServices.some(s => s.id === service.id)" class="fas fa-check" style="color: var(--primary); font-size: 1.25rem;" />
                      <i v-else class="fas fa-stethoscope" />
                    </div>
                    <div class="card-item__info" style="flex: 1; text-align: left;">
                      <h3>{{ service.name }}</h3>
                      <p>{{ service.description }}</p>
                      <div class="card-item__price">{{ formatPrice(service.price + getSubOptionPriceDiff(service.id)) }}</div>
                    </div>
                  </div>
                  
                  <!-- Dynamic Sub-Options for selected services -->
                  <div 
                    v-if="selectedServices.some(s => s.id === service.id) && hasSubOptions(service)"
                    @click.stop
                    style="margin-top: 1rem; border-top: 1px dashed #cbd5e1; padding-top: 0.85rem; width: 100%; text-align: left;"
                  >
                    <label style="font-size: 0.78rem; font-weight: 800; color: #475569; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.3px;">
                      💡 Chọn phân loại khám chi tiết:
                    </label>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                      <label 
                        v-for="sub in getSubOptions(service)" 
                        :key="sub.name"
                        style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #1e293b; cursor: pointer; padding: 4px 8px; border-radius: 6px; background: rgba(0, 71, 171, 0.03);"
                      >
                        <input 
                          type="radio" 
                          :name="'sub-opt-' + service.id" 
                          :checked="selectedSubOptions[service.id]?.name === sub.name"
                          @change="selectSubOption(service.id, sub)"
                          style="accent-color: #0047AB;"
                        />
                        <span>{{ sub.name }} <b style="color: #0047AB;" v-if="sub.priceDiff > 0">(+{{ formatPrice(sub.priceDiff) }})</b></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="action-footer">
              <button class="btn-main btn-back-v" @click="$router.push('/')">
                <i class="fas fa-chevron-left" /> Quay lại trang chủ
              </button>
              <button class="btn-main btn-primary-v" :disabled="selectedServices.length === 0" @click="currentStep = 2">
                Chọn bác sĩ <i class="fas fa-chevron-right" />
              </button>
            </div>
          </section>

          <!-- STEP 2: SELECT SPECIALIST DOCTOR -->
          <section v-if="currentStep === 2">
            <div class="section-title">
              <h2>Chọn bác sĩ chuyên khoa phụ trách</h2>
              <p>Dịch vụ đã chọn: <b style="color: #0047AB;">{{ selectedServices.map(s => s.name).join(', ') }}</b></p>
            </div>

            <div v-if="loadingDoctors" class="loading-state">
              <i class="fas fa-spinner fa-spin fa-2x text-blue" style="margin-bottom: 1rem;" />
              <p>Đang tải đội ngũ bác sĩ chuyên khoa lâm sàng...</p>
            </div>

            <div v-else class="grid-container">
              <div
                v-for="doc in filteredDoctors"
                :key="doc.id"
                class="card-item"
                :class="{ 'card-item--active': selectedDoctor?.id === doc.id }"
                @click="selectDoctor(doc)"
              >
                <div class="card-item__icon"><i class="fas fa-user-md" /></div>
                <div class="card-item__info">
                  <h3>BS. {{ doc.fullName }}</h3>
                  <span class="doc-spec-badge">{{ doc.specialty }}</span>
                </div>
              </div>
            </div>

            <div class="action-footer">
              <button class="btn-main btn-back-v" @click="currentStep = 1">
                <i class="fas fa-chevron-left" /> Quay lại
              </button>
              <button class="btn-main btn-primary-v" :disabled="!selectedDoctor" @click="currentStep = 3">
                Chọn giờ khám <i class="fas fa-chevron-right" />
              </button>
            </div>
          </section>

          <!-- STEP 3: SELECT WORK DAY & SLOTS -->
          <section v-if="currentStep === 3">
            <div class="section-title">
              <h2>Lựa chọn thời gian khám bệnh</h2>
              <p>Bác sĩ lâm sàng: <b style="color: #0047AB;">BS. {{ selectedDoctor?.fullName }}</b></p>
            </div>

            <!-- Horizontal Dates Slider -->
            <div class="date-scroll-v">
              <div
                v-for="date in nextFourteenDays"
                :key="date.iso"
                class="date-card-v"
                :class="{ 'date-card-v--active': selectedDate === date.iso }"
                @click="selectDate(date.iso)"
              >
                <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">{{ date.dayName }}</span>
                <span class="date-day-num">{{ date.dayNum }}</span>
                <span style="font-size: 0.72rem; opacity: 0.85;">Tháng {{ date.month }}</span>
              </div>
              <!-- Sleek Modern Calendar Date Picker Card -->
              <div
                class="date-card-v"
                style="min-width: 68px; max-width: 110px; flex: 1; background: rgba(37, 99, 235, 0.05); border: 1.5px dashed rgba(37, 99, 235, 0.4); justify-content: center; align-items: center; color: var(--primary); gap: 2px; position: relative; cursor: pointer;"
                @click="openDatePicker"
              >
                <i class="fas fa-calendar-plus" style="font-size: 1.15rem;" />
                <span style="font-size: 0.68rem; font-weight: 800; white-space: nowrap;">Chọn ngày</span>
                <input
                  type="date"
                  ref="customDatePicker"
                  style="position: absolute; opacity: 0; width: 0; height: 0; top: 0; left: 0; pointer-events: none;"
                  :min="minSelectableDate"
                  @change="handleCustomDateChange"
                />
              </div>
            </div>

            <!-- Time Slots Grid -->
            <div v-if="selectedDate" class="slot-container">
              <div v-if="loadingSlots" class="loading-state">
                <i class="fas fa-spinner fa-spin fa-2x text-blue" style="margin-bottom: 1rem;" />
                <p>Đang tra cứu lịch trực bác sĩ...</p>
              </div>

              <div v-else-if="availableSlots.length === 0" class="empty-slots">
                <i class="far fa-calendar-times" style="font-size: 2.5rem; color: #cbd5e1; margin-bottom: 1rem; display: block;" />
                <p>Bác sĩ hiện không có ca khám trực nào khả dụng hoặc các ca hôm nay đã qua giờ.</p>
              </div>

              <div v-else style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%;">
                <!-- morning section -->
                <div v-if="morningSlots.length > 0" style="text-align: left;">
                  <h4 style="font-size: 0.9rem; font-weight: 800; color: #0047AB; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 6px;">
                    🌅 Ca sáng (08:00 - 12:00)
                  </h4>
                  <div class="slot-grid-v">
                    <div
                      v-for="slot in morningSlots"
                      :key="slot.id"
                      class="slot-v"
                      :class="{ 'slot-v--active': selectedSlot?.id === slot.id, 'slot-v--disabled': slot.isBooked }"
                      @click="!slot.isBooked && (selectedSlot = slot)"
                    >
                      <i class="far fa-clock" /> {{ formatTime(slot.startTime) }}
                    </div>
                  </div>
                </div>

                <!-- afternoon section -->
                <div v-if="afternoonSlots.length > 0" style="text-align: left;">
                  <h4 style="font-size: 0.9rem; font-weight: 800; color: #d97706; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 6px;">
                    🌇 Ca chiều (13:00 - 17:00)
                  </h4>
                  <div class="slot-grid-v">
                    <div
                      v-for="slot in afternoonSlots"
                      :key="slot.id"
                      class="slot-v"
                      :class="{ 'slot-v--active': selectedSlot?.id === slot.id, 'slot-v--disabled': slot.isBooked }"
                      @click="!slot.isBooked && (selectedSlot = slot)"
                    >
                      <i class="far fa-clock" /> {{ formatTime(slot.startTime) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="action-footer">
              <button class="btn-main btn-back-v" @click="currentStep = 2">
                <i class="fas fa-chevron-left" /> Quay lại
              </button>
              <button class="btn-main btn-primary-v" :disabled="!selectedSlot" @click="currentStep = 4">
                Đi tới xác nhận <i class="fas fa-chevron-right" />
              </button>
            </div>
          </section>

          <!-- STEP 4: FINAL SPLIT SCREEN CONFIRMATION -->
          <section v-if="currentStep === 4" class="step-final" style="margin-top: -1rem;">
            <div class="section-title" style="margin-bottom: 1.5rem; text-align: center;">
              <h2 style="font-size: 1.6rem; margin-bottom: 0.35rem;">Xác nhận thủ tục đăng ký</h2>
              <p style="font-size: 0.9rem; margin: 0; opacity: 0.85;">Hồ sơ lịch hẹn sẽ được duyệt tức thời bởi lễ tân lâm sàng.</p>
            </div>

            <div class="final-grid" style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%;">
              <!-- Top Column: Patient Profile Form Details -->
              <div class="final-form-col" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); width: 100%; box-sizing: border-box;">
                <div class="summary-section" style="border: none; padding: 0;">
                  <h3 style="font-size: 1.2rem; font-weight: 850; color: #0f172a; margin-top: 0; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-id-card text-blue" style="font-size: 1.35rem;" />
                    <span>Thông tin bệnh nhân trực tuyến</span>
                  </h3>
                  
                  <div class="final-form-fields" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-top: 0;">
                    <div class="form-field" style="display: flex; flex-direction: column; gap: 4px;">
                      <label style="font-size: 0.85rem; font-weight: 750; color: #334155; display: flex; align-items: center; gap: 4px;">
                        <i class="fas fa-user" style="color: var(--primary); font-size: 0.9rem;" /> Họ và tên bệnh nhân <span style="color: #ef4444;">*</span>:
                      </label>
                      <input v-model="patientForm.fullName" placeholder="Nhập họ và tên..." type="text" class="final-input" />
                    </div>
                    <div class="form-field" style="display: flex; flex-direction: column; gap: 4px;">
                      <label style="font-size: 0.85rem; font-weight: 750; color: #334155; display: flex; align-items: center; gap: 4px;">
                        <i class="fas fa-phone" style="color: var(--primary); font-size: 0.9rem;" /> Số điện thoại liên hệ <span style="color: #ef4444;">*</span>:
                      </label>
                      <input v-model="patientForm.phone" placeholder="Số điện thoại di động..." type="tel" class="final-input" />
                    </div>
                    <div class="form-field" style="display: flex; flex-direction: column; gap: 4px;">
                      <label style="font-size: 0.85rem; font-weight: 750; color: #334155; display: flex; align-items: center; gap: 4px;">
                        <i class="fas fa-envelope" style="color: var(--primary); font-size: 0.9rem;" /> Địa chỉ Email nhận kết quả <span style="color: #ef4444;">*</span>:
                      </label>
                      <input v-model="patientForm.email" placeholder="Nhập địa chỉ email..." type="email" class="final-input" />
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
                      <div class="form-field" style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="font-size: 0.85rem; font-weight: 750; color: #334155; display: flex; align-items: center; gap: 4px;">
                          <i class="fas fa-calendar" style="color: var(--primary); font-size: 0.9rem;" /> Ngày sinh <span style="color: #ef4444;">*</span>:
                        </label>
                        <input v-model="patientForm.dob" type="date" class="final-input" />
                      </div>
                      <div class="form-field" style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="font-size: 0.85rem; font-weight: 750; color: #334155; display: flex; align-items: center; gap: 4px;">
                          <i class="fas fa-venus-mars" style="color: var(--primary); font-size: 0.9rem;" /> Giới tính <span style="color: #ef4444;">*</span>:
                        </label>
                        <select v-model="patientForm.gender" class="final-input" style="padding: 0 1rem; background: white;">
                          <option value="">Chọn giới tính</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                    </div>
                     <!-- Quick Address Selector API Integration -->
                    <div class="form-field" style="grid-column: span 2; display: flex; flex-direction: column; gap: 8px;">
                      <label style="font-size: 0.85rem; font-weight: 750; color: #334155; display: flex; align-items: center; gap: 4px;">
                        <i class="fas fa-map-marker-alt" style="color: var(--primary); font-size: 0.9rem;" /> Địa chỉ thường trú <span style="color: #ef4444;">*</span>:
                      </label>
                      <div style="display: flex; flex-direction: column; gap: 0.65rem; width: 100%;">
                        <select v-model="selectedProvince" @change="handleProvinceChange" class="final-input" style="padding: 0 1rem; background: white; width: 100%; box-sizing: border-box;">
                          <option :value="null">-- Chọn Tỉnh / Thành phố --</option>
                          <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
                        </select>
                        <select v-model="selectedDistrict" @change="handleDistrictChange" :disabled="!selectedProvince" class="final-input" style="padding: 0 1rem; background: white; width: 100%; box-sizing: border-box;">
                          <option :value="null">-- Chọn Quận / Huyện --</option>
                          <option v-for="d in districts" :key="d.code" :value="d.code">{{ d.name }}</option>
                        </select>
                        <input v-model="streetAddress" @input="handleWardOrStreetChange" placeholder="Số nhà, tên đường, phường/xã..." type="text" class="final-input" style="width: 100%; box-sizing: border-box;" />
                      </div>
                      <div v-if="patientForm.address" style="font-size: 0.78rem; color: var(--slate-500); font-style: italic; margin-top: 4px;">
                        Địa chỉ đầy đủ: {{ patientForm.address }}
                      </div>
                    </div>

                    <div class="form-field" style="grid-column: span 2; display: flex; flex-direction: column; gap: 4px;">
                      <label style="font-size: 0.85rem; font-weight: 750; color: #334155; display: flex; align-items: center; gap: 4px;">
                        <i class="fas fa-notes-medical" style="color: var(--primary); font-size: 0.9rem;" /> Triệu chứng & Lý do khám bệnh (Không bắt buộc):
                      </label>
                      <textarea v-model="reason" placeholder="Ví dụ: Đau đầu kéo dài, sốt nhẹ vào chiều tối..." rows="3" class="final-textarea" style="padding: 0.75rem 1rem;" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bottom Column: Receipt Summary and Book Button Integrated -->
              <div class="final-summary-col" style="width: 100%; display: flex; flex-direction: column;">
                <div class="summary-card shadow-light" style="padding: 2rem; background: #ffffff; border: 1.5px solid var(--slate-200); border-radius: 16px; overflow: hidden; position: relative; width: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 1.2rem; font-weight: 850; color: #0f172a; margin-top: 0; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-receipt text-blue" style="font-size: 1.35rem;" /> Phiếu đặt lịch khám
                  </h3>
                  
                  <!-- Horizontal 3-Column Summary Details Grid -->
                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem; border-bottom: 2px dashed var(--slate-300); padding-bottom: 1.5rem;">
                    <!-- Column 1: Services & Fees -->
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                      <span style="font-size: 0.85rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase; letter-spacing: 0.5px;">Dịch vụ khám</span>
                      <div style="display: flex; flex-direction: column; gap: 4px;">
                        <div v-for="svc in selectedServices" :key="svc.id" style="font-weight: 800; color: var(--dark-slate); font-size: 0.95rem;">
                          {{ svc.name }}
                        </div>
                      </div>
                      <div style="margin-top: auto; padding-top: 8px; border-top: 1px dashed var(--slate-200);">
                        <span style="font-size: 0.8rem; color: var(--slate-500);">Phí tạm tính:</span>
                        <div style="font-size: 1.45rem; font-weight: 900; color: var(--primary);">{{ formatPrice(totalPrice) }}</div>
                      </div>
                    </div>

                    <!-- Column 2: Doctor in charge -->
                    <div style="display: flex; flex-direction: column; gap: 8px; border-left: 1px solid var(--slate-200); padding-left: 1.5rem;">
                      <span style="font-size: 0.85rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase; letter-spacing: 0.5px;">Bác sĩ phụ trách</span>
                      <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px;">
                        <div style="width: 42px; height: 42px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; color: var(--primary);">
                          <i class="fas fa-user-md" style="font-size: 1.25rem;" />
                        </div>
                        <div>
                          <div style="font-weight: 800; color: var(--dark-slate); font-size: 0.95rem;">BS. {{ selectedDoctor?.fullName }}</div>
                          <div style="font-size: 0.78rem; color: var(--slate-500); font-weight: 600;">{{ selectedDoctor?.specialty }}</div>
                        </div>
                      </div>
                    </div>

                    <!-- Column 3: Appt Time -->
                    <div style="display: flex; flex-direction: column; gap: 8px; border-left: 1px solid var(--slate-200); padding-left: 1.5rem;">
                      <span style="font-size: 0.85rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase; letter-spacing: 0.5px;">Thời gian hẹn</span>
                      <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px;">
                        <div style="width: 42px; height: 42px; border-radius: 50%; background: #f0fdf4; display: flex; align-items: center; justify-content: center; color: var(--success);">
                          <i class="fas fa-clock" style="font-size: 1.2rem;" />
                        </div>
                        <div>
                          <div style="font-weight: 800; color: var(--dark-slate); font-size: 0.95rem;">
                            {{ formatTime(selectedSlot?.startTime) }} - {{ estimatedEndTime }}
                          </div>
                          <div style="font-size: 0.78rem; color: var(--slate-500); font-weight: 600;">{{ formatDateFull(selectedDate) }}</div>
                        </div>
                      </div>
                      <div style="font-size: 0.75rem; color: #475569; margin-top: 6px; padding-top: 6px; border-top: 1px dashed #e2e8f0; line-height: 1.4;">
                        <div>⏱️ Thời gian khám: <b>{{ estimatedDuration }} phút</b></div>
                        <div style="margin-top: 2px;">👤 Lịch người tiếp theo: từ <b>{{ estimatedEndTime }}</b></div>
                      </div>
                    </div>
                  </div>

                  <!-- Footer Actions & Note -->
                  <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 2rem; align-items: center; margin-top: 1.5rem;">
                    <div>
                      <p style="margin: 0; font-size: 0.82rem; color: var(--slate-600); line-height: 1.5; display: flex; align-items: flex-start; gap: 8px;">
                        <i class="fas fa-info-circle text-blue" style="margin-top: 2px; font-size: 0.9rem;" /> 
                        <span>Lịch hẹn sẽ được gửi tức thời đến Cổng tiếp nhận. Bạn sẽ được cấp số thứ tự khám ngay khi lễ tân duyệt hồ sơ.</span>
                      </p>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                      <button class="btn-book-final shadow-light" :disabled="submitting" @click="bookAppointment" style="padding: 1rem 1.5rem; font-size: 1rem; width: 100%; border-radius: var(--radius-md); font-weight: 850; background: linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%);">
                        <span v-if="submitting"><i class="fas fa-spinner fa-spin" /> ĐANG TRUYỀN DỮ LIỆU...</span>
                        <span v-else><i class="fas fa-check-double" /> XÁC NHẬN ĐẶT LỊCH NGAY</span>
                      </button>
                      <button 
                        style="width: 100%; background: #f8fafc; border: 1.5px solid var(--slate-300); color: var(--slate-600); padding: 0.75rem; border-radius: var(--radius-md); font-weight: 750; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;"
                        @click="currentStep = 3"
                      >
                        <i class="fas fa-chevron-left" /> Quay lại chọn ngày
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="action-footer" style="margin-top: 2rem;">
              <button class="btn-main btn-back-v" @click="currentStep = 3">
                <i class="fas fa-chevron-left" /> Quay lại chọn ngày
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>

    <!-- TOAST POPUPS -->
    <div class="toast-container">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="'toast--' + toast.type">
        <div class="toast-body">
          <span class="toast-title">{{ toast.title }}</span>
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button class="toast-close" @click="removeToast(toast.id)">&times;</button>
        <div class="toast-progress" :style="{ animationDuration: '4s' }" />
      </div>
    </div>

    <!-- SUCCESS RECEIPT MODAL OVERLAY -->
    <div v-if="successData" class="success-overlay">
      <div class="success-card shadow-lg">
        <div class="success-icon"><i class="fas fa-check-circle" /></div>
        <h2>Đăng Ký Thành Công!</h2>
        <div class="appointment-id">Mã đơn: #{{ (successData.appointmentId || successData.id || '').slice(0,8).toUpperCase() }}</div>
        
        <p style="margin: 1.25rem 0; color: #475569; font-weight: 500;">
          Medicare đã gửi thông tin xác nhận qua hòm thư <b>{{ authStore.user.value?.email }}</b>. Bạn có thể theo dõi tiến độ khám tại lịch sử đặt hẹn bất cứ lúc nào.
        </p>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 1.25rem;">
          <button class="btn-primary" style="background: var(--primary);" @click="$router.push('/my-appointments')">XEM LỊCH SỬ ĐẶT HẸN</button>
          <button class="btn-primary" style="background: var(--slate-600);" @click="$router.push('/')">VỀ TRANG CHỦ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/services/api'
  import { appointmentService } from '@/services/appointmentService'
  import { useAuthStore } from '@/stores/authStore'
  import { useDoctorStore } from '@/stores/doctorStore'

  const router = useRouter()
  const authStore = useAuthStore()
  const doctorStore = useDoctorStore()

  onMounted(() => {
    if (!authStore.isAuthenticated.value || !authStore.isPatient.value) {
      router.push('/login')
    }
  })

  const currentStep = ref(1)
  const medicalServices = ref([])
  const loadingServices = ref(false)
  const selectedServices = ref([])
  const selectedDoctor = ref(null)
  const selectedDate = ref('')
  const selectedSlot = ref(null)
  const reason = ref('')
  const loadingSlots = ref(false)
  const submitting = ref(false)
  const successData = ref(null)
  const slots = ref([])
  const toasts = ref([])

  // Search and Category Filters for Services
  const searchServiceQuery = ref('')
  const selectedCategory = ref('Tất cả')
  const categories = ["Tất cả", "Khám bệnh lâm sàng", "Nội soi", "Chẩn đoán hình ảnh", "Xét nghiệm & Khác"]
  const selectedSubOptions = ref({})

  const getServiceCategory = (service) => {
    const name = (service.name || '').toLowerCase()
    const desc = (service.description || '').toLowerCase()
    if (name.includes('nội soi') || desc.includes('nội soi')) return "Nội soi"
    if (name.includes('siêu âm') || name.includes('x-quang') || name.includes('chụp') || name.includes('doppler')) return "Chẩn đoán hình ảnh"
    if (name.includes('xét nghiệm') || name.includes('máu') || name.includes('sinh hóa')) return "Xét nghiệm & Khác"
    return "Khám bệnh lâm sàng"
  }

  const filteredServices = computed(() => {
    let list = [...medicalServices.value]
    if (selectedCategory.value !== 'Tất cả') {
      list = list.filter(s => getServiceCategory(s) === selectedCategory.value)
    }
    if (searchServiceQuery.value.trim()) {
      const q = searchServiceQuery.value.toLowerCase().trim()
      list = list.filter(s => (s.name || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q))
    }
    return list
  })

  // Dynamic Sub-options config
  const hasSubOptions = (service) => {
    const name = (service.name || '').toLowerCase()
    return name.includes('nội soi') || name.includes('khám') || name.includes('tổng quát')
  }

  const getSubOptions = (service) => {
    const name = (service.name || '').toLowerCase()
    if (name.includes('nội soi')) {
      return [
        { name: "Nội soi dạ dày/đại tràng 1 phần (Tiêu chuẩn)", priceDiff: 0, duration: 20 },
        { name: "Nội soi tiêu hóa tổng quát (Dạ dày + Đại tràng gây mê không đau)", priceDiff: 500000, duration: 40 }
      ]
    }
    if (name.includes('khám') || name.includes('tổng quát')) {
      return [
        { name: "Khám cơ bản (Lâm sàng + Sinh hiệu)", priceDiff: 0, duration: 15 },
        { name: "Khám định kỳ tổng quát (Có xét nghiệm máu cơ bản)", priceDiff: 150000, duration: 25 },
        { name: "Khám tổng quát VIP (Chuyên sâu & Tầm soát sớm)", priceDiff: 350000, duration: 35 }
      ]
    }
    return []
  }

  const getSubOptionPriceDiff = (serviceId) => {
    return selectedSubOptions.value[serviceId]?.priceDiff || 0
  }

  const selectSubOption = (serviceId, sub) => {
    selectedSubOptions.value[serviceId] = sub
  }

  const availableSlots = computed(() => {
    if (!slots.value) return []
    
    // Check if the selected date is today in local time
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}` // Local YYYY-MM-DD
    
    if (selectedDate.value === todayStr) {
      const currentHours = today.getHours()
      const currentMinutes = today.getMinutes()
      
      return slots.value.filter(slot => {
        if (!slot.startTime) return false
        
        // Parse startTime (e.g. "08:30:00" or "08:30")
        const parts = slot.startTime.split(':')
        const slotHours = parseInt(parts[0], 10)
        const slotMinutes = parseInt(parts[1], 10)
        
        if (slotHours > currentHours) return true
        if (slotHours === currentHours && slotMinutes > currentMinutes) return true
        
        return false // Past time slot
      })
    }
    
    return slots.value
  })

  const morningSlots = computed(() => availableSlots.value.filter(s => s.startTime < '12:00'))
  const afternoonSlots = computed(() => availableSlots.value.filter(s => s.startTime >= '12:00'))

  const estimatedDuration = computed(() => {
    let duration = 15 // default
    selectedServices.value.forEach(svc => {
      const subOpt = selectedSubOptions.value[svc.id]
      if (subOpt && subOpt.duration) {
        duration = subOpt.duration
      } else {
        // service default
        const name = (svc.name || '').toLowerCase()
        if (name.includes('nội soi')) duration = 30
        else if (name.includes('siêu âm') || name.includes('x-quang') || name.includes('chụp') || name.includes('doppler')) duration = 20
        else duration = 15
      }
    })
    return duration
  })

  const estimatedEndTime = computed(() => {
    if (!selectedSlot.value || !selectedSlot.value.startTime) return ''
    const parts = selectedSlot.value.startTime.split(':')
    const startHour = parseInt(parts[0], 10)
    const startMin = parseInt(parts[1], 10)
    
    const endTotalMin = startHour * 60 + startMin + estimatedDuration.value
    const endHour = Math.floor(endTotalMin / 60)
    const endMin = endTotalMin % 60
    
    return `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`
  })

  const patientForm = ref({
    fullName: '',
    phone: '',
    address: '',
    email: '',
    dob: '',
    gender: '',
    insurance: '',
    history: '',
  })

  // Vietnam Provinces API Integration for Quick Address Selection
  const provinces = ref([])
  const districts = ref([])
  const wards = ref([])
  const selectedProvince = ref(null)
  const selectedDistrict = ref(null)
  const selectedWard = ref(null)
  const streetAddress = ref('')

  async function fetchProvinces() {
    try {
      const res = await fetch('https://provinces.open-api.vn/api/p/')
      if (res.ok) {
        provinces.value = await res.json()
      }
    } catch (e) {
      console.error('Lỗi tải danh sách tỉnh thành', e)
    }
  }

  async function handleProvinceChange() {
    districts.value = []
    wards.value = []
    selectedDistrict.value = null
    selectedWard.value = null
    updateAddressString()
    
    if (!selectedProvince.value) return
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.value}?depth=2`)
      if (res.ok) {
        const data = await res.json()
        districts.value = data.districts || []
      }
    } catch (e) {
      console.error('Lỗi tải danh sách quận huyện', e)
    }
  }

  function handleDistrictChange() {
    updateAddressString()
  }

  function handleWardOrStreetChange() {
    updateAddressString()
  }

  function updateAddressString() {
    const provObj = provinces.value.find(p => p.code === selectedProvince.value)
    const distObj = districts.value.find(d => d.code === selectedDistrict.value)
    
    const parts = [
      streetAddress.value ? streetAddress.value.trim() : '',
      distObj ? distObj.name : '',
      provObj ? provObj.name : ''
    ]
    patientForm.value.address = parts.filter(Boolean).join(', ')
  }

  function addToast (title, message, type = 'success') {
    const duplicate = toasts.value.find(t => t.title === title && t.message === message)
    if (duplicate) return
    if (toasts.value.length >= 3) {
      toasts.value.shift()
    }
    const id = Date.now()
    toasts.value.push({ id, title, message, type })
    setTimeout(() => removeToast(id), 4000)
  }

  function removeToast (id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const getServiceSpecialty = (serviceName) => {
    const name = (serviceName || '').toLowerCase()
    if (name.includes('mat') || name.includes('mắt') || name.includes('thị lực') || name.includes('kính') || name.includes('khúc xạ')) {
      return 'Khám mắt'
    }
    if (name.includes('chan thuong') || name.includes('chinh hinh') || name.includes('chấn thương') || name.includes('chỉnh hình') || name.includes('xương') || name.includes('khớp') || name.includes('gối')) {
      return 'Ngoại chấn thương chỉnh hình'
    }
    if (name.includes('nhi') || name.includes('trẻ em') || name.includes('bé')) {
      return 'Nhi khoa'
    }
    if (name.includes('răng') || name.includes('hàm') || name.includes('mặt') || name.includes('nha khoa') || name.includes('rang') || name.includes('ham')) {
      return 'Răng Hàm Mặt'
    }
    if (name.includes('tai') || name.includes('mũi') || name.includes('họng') || name.includes('mui') || name.includes('hong')) {
      return 'Tai Mũi Họng'
    }
    if (name.includes('sản') || name.includes('phụ khoa') || name.includes('phụ') || name.includes('thai') || name.includes('san') || name.includes('phu')) {
      return 'Sản Phụ Khoa'
    }
    if (name.includes('da liễu') || name.includes('da') || name.includes('mụn') || name.includes('lieu')) {
      return 'Da liễu'
    }
    if (name.includes('ngoại')) {
      return 'Ngoại tổng quát'
    }
    return 'Nội tổng quát'
  }

  const loadingDoctors = computed(() => doctorStore.loading.value)
  const filteredDoctors = computed(() => {
    const list = doctorStore.doctors.value || []
    if (selectedServices.value.length === 0) return list
    
    const targetSpecs = selectedServices.value.map(svc => getServiceSpecialty(svc.name))
    
    const matched = list.filter(doc => {
      const docSpec = (doc.specialty || '').trim()
      return targetSpecs.includes(docSpec)
    })
    
    return matched
  })

  const totalPrice = computed(() => {
    return selectedServices.value.reduce((sum, s) => {
      const base = s.price || 0
      const diff = getSubOptionPriceDiff(s.id)
      return sum + base + diff
    }, 0)
  })

  const nextFourteenDays = computed(() => {
    const days = []
    const today = new Date()
    const dayNames = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
    for (let i = 0; i < 14; i++) {
      const d = new Date()
      d.setDate(today.getDate() + i)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      days.push({
        iso: `${year}-${month}-${day}`,
        dayNum: d.getDate(),
        month: d.getMonth() + 1,
        dayName: i === 0 ? 'Hôm nay' : dayNames[d.getDay()],
      })
    }
    return days
  })

  async function fetchServices () {
    loadingServices.value = true
    try {
      const res = await api.get('/MedicalServices')
      medicalServices.value = res.data
    } catch (e) {
      addToast('Lỗi tải dịch vụ', 'Không thể kết nối danh mục y tế', 'error')
    } finally {
      loadingServices.value = false
    }
  }

  function toggleService (service) {
    const index = selectedServices.value.findIndex(s => s.id === service.id)
    if (index > -1) {
      selectedServices.value.splice(index, 1)
      delete selectedSubOptions.value[service.id]
      addToast('Đã bỏ chọn dịch vụ', service.name)
    } else {
      selectedServices.value.push(service)
      const subOpts = getSubOptions(service)
      if (subOpts.length > 0) {
        selectedSubOptions.value[service.id] = subOpts[0]
      }
      addToast('Đã chọn dịch vụ', service.name)
    }
    selectedDoctor.value = null
  }

  function selectDoctor (doc) {
    selectedDoctor.value = doc
    addToast('Đã chọn bác sĩ', `BS. ${doc.fullName}`)
  }

  async function selectDate (dateIso) {
    selectedDate.value = dateIso
    selectedSlot.value = null
    fetchSlots()
  }

  async function fetchSlots () {
    if (!selectedDoctor.value || !selectedDate.value) return
    loadingSlots.value = true
    try {
      slots.value = await appointmentService.getAvailableSlots(selectedDoctor.value.id, selectedDate.value)
    } catch (e) {
      addToast('Lỗi tải slot', 'Không thể tải lịch khám bác sĩ', 'error')
    } finally {
      loadingSlots.value = false
    }
  }

  async function bookAppointment () {
    if (selectedServices.value.length === 0) {
      addToast('Chưa chọn dịch vụ', 'Vui lòng chọn ít nhất một dịch vụ khám để tiếp tục', 'warning')
      return
    }

    const form = patientForm.value
    if (!form.fullName || !form.fullName.trim()) {
      addToast('Thiếu thông tin', 'Vui lòng điền họ và tên bệnh nhân', 'warning')
      return
    }
    if (!form.phone || !form.phone.trim()) {
      addToast('Thiếu thông tin', 'Vui lòng điền số điện thoại liên hệ', 'warning')
      return
    }
    if (!form.email || !form.email.trim()) {
      addToast('Thiếu thông tin', 'Vui lòng nhập địa chỉ email nhận kết quả', 'warning')
      return
    }
    if (!form.dob) {
      addToast('Thiếu thông tin', 'Vui lòng chọn ngày tháng năm sinh', 'warning')
      return
    }
    if (!form.gender) {
      addToast('Thiếu thông tin', 'Vui lòng chọn giới tính sinh học', 'warning')
      return
    }
    if (!form.address || !form.address.trim()) {
      addToast('Thiếu thông tin', 'Vui lòng nhập địa chỉ thường trú hiện tại', 'warning')
      return
    }

    submitting.value = true
    try {
      const servicesString = selectedServices.value.map(s => {
        const sub = selectedSubOptions.value[s.id]
        return sub ? `${s.name} (${sub.name})` : s.name
      }).join(', ')
      // Compile rich clinical details to the reason field to pass seamlessly to the backend DB without database schema breakage
      const richReason = `[KHÁM CHUYÊN KHOA]
- Lý do khám: ${(reason.value || '').trim() || 'Khám tổng quát'}
- Các dịch vụ đã chọn: ${servicesString}
- Bệnh nhân: ${form.fullName.trim()}
- Ngày sinh: ${form.dob}
- Giới tính: ${form.gender}
- SĐT liên hệ: ${form.phone.trim()}
- Địa chỉ thường trú: ${form.address.trim()}`

      const data = {
        patientId: authStore.user.value?.id,
        slotId: selectedSlot.value?.id || '',
        medicalServiceId: selectedServices.value[0]?.id || '',
        reason: richReason,
        patientEmail: form.email.trim(),
        examinationDuration: estimatedDuration.value
      }
      const response = await appointmentService.bookAppointment(data)
      successData.value = { ...response, patientName: form.fullName.trim() }
    } catch (error) {
      addToast('Đặt lịch thất bại', error.response?.data?.message || 'Có lỗi xảy ra trong quá trình đặt lịch', 'error')
    } finally {
      submitting.value = false
    }
  }

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
  const formatTime = (t) => t?.slice(0, 5) || ''
  function formatDateFull (iso) {
    if (!iso) return ''
    const d = new Date(iso)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  onMounted(() => {
    fetchServices()
    doctorStore.fetchDoctors()
    fetchProvinces()
    // Pre-populate fields from the logged in user store safely and robustly
    const u = authStore.user.value || authStore.user
    if (u) {
      patientForm.value.fullName = u.fullName || u.username || ''
      patientForm.value.email = u.email || (u.username && u.username.includes('@') ? u.username : '') || ''
      patientForm.value.phone = u.phoneNumber || u.phone || ''
      patientForm.value.address = u.address || ''
      streetAddress.value = u.address || ''
      patientForm.value.dob = u.dob ? u.dob.split('T')[0] : '2000-01-01'
      patientForm.value.gender = u.gender || 'Nam'
      patientForm.value.insurance = u.insurance || ''
      patientForm.value.history = u.history || ''
    }
  })
</script>

<style src="@/styles/patient.css"></style>
