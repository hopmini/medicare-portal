<template>
  <a-layout :style="inline ? 'background: transparent; min-height: auto;' : 'min-height: 100vh; background: #f8fafc;'">
    <!-- Sidebar -->
    <a-layout-sider v-if="!inline" width="260" theme="light" style="background: #ffffff; border-right: 1px solid #f0f4f9;">
      <PharmacySidebar />
    </a-layout-sider>

    <!-- Main Content -->
    <a-layout :style="inline ? 'background: transparent;' : 'background: #f8fafc;'">
      <!-- Header -->
      <AppHeader v-if="!inline" :title="viewMode === 'list' ? 'Danh sách phiếu nhập thuốc' : 'Tạo phiếu nhập thuốc'" />

      <!-- Content Area -->
      <a-layout-content :style="inline ? 'padding: 0;' : 'padding: 24px 28px;'">
        
        <!-- -------------------- 1. VIEW MODE: LIST (DANH SÁCH PHIẾU NHẬP) -------------------- -->
        <div v-if="viewMode === 'list'">
          <!-- Top Navigation Status Info -->
          <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 20px; font-weight: 500;">
            Hóa đơn nhập thuốc <span style="margin: 0 4px; color: #cbd5e1;">&gt;</span> <span style="color: #0f172a; font-weight: 600;">Danh sách phiếu nhập</span>
          </div>

          <!-- Summary Metric Cards -->
          <a-row :gutter="24" style="margin-bottom: 24px;">
            <a-col :xs="24" :sm="8">
              <a-card :bordered="false" class="metric-card">
                <div class="metric-content">
                  <div class="metric-icon" style="background: #eff6ff; color: #3b82f6;">
                    <i class="fas fa-file-invoice" />
                  </div>
                  <div>
                    <div class="metric-title">Tổng phiếu nhập</div>
                    <div class="metric-value">{{ totalImportBillsCount }}</div>
                    <div class="metric-sub">Tất cả thời gian</div>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="8">
              <a-card :bordered="false" class="metric-card">
                <div class="metric-content">
                  <div class="metric-icon" style="background: #fffbeb; color: #f59e0b;">
                    <i class="fas fa-clock" />
                  </div>
                  <div>
                    <div class="metric-title">Chờ hoàn tất</div>
                    <div class="metric-value">{{ draftImportBillsCount }}</div>
                    <div class="metric-sub">Chưa hoàn tất</div>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="8">
              <a-card :bordered="false" class="metric-card">
                <div class="metric-content">
                  <div class="metric-icon" style="background: #ecfdf5; color: #10b981;">
                    <i class="fas fa-wallet" />
                  </div>
                  <div>
                    <div class="metric-title">Giá trị nhập tháng này</div>
                    <div class="metric-value">{{ currentMonthImportValue }}</div>
                    <div class="metric-sub">{{ currentMonthLabel }}</div>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>

          <!-- Filter & Action Bar -->
          <div class="filter-action-bar">
            <div class="filter-inputs">
              <a-input v-model:value="searchQuery" placeholder="Tìm theo mã phiếu hoặc nhà cung cấp..." style="width: 280px; border-radius: 8px;">
                <template #prefix>
                  <i class="fas fa-search" style="color: #cbd5e1;" />
                </template>
              </a-input>

              <a-select v-model:value="filterStatus" style="width: 160px;" placeholder="Tất cả trạng thái">
                <a-select-option value="all">Tất cả trạng thái</a-select-option>
                <a-select-option value="completed">Đã hoàn tất</a-select-option>
                <a-select-option value="draft">Nháp</a-select-option>
                <a-select-option value="cancelled">Đã hủy</a-select-option>
              </a-select>

              <a-select v-model:value="filterSupplier" style="width: 180px;" placeholder="Nhà cung cấp">
                <a-select-option value="all">Tất cả nhà cung cấp</a-select-option>
                <a-select-option v-for="sup in suppliersList" :key="sup.code" :value="sup.code">{{ sup.name }}</a-select-option>
              </a-select>

              <a-range-picker v-model:value="filterDateRange" style="width: 260px;" format="DD/MM/YYYY" :placeholder="['Từ ngày', 'Đến ngày']" />
            </div>

            <div style="display: flex; gap: 12px;">
              <a-button type="primary" @click="switchToCreateMode" style="background: #0047AB; border-color: #0047AB; border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-plus" /> Tạo phiếu nhập
              </a-button>
              <a-button style="border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 8px;" @click="exportToExcel">
                <i class="fas fa-download" /> Xuất Excel
              </a-button>
            </div>
          </div>

          <!-- Main List Table -->
          <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); border: 1px solid #e2e8f0; overflow: hidden;">
            <a-spin :spinning="loading">
            <a-empty v-if="!loading && filteredImportBills.length === 0" description="Không có phiếu nhập nào" />
            <a-table v-if="filteredImportBills.length > 0"
              :columns="listColumns" 
              :data-source="filteredImportBills" 
              :pagination="{ pageSize: 10, showSizeChanger: true, locale: { items_per_page: '/ trang' } }" 
              row-key="code" 
              size="middle"
            >
              <template #bodyCell="{ text, record, column }">
                <template v-if="column.key === 'code'">
                  <span style="font-weight: 700; color: #0047AB; cursor: pointer;" @click="viewDetail(record)">{{ record.code }}</span>
                </template>
                <template v-else-if="column.key === 'date'">
                  <span>{{ dayjs(record.date).isValid() ? dayjs(record.date).format('DD/MM/YYYY') : record.date }}</span>
                </template>
                <template v-else-if="column.key === 'goodsTotal'">
                  <span>{{ record.goodsTotal.toLocaleString() }} đ</span>
                </template>
                <template v-else-if="column.key === 'discountTotal'">
                  <span>{{ record.discountTotal.toLocaleString() }} đ</span>
                </template>
                <template v-else-if="column.key === 'vatTotal'">
                  <span>{{ record.vatTotal.toLocaleString() }} đ</span>
                </template>
                <template v-else-if="column.key === 'finalTotal'">
                  <span style="font-weight: 700; color: #1e293b;">{{ record.finalTotal.toLocaleString() }} đ</span>
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag v-if="record.status === 'completed'" color="success" style="font-weight: 700; border-radius: 4px; padding: 2px 8px;">Đã hoàn tất</a-tag>
                  <a-tag v-else-if="record.status === 'draft'" color="default" style="font-weight: 700; border-radius: 4px; padding: 2px 8px;">Nháp</a-tag>
                  <a-tag v-else-if="record.status === 'cancelled'" color="error" style="font-weight: 700; border-radius: 4px; padding: 2px 8px;">Đã hủy</a-tag>
                </template>
                <template v-else-if="column.key === 'actions'">
                  <div style="display: flex; gap: 8px; justify-content: center;">
                    <a-tooltip title="Xem chi tiết">
                      <a-button type="text" size="small" style="color: #64748b;" @click="viewDetail(record)">
                        <i class="far fa-eye" />
                      </a-button>
                    </a-tooltip>
                    <a-tooltip title="Chỉnh sửa">
                      <a-button type="text" size="small" style="color: #0047AB;" @click="editImportBill(record)" :disabled="record.status !== 'draft'">
                        <i class="far fa-edit" />
                      </a-button>
                    </a-tooltip>
                    <a-tooltip title="In phiếu">
                      <a-button type="text" size="small" style="color: #64748b;">
                        <i class="fas fa-print" />
                      </a-button>
                    </a-tooltip>
                  </div>
                </template>
              </template>
            </a-table>
            </a-spin>
          </a-card>
        </div>

        <!-- -------------------- 2. VIEW MODE: CREATE (TẠO PHIẾU NHẬP) -------------------- -->
        <div v-else>
          <!-- Top Navigation Status Info -->
          <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 20px; font-weight: 500; display: flex; align-items: center; justify-content: space-between;">
            <div>
              Hóa đơn nhập thuốc <span style="margin: 0 4px; color: #cbd5e1;">&gt;</span> <span style="color: #0f172a; font-weight: 600;">Tạo phiếu nhập</span>
            </div>
          </div>

          <!-- Action Bar Row mimicking mockup -->
          <div style="display: flex; justify-content: space-between; background: #ffffff; padding: 14px 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); border: 1px solid #e2e8f0; margin-bottom: 24px;">
            <a-button @click="backToList" style="border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-arrow-left" /> Quay lại danh sách
            </a-button>
            
            <div style="display: flex; gap: 12px;">
              <a-button @click="saveDraft" style="border-radius: 6px; font-weight: 600; color: #0047AB; border-color: #0047AB; display: flex; align-items: center; gap: 8px;">
                <i class="far fa-save" /> Lưu nháp
              </a-button>
              <a-button type="primary" @click="submitImport" style="background: #10b981; border-color: #10b981; border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-check" /> Hoàn tất nhập
              </a-button>
              <a-button style="border-radius: 6px; font-weight: 600; color: #0047AB; border-color: #0047AB; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-print" /> In phiếu nhập
              </a-button>
              <a-button danger @click="cancelImport" style="background: #ef4444; color: white; border-color: #ef4444; border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <i class="far fa-trash-alt" /> Hủy phiếu
              </a-button>
            </div>
          </div>

          <a-row :gutter="24" style="margin-bottom: 24px;">
            <!-- Left Column: Supplier Information -->
            <a-col :xs="24" :lg="13">
              <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); border: 1px solid #e2e8f0; height: 100%;" title="THÔNG TIN NHÀ CUNG CẤP">
                <a-form layout="vertical">
                  <a-form-item label="Nhà cung cấp" required>
                    <div style="display: flex; gap: 8px;">
                      <a-select v-model:value="supplier.selected" placeholder="Chọn nhà cung cấp..." style="flex: 1;" @change="onSupplierChange">
                        <a-select-option v-for="sup in suppliersList" :key="sup.code" :value="sup.code">{{ sup.code }} - {{ sup.name }}</a-select-option>
                      </a-select>
                      <a-button type="primary" style="background: #ffffff; border-color: #10b981; color: #10b981; display: flex; align-items: center; justify-content: center; height: 32px; width: 32px; padding: 0;">
                        <i class="fas fa-plus" />
                      </a-button>
                    </div>
                  </a-form-item>

                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item label="Mã số thuế">
                        <a-input v-model:value="supplier.taxCode" readonly placeholder="Mã số thuế nhà cung cấp" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="Số điện thoại">
                        <a-input v-model:value="supplier.phone" readonly placeholder="Số điện thoại nhà cung cấp" />
                      </a-form-item>
                    </a-col>
                  </a-row>

                      <a-form-item label="Địa chỉ">
                        <a-input v-model:value="supplier.address" readonly placeholder="Địa chỉ liên hệ" />
                      </a-form-item>

                      <a-form-item label="Email">
                        <a-input v-model:value="supplier.email" readonly placeholder="Email liên hệ" />
                      </a-form-item>
                    </a-form>
                  </a-card>
                </a-col>

                <!-- Right Column: Invoice Information -->
                <a-col :xs="24" :lg="11">
                  <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); border: 1px solid #e2e8f0; height: 100%;" title="THÔNG TIN PHIẾU NHẬP">
                    <a-form layout="vertical">
                      <a-row :gutter="16">
                        <a-col :span="12">
                          <a-form-item label="Mã phiếu nhập" required>
                            <a-input v-model:value="invoice.code" placeholder="Mã phiếu nhập tự động" />
                          </a-form-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-item label="Ngày nhập" required>
                            <a-date-picker v-model:value="invoice.date" style="width: 100%;" format="DD/MM/YYYY" />
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-row :gutter="16">
                        <a-col :span="12">
                          <a-form-item label="Người lập" required>
                            <a-select v-model:value="invoice.creator" placeholder="Chọn người lập phiếu">
                              <a-select-option value="admin">Hệ thống Admin</a-select-option>
                              <a-select-option value="pharmacist">Dược sĩ Trần Thị B</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-item label="Trạng thái">
                            <div style="margin-top: 6px;">
                              <a-tag color="warning" style="font-weight: 700; border-radius: 4px; padding: 2px 8px;">DRAFT</a-tag>
                            </div>
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-form-item label="Ghi chú">
                        <a-textarea v-model:value="invoice.note" placeholder="Nhập ghi chú (nếu có)..." :rows="3" />
                      </a-form-item>
                    </a-form>
                  </a-card>
                </a-col>
              </a-row>

              <!-- Lower Section: Medication Detail Inputs Table -->
              <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); border: 1px solid #e2e8f0; margin-bottom: 24px;" title="CHI TIẾT THUỐC NHẬP">
                <template #extra>
                  <div style="display: flex; gap: 12px;">
                    <a-button type="primary" @click="addMedicationRow" style="background: #ffffff; color: #0047AB; border-color: #0047AB; border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                      <i class="fas fa-plus" /> Thêm thuốc
                    </a-button>
                    <a-button style="border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                      <i class="fas fa-file-excel" /> Nhập từ file Excel
                    </a-button>
                  </div>
                </template>

                <a-table :columns="detailColumns" :data-source="medicationRows" :pagination="false" row-key="key" size="middle">
                  <template #bodyCell="{ text, record, index, column }">
                    <!-- Number Column -->
                    <template v-if="column.key === 'index'">
                      {{ index + 1 }}
                    </template>

                    <!-- Code Dropdown Column -->
                    <template v-else-if="column.key === 'code'">
                      <a-select v-model:value="record.code" placeholder="Mã thuốc" style="width: 120px;" @change="onMedicationCodeChange(record)">
                        <a-select-option v-for="m in availableMeds" :key="m.code" :value="m.code">{{ m.code }}</a-select-option>
                      </a-select>
                    </template>

                    <!-- Name Input Column -->
                    <template v-else-if="column.key === 'name'">
                      <span style="font-weight: 600; color: #1e293b;">{{ record.name || 'Chọn mã thuốc...' }}</span>
                    </template>

                    <!-- Batch Input -->
                    <template v-else-if="column.key === 'batch'">
                      <a-input v-model:value="record.batch" placeholder="Số lô" style="width: 100px;" />
                    </template>

                    <!-- Expiry Input -->
                    <template v-else-if="column.key === 'expiry'">
                      <a-date-picker v-model:value="record.expiryDate" placeholder="Chọn ngày" style="width: 130px;" format="DD/MM/YYYY" />
                    </template>

                    <!-- Quantity Input -->
                    <template v-else-if="column.key === 'qty'">
                      <a-input-number v-model:value="record.qty" :min="1" style="width: 80px;" @change="calculateRowTotal(record)" />
                    </template>

                    <!-- Unit Selector -->
                    <template v-else-if="column.key === 'unit'">
                      <a-select v-model:value="record.unit" style="width: 85px;">
                        <a-select-option value="Viên">Viên</a-select-option>
                        <a-select-option value="Hộp">Hộp</a-select-option>
                        <a-select-option value="Chai">Chai</a-select-option>
                      </a-select>
                    </template>

                    <!-- Price Input -->
                    <template v-else-if="column.key === 'price'">
                      <a-input-number v-model:value="record.price" :min="0" style="width: 90px;" @change="calculateRowTotal(record)" />
                    </template>

                    <!-- Discount Input -->
                    <template v-else-if="column.key === 'discount'">
                      <a-input-number v-model:value="record.discount" :min="0" :max="100" style="width: 65px;" @change="calculateRowTotal(record)" />
                    </template>

                    <!-- VAT Input -->
                    <template v-else-if="column.key === 'vat'">
                      <a-input-number v-model:value="record.vat" :min="0" :max="100" style="width: 65px;" @change="calculateRowTotal(record)" />
                    </template>

                    <!-- Row Subtotal -->
                    <template v-else-if="column.key === 'total'">
                      <span style="font-weight: 700; color: #1e293b;">{{ record.total.toLocaleString() }}</span>
                    </template>

                    <!-- Delete Action Button -->
                    <template v-else-if="column.key === 'action'">
                      <a-space>
                        <a-button type="link" style="padding: 0; color: #0047AB;">
                          <i class="far fa-edit" />
                        </a-button>
                        <a-button type="link" danger style="padding: 0;" @click="removeMedicationRow(record.key)">
                          <i class="far fa-trash-alt" />
                        </a-button>
                      </a-space>
                    </template>
                  </template>
                </a-table>
              </a-card>

              <!-- Summary Footer Row -->
              <a-card :bordered="false" style="border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); border: 1px solid #e2e8f0;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px;">
                  <div style="font-size: 1.1rem; font-weight: 800; color: #0047AB; letter-spacing: -0.5px;">TỔNG KẾT</div>
                  
                  <div style="display: flex; gap: 48px; align-items: center; flex-wrap: wrap;">
                    <div style="text-align: right;">
                      <div style="font-size: 0.8rem; color: #64748b; font-weight: 600; margin-bottom: 4px;">Tổng tiền hàng</div>
                      <strong style="font-size: 1.15rem; color: #1e293b;">{{ totalSummary.goodsTotal.toLocaleString() }}</strong>
                      <span style="font-size: 0.75rem; color: #94a3b8; margin-left: 4px; font-weight: bold;">VND</span>
                    </div>

                    <div style="text-align: right;">
                      <div style="font-size: 0.8rem; color: #64748b; font-weight: 600; margin-bottom: 4px;">Chiết khấu</div>
                      <strong style="font-size: 1.15rem; color: #10b981;">{{ totalSummary.discountTotal.toLocaleString() }}</strong>
                      <span style="font-size: 0.75rem; color: #94a3b8; margin-left: 4px; font-weight: bold;">VND</span>
                    </div>

                    <div style="text-align: right;">
                      <div style="font-size: 0.8rem; color: #64748b; font-weight: 600; margin-bottom: 4px;">Tiền VAT (5%)</div>
                      <strong style="font-size: 1.15rem; color: #1e293b;">{{ totalSummary.vatTotal.toLocaleString() }}</strong>
                      <span style="font-size: 0.75rem; color: #94a3b8; margin-left: 4px; font-weight: bold;">VND</span>
                    </div>

                    <div style="text-align: right; border-left: 1.5px solid #e2e8f0; padding-left: 24px;">
                      <div style="font-size: 0.82rem; color: #0047AB; font-weight: bold; margin-bottom: 4px;">Tổng thanh toán</div>
                      <strong style="font-size: 1.4rem; color: #0047AB;">{{ totalSummary.finalTotal.toLocaleString() }}</strong>
                      <span style="font-size: 0.8rem; color: #0047AB; margin-left: 4px; font-weight: 800;">VND</span>
                    </div>
                  </div>
                </div>
              </a-card>
            </div>

      </a-layout-content>
    </a-layout>
  </a-layout>

  <!-- Detail Dialog modal when user clicks view details -->
  <a-modal v-model:open="detailModalVisible" title="Chi tiết phiếu nhập thuốc" width="850px" :footer="null">
    <div v-if="selectedBillDetail" style="padding: 12px 0;">
      <a-row :gutter="24" style="margin-bottom: 16px;">
        <a-col :span="12">
          <p><strong>Mã phiếu:</strong> {{ selectedBillDetail.code }}</p>
          <p><strong>Nhà cung cấp:</strong> {{ selectedBillDetail.supplierName }}</p>
          <p><strong>Ngày nhập:</strong> {{ selectedBillDetail.date }}</p>
        </a-col>
        <a-col :span="12">
          <p><strong>Người lập:</strong> {{ selectedBillDetail.creator }}</p>
          <p><strong>Trạng thái:</strong> 
            <a-tag :color="selectedBillDetail.status === 'completed' ? 'success' : selectedBillDetail.status === 'draft' ? 'warning' : 'error'">
              {{ selectedBillDetail.status === 'completed' ? 'Đã hoàn tất' : selectedBillDetail.status === 'draft' ? 'Nháp' : 'Đã hủy' }}
            </a-tag>
          </p>
        </a-col>
      </a-row>
      <a-divider style="margin: 12px 0;" />
      <h4 style="font-weight: 700; margin-bottom: 12px;">CHI TIẾT THUỐC</h4>
      <a-table :columns="detailViewColumns" :data-source="selectedBillDetail.medications" :pagination="false" size="middle">
        <template #bodyCell="{ text, record, index, column }">
          <template v-if="column.key === 'index'">
            {{ index + 1 }}
          </template>
          <template v-else-if="column.key === 'price'">
            {{ record.price.toLocaleString() }} đ
          </template>
          <template v-else-if="column.key === 'total'">
            {{ (record.price * record.qty).toLocaleString() }} đ
          </template>
        </template>
      </a-table>
      <div style="margin-top: 16px; text-align: right;">
        <p><strong>Tổng tiền hàng:</strong> {{ selectedBillDetail.goodsTotal.toLocaleString() }} đ</p>
        <p><strong>Chiết khấu:</strong> {{ selectedBillDetail.discountTotal.toLocaleString() }} đ</p>
        <p><strong>VAT:</strong> {{ selectedBillDetail.vatTotal.toLocaleString() }} đ</p>
        <p style="font-size: 1.15rem; color: #0047AB;"><strong>Tổng thanh toán:</strong> {{ selectedBillDetail.finalTotal.toLocaleString() }} đ</p>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore';
const notif = useNotificationStore();
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import PharmacySidebar from '@/components/PharmacySidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import { getMedicines, getSuppliers, getImportBills, createImportBill } from '@/services/pharmacyService'

const props = withDefaults(
  defineProps<{
    inline?: boolean
  }>(),
  {
    inline: false
  }
)

const router = useRouter()

// viewMode determines whether to show 'list' or 'create'
const viewMode = ref<'list' | 'create'>('list')

// Search & filter states
const searchQuery = ref('')
const filterStatus = ref('all')
const filterSupplier = ref('all')
const filterDateRange = ref<any>(null)

// Detail modal logic
const detailModalVisible = ref(false)
const selectedBillDetail = ref<any>(null)

// List of available drugs fetched from backend
const availableMeds = ref<any[]>([])

// Supplier list loaded dynamically from backend API
const suppliersList = ref<any[]>([])

async function loadSuppliers() {
  try {
    const data = await getSuppliers()
    suppliersList.value = data || []
  } catch (e) {
    console.error('Failed to load suppliers from backend:', e)
    suppliersList.value = []
  }
}

const loading = ref(false)
const importBills = ref<any[]>([])

async function loadImportBills() {
  loading.value = true
  try {
    const data = await getImportBills()
    importBills.value = (data || []).map((b: any) => ({
      ...b,
      status: b.status || 'Đã nhập'
    }))
  } catch (e) {
    console.error('Failed to load import bills from backend:', e)
    importBills.value = []
  } finally {
    loading.value = false
  }
}

// Columns for list view
const listColumns = [
  { title: 'Mã phiếu nhập', dataIndex: 'code', key: 'code', sorter: (a: any, b: any) => a.code.localeCompare(b.code), width: '130px' },
  { title: 'Nhà cung cấp', dataIndex: 'supplierName', key: 'supplierName' },
  { title: 'Ngày nhập', dataIndex: 'date', key: 'date', sorter: (a: any, b: any) => a.date.localeCompare(b.date), width: '120px' },
  { title: 'Người lập', dataIndex: 'creator', key: 'creator', width: '140px' },
  { title: 'Tổng tiền hàng', dataIndex: 'goodsTotal', key: 'goodsTotal', align: 'right' },
  { title: 'Chiết khấu', dataIndex: 'discountTotal', key: 'discountTotal', align: 'right' },
  { title: 'VAT', dataIndex: 'vatTotal', key: 'vatTotal', align: 'right' },
  { title: 'Tổng thanh toán', dataIndex: 'finalTotal', key: 'finalTotal', align: 'right', sorter: (a: any, b: any) => a.finalTotal - b.finalTotal },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', align: 'center', width: '120px' },
  { title: 'Thao tác', key: 'actions', align: 'center', width: '120px' }
]

// Detail View Modal Columns
const detailViewColumns = [
  { title: '#', key: 'index', width: '50px', align: 'center' },
  { title: 'Mã thuốc', dataIndex: 'code', key: 'code' },
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Số lô', dataIndex: 'batch', key: 'batch' },
  { title: 'Hạn sử dụng', dataIndex: 'expiryDate', key: 'expiryDate' },
  { title: 'Số lượng', dataIndex: 'qty', key: 'qty', align: 'right' },
  { title: 'Đơn giá', dataIndex: 'price', key: 'price', align: 'right' },
  { title: 'Thành tiền', key: 'total', align: 'right' }
]

const totalImportBillsCount = computed(() => importBills.value.length)

const draftImportBillsCount = computed(() => importBills.value.filter(b => b.status === 'draft').length)

const currentMonthLabel = computed(() => {
  return 'Tháng ' + dayjs().format('MM/YYYY')
})

const currentMonthImportValue = computed(() => {
  const currentMonthYear = dayjs().format('MM/YYYY')
  const total = importBills.value
    .filter(b => {
      if (!b.date) return false
      const bDate = dayjs(b.date)
      if (bDate.isValid()) {
        return bDate.format('MM/YYYY') === currentMonthYear
      }
      return b.date.includes(currentMonthYear)
    })
    .reduce((sum, b) => sum + (b.finalTotal || 0), 0)
  return total.toLocaleString('vi-VN') + ' đ'
})

// Filter logic
const filteredImportBills = computed(() => {
  return importBills.value.filter(bill => {
    // Search query matches code or supplier name
    const matchesSearch = 
      bill.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      bill.supplierName.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Status matches
    const matchesStatus = filterStatus.value === 'all' || bill.status === filterStatus.value

    // Supplier matches
    const matchesSupplier = filterSupplier.value === 'all' || bill.supplierCode === filterSupplier.value

    // Date range matches
    let matchesDate = true
    if (filterDateRange.value && filterDateRange.value.length === 2) {
      const from = dayjs(filterDateRange.value[0]).startOf('day')
      const to = dayjs(filterDateRange.value[1]).endOf('day')
      const billDate = dayjs(bill.date, 'DD/MM/YYYY')
      matchesDate = (billDate.isAfter(from) || billDate.isSame(from)) && (billDate.isBefore(to) || billDate.isSame(to))
    }

    return matchesSearch && matchesStatus && matchesSupplier && matchesDate
  })
})

function switchToCreateMode() {
  // Reset create form inputs dynamically from loaded lists
  if (suppliersList.value.length > 0) {
    const firstSup = suppliersList.value[0]
    supplier.value = {
      selected: firstSup.code,
      name: firstSup.name,
      taxCode: firstSup.taxCode || firstSup.code || '',
      phone: firstSup.phone || '',
      address: firstSup.address || '',
      email: firstSup.email || ''
    }
  } else {
    supplier.value = {
      selected: '',
      name: '',
      taxCode: '',
      phone: '',
      address: '',
      email: ''
    }
  }
  invoice.value = {
    code: 'PN' + Math.floor(100000 + Math.random() * 900000).toString(),
    date: dayjs(),
    creator: 'admin',
    note: ''
  }
  
  if (availableMeds.value.length > 0) {
    const firstMed = availableMeds.value[0]
    medicationRows.value = [
      { 
        key: '1', 
        code: firstMed.code, 
        name: firstMed.name, 
        batch: 'LO' + Math.floor(100 + Math.random() * 900).toString(), 
        expiryDate: dayjs().add(2, 'year'), 
        qty: 100, 
        unit: 'Viên', 
        price: firstMed.price || 1000, 
        discount: 0, 
        vat: 5, 
        total: Math.round((firstMed.price || 1000) * 100 * 1.05)
      }
    ]
  } else {
    medicationRows.value = [
      { key: '1', code: '', name: '', batch: '', expiryDate: null, qty: 1, unit: 'Viên', price: 0, discount: 0, vat: 5, total: 0 }
    ]
  }
  viewMode.value = 'create'
}

function backToList() {
  viewMode.value = 'list'
}

function viewDetail(bill: any) {
  selectedBillDetail.value = bill
  detailModalVisible.value = true
}

function editImportBill(bill: any) {
  // Load draft bill details to editor
  invoice.value.code = bill.code
  invoice.value.creator = 'admin'
  invoice.value.note = 'Sửa phiếu nháp ' + bill.code
  invoice.value.date = dayjs(bill.date, 'DD/MM/YYYY')
  
  // Load medications
  medicationRows.value = bill.medications.map((m: any, idx: number) => ({
    key: (idx + 1).toString(),
    code: m.code,
    name: m.name,
    batch: m.batch,
    expiryDate: dayjs(m.expiryDate, 'DD/MM/YYYY'),
    qty: m.qty,
    unit: m.unit || 'Viên',
    price: m.price,
    discount: 0,
    vat: 5,
    total: m.price * m.qty * 1.05
  }))

  const sup = suppliersList.value.find(s => s.code === bill.supplierCode)
  if (sup) {
    supplier.value.selected = sup.code
    supplier.value.name = sup.name
    supplier.value.taxCode = sup.taxCode
    supplier.value.phone = sup.phone
    supplier.value.address = sup.address
    supplier.value.email = sup.email
  }

  viewMode.value = 'create'
}

function exportToExcel() {
  notif.show({ type: 'success', message: 'Xuất file excel danh sách phiếu nhập thành công!' })
}

// -------------------- CREATE FORM CODE --------------------

const supplier = ref({
  selected: '',
  name: '',
  taxCode: '',
  phone: '',
  address: '',
  email: ''
})

const invoice = ref({
  code: '',
  date: dayjs(),
  creator: 'admin',
  note: ''
})

interface MedicineRow {
  key: string;
  code: string;
  name: string;
  batch: string;
  expiryDate: any;
  qty: number;
  unit: string;
  price: number;
  discount: number;
  vat: number;
  total: number;
}

const medicationRows = ref<MedicineRow[]>([])

const detailColumns = [
  { title: '#', key: 'index', width: '50px', align: 'center' },
  { title: 'Mã thuốc', key: 'code', width: '130px' },
  { title: 'Tên thuốc', key: 'name' },
  { title: 'Số lô', key: 'batch', width: '110px' },
  { title: 'Hạn sử dụng', key: 'expiry', width: '140px' },
  { title: 'Số lượng', key: 'qty', width: '90px' },
  { title: 'Đơn vị', key: 'unit', width: '100px' },
  { title: 'Đơn giá nhập', key: 'price', width: '100px' },
  { title: 'CK (%)', key: 'discount', width: '75px' },
  { title: 'VAT (%)', key: 'vat', width: '75px' },
  { title: 'Thành tiền', key: 'total', width: '120px', align: 'right' },
  { title: 'Thao tác', key: 'action', width: '100px', align: 'center' }
]

function onSupplierChange(val: string) {
  const selected = suppliersList.value.find(s => s.code === val)
  if (selected) {
    supplier.value.name = selected.name
    supplier.value.taxCode = selected.taxCode
    supplier.value.phone = selected.phone
    supplier.value.address = selected.address
    supplier.value.email = selected.email
  }
}

function onMedicationCodeChange(row: MedicineRow) {
  const med = availableMeds.value.find(m => m.code === row.code)
  if (med) {
    row.name = med.name
    row.price = med.price || 1000
    calculateRowTotal(row)
  }
}

function calculateRowTotal(row: MedicineRow) {
  const basePrice = row.price * row.qty
  const discounted = basePrice * (1 - (row.discount / 100))
  const final = discounted * (1 + (row.vat / 100))
  row.total = Math.round(final)
}

function addMedicationRow() {
  const key = (medicationRows.value.length + 1).toString()
  medicationRows.value.push({
    key,
    code: '',
    name: '',
    batch: '',
    expiryDate: null,
    qty: 1,
    unit: 'Viên',
    price: 0,
    discount: 0,
    vat: 5,
    total: 0
  })
}

function removeMedicationRow(key: string) {
  medicationRows.value = medicationRows.value.filter(r => r.key !== key)
}

const totalSummary = computed(() => {
  let goodsTotal = 0
  let discountTotal = 0
  let vatTotal = 0

  medicationRows.value.forEach(row => {
    const rawTotal = row.price * row.qty
    goodsTotal += rawTotal
    
    const disc = rawTotal * (row.discount / 100)
    discountTotal += disc
    
    const withDisc = rawTotal - disc
    const tax = withDisc * (row.vat / 100)
    vatTotal += tax
  })

  return {
    goodsTotal: Math.round(goodsTotal),
    discountTotal: Math.round(discountTotal),
    vatTotal: Math.round(vatTotal),
    finalTotal: Math.round(goodsTotal - discountTotal + vatTotal)
  }
})

async function saveDraft() {
  loading.value = true
  try {
    const payload = {
      supplierCode: supplier.value.selected,
      supplierName: suppliersList.value.find(s => s.code === supplier.value.selected)?.name || '',
      date: invoice.value.date ? invoice.value.date.toISOString() : new Date().toISOString(),
      creator: invoice.value.creator === 'admin' ? 'Phạm Minh Đức' : 'Nguyễn Thị Hằng',
      note: invoice.value.note || '',
      goodsTotal: totalSummary.value.goodsTotal,
      discountTotal: totalSummary.value.discountTotal,
      vatTotal: totalSummary.value.vatTotal,
      finalTotal: totalSummary.value.finalTotal,
      status: 'draft',
      medications: medicationRows.value.map(m => ({
        code: m.code,
        name: m.name,
        batch: m.batch || 'LO01',
        expiryDate: m.expiryDate ? m.expiryDate.toISOString() : new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
        qty: m.qty,
        unit: m.unit,
        price: m.price
      }))
    }
    await createImportBill(payload)
    notif.show({ type: 'success', message: 'Đã lưu nháp phiếu nhập thuốc thành công!' })
    await loadImportBills()
    viewMode.value = 'list'
  } catch (err: any) {
    notif.show({ type: 'error', message: 'Lỗi khi lưu phiếu nhập thuốc: ' + err.message })
  } finally {
    loading.value = false
  }
}

async function submitImport() {
  if (medicationRows.value.length === 0) {
    notif.show({ type: 'error', message: 'Vui lòng thêm ít nhất một sản phẩm thuốc!' })
    return
  }
  for (const row of medicationRows.value) {
    if (!row.code || !row.name) {
      notif.show({ type: 'error', message: 'Vui lòng chọn thuốc đầy đủ cho tất cả các dòng!' })
      return
    }
  }
  
  loading.value = true
  try {
    const payload = {
      supplierCode: supplier.value.selected,
      supplierName: suppliersList.value.find(s => s.code === supplier.value.selected)?.name || '',
      date: invoice.value.date ? invoice.value.date.toISOString() : new Date().toISOString(),
      creator: invoice.value.creator === 'admin' ? 'Phạm Minh Đức' : 'Nguyễn Thị Hằng',
      note: invoice.value.note || '',
      goodsTotal: totalSummary.value.goodsTotal,
      discountTotal: totalSummary.value.discountTotal,
      vatTotal: totalSummary.value.vatTotal,
      finalTotal: totalSummary.value.finalTotal,
      status: 'completed',
      medications: medicationRows.value.map(m => ({
        code: m.code,
        name: m.name,
        batch: m.batch || 'LO01',
        expiryDate: m.expiryDate ? m.expiryDate.toISOString() : new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
        qty: m.qty,
        unit: m.unit,
        price: m.price
      }))
    }
    await createImportBill(payload)
    notif.show({ type: 'success', message: 'Hoàn tất nhập kho và cập nhật số lượng tồn kho thành công!' })
    await loadImportBills()
    viewMode.value = 'list'
  } catch (err: any) {
    notif.show({ type: 'error', message: 'Lỗi khi hoàn tất nhập kho: ' + err.message })
  } finally {
    loading.value = false
  }
}

function cancelImport() {
  notif.show({ type: 'info', message: 'Đã hủy tạo phiếu nhập' })
  viewMode.value = 'list'
}

onMounted(async () => {
  await Promise.all([
    loadSuppliers(),
    loadImportBills(),
    (async () => {
      try {
        const data = await getMedicines()
        if (data && data.length > 0) {
          availableMeds.value = data.map((item: any) => ({
            code: item.code || `MED00${item.id}`,
            name: item.name,
            price: item.purchasePrice || item.price || 1000
          }))
        } else {
          throw new Error('No medicines returned from backend')
        }
      } catch (e) {
        console.error('Failed to load medicines from backend:', e)
        availableMeds.value = []
      }
    })()
  ])
  
  // Set initial supplier if loaded
  if (suppliersList.value.length > 0) {
    const firstSup = suppliersList.value[0]
    supplier.value = {
      selected: firstSup.code,
      name: firstSup.name,
      taxCode: firstSup.taxCode || firstSup.code || '',
      phone: firstSup.phone || '',
      address: firstSup.address || '',
      email: firstSup.email || ''
    }
  }
  invoice.value.code = 'PN' + Math.floor(100000 + Math.random() * 900000).toString()
})
</script>

<style scoped>
:deep(.ant-card) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  color: #1e293b;
  font-weight: 700;
  border-bottom: 1px solid #f0f4f9;
}

:deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #f0f4f9;
}

.metric-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 0;
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.metric-title {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 2px;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.metric-sub {
  font-size: 0.75rem;
  color: #94a3b8;
}

.filter-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 14px 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
