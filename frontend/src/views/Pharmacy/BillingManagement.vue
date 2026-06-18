<template>
  <a-layout :style="inline ? 'background: transparent; min-height: auto;' : 'min-height: 100vh; background: #f8fafc;'">
      <a-layout-sider v-if="!inline" width="260" theme="light" style="background: #ffffff; border-right: 1px solid #f0f4f9; flex-shrink: 0;">
        <PharmacySidebar />
      </a-layout-sider>
    
    <a-layout :style="inline ? 'background: transparent;' : 'background: #f8fafc;'">
      <AppHeader v-if="!inline" :title="viewMode === 'list' ? 'Hóa đơn bán thuốc' : createTitle" />
 
      <a-layout-content :style="inline ? 'padding: 0;' : 'padding: 24px 28px;'">

        <!-- ==================== LIST VIEW ==================== -->
        <template v-if="viewMode === 'list'">
          <!-- 4 Metric Cards -->
          <a-row :gutter="20" style="margin-bottom: 24px;">
            <a-col :xs="24" :sm="6">
              <a-card :bordered="false" class="metric-card">
                <div class="metric-content">
                  <div class="metric-icon" style="background: #eff6ff; color: #3b82f6;">
                    <i class="fas fa-file-invoice" />
                  </div>
                  <div>
                    <div class="metric-title">Hóa đơn hôm nay</div>
                    <div class="metric-value" style="color: #3b82f6;">{{ todayBillsCount }}</div>
                    <div class="metric-sub">Tổng tiền: {{ todayBillsTotal.toLocaleString() }} đ</div>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="6">
              <a-card :bordered="false" class="metric-card">
                <div class="metric-content">
                  <div class="metric-icon" style="background: #fffbeb; color: #f59e0b;">
                    <i class="fas fa-clock" />
                  </div>
                  <div>
                    <div class="metric-title">Chờ thanh toán</div>
                    <div class="metric-value" style="color: #f59e0b;">{{ pendingBillsCount }}</div>
                    <div class="metric-sub">Tổng tiền: {{ pendingBillsTotal.toLocaleString() }} đ</div>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="6">
              <a-card :bordered="false" class="metric-card">
                <div class="metric-content">
                  <div class="metric-icon" style="background: #ecfdf5; color: #10b981;">
                    <i class="fas fa-check-circle" />
                  </div>
                  <div>
                    <div class="metric-title">Đã thanh toán</div>
                    <div class="metric-value" style="color: #10b981;">{{ paidBillsCount }}</div>
                    <div class="metric-sub">Tổng tiền: {{ paidBillsTotal.toLocaleString() }} đ</div>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="6">
              <a-card :bordered="false" class="metric-card">
                <div class="metric-content">
                  <div class="metric-icon" style="background: #fef2f2; color: #ef4444;">
                    <i class="fas fa-times-circle" />
                  </div>
                  <div>
                    <div class="metric-title">Đã hủy</div>
                    <div class="metric-value" style="color: #ef4444;">{{ cancelledBillsCount }}</div>
                    <div class="metric-sub">Tổng tiền: {{ cancelledBillsTotal.toLocaleString() }} đ</div>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>

          <!-- Tabs & Action Buttons Row -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <a-tabs v-model:activeKey="activeTab" class="bill-tabs" style="margin-bottom: 0;">
              <a-tab-pane key="all" tab="Tất cả hóa đơn" />
              <a-tab-pane key="prescription" tab="Theo đơn bác sĩ" />
              <a-tab-pane key="otc" tab="Ngoài đơn" />
              <a-tab-pane key="combined" tab="Tổng hợp" />
            </a-tabs>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <a-button style="border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 6px; border-color: #0047AB; color: #0047AB;" @click="viewMode = 'create-rx'">
                <i class="fas fa-file-prescription" /> Tạo hóa đơn theo đơn
              </a-button>
              <a-button style="border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 6px; border-color: #f59e0b; color: #f59e0b;" @click="viewMode = 'create-otc'">
                <i class="fas fa-cart-plus" /> Tạo hóa đơn ngoài đơn
              </a-button>
              <a-button type="primary" style="background: #0047AB; border-color: #0047AB; border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 6px;" @click="viewMode = 'create-combo'">
                <i class="fas fa-plus" /> Tạo hóa đơn tổng hợp
              </a-button>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="search-bar">
            <a-input v-model:value="searchQuery" placeholder="Tìm theo mã HĐ, bệnh nhân, số điện thoại..." style="width: 320px; border-radius: 8px;" allow-clear>
              <template #prefix>
                <i class="fas fa-search" style="color: #cbd5e1;" />
              </template>
            </a-input>
            <a-select v-model:value="filterType" style="width: 190px;" placeholder="Tất cả loại hóa đơn">
              <a-select-option value="all">Tất cả loại hóa đơn</a-select-option>
              <a-select-option value="prescription">Theo đơn bác sĩ</a-select-option>
              <a-select-option value="otc">Ngoài đơn</a-select-option>
              <a-select-option value="combined">Tổng hợp</a-select-option>
            </a-select>
            <a-select v-model:value="filterPayStatus" style="width: 170px;" placeholder="Tất cả trạng thái">
              <a-select-option value="all">Tất cả trạng thái</a-select-option>
              <a-select-option value="paid">Đã thanh toán</a-select-option>
              <a-select-option value="pending">Chờ thanh toán</a-select-option>
              <a-select-option value="cancelled">Đã hủy</a-select-option>
            </a-select>
            <a-range-picker style="width: 260px;" :placeholder="['Từ ngày', 'Đến ngày']" format="DD/MM/YYYY" />
            <a-button style="border-radius: 8px; display: flex; align-items: center; gap: 6px;" @click="resetFilters">
              <i class="fas fa-sync-alt" />
            </a-button>
          </div>

          <!-- Main Table -->
          <a-card :bordered="false" class="main-card" style="overflow-x: auto;">
            <a-spin :spinning="loading">
            <a-empty v-if="!loading && filteredBills.length === 0" description="Không có hóa đơn nào" />
            <a-table v-if="filteredBills.length > 0"
              :columns="columns"
              :data-source="filteredBills"
              row-key="id"
              :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total: number, range: [number, number]) => `Hiển thị ${range[0]} đến ${range[1]} của ${total} hóa đơn`, locale: { items_per_page: '/ trang' } }"
              size="middle"
              :scroll="{ x: 1200 }"
            >
              <template #bodyCell="{ text, record, column }">
                <template v-if="column.key === 'code'">
                  <span style="font-weight: 700; color: #0047AB; cursor: pointer; font-size: 0.85rem;" @click="showBillDetails(record)">{{ record.code }}</span>
                </template>
                <template v-else-if="column.key === 'billType'">
                  <a-tag v-if="record.billType === 'prescription'" color="blue" style="font-weight: 600; border-radius: 4px;">Theo đơn bác sĩ</a-tag>
                  <a-tag v-else-if="record.billType === 'otc'" color="orange" style="font-weight: 600; border-radius: 4px;">Ngoài đơn</a-tag>
                  <a-tag v-else-if="record.billType === 'combined'" color="purple" style="font-weight: 600; border-radius: 4px;">Tổng hợp</a-tag>
                </template>
                <template v-else-if="column.key === 'patient'">
                  <div>
                    <div style="font-weight: 600; color: #1e293b;">{{ record.patientName }}</div>
                    <div style="font-size: 0.78rem; color: #94a3b8;">{{ record.patientPhone }}</div>
                  </div>
                </template>
                <template v-else-if="column.key === 'createdDate'">
                  <div>
                    <div style="font-weight: 500; color: #1e293b;">{{ record.createdDate }}</div>
                    <div style="font-size: 0.78rem; color: #94a3b8;">{{ record.createdTime }}</div>
                  </div>
                </template>
                <template v-else-if="column.key === 'total'">
                  <span style="font-weight: 700; color: #1e293b;">{{ record.total.toLocaleString() }} đ</span>
                </template>
                <template v-else-if="column.key === 'payStatus'">
                  <a-tag v-if="record.payStatus === 'paid'" color="success" style="font-weight: 700; border-radius: 12px; padding: 2px 10px;">Đã thanh toán</a-tag>
                  <a-tag v-else-if="record.payStatus === 'pending'" color="warning" style="font-weight: 700; border-radius: 12px; padding: 2px 10px;">Chờ thanh toán</a-tag>
                  <a-tag v-else-if="record.payStatus === 'cancelled'" color="error" style="font-weight: 700; border-radius: 12px; padding: 2px 10px;">Đã hủy</a-tag>
                </template>
                <template v-else-if="column.key === 'billStatus'">
                  <a-tag v-if="record.billStatus === 'completed'" color="success" style="font-weight: 700; border-radius: 12px; padding: 2px 10px;">Hoàn tất</a-tag>
                  <a-tag v-else-if="record.billStatus === 'pending'" color="warning" style="font-weight: 700; border-radius: 12px; padding: 2px 10px;">Chờ thanh toán</a-tag>
                  <a-tag v-else-if="record.billStatus === 'cancelled'" color="error" style="font-weight: 700; border-radius: 12px; padding: 2px 10px;">Đã hủy</a-tag>
                </template>
                <template v-else-if="column.key === 'paidBy'">
                  <span v-if="record.paidBy" style="color: #1e293b;">{{ record.paidBy }}</span>
                  <span v-else style="color: #cbd5e1;">–</span>
                </template>
                <template v-else-if="column.key === 'actions'">
                  <div style="display: flex; gap: 6px; justify-content: center;">
                    <a-tooltip title="Xem chi tiết">
                      <a-button type="text" size="small" style="color: #64748b;" @click="showBillDetails(record)"><i class="far fa-eye" /></a-button>
                    </a-tooltip>
                    <a-tooltip title="Chỉnh sửa">
                      <a-button type="text" size="small" style="color: #0047AB;" :disabled="record.payStatus === 'paid' || record.payStatus === 'cancelled'"><i class="far fa-edit" /></a-button>
                    </a-tooltip>
                    <a-tooltip title="In hóa đơn">
                      <a-button type="text" size="small" style="color: #64748b;"><i class="fas fa-print" /></a-button>
                    </a-tooltip>
                    <a-dropdown>
                      <a-button type="text" size="small" style="color: #64748b;"><i class="fas fa-ellipsis-v" /></a-button>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item key="duplicate">Nhân bản</a-menu-item>
                          <a-menu-item key="cancel" danger :disabled="record.payStatus === 'cancelled'">Hủy hóa đơn</a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </div>
                </template>
              </template>
            </a-table>
            </a-spin>
          </a-card>

          <!-- Bottom Legend -->
          <div class="legend-bar">
            <div class="legend-group">
              <h4 style="font-weight: 700; margin-bottom: 6px; color: #0f172a;">Loại hóa đơn</h4>
              <div class="legend-item"><span class="legend-dot" style="background: #3b82f6;" /> <strong>Theo đơn bác sĩ:</strong> Hóa đơn được tạo từ đơn thuốc do bác sĩ kê</div>
              <div class="legend-item"><span class="legend-dot" style="background: #f59e0b;" /> <strong>Ngoài đơn:</strong> Hóa đơn bán thuốc không cần đơn bác sĩ</div>
              <div class="legend-item"><span class="legend-dot" style="background: #8b5cf6;" /> <strong>Tổng hợp:</strong> Hóa đơn tổng hợp nhiều lần bán trong ngày</div>
            </div>
            <div class="legend-group">
              <h4 style="font-weight: 700; margin-bottom: 6px; color: #0f172a;">Trạng thái thanh toán</h4>
              <div class="legend-item"><span class="legend-dot" style="background: #f59e0b;" /> <strong>Chờ thanh toán:</strong> Hóa đơn chưa được thanh toán</div>
              <div class="legend-item"><span class="legend-dot" style="background: #10b981;" /> <strong>Đã thanh toán:</strong> Hóa đơn đã được thanh toán đầy đủ</div>
              <div class="legend-item"><span class="legend-dot" style="background: #ef4444;" /> <strong>Đã hủy:</strong> Hóa đơn đã bị hủy</div>
            </div>
          </div>
        </template>

        <!-- ==================== CREATE VIEW ==================== -->
        <template v-else>
          <!-- Breadcrumb -->
          <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
            <a-button type="link" style="padding: 0; color: #64748b; font-weight: 600;" @click="viewMode = 'list'">
              <i class="fas fa-arrow-left" style="margin-right: 6px;" /> Hóa đơn bán thuốc
            </a-button>
            <span style="color: #cbd5e1;">/</span>
            <span style="color: #0f172a; font-weight: 600;">{{ createTitle }}</span>
          </div>

          <a-row :gutter="20">

            <!-- ===== Tạo hóa đơn theo đơn bác sĩ ===== -->
            <a-col v-if="viewMode === 'create-rx'" :xs="24" :lg="16" :offset="4">
              <a-card :bordered="false" class="create-card">
                <div class="create-card-header">
                  <div class="step-circle" style="background: #0047AB;">1</div>
                  <div>
                    <div class="create-card-title">Tạo hóa đơn theo đơn bác sĩ</div>
                    <div class="create-card-sub">Tạo hóa đơn từ đơn thuốc do bác sĩ kê</div>
                  </div>
                </div>

                <a-divider style="margin: 16px 0;" />

                <h4 class="section-label">Thông tin đơn thuốc</h4>
                <div style="display: flex; gap: 8px; margin-bottom: 14px;">
                  <a-select v-model:value="rxSelectedPrescription" style="flex: 1;" placeholder="Chọn đơn thuốc">
                    <a-select-option v-for="rx in prescriptionList" :key="rx.code" :value="rx.code">{{ rx.code }}</a-select-option>
                  </a-select>
                  <a-button type="primary" style="background: #0047AB; border-color: #0047AB; border-radius: 8px; font-weight: 600;" @click="showPrescriptionDetails(rxSelectedPrescription)">Xem đơn</a-button>
                </div>

                <!-- Prescription Info -->
                <div v-if="rxSelectedPrescription" class="info-grid">
                  <div class="info-row"><span class="info-label">Mã đơn thuốc:</span><span class="info-value">{{ rxInfo.code }}</span></div>
                  <div class="info-row"><span class="info-label">Bệnh nhân:</span><span class="info-value">{{ rxInfo.patient }}</span></div>
                  <div class="info-row"><span class="info-label">Bác sĩ kê đơn:</span><span class="info-value">{{ rxInfo.doctor }}</span></div>
                  <div class="info-row"><span class="info-label">Ngày kê:</span><span class="info-value">{{ rxInfo.date }}</span></div>
                </div>

                <h4 class="section-label" style="margin-top: 16px;">Danh sách thuốc trong đơn</h4>
                <a-table :columns="rxDrugCols" :data-source="rxDrugs" :pagination="false" size="small" row-key="id" class="compact-table">
                  <template #bodyCell="{ record, column }">
                    <template v-if="column.key === 'total'">
                      {{ (record.dispensed * record.price).toLocaleString() }}
                    </template>
                  </template>
                </a-table>

                <!-- Notes -->
                <h4 class="section-label" style="margin-top: 14px;">Ghi chú</h4>
                <a-textarea v-model:value="rxNote" placeholder="Ghi chú (nếu có)..." :rows="2" style="border-radius: 8px;" />

                <!-- Totals -->
                <div class="totals-section">
                  <a-row :gutter="8" align="middle">
                    <a-col :span="6">
                      <div class="total-label">Tổng tiền thuốc</div>
                      <div class="total-value">{{ rxSubtotal.toLocaleString() }} đ</div>
                    </a-col>
                    <a-col :span="6">
                      <div class="total-label">Chiết khấu (%)</div>
                      <a-input-number v-model:value="rxDiscount" :min="0" :max="100" size="small" style="width: 100%;" />
                    </a-col>
                    <a-col :span="6">
                      <div class="total-label">Giảm giá (đ)</div>
                      <a-input-number v-model:value="rxDiscountAmount" :min="0" size="small" style="width: 100%;" />
                    </a-col>
                    <a-col :span="6">
                      <div class="total-label">VAT (%)</div>
                      <a-input-number v-model:value="rxVat" :min="0" :max="100" size="small" style="width: 100%;" />
                    </a-col>
                  </a-row>
                  <div class="grand-total">
                    <span>Tổng thanh toán</span>
                    <span class="grand-total-value" style="color: #10b981;">{{ rxGrandTotal.toLocaleString() }} đ</span>
                  </div>
                </div>

                <!-- Buttons -->
                <div style="display: flex; gap: 10px; margin-top: 16px;">
                  <a-button style="flex: 1; border-radius: 8px; font-weight: 600; height: 38px;" @click="viewMode = 'list'">Hủy</a-button>
                  <a-button type="primary" style="flex: 1.5; background: #0047AB; border-color: #0047AB; border-radius: 8px; font-weight: 600; height: 38px; display: flex; align-items: center; justify-content: center; gap: 6px;" @click="submitRxBill">
                    <i class="fas fa-file-invoice" /> Tạo hóa đơn theo đơn
                  </a-button>
                </div>
              </a-card>
            </a-col>

            <!-- ===== Tạo hóa đơn ngoài đơn ===== -->
            <a-col v-if="viewMode === 'create-otc'" :xs="24" :lg="16" :offset="4">
              <a-card :bordered="false" class="create-card">
                <div class="create-card-header">
                  <div class="step-circle" style="background: #f59e0b;">2</div>
                  <div>
                    <div class="create-card-title">Tạo hóa đơn ngoài đơn</div>
                    <div class="create-card-sub">Tạo hóa đơn bán thuốc không theo đơn bác sĩ</div>
                  </div>
                </div>

                <a-divider style="margin: 16px 0;" />

                <h4 class="section-label">Thông tin khách hàng (nếu có)</h4>
                <a-row :gutter="12" style="margin-bottom: 10px;">
                  <a-col :span="8">
                    <a-input v-model:value="otcCustomer.name" placeholder="Nhập họ tên" size="small" />
                  </a-col>
                  <a-col :span="8">
                    <a-input v-model:value="otcCustomer.phone" placeholder="Nhập số điện thoại" size="small" />
                  </a-col>
                  <a-col :span="8">
                    <a-input v-model:value="otcCustomer.doctor" placeholder="Bác sĩ kê (nếu có)" size="small" />
                  </a-col>
                </a-row>
                <a-input v-model:value="otcCustomer.address" placeholder="Nhập địa chỉ" size="small" style="margin-bottom: 8px;" />
                <a-checkbox v-model:checked="otcIsWalkIn" style="margin-bottom: 14px; font-size: 0.85rem; color: #64748b;">Khách lẻ</a-checkbox>

                <h4 class="section-label">Danh sách thuốc</h4>
                <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                  <a-select
                    v-model:value="selectedOtcMedicineId"
                    show-search
                    placeholder="Chọn thuốc cần thêm..."
                    option-filter-prop="children"
                    style="flex: 1;"
                    size="small"
                  >
                    <a-select-option v-for="med in allMedicines" :key="med.id" :value="med.id">
                      {{ med.name }} - Tồn: {{ med.stock }} {{ med.unit }} - Giá: {{ med.price.toLocaleString() }}đ
                    </a-select-option>
                  </a-select>
                  <a-button type="primary" size="small" style="border-radius: 6px; font-weight: 600; background: #10b981; border-color: #10b981; display: flex; align-items: center; gap: 4px;" @click="addOtcDrug" :disabled="!selectedOtcMedicineId">
                    <i class="fas fa-plus" /> Thêm thuốc
                  </a-button>
                </div>

                <a-table :columns="otcDrugCols" :data-source="otcDrugs" :pagination="false" size="small" row-key="id" class="compact-table">
                  <template #bodyCell="{ record, column, index }">
                    <template v-if="column.key === 'index'">{{ index + 1 }}</template>
                    <template v-else-if="column.key === 'lot'">
                      <div style="font-weight: 600; color: #0047AB; font-size: 0.78rem;">{{ record.lot }}</div>
                      <div style="font-size: 0.7rem; color: #94a3b8;">HSD: {{ record.expiry }}</div>
                    </template>
                    <template v-else-if="column.key === 'qty'">
                      <a-input-number v-model:value="record.qty" :min="1" :max="record.stock" size="small" style="width: 60px;" />
                    </template>
                    <template v-else-if="column.key === 'total'">
                      {{ (record.qty * record.price).toLocaleString() }}
                    </template>
                    <template v-else-if="column.key === 'action'">
                      <a-button type="link" danger size="small" @click="otcDrugs.splice(index, 1)" style="padding: 0;"><i class="fas fa-times" /></a-button>
                    </template>
                  </template>
                </a-table>

                <!-- Notes -->
                <h4 class="section-label" style="margin-top: 14px;">Ghi chú</h4>
                <a-textarea v-model:value="otcNote" placeholder="Ghi chú (nếu có)..." :rows="2" style="border-radius: 8px;" />

                <!-- Totals -->
                <div class="totals-section">
                  <a-row :gutter="8" align="middle">
                    <a-col :span="6">
                      <div class="total-label">Tổng tiền thuốc</div>
                      <div class="total-value">{{ otcSubtotal.toLocaleString() }} đ</div>
                    </a-col>
                    <a-col :span="6">
                      <div class="total-label">Chiết khấu (%)</div>
                      <a-input-number v-model:value="otcDiscountPct" :min="0" :max="100" size="small" style="width: 100%;" />
                    </a-col>
                    <a-col :span="6">
                      <div class="total-label">Giảm giá (đ)</div>
                      <a-input-number v-model:value="otcDiscountAmt" :min="0" size="small" style="width: 100%;" />
                    </a-col>
                    <a-col :span="6">
                      <div class="total-label">VAT (%)</div>
                      <a-input-number v-model:value="otcVat" :min="0" :max="100" size="small" style="width: 100%;" />
                    </a-col>
                  </a-row>
                  <div class="grand-total">
                    <span>Tổng thanh toán</span>
                    <span class="grand-total-value" style="color: #f59e0b;">{{ otcGrandTotal.toLocaleString() }} đ</span>
                  </div>
                </div>

                <!-- Buttons -->
                <div style="display: flex; gap: 10px; margin-top: 16px;">
                  <a-button style="flex: 1; border-radius: 8px; font-weight: 600; height: 38px;" @click="viewMode = 'list'">Hủy</a-button>
                  <a-button type="primary" style="flex: 1.5; background: #f59e0b; border-color: #f59e0b; border-radius: 8px; font-weight: 600; height: 38px; display: flex; align-items: center; justify-content: center; gap: 6px;" @click="submitOtcBill">
                    <i class="fas fa-cart-plus" /> Tạo hóa đơn ngoài đơn
                  </a-button>
                </div>
              </a-card>
            </a-col>

            <!-- ===== Tạo hóa đơn tổng hợp ===== -->
            <a-col v-if="viewMode === 'create-combo'" :xs="24" :lg="16" :offset="4">
              <a-card :bordered="false" class="create-card">
                <div class="create-card-header">
                  <div class="step-circle" style="background: #8b5cf6;">3</div>
                  <div>
                    <div class="create-card-title">Tạo hóa đơn tổng hợp</div>
                    <div class="create-card-sub">Tạo hóa đơn tổng hợp từ nhiều đơn thuốc và/hoặc ngoài đơn</div>
                  </div>
                </div>

                <a-divider style="margin: 16px 0;" />

                <h4 class="section-label">Thông tin khách hàng</h4>
                <a-row :gutter="12" style="margin-bottom: 10px;">
                  <a-col :span="8">
                    <a-input v-model:value="comboCustomer.name" placeholder="Nhập họ tên" size="small" />
                  </a-col>
                  <a-col :span="8">
                    <a-input v-model:value="comboCustomer.phone" placeholder="Nhập số điện thoại" size="small" />
                  </a-col>
                  <a-col :span="8">
                    <a-input v-model:value="comboCustomer.doctor" placeholder="Bác sĩ kê" size="small" />
                  </a-col>
                </a-row>
                <a-input v-model:value="comboCustomer.address" placeholder="Nhập địa chỉ" size="small" style="margin-bottom: 14px;" />

                <!-- Tabs: Đơn thuốc / Thuốc ngoài đơn -->
                <a-tabs v-model:activeKey="comboTab" size="small" class="combo-tabs">
                  <a-tab-pane key="rx" tab="Đơn thuốc của bác sĩ" />
                  <a-tab-pane key="otc" tab="Thuốc ngoài đơn" />
                </a-tabs>

                <!-- Tab: Đơn thuốc -->
                <div v-if="comboTab === 'rx'">
                  <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                    <a-select v-model:value="comboSelectedRx" style="flex: 1;" placeholder="Chọn đơn thuốc" size="small">
                      <a-select-option v-for="rx in prescriptionList" :key="rx.code" :value="rx.code">{{ rx.code }}</a-select-option>
                    </a-select>
                    <a-button type="primary" size="small" style="border-radius: 6px; font-weight: 600; background: #8b5cf6; border-color: #8b5cf6;" @click="addRxToCombo" :disabled="!comboSelectedRx">Thêm</a-button>
                  </div>
                  <h4 class="section-label">Danh sách đơn thuốc đã chọn</h4>
                  <a-table :columns="comboRxCols" :data-source="comboRxList" :pagination="false" size="small" row-key="code" class="compact-table">
                    <template #bodyCell="{ record, column, index }">
                      <template v-if="column.key === 'total'">
                        {{ record.total.toLocaleString() }}
                      </template>
                      <template v-else-if="column.key === 'action'">
                        <div style="display: flex; gap: 8px; align-items: center;">
                          <a-button type="link" size="small" @click="showPrescriptionDetails(record.code)" style="padding: 0;"><i class="far fa-eye" /></a-button>
                          <a-button type="link" danger size="small" @click="comboRxList.splice(index, 1)" style="padding: 0;"><i class="fas fa-times" /></a-button>
                        </div>
                      </template>
                    </template>
                  </a-table>
                </div>

                <!-- Tab: Thuốc ngoài đơn -->
                <div v-else>
                  <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                    <a-select
                      v-model:value="selectedComboMedicineId"
                      show-search
                      placeholder="Chọn thuốc ngoài đơn cần thêm..."
                      option-filter-prop="children"
                      style="flex: 1;"
                      size="small"
                    >
                      <a-select-option v-for="med in allMedicines" :key="med.id" :value="med.id">
                        {{ med.name }} - Tồn: {{ med.stock }} {{ med.unit }} - Giá: {{ med.price.toLocaleString() }}đ
                      </a-select-option>
                    </a-select>
                    <a-button type="primary" size="small" style="border-radius: 6px; font-weight: 600; background: #8b5cf6; border-color: #8b5cf6; display: flex; align-items: center; gap: 4px;" @click="addComboDrug" :disabled="!selectedComboMedicineId">
                      <i class="fas fa-plus" /> Thêm thuốc
                    </a-button>
                  </div>
                  <h4 class="section-label">Danh sách thuốc ngoài đơn</h4>
                  <a-table :columns="comboOtcCols" :data-source="comboOtcDrugs" :pagination="false" size="small" row-key="id" class="compact-table">
                    <template #bodyCell="{ record, column, index }">
                      <template v-if="column.key === 'index'">{{ index + 1 }}</template>
                      <template v-else-if="column.key === 'total'">
                        {{ (record.qty * record.price).toLocaleString() }}
                      </template>
                      <template v-else-if="column.key === 'action'">
                        <a-button type="link" danger size="small" @click="comboOtcDrugs.splice(index, 1)" style="padding: 0;"><i class="fas fa-times" /></a-button>
                      </template>
                    </template>
                  </a-table>
                </div>

                <!-- Notes -->
                <h4 class="section-label" style="margin-top: 14px;">Ghi chú</h4>
                <a-textarea v-model:value="comboNote" placeholder="Ghi chú (nếu có)..." :rows="2" style="border-radius: 8px;" />

                <!-- Totals -->
                <div class="totals-section">
                  <a-row :gutter="8" align="middle">
                    <a-col :span="6">
                      <div class="total-label">Tổng tiền thuốc</div>
                      <div class="total-value">{{ comboSubtotal.toLocaleString() }} đ</div>
                    </a-col>
                    <a-col :span="6">
                      <div class="total-label">Chiết khấu (%)</div>
                      <a-input-number v-model:value="comboDiscountPct" :min="0" :max="100" size="small" style="width: 100%;" />
                    </a-col>
                    <a-col :span="6">
                      <div class="total-label">Giảm giá (đ)</div>
                      <a-input-number v-model:value="comboDiscountAmt" :min="0" size="small" style="width: 100%;" />
                    </a-col>
                    <a-col :span="6">
                      <div class="total-label">VAT (%)</div>
                      <a-input-number v-model:value="comboVat" :min="0" :max="100" size="small" style="width: 100%;" />
                    </a-col>
                  </a-row>
                  <div class="grand-total">
                    <span>Tổng thanh toán</span>
                    <span class="grand-total-value" style="color: #8b5cf6;">{{ comboGrandTotal.toLocaleString() }} đ</span>
                  </div>
                </div>

                <!-- Buttons -->
                <div style="display: flex; gap: 10px; margin-top: 16px;">
                  <a-button style="flex: 1; border-radius: 8px; font-weight: 600; height: 38px;" @click="viewMode = 'list'">Hủy</a-button>
                  <a-button type="primary" style="flex: 1.5; background: #8b5cf6; border-color: #8b5cf6; border-radius: 8px; font-weight: 600; height: 38px; display: flex; align-items: center; justify-content: center; gap: 6px;" @click="submitComboBill">
                    <i class="fas fa-layer-group" /> Tạo hóa đơn tổng hợp
                  </a-button>
                </div>
              </a-card>
            </a-col>
          </a-row>

          <!-- Bottom Notes -->
          <div class="legend-bar" style="margin-top: 20px;">
            <div>
              <h4 style="font-weight: 700; margin-bottom: 6px; color: #0f172a;"><i class="fas fa-exclamation-triangle" style="color: #f59e0b; margin-right: 6px;" />Lưu ý:</h4>
              <div class="legend-item">• Hóa đơn theo đơn bác sĩ: chỉ cấp phát số lượng ≤ số lượng kê đơn.</div>
              <div class="legend-item">• Vui lòng kiểm tra kỹ thông tin trước khi tạo hóa đơn.</div>
              <div class="legend-item">• Sau khi tạo, không thể chỉnh sửa hóa đơn. Vui lòng hủy và tạo lại nếu cần.</div>
            </div>
          </div>
        </template>

      </a-layout-content>
    </a-layout>
  </a-layout>
  <!-- Prescription Detail Modal -->
  <a-modal
    v-model:open="prescriptionModalVisible"
    title="Chi tiết đơn thuốc"
    @ok="prescriptionModalVisible = false"
    width="600px"
    ok-text="Đóng"
    :cancel-button-props="{ style: { display: 'none' } }"
  >
    <div v-if="selectedPrescriptionDetails" style="padding: 10px 0;">
      <div class="info-grid" style="margin-bottom: 20px;">
        <div class="info-row"><span class="info-label">Mã đơn thuốc:</span><span class="info-value" style="color: #0047AB; font-weight: bold;">{{ selectedPrescriptionDetails.code }}</span></div>
        <div class="info-row"><span class="info-label">Bệnh nhân:</span><span class="info-value">{{ selectedPrescriptionDetails.patient }}</span></div>
        <div class="info-row"><span class="info-label">Bác sĩ kê đơn:</span><span class="info-value">{{ selectedPrescriptionDetails.doctor || selectedPrescriptionDetails.doctorName }}</span></div>
        <div class="info-row"><span class="info-label">Ngày kê:</span><span class="info-value">{{ selectedPrescriptionDetails.date }}</span></div>
      </div>
      <h4 class="section-label" style="font-weight: 700; margin-bottom: 10px;">Danh sách thuốc kê đơn</h4>
      <a-table
        :columns="modalMedicationColumns"
        :data-source="selectedPrescriptionDetails.medications"
        :pagination="false"
        size="small"
        row-key="name"
        class="compact-table"
      >
        <template #bodyCell="{ index, column }">
          <template v-if="column.key === 'index'">{{ index + 1 }}</template>
        </template>
      </a-table>
    </div>
    <div v-else style="text-align: center; padding: 20px; color: #94a3b8;">
      Chưa chọn đơn thuốc hoặc đơn thuốc không tồn tại!
    </div>
  </a-modal>

  <!-- Bill Detail Modal -->
  <a-modal
    v-model:open="billModalVisible"
    title="Chi tiết hóa đơn"
    @ok="billModalVisible = false"
    width="750px"
    ok-text="Đóng"
    :cancel-button-props="{ style: { display: 'none' } }"
  >
    <div v-if="selectedBillDetails" style="padding: 10px 0;">
      <!-- Header Info -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div>
          <div style="font-size: 1.2rem; font-weight: 800; color: #0047AB; margin-bottom: 4px;">{{ selectedBillDetails.code }}</div>
          <a-tag v-if="selectedBillDetails.billType === 'prescription'" color="blue" style="font-weight: 600; border-radius: 4px;">Theo đơn bác sĩ</a-tag>
          <a-tag v-else-if="selectedBillDetails.billType === 'otc'" color="orange" style="font-weight: 600; border-radius: 4px;">Ngoài đơn</a-tag>
          <a-tag v-else-if="selectedBillDetails.billType === 'combined'" color="purple" style="font-weight: 600; border-radius: 4px;">Tổng hợp</a-tag>
        </div>
        <div style="text-align: right;">
          <a-tag v-if="selectedBillDetails.payStatus === 'paid'" color="success" style="font-weight: 700; border-radius: 12px; padding: 2px 12px; font-size: 0.85rem;">Đã thanh toán</a-tag>
          <a-tag v-else-if="selectedBillDetails.payStatus === 'pending'" color="warning" style="font-weight: 700; border-radius: 12px; padding: 2px 12px; font-size: 0.85rem;">Chờ thanh toán</a-tag>
          <a-tag v-else-if="selectedBillDetails.payStatus === 'cancelled'" color="error" style="font-weight: 700; border-radius: 12px; padding: 2px 12px; font-size: 0.85rem;">Đã hủy</a-tag>
        </div>
      </div>

      <!-- Customer / Patient Info -->
      <div class="info-grid" style="margin-bottom: 20px; background: #f8fafc; border-radius: 10px; padding: 14px 18px;">
        <div class="info-row"><span class="info-label">Bệnh nhân / Khách hàng:</span><span class="info-value" style="font-weight: 700;">{{ selectedBillDetails.patientName }}</span></div>
        <div class="info-row" v-if="selectedBillDetails.patientPhone"><span class="info-label">Số điện thoại:</span><span class="info-value">{{ selectedBillDetails.patientPhone }}</span></div>
        <div class="info-row"><span class="info-label">Ngày lập:</span><span class="info-value">{{ selectedBillDetails.createdDate }} {{ selectedBillDetails.createdTime }}</span></div>
        <div class="info-row"><span class="info-label">Thanh toán bởi:</span><span class="info-value">{{ selectedBillDetails.paidBy || '–' }}</span></div>
        <div class="info-row" v-if="selectedBillDetails.note"><span class="info-label">Ghi chú:</span><span class="info-value" style="color: #64748b; font-style: italic;">{{ selectedBillDetails.note }}</span></div>
      </div>

      <!-- Items Table -->
      <h4 class="section-label" style="font-weight: 700; margin-bottom: 10px;"><i class="fas fa-pills" style="color: #0047AB; margin-right: 6px;"></i>Danh sách thuốc</h4>
      <a-table
        :columns="billDetailItemCols"
        :data-source="selectedBillDetails.items"
        :pagination="false"
        size="small"
        row-key="name"
        class="compact-table"
      >
        <template #bodyCell="{ text, record, column, index }">
          <template v-if="column.key === 'index'">{{ index + 1 }}</template>
          <template v-else-if="column.key === 'price'">{{ record.price?.toLocaleString() }} đ</template>
          <template v-else-if="column.key === 'total'">{{ record.total?.toLocaleString() }} đ</template>
        </template>
      </a-table>

      <!-- Summary -->
      <div style="margin-top: 20px; background: linear-gradient(135deg, #f0f7ff, #f8fafc); border-radius: 10px; padding: 16px 20px; border: 1px solid #e2e8f0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #64748b;">Tổng tiền thuốc:</span>
          <span style="font-weight: 600;">{{ (selectedBillDetails.subtotal ?? selectedBillDetails.total)?.toLocaleString() }} đ</span>
        </div>
        <div v-if="selectedBillDetails.discountPct" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #64748b;">Chiết khấu ({{ selectedBillDetails.discountPct }}%):</span>
          <span style="font-weight: 600; color: #ef4444;">-{{ Math.round((selectedBillDetails.subtotal ?? selectedBillDetails.total) * selectedBillDetails.discountPct / 100)?.toLocaleString() }} đ</span>
        </div>
        <div v-if="selectedBillDetails.discountAmt" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #64748b;">Giảm giá trực tiếp:</span>
          <span style="font-weight: 600; color: #ef4444;">-{{ selectedBillDetails.discountAmt?.toLocaleString() }} đ</span>
        </div>
        <div v-if="selectedBillDetails.vatPct" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #64748b;">VAT ({{ selectedBillDetails.vatPct }}%):</span>
          <span style="font-weight: 600; color: #f59e0b;">+{{ Math.round(selectedBillDetails.total * selectedBillDetails.vatPct / 100)?.toLocaleString() }} đ</span>
        </div>
        <a-divider style="margin: 10px 0;" />
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 1rem; font-weight: 700; color: #0f172a;">TỔNG THANH TOÁN:</span>
          <span style="font-size: 1.3rem; font-weight: 800; color: #10b981;">{{ selectedBillDetails.total?.toLocaleString() }} đ</span>
        </div>
      </div>
    </div>
    <div v-else style="text-align: center; padding: 20px; color: #94a3b8;">
      Không có thông tin chi tiết hóa đơn.
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore';
const notif = useNotificationStore();
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { getBills, getPrescriptions, getMedicines, createBill } from '@/services/pharmacyService';
import { medicalRecordService, mapUserIdToGuid } from '@/services/medicalRecordService';
import PharmacySidebar from '@/components/PharmacySidebar.vue';
import AppHeader from '@/components/AppHeader.vue';
import { normalizeSearch } from '@/utils/search';

const props = withDefaults(
  defineProps<{
    inline?: boolean
  }>(),
  {
    inline: false
  }
)

interface BillItem {
  id: number;
  code: string;
  billType: 'prescription' | 'otc' | 'combined';
  patientName: string;
  patientPhone: string;
  createdDate: string;
  createdTime: string;
  total: number;
  payStatus: 'paid' | 'pending' | 'cancelled';
  billStatus: 'completed' | 'pending' | 'cancelled';
  paidBy: string;
  items?: any[];
  note?: string;
  subtotal?: number;
  discountPct?: number;
  discountAmt?: number;
  vatPct?: number;
}

const authStore = useAuthStore();
const loading = ref(false);
const viewMode = ref<'list' | 'create-rx' | 'create-otc' | 'create-combo'>('list');

const createTitle = computed(() => {
  switch (viewMode.value) {
    case 'create-rx': return 'Tạo hóa đơn theo đơn bác sĩ';
    case 'create-otc': return 'Tạo hóa đơn ngoài đơn';
    case 'create-combo': return 'Tạo hóa đơn tổng hợp';
    default: return 'Tạo hóa đơn';
  }
});
const activeTab = ref('all');
const searchQuery = ref('');
const filterType = ref('all');
const filterPayStatus = ref('all');

// Dynamic metric computations
const todayStr = new Date().toLocaleDateString('vi-VN');
const todayBills = computed(() => bills.value.filter(b => b.createdDate === todayStr));
const todayBillsCount = computed(() => todayBills.value.length);
const todayBillsTotal = computed(() => todayBills.value.reduce((s, b) => s + b.total, 0));

const pendingBills = computed(() => bills.value.filter(b => b.payStatus === 'pending'));
const pendingBillsCount = computed(() => pendingBills.value.length);
const pendingBillsTotal = computed(() => pendingBills.value.reduce((s, b) => s + b.total, 0));

const paidBills = computed(() => bills.value.filter(b => b.payStatus === 'paid'));
const paidBillsCount = computed(() => paidBills.value.length);
const paidBillsTotal = computed(() => paidBills.value.reduce((s, b) => s + b.total, 0));

const cancelledBills = computed(() => bills.value.filter(b => b.payStatus === 'cancelled'));
const cancelledBillsCount = computed(() => cancelledBills.value.length);
const cancelledBillsTotal = computed(() => cancelledBills.value.reduce((s, b) => s + b.total, 0));

// ===================== LIST VIEW DATA =====================
const bills = ref<BillItem[]>([]);

const columns = [
  { title: 'Mã hóa đơn', dataIndex: 'code', key: 'code', width: 150, sorter: (a: any, b: any) => a.code.localeCompare(b.code) },
  { title: 'Loại hóa đơn', dataIndex: 'billType', key: 'billType', width: 140, filters: [{ text: 'Theo đơn bác sĩ', value: 'prescription' }, { text: 'Ngoài đơn', value: 'otc' }, { text: 'Tổng hợp', value: 'combined' }], onFilter: (value: string, record: any) => record.billType === value },
  { title: 'Bệnh nhân', dataIndex: 'patientName', key: 'patient', width: 220, sorter: (a: any, b: any) => a.patientName.localeCompare(b.patientName) },
  { title: 'Ngày lập', key: 'createdDate', width: 130, sorter: (a: any, b: any) => { const dA = a.createdDate.split('/').reverse().join('') + a.createdTime.replace(':', ''); const dB = b.createdDate.split('/').reverse().join('') + b.createdTime.replace(':', ''); return dA.localeCompare(dB); } },
  { title: 'Tổng Tiền', dataIndex: 'total', key: 'total', width: 130, align: 'right' as const, sorter: (a: any, b: any) => a.total - b.total },
  { title: 'Trạng thái thanh toán', dataIndex: 'payStatus', key: 'payStatus', width: 160, align: 'center' as const, filters: [{ text: 'Đã thanh toán', value: 'paid' }, { text: 'Chờ thanh toán', value: 'pending' }, { text: 'Đã hủy', value: 'cancelled' }], onFilter: (value: string, record: any) => record.payStatus === value },
  { title: 'Trạng thái HĐ', dataIndex: 'billStatus', key: 'billStatus', width: 140, align: 'center' as const, filters: [{ text: 'Hoàn tất', value: 'completed' }, { text: 'Chờ thanh toán', value: 'pending' }, { text: 'Đã hủy', value: 'cancelled' }], onFilter: (value: string, record: any) => record.billStatus === value },
  { title: 'Thanh toán bởi', dataIndex: 'paidBy', key: 'paidBy', width: 130, filters: [{ text: 'Lê Thị Mai', value: 'Lê Thị Mai' }, { text: 'Nguyễn Văn D', value: 'Nguyễn Văn D' }, { text: 'Chưa thanh toán', value: '' }], onFilter: (value: string, record: any) => record.paidBy === value },
  { title: 'Thao tác', key: 'actions', width: 130, align: 'center' as const, fixed: 'right' as const }
];

const filteredBills = computed(() => {
  return bills.value.filter(b => {
    if (activeTab.value !== 'all' && b.billType !== activeTab.value) return false;
    if (searchQuery.value) {
      const q = normalizeSearch(searchQuery.value);
      if (!(normalizeSearch(b.code).includes(q) || normalizeSearch(b.patientName).includes(q) || b.patientPhone.includes(q))) return false;
    }
    if (filterType.value !== 'all' && b.billType !== filterType.value) return false;
    if (filterPayStatus.value !== 'all' && b.payStatus !== filterPayStatus.value) return false;
    return true;
  });
});

function resetFilters() {
  searchQuery.value = '';
  filterType.value = 'all';
  filterPayStatus.value = 'all';
  activeTab.value = 'all';
}

// ===================== UNIFIED SHARED DATA & API INTEGRATION =====================
const prescriptionList = ref<any[]>([]);
const allMedicines = ref<any[]>([]);

function getMedicinePrice(name: string): number {
  const q = name.toLowerCase();
  const med = allMedicines.value.find(m => m.name.toLowerCase() === q || m.name.toLowerCase().includes(q) || q.includes(m.name.toLowerCase()));
  return med ? med.price : 1500;
}

function getMedicineUnit(name: string): string {
  const q = name.toLowerCase();
  const med = allMedicines.value.find(m => m.name.toLowerCase() === q || m.name.toLowerCase().includes(q) || q.includes(m.name.toLowerCase()));
  if (med) return med.unit;
  if (q.includes('oresol') || q.includes('gaviscon')) return 'Gói';
  if (q.includes('syrup') || q.includes('nacl') || q.includes('dịch')) return 'Chai';
  return 'Viên';
}

// ===================== COLUMN 1: Tạo hóa đơn theo đơn bác sĩ =====================
const rxSelectedPrescription = ref<string | undefined>(undefined);
const rxNote = ref('');
const rxDiscount = ref(0);
const rxDiscountAmount = ref(0);
const rxVat = ref(0);
const rxDrugs = ref<any[]>([]);

const rxInfo = computed(() => {
  const found = prescriptionList.value.find(p => p.code === rxSelectedPrescription.value);
  return found || { code: '', patient: '', doctor: '', date: '' };
});

watch(rxSelectedPrescription, (newVal) => {
  if (!newVal) {
    rxDrugs.value = [];
    return;
  }
  const found = prescriptionList.value.find(p => p.code === newVal);
  if (found && found.medications) {
    rxDrugs.value = found.medications.map((m: any, idx: number) => {
      const medName = m.name;
      const price = getMedicinePrice(medName);
      const unit = getMedicineUnit(medName);
      return {
        id: idx + 1,
        name: medName,
        form: unit,
        prescribed: m.qty || 10,
        dispensed: m.qty || 10,
        price: price
      };
    });
  } else {
    rxDrugs.value = [];
  }
});

const rxDrugCols = [
  { title: 'STT', key: 'index', width: 40, align: 'center' as const, customRender: ({ index }: any) => index + 1 },
  { title: 'Thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Dạng dùng', dataIndex: 'form', key: 'form', width: 65 },
  { title: 'SL kê đơn', dataIndex: 'prescribed', key: 'prescribed', width: 65, align: 'center' as const },
  { title: 'SL cấp phát', dataIndex: 'dispensed', key: 'dispensed', width: 65, align: 'center' as const },
  { title: 'Đơn giá', dataIndex: 'price', key: 'price', width: 60, align: 'right' as const, customRender: ({ text }: any) => text?.toLocaleString() },
  { title: 'Thành tiền', key: 'total', width: 75, align: 'right' as const },
];

const rxSubtotal = computed(() => rxDrugs.value.reduce((s, d) => s + d.dispensed * d.price, 0));
const rxGrandTotal = computed(() => {
  let total = rxSubtotal.value;
  total -= Math.round(total * rxDiscount.value / 100);
  total -= rxDiscountAmount.value;
  total += Math.round(total * rxVat.value / 100);
  return Math.max(0, total);
});

async function submitRxBill() {
  if (!rxSelectedPrescription.value) {
    notif.show({ type: 'error', message: 'Vui lòng chọn đơn thuốc!' });
    return;
  }
  const rx = rxInfo.value;
  const patientIdStr = rx.patient.replace(/\D/g, '') || '5';

  try {
    const newBill = await createBill({
      patientCode: patientIdStr,
      doctorName: rx.doctor || 'Bác sĩ điều trị',
      consultFee: 0,
      medicines: rxDrugs.value.map(d => ({
        price: d.price,
        qty: d.dispensed
      }))
    });
    if (newBill && newBill.id) {
      const itemsToSave = rxDrugs.value.map(d => ({
        name: d.name,
        form: d.form,
        qty: d.dispensed,
        price: d.price,
        total: d.dispensed * d.price
      }));
      localStorage.setItem(`bill_items_${newBill.id}`, JSON.stringify(itemsToSave));
    }
    notif.show({ type: 'success', message: 'Đã tạo hóa đơn theo đơn bác sĩ thành công!' });
    await loadData();
    rxSelectedPrescription.value = undefined;
    rxNote.value = '';
    rxDiscount.value = 0;
    rxDiscountAmount.value = 0;
    rxVat.value = 0;
    viewMode.value = 'list';
  } catch (err: any) {
    notif.show({ type: 'error', message: 'Lỗi khi tạo hóa đơn: ' + err.message });
  }
}

// ===================== COLUMN 2: Tạo hóa đơn ngoài đơn =====================
const otcCustomer = ref({ name: '', phone: '', address: '', doctor: '' });
const otcIsWalkIn = ref(false);
const selectedOtcMedicineId = ref<number | undefined>(undefined);
const otcNote = ref('');
const otcDiscountPct = ref(0);
const otcDiscountAmt = ref(0);
const otcVat = ref(0);
const otcDrugs = ref<any[]>([]);

const otcDrugCols = [
  { title: 'STT', key: 'index', width: 40, align: 'center' as const },
  { title: 'Thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Dạng dùng', dataIndex: 'form', key: 'form', width: 60 },
  { title: 'Lô thuốc', key: 'lot', width: 90 },
  { title: 'SL', key: 'qty', width: 60, align: 'center' as const },
  { title: 'Đơn giá', dataIndex: 'price', key: 'price', width: 55, align: 'right' as const, customRender: ({ text }: any) => text?.toLocaleString() },
  { title: 'Thành tiền', key: 'total', width: 70, align: 'right' as const },
  { title: '', key: 'action', width: 30 },
];

const otcSubtotal = computed(() => otcDrugs.value.reduce((s, d) => s + d.qty * d.price, 0));
const otcGrandTotal = computed(() => {
  let total = otcSubtotal.value;
  total -= Math.round(total * otcDiscountPct.value / 100);
  total -= otcDiscountAmt.value;
  total += Math.round(total * otcVat.value / 100);
  return Math.max(0, total);
});

function addOtcDrug() {
  if (!selectedOtcMedicineId.value) return;
  const med = allMedicines.value.find(m => m.id === selectedOtcMedicineId.value);
  if (!med) return;
  
  const idx = otcDrugs.value.findIndex(d => d.id === med.id);
  if (idx >= 0) {
    if (otcDrugs.value[idx].qty < med.stock) {
      const updated = [...otcDrugs.value];
      updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
      otcDrugs.value = updated;
    } else {
      notif.show({ type: 'warning', message: 'Số lượng vượt quá tồn kho!' });
    }
  } else {
    otcDrugs.value = [...otcDrugs.value, {
      id: med.id,
      name: med.name,
      form: med.unit || 'Viên',
      lot: 'L' + new Date().getFullYear().toString().slice(2) + '0401',
      expiry: '01/12/2026',
      qty: 1,
      price: med.price,
      stock: med.stock || 100
    }];
  }
  selectedOtcMedicineId.value = undefined;
}

async function submitOtcBill() {
  if (otcDrugs.value.length === 0) {
    notif.show({ type: 'error', message: 'Vui lòng thêm ít nhất một thuốc vào hóa đơn!' });
    return;
  }
  try {
    const newBill = await createBill({
      patientCode: '5',
      doctorName: otcCustomer.value.doctor,
      consultFee: 0,
      medicines: otcDrugs.value.map(d => ({
        price: d.price,
        qty: d.qty
      }))
    });
    if (newBill && newBill.id) {
      const itemsToSave = otcDrugs.value.map(d => ({
        name: d.name,
        form: d.form,
        qty: d.qty,
        price: d.price,
        total: d.qty * d.price
      }));
      localStorage.setItem(`bill_items_${newBill.id}`, JSON.stringify(itemsToSave));
    }
    notif.show({ type: 'success', message: 'Đã tạo hóa đơn ngoài đơn thành công!' });
    await loadData();
    otcCustomer.value = { name: '', phone: '', address: '', doctor: '' };
    otcIsWalkIn.value = false;
    otcDrugs.value = [];
    otcNote.value = '';
    otcDiscountPct.value = 0;
    otcDiscountAmt.value = 0;
    otcVat.value = 0;
    viewMode.value = 'list';
  } catch (err: any) {
    notif.show({ type: 'error', message: 'Lỗi khi tạo hóa đơn ngoài đơn: ' + err.message });
  }
}

// ===================== COLUMN 3: Tạo hóa đơn tổng hợp =====================
const comboCustomer = ref({ name: '', phone: '', address: '', doctor: '' });
const comboTab = ref('rx');
const comboSelectedRx = ref<string | undefined>(undefined);
const selectedComboMedicineId = ref<number | undefined>(undefined);
const comboNote = ref('');
const comboDiscountPct = ref(0);
const comboDiscountAmt = ref(0);
const comboVat = ref(0);

const comboRxList = ref<any[]>([]);
const comboOtcDrugs = ref<any[]>([]);

const comboRxCols = [
  { title: 'Mã đơn', dataIndex: 'code', key: 'code', width: 110 },
  { title: 'Bệnh nhân', dataIndex: 'patient', key: 'patient' },
  { title: 'Bác sĩ kê', dataIndex: 'doctor', key: 'doctor' },
  { title: 'Ngày kê', dataIndex: 'date', key: 'date', width: 85 },
  { title: 'Tổng tiền', key: 'total', width: 70, align: 'right' as const },
  { title: '', key: 'action', width: 60 },
];

const prescriptionModalVisible = ref(false);
const selectedPrescriptionDetails = ref<any>(null);

const modalMedicationColumns = [
  { title: '#', key: 'index', width: '50px', align: 'center' as const },
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Số lượng', dataIndex: 'qty', key: 'qty', width: '90px', align: 'right' as const },
  { title: 'Liều lượng', dataIndex: 'dosage', key: 'dosage' },
];

function showPrescriptionDetails(code: string | undefined) {
  if (!code) {
    notif.show({ type: 'warning', message: 'Vui lòng chọn một đơn thuốc trước!' });
    return;
  }
  const found = prescriptionList.value.find(p => p.code === code);
  if (found) {
    selectedPrescriptionDetails.value = found;
    prescriptionModalVisible.value = true;
  } else {
    notif.show({ type: 'error', message: 'Không tìm thấy thông tin đơn thuốc!' });
  }
}

const billModalVisible = ref(false);
const selectedBillDetails = ref<any>(null);

const billDetailItemCols = [
  { title: 'STT', key: 'index', width: 50, align: 'center' as const },
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Dạng dùng', dataIndex: 'form', key: 'form', width: 90 },
  { title: 'SL cấp phát', dataIndex: 'qty', key: 'qty', width: 95, align: 'center' as const },
  { title: 'Đơn giá', key: 'price', width: 100, align: 'right' as const },
  { title: 'Thành tiền', key: 'total', width: 110, align: 'right' as const },
];

function showBillDetails(bill: BillItem) {
  const storedItems = localStorage.getItem(`bill_items_${bill.id}`);
  if (storedItems) {
    try {
      bill.items = JSON.parse(storedItems);
    } catch (e) {
      bill.items = [];
    }
  }

  if (!bill.items || bill.items.length === 0) {
    const generated: any[] = [];
    if (bill.billType === 'prescription') {
      const matchingRx = prescriptionList.value.find(p => p.patient?.toLowerCase().includes(bill.patientName.toLowerCase()));
      if (matchingRx && matchingRx.medications) {
        matchingRx.medications.forEach((m: any) => {
          generated.push({
            name: m.name,
            form: getMedicineUnit(m.name),
            qty: m.qty,
            price: getMedicinePrice(m.name),
            total: m.qty * getMedicinePrice(m.name)
          });
        });
      }
    }
    
    if (generated.length === 0) {
      const medFee = bill.total;
      if (medFee > 0) {
        generated.push({
          name: 'Thuốc điều trị / Vật tư y tế',
          form: 'Gói',
          qty: 1,
          price: medFee,
          total: medFee
        });
      }
    }
    bill.items = generated;
  }
  
  bill.subtotal = bill.total;
  bill.vatPct = 0;
  bill.discountPct = 0;
  bill.discountAmt = 0;
  bill.note = bill.billType === 'prescription' ? 'Hóa đơn xuất theo đơn thuốc điện tử.' : 'Hóa đơn bán lẻ OTC tại quầy.';
  
  selectedBillDetails.value = bill;
  billModalVisible.value = true;
}

const comboOtcCols = [
  { title: 'STT', key: 'index', width: 35, align: 'center' as const },
  { title: 'Thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Dạng dùng', dataIndex: 'form', key: 'form', width: 60 },
  { title: 'Lô thuốc', dataIndex: 'lot', key: 'lot', width: 70 },
  { title: 'SL', dataIndex: 'qty', key: 'qty', width: 40, align: 'center' as const },
  { title: 'Đơn giá', dataIndex: 'price', key: 'price', width: 55, align: 'right' as const, customRender: ({ text }: any) => text?.toLocaleString() },
  { title: 'Thành tiền', key: 'total', width: 70, align: 'right' as const },
  { title: '', key: 'action', width: 30 },
];

const comboSubtotal = computed(() => {
  const rxTotal = comboRxList.value.reduce((s, r) => s + r.total, 0);
  const otcTotal = comboOtcDrugs.value.reduce((s, d) => s + d.qty * d.price, 0);
  return rxTotal + otcTotal;
});
const comboGrandTotal = computed(() => {
  let total = comboSubtotal.value;
  total -= Math.round(total * comboDiscountPct.value / 100);
  total -= comboDiscountAmt.value;
  total += Math.round(total * comboVat.value / 100);
  return Math.max(0, total);
});

function addComboDrug() {
  if (!selectedComboMedicineId.value) return;
  const med = allMedicines.value.find(m => m.id === selectedComboMedicineId.value);
  if (!med) return;
  
  const idx = comboOtcDrugs.value.findIndex(d => d.id === med.id);
  if (idx >= 0) {
    const updated = [...comboOtcDrugs.value];
    updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
    comboOtcDrugs.value = updated;
  } else {
    comboOtcDrugs.value = [...comboOtcDrugs.value, {
      id: med.id,
      name: med.name,
      form: med.unit || 'Viên',
      lot: 'L' + new Date().getFullYear().toString().slice(2) + '0313',
      qty: 1,
      price: med.price,
      stock: med.stock || 100
    }];
  }
  selectedComboMedicineId.value = undefined;
}

function addRxToCombo() {
  if (!comboSelectedRx.value) return;
  const rx = prescriptionList.value.find(p => p.code === comboSelectedRx.value);
  if (!rx) return;
  
  if (comboRxList.value.some(r => r.code === rx.code)) {
    notif.show({ type: 'warning', message: 'Đơn thuốc này đã được chọn!' });
    return;
  }
  comboRxList.value.push(rx);
  comboSelectedRx.value = undefined;
}

async function submitComboBill() {
  if (comboRxList.value.length === 0 && comboOtcDrugs.value.length === 0) {
    notif.show({ type: 'error', message: 'Vui lòng chọn ít nhất một đơn thuốc hoặc thêm thuốc ngoài đơn!' });
    return;
  }
  
  const combinedMeds: any[] = [];
  comboRxList.value.forEach(rx => {
    rx.medications.forEach((m: any) => {
      combinedMeds.push({
        price: getMedicinePrice(m.name),
        qty: m.qty
      });
    });
  });
  comboOtcDrugs.value.forEach(d => {
    combinedMeds.push({
      price: d.price,
      qty: d.qty
    });
  });

  try {
    const newBill = await createBill({
      patientCode: '5',
      doctorName: comboCustomer.value.doctor,
      consultFee: 150000,
      medicines: combinedMeds
    });
    if (newBill && newBill.id) {
      const itemsToSave: any[] = [];
      comboRxList.value.forEach(rx => {
        rx.medications.forEach((m: any) => {
          itemsToSave.push({
            name: m.name,
            form: getMedicineUnit(m.name),
            qty: m.qty,
            price: getMedicinePrice(m.name),
            total: m.qty * getMedicinePrice(m.name)
          });
        });
      });
      comboOtcDrugs.value.forEach(d => {
        itemsToSave.push({
          name: d.name,
          form: d.form,
          qty: d.qty,
          price: d.price,
          total: d.qty * d.price
        });
      });
      localStorage.setItem(`bill_items_${newBill.id}`, JSON.stringify(itemsToSave));
    }
    notif.show({ type: 'success', message: 'Đã tạo hóa đơn tổng hợp thành công!' });
    await loadData();
    comboCustomer.value = { name: '', phone: '', address: '', doctor: '' };
    comboRxList.value = [];
    comboOtcDrugs.value = [];
    comboNote.value = '';
    comboDiscountPct.value = 0;
    comboDiscountAmt.value = 0;
    comboVat.value = 0;
    viewMode.value = 'list';
  } catch (err: any) {
    notif.show({ type: 'error', message: 'Lỗi khi tạo hóa đơn tổng hợp: ' + err.message });
  }
}

async function loadData() {
  loading.value = true;
  let patientsData: any[] = [];
  try {
    patientsData = await medicalRecordService.getAllPatients();
  } catch (e) {
    patientsData = [];
  }
  const patientMap = new Map<string, any>();
  patientsData.forEach((p: any) => {
    const id = String(p.id || p.Id).toLowerCase();
    patientMap.set(id, p);
    const gid = p.gatewayPatientId ?? p.GatewayPatientId;
    if (gid != null) {
      patientMap.set(mapUserIdToGuid(String(gid)), p);
    }
    const lastSeg = (id.split('-').pop() || '').replace(/^0+/, '');
    if (lastSeg && /^\d+$/.test(lastSeg)) {
      patientMap.set(mapUserIdToGuid(lastSeg), p);
    }
  });

  // Load medicines
  try {
    const mData = await getMedicines();
    if (mData && mData.length > 0) {
      allMedicines.value = mData.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price || 1500,
        stock: item.stockQuantity || item.stock || 0,
        unit: item.unit || 'Viên'
      }));
    } else {
      allMedicines.value = [];
    }
  } catch (e) {
    allMedicines.value = [];
  }

  // Load prescriptions
  try {
    const pData = await getPrescriptions();
    prescriptionList.value = (pData || []).map((p: any, idx: number) => {
      let patientName = p.patient;
      const match = p.patient?.match(/Bệnh nhân #([0-9]+)/);
      if (match && match[1]) {
        const idNum = parseInt(match[1], 10);
        const pGuid = mapUserIdToGuid(idNum);
        let prof = patientMap.get(pGuid);
        if (!prof) {
          for (const pt of patientsData) {
            const pg = pt.gatewayPatientId ?? pt.GatewayPatientId;
            if (pg != null && Number(pg) === idNum) { prof = pt; break; }
          }
        }
        if (!prof) {
          for (const pt of patientsData) {
            const lastSeg = (String(pt.id || pt.Id).split('-').pop() || '').replace(/^0+/, '');
            if (lastSeg === match[1]) { prof = pt; break; }
          }
        }
        if (prof) {
          patientName = prof.fullName;
        }
      }
      return {
        code: p.code || `PRC${String(p.id).padStart(5, '0')}`,
        patient: patientName,
        doctor: p.doctorName || 'Bác sĩ điều trị',
        date: p.date || '20/05/2025',
        medications: p.medications || [],
        total: (p.medications || []).reduce((sum: number, item: any) => sum + item.qty * getMedicinePrice(item.name), 0)
      };
    });
  } catch (e) {
    prescriptionList.value = [];
  }

  // Load bills
  try {
    const data = await getBills();
    if (data) {
      bills.value = data.map((b: any, idx: number) => {
        const createdDateTime = b.createdAt ? new Date(b.createdAt) : new Date();
        const dateStr = createdDateTime.toLocaleDateString('vi-VN');
        const timeStr = createdDateTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        
        const pGuid = mapUserIdToGuid(b.patientId);
        let prof = patientMap.get(pGuid);
        if (!prof) {
          for (const pt of patientsData) {
            const pg = pt.gatewayPatientId ?? pt.GatewayPatientId;
            if (pg != null && Number(pg) === b.patientId) { prof = pt; break; }
          }
        }
        if (!prof) {
          for (const pt of patientsData) {
            const lastSeg = (String(pt.id || pt.Id).split('-').pop() || '').replace(/^0+/, '');
            if (lastSeg === String(b.patientId)) { prof = pt; break; }
          }
        }
        const pName = prof ? prof.fullName : `Bệnh nhân #${b.patientId}`;
        const pPhone = prof ? prof.phone || '0901234567' : '0901234567';

        return {
          id: b.id || idx + 1,
          code: `INV${String(b.id || idx + 1).padStart(8, '0')}`,
          billType: b.examinationFee > 0 ? 'combined' as const : 'prescription' as const,
          patientName: pName,
          patientPhone: pPhone,
          createdDate: dateStr,
          createdTime: timeStr,
          total: b.total || b.totalAmount || 0,
          payStatus: b.status?.toLowerCase() === 'paid' ? 'paid' as const : b.status?.toLowerCase() === 'cancelled' ? 'cancelled' as const : 'pending' as const,
          billStatus: b.status?.toLowerCase() === 'paid' ? 'completed' as const : b.status?.toLowerCase() === 'cancelled' ? 'cancelled' as const : 'pending' as const,
          paidBy: b.paidBy || (b.status?.toLowerCase() === 'paid' ? 'Nhân viên thu ngân' : '')
        };
      });
    } else {
      bills.value = [];
    }
  } catch (e) {
    bills.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadData();
});
</script>

<style scoped>
:deep(.ant-card) {
  border-radius: 12px;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 700;
  font-size: 0.78rem;
  border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

:deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #f0f4f9;
  vertical-align: middle;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f8fafc !important;
}

:deep(.bill-tabs .ant-tabs-nav) {
  margin-bottom: 0;
}

:deep(.bill-tabs .ant-tabs-tab) {
  font-weight: 600;
  color: #64748b;
}

:deep(.bill-tabs .ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #0047AB !important;
  font-weight: 700;
}

:deep(.bill-tabs .ant-tabs-ink-bar) {
  background: #0047AB;
}

:deep(.combo-tabs .ant-tabs-nav) {
  margin-bottom: 10px;
}

:deep(.combo-tabs .ant-tabs-tab) {
  font-weight: 600;
  font-size: 0.82rem;
}

.metric-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 4px 0;
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.metric-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.metric-title {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 2px;
}

.metric-value {
  font-size: 1.4rem;
  font-weight: 800;
}

.metric-sub {
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: 2px;
}

.search-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  background: #ffffff;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.main-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.legend-bar {
  display: flex;
  gap: 48px;
  background: #ffffff;
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-top: 20px;
  flex-wrap: wrap;
}

.legend-group {
  flex: 1;
  min-width: 280px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 4px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ===== CREATE VIEW STYLES ===== */
.create-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 20px;
}

.create-card-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #fff;
  font-weight: 800;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.create-card-title {
  font-weight: 700;
  font-size: 1rem;
  color: #0f172a;
}

.create-card-sub {
  font-size: 0.78rem;
  color: #94a3b8;
  margin-top: 2px;
}

.section-label {
  font-weight: 700;
  font-size: 0.85rem;
  color: #0f172a;
  margin-bottom: 8px;
}

.info-grid {
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
  font-size: 0.82rem;
}

.info-label {
  color: #64748b;
  font-weight: 500;
}

.info-value {
  color: #0f172a;
  font-weight: 600;
}

.compact-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  font-size: 0.72rem;
}

.compact-table :deep(.ant-table-tbody > tr > td) {
  padding: 5px 8px;
  font-size: 0.8rem;
}

.totals-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  margin-top: 14px;
}

.total-label {
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 4px;
}

.total-value {
  font-weight: 700;
  font-size: 0.85rem;
  color: #0f172a;
}

.grand-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed #cbd5e1;
  font-weight: 700;
  font-size: 0.95rem;
  color: #0f172a;
}

.grand-total-value {
  font-size: 1.3rem;
  font-weight: 800;
}
</style>
