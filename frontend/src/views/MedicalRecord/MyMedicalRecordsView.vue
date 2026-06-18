<template>
  <div class="public-page">
    <Navbar />

    <div class="page-header" style="background: #0047AB; color: white; padding: 2.5rem 0; text-align: left;">
      <div class="container" style="max-width: 1100px; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="margin: 0; font-size: 2.25rem; font-weight: 800; letter-spacing: -0.5px; color: #ffffff !important;">Lịch sử khám & Đơn thuốc</h1>
          <p style="margin: 0.5rem 0 0 0; font-size: 1rem; color: rgba(255,255,255,0.9) !important; font-weight: 500;">
            Tra cứu toàn bộ lịch sử bệnh án và các toa thuốc y khoa do bác sĩ chỉ định.
          </p>
        </div>
        <router-link to="/patient" class="btn-book-now" style="background: white; color: #0047AB; padding: 0.8rem 1.6rem; border-radius: 8px; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transition: 0.2s;">
          <i class="fas fa-calendar-plus" /> Đặt lịch khám mới
        </router-link>
      </div>
    </div>

    <div class="container" style="padding: 2rem 1rem 4rem 1rem; max-width: 1100px; margin: 0 auto;">
      
      <!-- Notification Banner for new records -->
      <div v-if="records.length > 0 && newRecordCount > 0" style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 1rem 1.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
        <div style="background: #16a34a; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;">
          <i class="fas fa-check" />
        </div>
        <div style="flex: 1; text-align: left;">
          <div style="font-weight: 800; color: #166534; font-size: 0.95rem;">Có {{ newRecordCount }} bệnh án mới được ghi nhận</div>
          <div style="font-size: 0.82rem; color: #15803d; margin-top: 2px;">Bác sĩ đã cập nhật kết quả khám và đơn thuốc mới nhất cho bạn.</div>
        </div>
        <button @click="scrollToNewRecords" style="background: #16a34a; color: white; border: none; padding: 0.5rem 1.25rem; border-radius: 8px; font-weight: 700; font-size: 0.82rem; cursor: pointer; white-space: nowrap; transition: 0.15s;">
          <i class="fas fa-arrow-down" /> Xem ngay
        </button>
      </div>

      <!-- Centered Notification Overlay -->
      <div v-if="showNotificationOverlay && notifications.length > 0" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(2px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 24px;" @click.self="showNotificationOverlay = false">
        <div style="background: white; border-radius: 16px; box-shadow: 0 25px 60px rgba(0,0,0,0.2); max-width: 480px; width: 100%; padding: 2rem; animation: fadeInUp 0.3s ease;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="background: #16a34a; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                <i class="fas fa-bell" />
              </div>
              <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a;">Thông báo mới</h3>
            </div>
            <button @click="showNotificationOverlay = false" style="background: none; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer; padding: 0; line-height: 1;">&times;</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px; max-height: 350px; overflow-y: auto;">
            <div v-for="n in notifications" :key="n.id" :style="n.type === 'success' ? 'background: #f0fdf4; border-left: 4px solid #16a34a;' : 'background: #eff6ff; border-left: 4px solid #3b82f6;'" style="border-radius: 8px; padding: 0.85rem 1rem; text-align: left;">
              <div :style="n.type === 'success' ? 'color: #166534;' : 'color: #1e40af;'" style="font-weight: 800; font-size: 0.88rem;">{{ n.title }}</div>
              <div :style="n.type === 'success' ? 'color: #15803d;' : 'color: #3b82f6;'" style="font-size: 0.82rem; margin-top: 2px;">{{ n.message }}</div>
              <div style="font-size: 0.72rem; font-weight: 600; color: #94a3b8; margin-top: 4px;">{{ n.time }}</div>
            </div>
          </div>
          <button @click="showNotificationOverlay = false" style="margin-top: 1.25rem; width: 100%; padding: 0.7rem; background: #0047AB; color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: 0.15s;">
            Đã hiểu
          </button>
        </div>
      </div>

      <!-- Patient Information Summary Card (Editable) -->
      <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 1.75rem; margin-bottom: 2.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.01); position: relative;">
        <!-- Card Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="background: #eff6ff; color: #0047AB; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.95rem;">
              <i class="fas fa-id-card" />
            </div>
            <h3 style="margin: 0; font-size: 1rem; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Hồ sơ sức khỏe cá nhân</h3>
          </div>
          
          <div v-if="!isEditingProfile">
            <button @click="startEditing" style="background: #f1f5f9; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.82rem; color: #475569; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: 0.15s;">
              <i class="fas fa-edit" /> Chỉnh sửa hồ sơ
            </button>
          </div>
          <div v-else style="display: flex; gap: 8px;">
            <button @click="isEditingProfile = false" style="background: white; border: 1px solid #cbd5e1; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.82rem; color: #475569; cursor: pointer; transition: 0.15s;">
              Hủy
            </button>
            <button @click="saveProfile" :disabled="profileLoading" style="background: #0047AB; border: none; padding: 0.5rem 1.25rem; border-radius: 8px; font-weight: 700; font-size: 0.82rem; color: white; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: 0.15s;">
              <i v-if="profileLoading" class="fas fa-circle-notch fa-spin" />
              <i v-else class="fas fa-save" /> Lưu lại
            </button>
          </div>
        </div>

        <!-- Detail Layout (Read-Only Mode) -->
        <div v-if="!isEditingProfile" style="display: grid; grid-template-columns: auto 1fr; gap: 2rem; align-items: center;">
          <div style="background: #eff6ff; color: #0047AB; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; box-shadow: 0 4px 10px rgba(0,71,171,0.08);">
            {{ (patientInfo.fullName || authStore.user.value?.fullName || 'BN').substring(0, 2).toUpperCase() }}
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Bệnh nhân</div>
              <div style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-top: 2px;">{{ patientInfo.fullName || authStore.user.value?.fullName || 'Đang tải...' }}</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Ngày sinh / Giới tính</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #334155; margin-top: 2px;">
                {{ patientInfo.dateOfBirth ? formatDateShort(patientInfo.dateOfBirth) : '--' }} / {{ patientInfo.gender || '--' }}
              </div>
            </div>
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Tiền sử bệnh lý & Triệu chứng hiện tại</div>
              <div style="font-size: 0.9rem; font-weight: 600; color: #475569; margin-top: 2px;">{{ patientInfo.medicalHistory || 'Chưa ghi nhận' }}</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #b91c1c; text-transform: uppercase;">Dị ứng thuốc/Thức ăn</div>
              <div style="font-size: 0.9rem; font-weight: 700; color: #991b1b; margin-top: 2px;">{{ patientInfo.allergies || 'Không dị ứng' }}</div>
            </div>
          </div>
        </div>

        <!-- Detail Layout (Edit Mode) -->
        <div v-else style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <label style="font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; text-align: left;">Họ và tên bệnh nhân</label>
            <input v-model="editForm.fullName" type="text" style="width: 100%; padding: 0.6rem 0.8rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; font-weight: 600; color: #334155; outline: none; transition: 0.15s;" placeholder="Họ và tên đầy đủ..." />
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <label style="font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; text-align: left;">Ngày sinh</label>
              <input v-model="editForm.dateOfBirth" type="date" style="width: 100%; padding: 0.6rem 0.8rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; font-weight: 600; color: #334155; outline: none;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <label style="font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; text-align: left;">Giới tính</label>
              <select v-model="editForm.gender" style="width: 100%; padding: 0.6rem 0.8rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; font-weight: 600; color: #334155; outline: none; background: white;">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px; grid-column: span 2;">
            <label style="font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; text-align: left;">Tiền sử bệnh lý & Triệu chứng hiện tại</label>
            <textarea v-model="editForm.medicalHistory" rows="2" style="width: 100%; padding: 0.6rem 0.8rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; font-weight: 600; color: #334155; outline: none; resize: vertical;" placeholder="Nhập tiền sử bệnh lý và các triệu chứng hiện tại bạn đang gặp phải..."></textarea>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px; grid-column: span 2;">
            <label style="font-size: 0.75rem; font-weight: 800; color: #b91c1c; text-transform: uppercase; text-align: left;">Dị ứng thuốc/Thức ăn</label>
            <textarea v-model="editForm.allergies" rows="2" style="width: 100%; padding: 0.6rem 0.8rem; border: 1.5px solid #fca5a5; border-radius: 8px; font-size: 0.9rem; font-weight: 600; color: #991b1b; outline: none; resize: vertical;" placeholder="Nhập chi tiết các dị ứng y khoa nếu có..."></textarea>
          </div>
        </div>
      </div>

      <!-- MEDICAL RECORDS SECTION -->
      <div class="history-section">
        <div v-if="loading" class="loading-state" style="text-align: center; padding: 4rem 0;">
          <i class="fas fa-circle-notch fa-spin fa-2x" style="color: #0047AB; margin-bottom: 1rem;" />
          <p style="color: #64748b; font-weight: 600;">Đang tải hồ sơ bệnh án của quý khách...</p>
        </div>

        <div v-else-if="records.length === 0" class="empty-state" style="background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 4rem 2rem; text-align: center;">
          <div class="empty-icon" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"><i class="fas fa-folder-open" /></div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">Chưa có hồ sơ bệnh án</h3>
          <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1.5rem;">Quý khách chưa có hồ sơ bệnh án nào được ghi nhận trên hệ thống Medicare.</p>
          <router-link class="btn-primary-action" to="/patient" style="display: inline-block; background: #0047AB; color: white; padding: 0.75rem 2rem; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 0.9rem; transition: 0.15s;">Đăng ký khám ngay</router-link>
        </div>

        <div v-else class="records-list animate-fade-in" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div v-for="rec in records" :key="rec.id" class="record-card" style="background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: 0.2s;">
            <!-- Card Header -->
            <div class="card-header" style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="background: #eff6ff; color: #0047AB; width: 42px; height: 42px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                  <i class="fas fa-file-prescription" />
                </div>
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                    {{ rec.title ? 'Khám bệnh chuyên khoa' : 'Bệnh án ngày' }}
                  </div>
                  <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">
                    {{ rec.title || formatDateFull(rec.createdAt) }}
                  </div>
                  <div v-if="rec.title" style="font-size: 0.75rem; color: #64748b; font-weight: 600; margin-top: 1px;">
                    Ngày lập: {{ formatDateFull(rec.createdAt) }}
                  </div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-family: monospace; font-size: 0.75rem; background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 6px; font-weight: 700;">
                  Mã BA: #{{ String(rec.id || '').substring(0, 8).toUpperCase() }}
                </span>
                <button class="btn-print" style="background: white; border: 1px solid #cbd5e1; color: #475569; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: 0.15s;" @click="downloadPdf(rec)">
                  <i class="fas fa-file-pdf" /> Tải PDF
                </button>
                <button v-if="rec.prescription" class="btn-print" style="background: white; border: 1px solid #cbd5e1; color: #475569; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: 0.15s;" @click="printPrescription(rec)">
                  <i class="fas fa-print" /> In toa thuốc
                </button>
                <button class="btn-print btn-delete-record" style="background: white; border: 1px solid #fecaca; color: #dc2626; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: 0.15s;" @click="confirmDelete(rec)">
                  <i class="fas fa-trash-alt" /> Xóa
                </button>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body" style="padding: 1.5rem; display: grid; grid-template-columns: 3fr 2fr; gap: 1.5rem;">
              <!-- Left column: Clinical history -->
              <div class="clinical-details" style="display: flex; flex-direction: column; gap: 1.25rem;">
                
                <!-- Vital Signs Grid -->
                <div v-if="rec.weight || rec.height || rec.bloodPressure || rec.heartRate || rec.temperature" style="display: flex; flex-direction: column; gap: 6px;">
                  <h4 style="margin: 0 0 6px 0; font-size: 0.85rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Chỉ số sinh tồn & Thể trạng</h4>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px;">
                    <div v-if="rec.weight" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 6px 10px; text-align: center;">
                      <div style="font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Cân nặng</div>
                      <div style="font-size: 0.95rem; font-weight: 800; color: #0047AB;">{{ rec.weight }} kg</div>
                    </div>
                    <div v-if="rec.height" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 6px 10px; text-align: center;">
                      <div style="font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Chiều cao</div>
                      <div style="font-size: 0.95rem; font-weight: 800; color: #0047AB;">{{ rec.height }} cm</div>
                    </div>
                    <div v-if="calculateBMI(rec.weight, rec.height)" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 6px 10px; text-align: center;">
                      <div style="font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase;">BMI</div>
                      <div style="font-size: 0.95rem; font-weight: 800; color: #16a34a;">{{ calculateBMI(rec.weight, rec.height) }}</div>
                      <div v-if="getBMICategory(calculateBMI(rec.weight, rec.height))" style="font-size: 0.6rem; font-weight: 800; margin-top: 1px;" :class="getBMICategory(calculateBMI(rec.weight, rec.height)).class">
                        {{ getBMICategory(calculateBMI(rec.weight, rec.height)).text }}
                      </div>
                    </div>
                    <div v-if="rec.bloodPressure" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 6px 10px; text-align: center;">
                      <div style="font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Huyết áp</div>
                      <div style="font-size: 0.95rem; font-weight: 800; color: #dc2626;">{{ rec.bloodPressure }}</div>
                    </div>
                    <div v-if="rec.heartRate" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 6px 10px; text-align: center;">
                      <div style="font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Nhịp tim</div>
                      <div style="font-size: 0.95rem; font-weight: 800; color: #dc2626;">{{ rec.heartRate }} bpm</div>
                    </div>
                    <div v-if="rec.temperature" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 6px 10px; text-align: center;">
                      <div style="font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Nhiệt độ</div>
                      <div style="font-size: 0.95rem; font-weight: 800; color: #ea580c;">{{ rec.temperature }} °C</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style="margin: 0 0 6px 0; font-size: 0.85rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Triệu chứng lâm sàng</h4>
                  <p style="margin: 0; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.9rem; color: #334155; line-height: 1.5; white-space: pre-wrap;">{{ rec.symptoms }}</p>
                </div>

                <div>
                  <h4 style="margin: 0 0 6px 0; font-size: 0.85rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Chẩn đoán của bác sĩ</h4>
                  <p style="margin: 0; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.9rem; color: #15803d; font-weight: 700; line-height: 1.5;">{{ rec.diagnosis }}</p>
                </div>

                <!-- Custom diagnostic test metrics table -->
                <div v-if="rec.customMetricsJson && safeParseJson(rec.customMetricsJson).length > 0">
                  <h4 style="margin: 0 0 6px 0; font-size: 0.85rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Bảng chỉ số dịch vụ cận lâm sàng</h4>
                  <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #fff;">
                    <div v-for="(metric, idx) in safeParseJson(rec.customMetricsJson)" :key="idx" style="display: flex; justify-content: space-between; padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem;">
                      <span style="font-weight: 700; color: #475569;">{{ metric.name }}</span>
                      <span style="font-weight: 800; color: #0047AB;">{{ metric.value }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style="margin: 0 0 6px 0; font-size: 0.85rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Lời dặn y khoa</h4>
                  <p style="margin: 0; font-size: 0.9rem; color: #475569; line-height: 1.5;">{{ rec.notes || 'Không có ghi chú thêm.' }}</p>
                </div>

                <!-- File Attachments display -->
                <div v-if="rec.attachmentsJson && safeParseJson(rec.attachmentsJson).length > 0">
                  <h4 style="margin: 0 0 6px 0; font-size: 0.85rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Tài liệu / Tệp đính kèm kết quả</h4>
                  <div style="display: flex; flex-direction: column; gap: 6px;">
                    <a v-for="(file, idx) in safeParseJson(rec.attachmentsJson)" :key="idx" :href="file.data" :download="file.name" style="background: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; text-decoration: none; color: #0047AB; font-weight: 700; font-size: 0.85rem; transition: 0.15s;">
                      <span style="display: flex; align-items: center; gap: 6px;">
                        <i class="far fa-file-alt" /> {{ file.name }}
                      </span>
                      <span style="font-size: 0.75rem; background: #0047AB; color: white; padding: 2px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
                        <i class="fas fa-download" /> Tải về
                      </span>
                    </a>
                  </div>
                </div>

                <!-- Lab Tests display -->
                <div v-if="rec.labTests && rec.labTests.length > 0">
                  <h4 style="margin: 12px 0 6px 0; font-size: 0.85rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Xét nghiệm</h4>
                  <div style="display: flex; flex-direction: column; gap: 6px;">
                    <div v-for="lt in rec.labTests" :key="lt.id" style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 8px 12px;">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700; font-size: 0.85rem;">{{ lt.testName }}</span>
                        <span :style="{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700, background: lt.status === 'Completed' ? '#dcfce7' : '#fef3c7', color: lt.status === 'Completed' ? '#16a34a' : '#d97706' }">{{ lt.status === 'Completed' ? 'Có kết quả' : lt.status }}</span>
                      </div>
                      <div v-if="lt.result" style="margin-top: 4px; font-size: 0.85rem;">
                        <strong>Kết quả:</strong> {{ lt.result }} <span v-if="lt.unit">{{ lt.unit }}</span>
                        <span v-if="lt.normalRange" style="color: #64748b; font-size: 0.75rem; margin-left: 8px;">(BT: {{ lt.normalRange }})</span>
                      </div>
                      <div v-if="lt.attachmentFileJson" style="margin-top: 6px;">
                        <a :href="lt.attachmentFileJson" download style="font-size: 0.78rem; color: #2563eb; text-decoration: underline;">
                          <i class="fas fa-download" /> Tải file kết quả
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right column: Prescription slip -->
              <div class="prescription-column">
                <div v-if="rec.prescription" class="prescription-slip" style="background: #fff8f8; border: 1.5px dashed #fca5a5; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; position: relative;">
                  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed #fca5a5; padding-bottom: 6px;">
                    <span style="font-weight: 800; font-size: 0.85rem; color: #b91c1c; text-transform: uppercase; display: flex; align-items: center; gap: 6px;">
                      <i class="fas fa-prescription-bottle" /> Đơn thuốc y khoa
                    </span>
                    <span style="font-size: 0.75rem; color: #7f1d1d; font-weight: 600;">
                      Medicare Pharmacy
                    </span>
                  </div>

                  <div v-if="rec.prescription.instructions" style="font-size: 0.8rem; color: #7f1d1d; background: #fee2e2; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #ef4444;">
                     <strong>Lời dặn:</strong> {{ rec.prescription.instructions }}
                  </div>

                  <!-- Medicines List -->
                  <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
                    <div v-for="(med, idx) in rec.prescription.details" :key="idx" style="background: white; border: 1px solid #fee2e2; border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700; font-size: 0.85rem; color: #1e293b;">{{ idx + 1 }}. {{ med.medicationName }}</span>
                        <span style="font-weight: 800; font-size: 0.85rem; color: #b91c1c;">x{{ med.quantity }} Viên</span>
                      </div>
                      <div style="font-size: 0.75rem; color: #64748b; font-style: italic; display: flex; align-items: center; gap: 4px;">
                        <i class="far fa-clock" /> Cách dùng: {{ med.dosage }}
                      </div>
                    </div>
                  </div>

                  <!-- Doctor signature visual -->
                  <div style="margin-top: auto; border-top: 1px dashed #fca5a5; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 4px;">
                    <div style="display: flex; flex-direction: column; font-size: 0.7rem; color: #94a3b8;">
                      <span>Hệ thống bệnh án điện tử</span>
                      <span>Bệnh viện quốc tế Medicare</span>
                    </div>
                    <div style="text-align: right; font-size: 0.75rem; font-weight: 700; color: #15803d; display: flex; align-items: center; gap: 4px; background: #f0fdf4; padding: 3px 6px; border-radius: 4px; border: 1px solid #bbf7d0;">
                      <i class="fas fa-signature" /> Đã ký điện tử
                    </div>
                  </div>
                </div>

                <!-- No prescription visual -->
                <div v-else style="height: 100%; min-height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 12px; color: #64748b; padding: 1.5rem; text-align: center;">
                  <i class="fas fa-info-circle" style="font-size: 1.5rem; margin-bottom: 6px; color: #94a3b8;" />
                  <span style="font-size: 0.85rem; font-weight: 600;">Không có đơn thuốc chỉ định</span>
                  <span style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Bác sĩ khám không chỉ định dùng thuốc hoặc khuyên dùng thuốc ngoài.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import Navbar from '@/components/Navbar.vue'
  import api from '@/services/api'
  import { medicalRecordService, MedicalRecord } from '@/services/medicalRecordService'
  import { useAuthStore } from '@/stores/authStore'

  const router = useRouter()
  const authStore = useAuthStore()
  
  const loading = ref(false)
  const profileLoading = ref(false)
  
  const records = ref<MedicalRecord[]>([])
  const printTarget = ref<MedicalRecord | null>(null)
  const notifications = ref<any[]>([])
  const showNotificationOverlay = ref(false)

  const isEditingProfile = ref(false)
  const editForm = ref({
    fullName: '',
    dateOfBirth: '',
    gender: 'Nam',
    medicalHistory: '',
    allergies: ''
  })

  function startEditing() {
    editForm.value.fullName = patientInfo.value.fullName
    editForm.value.dateOfBirth = patientInfo.value.dateOfBirth ? new Date(patientInfo.value.dateOfBirth).toISOString().split('T')[0] : ''
    editForm.value.gender = patientInfo.value.gender || 'Nam'
    editForm.value.medicalHistory = patientInfo.value.medicalHistory
    editForm.value.allergies = patientInfo.value.allergies
    isEditingProfile.value = true
  }

  async function saveProfile() {
    if (!editForm.value.fullName.trim()) {
      alert('Vui lòng điền họ và tên!')
      return
    }
    profileLoading.value = true
    try {
      const userId = authStore.user.value?.id
      if (!userId) {
        alert('Phiên làm việc hết hạn, vui lòng đăng nhập lại.')
        return
      }
      const res = await medicalRecordService.updatePatientProfile(userId, {
        fullName: editForm.value.fullName,
        dateOfBirth: editForm.value.dateOfBirth,
        gender: editForm.value.gender,
        medicalHistory: editForm.value.medicalHistory,
        allergies: editForm.value.allergies
      })
      if (res.success) {
        alert('Cập nhật hồ sơ sức khỏe thành công!')
        isEditingProfile.value = false
        await fetchProfile()
      } else {
        alert(res.message || 'Lỗi khi cập nhật hồ sơ.')
      }
    } catch (e: any) {
      alert('Lỗi: ' + (e.message || e))
    } finally {
      profileLoading.value = false
    }
  }

  const newRecordCount = computed(() => {
    const now = Date.now()
    const dayAgo = now - 24 * 60 * 60 * 1000
    return records.value.filter(r => {
      const t = r.createdAt ? new Date(r.createdAt).getTime() : 0
      return t >= dayAgo && t <= now
    }).length
  })

  function scrollToNewRecords() {
    const el = document.querySelector('.records-list')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function fetchNotifications() {
    try {
      const res = await api.get('/Notifications/my')
      const list = res.data || []
      notifications.value = list.slice(0, 5).map((n: any) => ({
        id: n.id,
        title: n.title || 'Thông báo y khoa',
        message: n.message || '',
        type: n.type === 'info' ? 'medical' : n.type,
        time: n.createdAt ? new Date(n.createdAt).toLocaleString('vi-VN') : ''
      }))
      if (notifications.value.length > 0) {
        showNotificationOverlay.value = true
        // Auto-dismiss after 8 seconds
        setTimeout(() => { showNotificationOverlay.value = false }, 8000)
      }
    } catch { }
  }

  const patientInfo = ref({
    fullName: '',
    dateOfBirth: '',
    gender: '--',
    medicalHistory: '',
    allergies: ''
  })

  // Load Patient Profile (MedicalRecordDB -> Patients)
  async function fetchProfile() {
    if (!authStore.user.value?.id) return
    profileLoading.value = true
    try {
      const res = await medicalRecordService.getPatientProfile(authStore.user.value.id)
      if (res) {
        const rawName = res.fullName || ''
        patientInfo.value.fullName = (rawName === 'Bệnh nhân Medicare' && authStore.user.value?.fullName)
          ? authStore.user.value.fullName
          : (rawName || authStore.user.value?.fullName || '')
        patientInfo.value.gender = res.gender || 'Nam'
        patientInfo.value.medicalHistory = res.medicalHistory || ''
        patientInfo.value.allergies = res.allergies || ''
        patientInfo.value.dateOfBirth = res.dateOfBirth || ''
      }
    } catch (e) {
      console.error('Lỗi tải hồ sơ bệnh nhân:', e)
    } finally {
      profileLoading.value = false
    }
  }

  // Load Clinical history records
  async function fetchRecords() {
    if (!authStore.user.value?.id) return
    loading.value = true
    try {
      const res = await medicalRecordService.getRecordsByPatient(authStore.user.value.id)
      records.value = res || []
    } catch (e) {
      console.error('Không tải được danh sách bệnh án:', e)
    } finally {
      loading.value = false
    }
  }

  async function confirmDelete(rec: MedicalRecord) {
    if (!confirm(`Xác nhận xóa bệnh án #${String(rec.id || '').substring(0, 8).toUpperCase()}?`)) return
    loading.value = true
    try {
      const res = await medicalRecordService.deleteRecord(rec.id!)
      if (res.success) {
        alert(res.message || 'Đã xóa thành công!')
        await fetchRecords()
      } else {
        alert(res.message || 'Xóa thất bại.')
      }
    } catch (e: any) {
      alert('Lỗi: ' + (e.message || e))
    } finally {
      loading.value = false
    }
  }

  function downloadPdf(rec: MedicalRecord) {
    const pName = patientInfo.value.fullName || 'Bệnh nhân Medicare'
    const recordId = String(rec.id || '').substring(0, 8).toUpperCase()
    const dateStr = formatDateFull(rec.createdAt)

    let labHtml = ''
    if (rec.labTests?.length) {
      labHtml = '<h4 style="margin: 20px 0 10px; font-size: 14pt;">KẾT QUẢ XÉT NGHIỆM</h4>'
      rec.labTests.forEach((lt: any) => {
        labHtml += `<div style="border: 1px solid #ddd; padding: 8px; margin-bottom: 8px;">
          <strong>${lt.testName}</strong>${lt.result ? `: ${lt.result} ${lt.unit || ''}` : ''}
          ${lt.normalRange ? `<span style="color: #666; margin-left: 8px;">(Bình thường: ${lt.normalRange})</span>` : ''}
        </div>`
      })
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) { alert('Trình duyệt đã chặn popup.'); return }
    printWindow.document.write(`
      <html>
        <head><title>Bệnh án - Medicare</title>
        <style>
          body { padding: 2cm; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.4; }
          @media print { @page { margin: 1.5cm; } body { padding: 0; } }
          table { width: 100%; border-collapse: collapse; }
        </style></head>
        <body>
          <div style="border-bottom: 2px solid #0047AB; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between;">
            <div>
              <h2 style="margin: 0; color: #0047AB;">Bệnh viện Medicare</h2>
              <p style="margin: 2px 0; font-size: 10pt;">78 Giải Phóng, Đống Đa, Hà Nội | 1900 6789</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-weight: bold;">MÃ BA: #${recordId}</p>
              <p style="margin: 2px 0; font-size: 10pt;">Ngày: ${dateStr}</p>
            </div>
          </div>
          <h3 style="text-align: center; text-transform: uppercase;">BỆNH ÁN ĐIỆN TỬ</h3>
          <p style="margin-top: 20px;"><strong>Bệnh nhân:</strong> ${pName}</p>
          <p><strong>Chẩn đoán:</strong> ${rec.diagnosis || ''}</p>
          ${rec.preliminaryDiagnosis ? `<p><strong>Chẩn đoán sơ bộ:</strong> ${rec.preliminaryDiagnosis}</p>` : ''}
          ${rec.finalDiagnosis ? `<p><strong>Chẩn đoán cuối cùng:</strong> ${rec.finalDiagnosis}</p>` : ''}
          <p><strong>Triệu chứng:</strong> ${rec.symptoms || ''}</p>
          ${rec.diagnosisCode ? `<p><strong>Mã ICD-10:</strong> ${rec.diagnosisCode} - ${rec.diagnosisCodeName || ''}</p>` : ''}
          ${rec.notes ? `<p><strong>Ghi chú:</strong> ${rec.notes}</p>` : ''}
          ${labHtml}
          <div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 10px; text-align: center; font-size: 10pt; color: #666;">
            Bệnh án điện tử - Medicare Hospital System
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => { printWindow.print() }, 500)
  }

  function printPrescription(rec: MedicalRecord) {
    if (!rec.prescription || !rec.prescription.details || rec.prescription.details.length === 0) {
      alert('Bệnh án này không có đơn thuốc để in.')
      return
    }
    const pName = patientInfo.value.fullName || authStore.user.value?.fullName || 'Bệnh nhân Medicare'
    const recordId = String(rec.id || '').substring(0, 8).toUpperCase()
    const dateCreated = rec.createdAt ? new Date(rec.createdAt) : new Date()
    const dateStr = formatDateFull(rec.createdAt)
    
    let medsHtml = ''
    rec.prescription.details.forEach((med, idx) => {
      medsHtml += `
        <tr style="border-bottom: 1px dashed #ccc;">
          <td style="padding: 8px 0;">${idx + 1}</td>
          <td style="padding: 8px 0; font-weight: bold;">${med.medicationName}</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold;">${med.quantity} Viên</td>
          <td style="padding: 8px 0; padding-left: 20px; font-style: italic;">${med.dosage}</td>
        </tr>
      `
    })

    const instructionsHtml = rec.prescription.instructions 
      ? `<div style="margin-bottom: 30px; border: 1px solid black; padding: 10px; font-style: italic;"><strong>Lời dặn của bác sĩ:</strong> ${rec.prescription.instructions}</div>` 
      : ''

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Trình duyệt đã chặn popup. Vui lòng cho phép popup để in toa thuốc.')
      return
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>In Toa Thuốc - Medicare Hospital</title>
          <style>
            body { margin: 0; padding: 2.5cm; font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: black; line-height: 1.4; }
            @media print { @page { margin: 1.5cm; } body { padding: 0; } }
            table { width: 100%; border-collapse: collapse; }
          </style>
        </head>
        <body>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 20px;">
            <div>
              <h3 style="margin: 0; font-size: 16pt; font-weight: bold; text-transform: uppercase;">Bệnh viện quốc tế Medicare</h3>
              <p style="margin: 3px 0; font-size: 10pt; font-style: italic;">Địa chỉ: 78 Giải Phóng, Đống Đa, Hà Nội</p>
              <p style="margin: 0; font-size: 10pt; font-style: italic;">Điện thoại: 1900 6789</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 10pt; font-weight: bold;">Mã số BA: #${recordId}</p>
              <p style="margin: 3px 0; font-size: 10pt;">Ngày khám: ${dateStr}</p>
            </div>
          </div>
          <h2 style="text-align: center; text-transform: uppercase; font-size: 20pt; font-weight: bold; margin: 30px 0;">Đơn thuốc y khoa</h2>
          <div style="margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>Họ và tên bệnh nhân:</strong> ${pName}</p>
            <p style="margin: 5px 0;"><strong>Chẩn đoán:</strong> ${rec.diagnosis}</p>
            <p style="margin: 5px 0;"><strong>Triệu chứng lâm sàng:</strong> ${rec.symptoms}</p>
          </div>
          <h3 style="font-size: 13pt; font-weight: bold; border-bottom: 1px solid black; padding-bottom: 4px; margin-top: 30px; margin-bottom: 10px;">Thuốc chỉ định</h3>
          <table style="margin-bottom: 30px;">
            <thead>
              <tr style="border-bottom: 1px solid black; text-align: left;">
                <th style="padding: 6px 0; width: 50px;">STT</th>
                <th style="padding: 6px 0;">Tên thuốc / Biệt dược</th>
                <th style="padding: 6px 0; text-align: right; width: 100px;">Số lượng</th>
                <th style="padding: 6px 0; padding-left: 20px;">Cách dùng (Liều lượng)</th>
              </tr>
            </thead>
            <tbody>${medsHtml}</tbody>
          </table>
          ${instructionsHtml}
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 50px;">
            <div>
              <p style="margin: 0; font-size: 10pt; font-style: italic;">(Toa thuốc có giá trị sử dụng trong 5 ngày kể từ ngày kê đơn)</p>
            </div>
            <div style="text-align: center; width: 250px;">
              <p style="margin: 0; font-style: italic;">Hà Nội, ngày ${dateCreated.getDate()} tháng ${dateCreated.getMonth() + 1} năm ${dateCreated.getFullYear()}</p>
              <p style="margin: 5px 0 40px 0; font-weight: bold; text-transform: uppercase;">Bác sĩ điều trị</p>
              <p style="margin: 0; font-weight: bold; color: green; border: 2px solid green; display: inline-block; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">Đã ký điện tử</p>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }

  function formatDateFull(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  function calculateBMI(w?: number, h?: number) {
    if (!w || !h) return null
    const heightInMeters = h / 100
    return (w / (heightInMeters * heightInMeters)).toFixed(1)
  }

  function formatDateShort(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  function getBMICategory(bmiVal?: string | null) {
    if (!bmiVal) return null
    const val = parseFloat(bmiVal)
    if (val < 18.5) return { text: 'Thiếu cân', class: 'bmi-underweight' }
    if (val < 25) return { text: 'Bình thường', class: 'bmi-normal' }
    if (val < 30) return { text: 'Thừa cân', class: 'bmi-overweight' }
    return { text: 'Béo phì', class: 'bmi-obese' }
  }

  function safeParseJson(jsonStr?: string) {
    if (!jsonStr) return []
    try {
      return JSON.parse(jsonStr)
    } catch (e) {
      return []
    }
  }

  onMounted(async () => {
    if (!authStore.isAuthenticated.value) {
      router.push('/login')
      return
    }
    await fetchProfile()
    await fetchRecords()
    await fetchNotifications()
  })
</script>

<style scoped>
@import '@/styles/public-pages.css';

.record-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
}

.btn-print:hover {
  border-color: #0047AB !important;
  color: #0047AB !important;
  background-color: #f0f7ff !important;
}

.btn-delete-record:hover {
  border-color: #dc2626 !important;
  color: #b91c1c !important;
  background-color: #fef2f2 !important;
}

.btn-book-now:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15) !important;
  background-color: #f8fafc !important;
}

@media (max-width: 768px) {
  .card-body {
    grid-template-columns: 1fr !important;
  }
}
</style>
