<template>
  <a-layout :style="inline ? 'background: transparent; min-height: auto;' : 'min-height: 100vh; background: #f8fafc;'">
    <!-- Sidebar -->
    <a-layout-sider v-if="!inline" width="260" theme="light" style="background: #ffffff; border-right: 1px solid #f0f4f9;">
      <PharmacySidebar />
    </a-layout-sider>

    <!-- Main Content -->
    <a-layout :style="inline ? 'background: transparent;' : 'background: #f8fafc;'">
      <AppHeader v-if="!inline" title="Quản lý thanh toán" />

      <a-layout-content :style="inline ? 'padding: 0;' : 'padding: 24px 28px;'">

        <!-- Role-based Access Control Result -->
        <template v-if="!canManageBilling">
          <a-result
            status="403"
            title="Quyền truy cập hạn chế"
            sub-title="Màn hình giám sát thanh toán này chỉ dành cho Admin, Thu ngân hoặc Nhân viên tiếp đón."
          >
            <template #extra>
              <a-button type="primary" @click="$router.push('/pharmacy/dashboard')" style="background: #0047AB; border-color: #0047AB; border-radius: 8px;">
                <i class="fas fa-arrow-left" style="margin-right: 6px;" /> Quay lại Dashboard
              </a-button>
            </template>
          </a-result>
        </template>

        <template v-else>
          <!-- Navigation Tabs -->
          <a-tabs v-model:activeKey="activeTab" class="pay-tabs" style="margin-bottom: 16px;">
            <a-tab-pane key="list" tab="Danh sách thanh toán" />
            <a-tab-pane key="history" tab="Lịch sử thanh toán" />
            <a-tab-pane v-if="isAdmin" key="report" tab="Báo cáo thanh toán" />
          </a-tabs>

          <!-- ==================== TAB 1: Danh sách thanh toán ==================== -->
          <div v-if="activeTab === 'list'">
            <!-- Filters -->
            <div class="filter-bar">
              <a-input v-model:value="searchQuery" placeholder="Tìm theo mã HĐ hoặc tên bệnh nhân..." style="width: 280px; border-radius: 8px;" allow-clear>
                <template #prefix><i class="fas fa-search" style="color: #cbd5e1;" /></template>
              </a-input>

              <a-select v-model:value="filterStatus" style="width: 170px;" placeholder="Lọc theo trạng thái">
                <a-select-option value="all">Tất cả trạng thái</a-select-option>
                <a-select-option value="pending">Chưa thanh toán</a-select-option>
                <a-select-option value="partial">Thanh toán một phần</a-select-option>
                <a-select-option value="paid">Đã thanh toán</a-select-option>
                <a-select-option value="cancelled">Đã hủy</a-select-option>
              </a-select>

              <a-select v-model:value="filterMethod" style="width: 180px;" placeholder="Phương thức thanh toán">
                <a-select-option value="all">Tất cả phương thức</a-select-option>
                <a-select-option value="cash">Tiền mặt</a-select-option>
                <a-select-option value="transfer">Chuyển khoản</a-select-option>
                <a-select-option value="card">Thẻ ngân hàng</a-select-option>
              </a-select>

              <a-select v-model:value="filterType" style="width: 160px;" placeholder="Loại hóa đơn">
                <a-select-option value="all">Tất cả loại HĐ</a-select-option>
                <a-select-option value="Theo đơn bác sĩ">Theo đơn bác sĩ</a-select-option>
                <a-select-option value="Ngoài đơn">Ngoài đơn</a-select-option>
                <a-select-option value="Tổng hợp">Tổng hợp</a-select-option>
              </a-select>

              <a-range-picker v-model:value="filterDateRange" style="width: 250px;" format="DD/MM/YYYY" :placeholder="['Từ ngày', 'Đến ngày']" />

              <a-button @click="resetFilters" style="border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                <i class="fas fa-sync-alt" /> Làm mới
              </a-button>
            </div>

            <!-- Table + Details Panel Layout -->
            <a-row :gutter="20">
              <a-col :xs="24" :lg="selectedBill ? 15 : 24">
                <a-card :bordered="false" class="main-card">
                  <a-spin :spinning="loading">
                  <a-empty v-if="!loading && filteredBills.length === 0" description="Không có hóa đơn nào" />
                  <a-table v-if="filteredBills.length > 0"
                    :columns="listColumns"
                    :data-source="filteredBills"
                    row-key="id"
                    :pagination="{ pageSize: 8, showSizeChanger: true }"
                    size="middle"
                    :customRow="customTableRow"
                  >
                    <template #bodyCell="{ text, record, column }">
                      <template v-if="column.key === 'code'">
                        <span class="bill-code-link" @click="selectBill(record)">{{ record.code }}</span>
                      </template>
                      <template v-else-if="column.key === 'billType'">
                        <a-tag v-if="record.billType === 'Theo đơn bác sĩ'" color="blue">{{ record.billType }}</a-tag>
                        <a-tag v-else-if="record.billType === 'Ngoài đơn'" color="orange">{{ record.billType }}</a-tag>
                        <a-tag v-else color="purple">{{ record.billType }}</a-tag>
                      </template>
                      <template v-else-if="column.key === 'total'">
                        <span style="font-weight: 600;">{{ record.total.toLocaleString() }} đ</span>
                      </template>
                      <template v-else-if="column.key === 'paidAmount'">
                        <span style="font-weight: 600; color: #10b981;">{{ record.paidAmount.toLocaleString() }} đ</span>
                      </template>
                      <template v-else-if="column.key === 'remaining'">
                        <span :style="{ fontWeight: '700', color: record.remaining > 0 ? '#ef4444' : '#64748b' }">{{ record.remaining.toLocaleString() }} đ</span>
                      </template>
                      <template v-else-if="column.key === 'payStatus'">
                        <span :class="['mi-badge', getBadgeClass(record.payStatus)]">
                          {{ getStatusText(record.payStatus) }}
                        </span>
                      </template>
                      <template v-else-if="column.key === 'paidBy'">
                        <span v-if="record.paidBy">{{ record.paidBy }}</span>
                        <span v-else style="color: #cbd5e1;">–</span>
                      </template>
                      <template v-else-if="column.key === 'paidDate'">
                        <span v-if="record.paidDate">{{ record.paidDate }}</span>
                        <span v-else style="color: #cbd5e1;">–</span>
                      </template>
                      <template v-else-if="column.key === 'actions'">
                        <div style="display: flex; gap: 8px; justify-content: center;">
                          <a-tooltip title="Xem chi tiết">
                            <a-button type="text" size="small" style="color: #0047AB;" @click="selectBill(record)">
                              <i class="far fa-eye" />
                            </a-button>
                          </a-tooltip>
                          <a-tooltip title="In hóa đơn">
                            <a-button type="text" size="small" style="color: #64748b;" @click="printInvoice(record)">
                              <i class="fas fa-print" />
                            </a-button>
                          </a-tooltip>
                          <a-dropdown>
                            <a-button type="text" size="small" style="color: #64748b;"><i class="fas fa-ellipsis-v" /></a-button>
                            <template #overlay>
                              <a-menu>
                                <a-menu-item key="export"><i class="fas fa-download" style="margin-right: 6px;" /> Xuất dữ liệu</a-menu-item>
                                <a-menu-item key="history" @click="activeTab = 'history'; historySearchQuery = record.code;"><i class="fas fa-history" style="margin-right: 6px;" /> Xem lịch sử GD</a-menu-item>
                              </a-menu>
                            </template>
                          </a-dropdown>
                        </div>
                      </template>
                    </template>
                  </a-table>
                  </a-spin>
                </a-card>
              </a-col>

              <!-- Panel Chi tiết hóa đơn (Split panel on the right) -->
              <a-col :xs="24" :lg="9" v-if="selectedBill">
                <a-card :bordered="false" class="main-card detail-panel">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-weight: 700; font-size: 1.05rem; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                      <i class="fas fa-file-invoice" style="color: #0047AB;" /> Chi tiết hóa đơn
                    </div>
                    <a-button type="text" size="small" @click="selectedBill = null" style="color: #94a3b8;"><i class="fas fa-times" /></a-button>
                  </div>

                  <!-- Thông tin chung -->
                  <div class="detail-section">
                    <div class="detail-title">Thông tin chung</div>
                    <div class="detail-grid">
                      <div class="detail-row"><span class="dl">Mã hóa đơn</span><span class="dv code-blue">{{ selectedBill.code }}</span></div>
                      <div class="detail-row"><span class="dl">Bệnh nhân</span><span class="dv">{{ selectedBill.patientName }}</span></div>
                      <div class="detail-row"><span class="dl">Loại hóa đơn</span><span class="dv">{{ selectedBill.billType }}</span></div>
                      <div class="detail-row" v-if="selectedBill.prescriptionId"><span class="dl">PrescriptionId</span><span class="dv code-blue">{{ selectedBill.prescriptionId }}</span></div>
                      <div class="detail-row" v-if="selectedBill.appointmentId"><span class="dl">AppointmentId</span><span class="dv code-blue">{{ selectedBill.appointmentId }}</span></div>
                      <div class="detail-row"><span class="dl">Ngày tạo</span><span class="dv">{{ selectedBill.createdDate }}</span></div>
                      <div class="detail-row">
                        <span class="dl">Trạng thái</span>
                        <span :class="['mi-badge', getBadgeClass(selectedBill.payStatus)]">{{ getStatusText(selectedBill.payStatus) }}</span>
                      </div>
                    </div>
                  </div>

                  <a-divider style="margin: 14px 0;" />

                  <!-- Chi tiết thanh toán -->
                  <div class="detail-section">
                    <div class="detail-title">Chi tiết thanh toán</div>
                    <div class="detail-grid">
                      <div class="detail-row"><span class="dl">Tiền thuốc</span><span class="dv">{{ selectedBill.medicineCost.toLocaleString() }} đ</span></div>
                      <div class="detail-row"><span class="dl">Tiền khám</span><span class="dv">{{ selectedBill.examCost.toLocaleString() }} đ</span></div>
                      <div class="detail-row" v-if="selectedBill.discountAmt"><span class="dl">Giảm giá</span><span class="dv" style="color: #ef4444;">-{{ selectedBill.discountAmt.toLocaleString() }} đ</span></div>
                      <div class="detail-row"><span class="dl">VAT (5%)</span><span class="dv">+{{ selectedBill.vatAmt.toLocaleString() }} đ</span></div>
                      <div class="detail-row" style="margin-top: 4px; padding-top: 4px; border-top: 1px dashed #e2e8f0;">
                        <span class="dl" style="font-weight: 700; color: #0f172a;">Tổng thanh toán</span>
                        <span class="dv" style="font-weight: 800; font-size: 0.95rem; color: #0047AB;">{{ selectedBill.total.toLocaleString() }} đ</span>
                      </div>
                      <div class="detail-row"><span class="dl">Đã trả</span><span class="dv" style="color: #10b981; font-weight: 700;">{{ selectedBill.paidAmount.toLocaleString() }} đ</span></div>
                      <div class="detail-row"><span class="dl">Còn lại</span><span class="dv" style="color: #ef4444; font-weight: 700;">{{ selectedBill.remaining.toLocaleString() }} đ</span></div>
                    </div>
                  </div>

                  <a-divider style="margin: 14px 0;" />

                  <!-- Thông tin xác nhận -->
                  <div class="detail-section">
                    <div class="detail-title">Thông tin xác nhận</div>
                    <div class="detail-grid" v-if="selectedBill.paidBy">
                      <div class="detail-row"><span class="dl">Người xác nhận</span><span class="dv">{{ selectedBill.paidBy }}</span></div>
                      <div class="detail-row"><span class="dl">Vai trò</span><span class="dv">Thu ngân / Dược sĩ</span></div>
                      <div class="detail-row"><span class="dl">Thời gian</span><span class="dv">{{ selectedBill.paidDate }}</span></div>
                      <div class="detail-row">
                        <span class="dl">Phương thức</span>
                        <span class="dv">
                          <a-tag color="blue" style="font-weight: 600; margin-right: 0;">{{ getMethodLabel(selectedBill.payMethod) }}</a-tag>
                        </span>
                      </div>
                    </div>
                    <div v-else style="color: #94a3b8; font-size: 0.8rem; font-style: italic; text-align: center; padding: 6px 0;">
                      Chưa ghi nhận thông tin thanh toán
                    </div>
                  </div>

                  <!-- Xác nhận thanh toán action (for pending bills) -->
                  <div v-if="selectedBill.payStatus === 'pending'" style="margin-top: 18px; margin-bottom: 8px;">
                    <div style="margin-bottom: 10px;">
                      <div style="font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Phương thức thanh toán</div>
                      <a-select v-model:value="confirmPayMethod" style="width: 100%; border-radius: 8px;" placeholder="Chọn phương thức">
                        <a-select-option value="cash"><i class="fas fa-money-bill-wave" style="margin-right: 6px; color: #10b981;" />Tiền mặt</a-select-option>
                        <a-select-option value="transfer"><i class="fas fa-university" style="margin-right: 6px; color: #0047AB;" />Chuyển khoản</a-select-option>
                        <a-select-option value="card"><i class="fas fa-credit-card" style="margin-right: 6px; color: #f59e0b;" />Thẻ ngân hàng</a-select-option>
                        <a-select-option value="ewallet"><i class="fas fa-wallet" style="margin-right: 6px; color: #8b5cf6;" />Ví điện tử</a-select-option>
                      </a-select>
                    </div>
                    <a-button
                      type="primary"
                      block
                      size="large"
                      style="background: #10b981; border-color: #10b981; border-radius: 10px; font-weight: 700; height: 44px; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 8px;"
                      @click="confirmPayment(selectedBill)"
                    >
                      <i class="fas fa-check-circle" /> Xác nhận thanh toán
                    </a-button>
                  </div>

                  <!-- Actions (Read-only for Admin) -->
                  <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 10px; margin-top: 10px;">
                    <a-button type="primary" style="background: #0047AB; border-color: #0047AB; border-radius: 8px; font-weight: 600;" @click="viewFullDetail(selectedBill)">
                      Xem chi tiết đầy đủ
                    </a-button>
                    <a-button style="border-radius: 8px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;" @click="printInvoice(selectedBill)">
                      <i class="fas fa-print" /> In hóa đơn
                    </a-button>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </div>

          <!-- ==================== TAB 2: Lịch sử thanh toán ==================== -->
          <div v-if="activeTab === 'history'">
            <!-- Filters -->
            <div class="filter-bar">
              <a-input v-model:value="historySearchQuery" placeholder="Mã giao dịch, mã hóa đơn, bệnh nhân..." style="width: 320px; border-radius: 8px;" allow-clear>
                <template #prefix><i class="fas fa-search" style="color: #cbd5e1;" /></template>
              </a-input>

              <a-select v-model:value="historyFilterMethod" style="width: 180px;" placeholder="Phương thức thanh toán">
                <a-select-option value="all">Tất cả phương thức</a-select-option>
                <a-select-option value="cash">Tiền mặt</a-select-option>
                <a-select-option value="transfer">Chuyển khoản</a-select-option>
                <a-select-option value="card">Thẻ ngân hàng</a-select-option>
              </a-select>

              <a-select v-model:value="historyFilterStaff" style="width: 170px;" placeholder="Người xác nhận">
                <a-select-option value="all">Tất cả nhân viên</a-select-option>
                <a-select-option v-for="staff in staffList" :key="staff.name" :value="staff.name">{{ staff.name }}</a-select-option>
              </a-select>

              <a-select v-model:value="historyFilterStatus" style="width: 170px;" placeholder="Trạng thái GD">
                <a-select-option value="all">Tất cả trạng thái</a-select-option>
                <a-select-option value="Thành công">Thành công</a-select-option>
                <a-select-option value="Thất bại">Thất bại</a-select-option>
              </a-select>

              <a-range-picker v-model:value="historyFilterDateRange" style="width: 250px;" format="DD/MM/YYYY" :placeholder="['Từ ngày', 'Đến ngày']" />

              <a-button @click="resetHistoryFilters" style="border-radius: 8px; font-weight: 600;">
                Đặt lại
              </a-button>
            </div>

            <!-- Table + Details Panel Layout -->
            <a-row :gutter="20">
              <a-col :xs="24" :lg="selectedTransaction ? 15 : 24">
                <a-card :bordered="false" class="main-card">
                  <a-spin :spinning="loading">
                  <a-empty v-if="!loading && filteredTransactions.length === 0" description="Không có giao dịch nào" />
                  <a-table v-if="filteredTransactions.length > 0"
                    :columns="historyListColumns"
                    :data-source="filteredTransactions"
                    row-key="id"
                    :pagination="{ pageSize: 8, showSizeChanger: true, locale: { items_per_page: '/ trang' } }"
                    size="middle"
                    :row-class-name="(record: any) => record.id === selectedTransaction?.id ? 'selected-row' : ''"
                  >
                    <template #bodyCell="{ text, record, column }">
                      <template v-if="column.key === 'txCode'">
                        <span class="bill-code-link" @click="selectTransaction(record)">{{ record.txCode }}</span>
                      </template>
                      <template v-else-if="column.key === 'billCode'">
                        <span style="font-weight: 700; color: #64748b;">{{ record.billCode }}</span>
                      </template>
                      <template v-else-if="column.key === 'amount'">
                        <span style="font-weight: 700; color: #1e293b;">{{ record.amount.toLocaleString() }} đ</span>
                      </template>
                      <template v-else-if="column.key === 'payMethod'">
                        <span>{{ getMethodLabel(record.payMethod) }}</span>
                      </template>
                      <template v-else-if="column.key === 'txStatus'">
                        <a-tag :color="record.txStatus === 'Thành công' ? 'success' : 'error'" style="font-weight: 700; border-radius: 4px;">{{ record.txStatus }}</a-tag>
                      </template>
                      <template v-else-if="column.key === 'actions'">
                        <div style="display: flex; gap: 8px; justify-content: center;">
                          <a-tooltip title="Xem chi tiết giao dịch">
                            <a-button type="text" size="small" style="color: #0047AB;" @click="selectTransaction(record)">
                              <i class="far fa-eye" />
                            </a-button>
                          </a-tooltip>
                          <a-tooltip title="In biên nhận">
                            <a-button type="text" size="small" style="color: #64748b;" @click="printReceipt(record)">
                              <i class="fas fa-print" />
                            </a-button>
                          </a-tooltip>
                        </div>
                      </template>
                    </template>
                  </a-table>
                  </a-spin>
                </a-card>
              </a-col>

              <!-- Panel Chi tiết giao dịch -->
              <a-col :xs="24" :lg="9" v-if="selectedTransaction">
                <a-card :bordered="false" class="main-card detail-panel">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-weight: 700; font-size: 1.05rem; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                      <i class="fas fa-receipt" style="color: #10b981;" /> Chi tiết giao dịch
                    </div>
                    <a-button type="text" size="small" @click="selectedTransaction = null" style="color: #94a3b8;"><i class="fas fa-times" /></a-button>
                  </div>

                  <div class="detail-section">
                    <div class="detail-grid">
                      <div class="detail-row"><span class="dl">Mã giao dịch</span><span class="dv code-blue">{{ selectedTransaction.txCode }}</span></div>
                      <div class="detail-row"><span class="dl">Mã hóa đơn</span><span class="dv">{{ selectedTransaction.billCode }}</span></div>
                      <div class="detail-row"><span class="dl">Bệnh nhân</span><span class="dv">{{ selectedTransaction.patientName }}</span></div>
                      <div class="detail-row"><span class="dl">Số tiền</span><span class="dv" style="font-weight: 800; color: #10b981; font-size: 1.1rem;">{{ selectedTransaction.amount.toLocaleString() }} đ</span></div>
                      <div class="detail-row"><span class="dl">Phương thức</span><span class="dv">{{ getMethodLabel(selectedTransaction.payMethod) }}</span></div>
                      <div class="detail-row"><span class="dl">Người xác nhận</span><span class="dv">{{ selectedTransaction.staffName }}</span></div>
                      <div class="detail-row"><span class="dl">Vai trò</span><span class="dv">{{ selectedTransaction.role }}</span></div>
                      <div class="detail-row"><span class="dl">Thời gian</span><span class="dv">{{ selectedTransaction.time }}</span></div>
                      <div class="detail-row">
                        <span class="dl">Trạng thái</span>
                        <a-tag :color="selectedTransaction.txStatus === 'Thành công' ? 'success' : 'error'">{{ selectedTransaction.txStatus }}</a-tag>
                      </div>
                      <div class="detail-row" v-if="selectedTransaction.note"><span class="dl">Ghi chú</span><span class="dv" style="font-style: italic; color: #64748b;">{{ selectedTransaction.note }}</span></div>
                    </div>
                  </div>

                  <!-- Related Payments history (if bill had multiple transactions) -->
                  <a-divider style="margin: 14px 0;" />
                  <div class="detail-section" v-if="getRelatedTransactions(selectedTransaction.billCode).length > 1">
                    <div class="detail-title">Lịch sử thanh toán của hóa đơn</div>
                    <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                      <div v-for="(tx, idx) in getRelatedTransactions(selectedTransaction.billCode)" :key="tx.id" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 0.8rem;">
                        <div>
                          <div style="font-weight: 700; color: #475569;">Lần {{ idx + 1 }} - {{ tx.txCode }}</div>
                          <div style="color: #94a3b8; font-size: 0.72rem;">{{ tx.time }}</div>
                        </div>
                        <div style="text-align: right;">
                          <div style="font-weight: 700; color: #10b981;">+{{ tx.amount.toLocaleString() }} đ</div>
                          <div style="font-size: 0.72rem; color: #64748b;">{{ getMethodLabel(tx.payMethod) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style="display: flex; justify-content: flex-end; margin-top: 22px;">
                    <a-button style="border-radius: 8px; font-weight: 600;" @click="printReceipt(selectedTransaction)">
                      <i class="fas fa-print" style="margin-right: 6px;" /> In biên nhận giao dịch
                    </a-button>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </div>

          <!-- ==================== TAB 3: Báo cáo thanh toán ==================== -->
          <div v-if="activeTab === 'report'">
            <!-- Report filters -->
            <div class="filter-bar" style="margin-bottom: 24px;">
              <span style="font-weight: 600; color: #475569; font-size: 0.85rem;">Chọn khoảng thời gian báo cáo:</span>
              <a-range-picker v-model:value="reportDateRange" style="width: 260px;" format="DD/MM/YYYY" />
              <a-button type="primary" style="background: #0047AB; border-color: #0047AB; border-radius: 8px;" @click="applyReportFilter">
                Lọc dữ liệu
              </a-button>
              <a-button style="border-radius: 8px; display: flex; align-items: center; gap: 6px;" @click="exportReport('Excel')">
                <i class="far fa-file-excel" style="color: #10b981;" /> Xuất Excel
              </a-button>
              <a-button style="border-radius: 8px; display: flex; align-items: center; gap: 6px;" @click="exportReport('PDF')">
                <i class="far fa-file-pdf" style="color: #ef4444;" /> Xuất PDF
              </a-button>
            </div>

            <!-- Stats Metric Cards -->
            <a-row :gutter="[20, 20]" style="margin-bottom: 24px;">
              <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
                <div class="stat-card shadow-light">
                  <div class="stat-icon-pay" style="background: #eff6ff; color: #0047AB;">
                    <i class="fas fa-money-bill-wave" />
                  </div>
                  <div class="stat-body">
                    <span class="lbl">Tổng doanh thu</span>
                    <strong class="val" style="color: #0047AB;">{{ totalRevenue.toLocaleString() }} đ</strong>
                  </div>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
                <div class="stat-card shadow-light">
                  <div class="stat-icon-pay" style="background: #eff6ff; color: #3b82f6;">
                    <i class="fas fa-file-invoice" />
                  </div>
                  <div class="stat-body">
                    <span class="lbl">Tổng số hóa đơn</span>
                    <strong class="val">{{ totalBillsCount }}</strong>
                  </div>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
                <div class="stat-card shadow-light">
                  <div class="stat-icon-pay" style="background: #ecfdf5; color: #10b981;">
                    <i class="fas fa-check-circle" />
                  </div>
                  <div class="stat-body">
                    <span class="lbl">Đã thanh toán</span>
                    <strong class="val" style="color: #10b981;">{{ paidBillsCount }}</strong>
                  </div>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
                <div class="stat-card shadow-light">
                  <div class="stat-icon-pay" style="background: #fef2f2; color: #ef4444;">
                    <i class="fas fa-clock" />
                  </div>
                  <div class="stat-body">
                    <span class="lbl">Chưa thanh toán</span>
                    <strong class="val" style="color: #ef4444;">{{ unpaidBillsCount }}</strong>
                  </div>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
                <div class="stat-card shadow-light">
                  <div class="stat-icon-pay" style="background: #fff7ed; color: #ea580c;">
                    <i class="fas fa-hourglass-half" />
                  </div>
                  <div class="stat-body">
                    <span class="lbl">Thanh toán 1 phần</span>
                    <strong class="val" style="color: #ea580c;">{{ partialBillsCount }}</strong>
                  </div>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
                <div class="stat-card shadow-light">
                  <div class="stat-icon-pay" style="background: #fffbeb; color: #f59e0b;">
                    <i class="fas fa-wallet" />
                  </div>
                  <div class="stat-body">
                    <span class="lbl">Còn phải thu</span>
                    <strong class="val" style="color: #f59e0b;">{{ remainingRevenue.toLocaleString() }} đ</strong>
                  </div>
                </div>
              </a-col>
            </a-row>

            <!-- Custom Graphic SVG Dashboard Panels -->
            <a-row :gutter="20">
              <!-- SVG chart: Doanh thu theo ngày -->
              <a-col :xs="24" :lg="12">
                <a-card :bordered="false" class="main-card report-chart-card" title="Doanh thu theo ngày (Tuần này)">
                  <div style="padding: 10px 0; height: 260px; display: flex; align-items: flex-end; justify-content: space-around;">
                    <div v-for="day in dailyRevenueData" :key="day.day" style="display: flex; flex-direction: column; align-items: center; width: 12%;">
                      <span style="font-size: 0.72rem; font-weight: 700; color: #475569; margin-bottom: 4px;">{{ day.val }}M</span>
                      <div :style="{ height: `${day.height}px`, background: '#0047AB', width: '30px', borderRadius: '6px 6px 0 0', transition: 'height 0.4s' }"></div>
                      <span style="font-size: 0.78rem; font-weight: 600; color: #64748b; margin-top: 6px;">{{ day.day }}</span>
                    </div>
                  </div>
                </a-card>
              </a-col>

              <!-- SVG chart: Doanh thu theo phương thức & Tỷ lệ trạng thái -->
              <a-col :xs="24" :lg="12">
                <a-row :gutter="[0, 20]">
                  <a-col :span="24">
                    <a-card :bordered="false" class="main-card report-chart-card" title="Tỷ lệ doanh thu theo phương thức">
                      <div style="display: flex; align-items: center; justify-content: space-around; height: 100px;">
                        <!-- SVG Donut Chart -->
                        <div style="position: relative; width: 80px; height: 80px;">
                          <svg viewBox="0 0 36 36" style="width: 100%; height: 100%;">
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" stroke-width="4.2" />
                            <!-- Tiền mặt: 50% -->
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" stroke-width="4.2" stroke-dasharray="50 50" stroke-dashoffset="25" />
                            <!-- Chuyển khoản: 35% -->
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" stroke-width="4.2" stroke-dasharray="35 65" stroke-dashoffset="-25" />
                            <!-- Thẻ: 15% -->
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" stroke-width="4.2" stroke-dasharray="15 85" stroke-dashoffset="-60" />
                          </svg>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 14px; flex: 1; margin-left: 20px;">
                          <div class="legend-dot-item"><span class="dot-c" style="background: #3b82f6;" /> Tiền mặt (50%)</div>
                          <div class="legend-dot-item"><span class="dot-c" style="background: #10b981;" /> Chuyển khoản (35%)</div>
                          <div class="legend-dot-item"><span class="dot-c" style="background: #f59e0b;" /> Thẻ ngân hàng (15%)</div>
                        </div>
                      </div>
                    </a-card>
                  </a-col>

                  <a-col :span="24">
                    <a-card :bordered="false" class="main-card report-chart-card" title="Tỷ lệ trạng thái hóa đơn">
                      <div style="display: flex; flex-direction: column; gap: 10px; padding: 4px 0;">
                        <div>
                          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 600; margin-bottom: 4px; color: #475569;">
                            <span>Đã thanh toán (12 HĐ)</span>
                            <span>50%</span>
                          </div>
                          <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                            <div style="width: 50%; height: 100%; background: #10b981; border-radius: 4px;" />
                          </div>
                        </div>
                        <div>
                          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 600; margin-bottom: 4px; color: #475569;">
                            <span>Chưa thanh toán (8 HĐ)</span>
                            <span>33%</span>
                          </div>
                          <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                            <div style="width: 33%; height: 100%; background: #ef4444; border-radius: 4px;" />
                          </div>
                        </div>
                        <div>
                          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 600; margin-bottom: 4px; color: #475569;">
                            <span>Thanh toán một phần (4 HĐ)</span>
                            <span>17%</span>
                          </div>
                          <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                            <div style="width: 17%; height: 100%; background: #ea580c; border-radius: 4px;" />
                          </div>
                        </div>
                      </div>
                    </a-card>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </div>
        </template>
      </a-layout-content>
    </a-layout>
  </a-layout>

  <!-- Complete Full Invoice Detail Modal dialog -->
  <a-modal v-model:open="detailModalVisible" title="Thông tin chi tiết hóa đơn điện tử" width="1000px">
    <div v-if="selectedBillDetail" style="padding: 10px 0; max-height: 70vh; overflow-y: auto;">
      
      <!-- Phần 1: Thông tin hóa đơn -->
      <div class="detail-section">
        <h4 class="section-title">
          <i class="fas fa-file-invoice icon-val" style="vertical-align: middle;" />
          <span style="vertical-align: middle; margin-left: 6px;">Thông tin hóa đơn</span>
        </h4>
        <div class="info-grid">
          <div class="info-item"><strong>Mã hóa đơn:</strong> <span class="code-blue">{{ selectedBillDetail.code }}</span></div>
          <div class="info-item"><strong>Loại hóa đơn:</strong> <span style="font-weight: 600; color: #0f172a;">{{ selectedBillDetail.billType }}</span></div>
          <div class="info-item"><strong>Ngày tạo:</strong> {{ selectedBillDetail.createdDate }}</div>
          <div class="info-item"><strong>Trạng thái:</strong> 
            <span :class="['mi-badge', getBadgeClass(selectedBillDetail.payStatus)]">{{ getStatusText(selectedBillDetail.payStatus) }}</span>
          </div>
          <div class="info-item"><strong>PrescriptionId:</strong> {{ selectedBillDetail.prescriptionId || '–' }}</div>
          <div class="info-item"><strong>AppointmentId:</strong> {{ selectedBillDetail.appointmentId || '–' }}</div>
          <div class="info-item"><strong>Người tạo:</strong> {{ selectedBillDetail.paidBy || 'Thu ngân hệ thống' }}</div>
          <div class="info-item"><strong>Người xác nhận:</strong> {{ selectedBillDetail.payStatus === 'paid' || selectedBillDetail.payStatus === 'partial' ? (selectedBillDetail.paidBy || 'Thu ngân hệ thống') : '–' }}</div>
        </div>
      </div>

      <!-- Phần 2: Thông tin bệnh nhân -->
      <div class="detail-section">
        <h4 class="section-title">
          <i class="fas fa-user icon-val" style="vertical-align: middle;" />
          <span style="vertical-align: middle; margin-left: 6px;">Thông tin bệnh nhân</span>
        </h4>
        <div class="info-grid three-cols">
          <div class="info-item"><strong>Mã bệnh nhân:</strong> {{ selectedBillDetail.patientCode || '–' }}</div>
          <div class="info-item"><strong>Họ tên:</strong> <span style="font-weight: 600; color: #0f172a;">{{ selectedBillDetail.patientName }}</span></div>
          <div class="info-item"><strong>Số điện thoại:</strong> {{ selectedBillDetail.patientPhone || '–' }}</div>
          <div class="info-item"><strong>Giới tính:</strong> {{ selectedBillDetail.patientGender || '–' }}</div>
          <div class="info-item"><strong>Ngày sinh:</strong> {{ selectedBillDetail.patientDob || '–' }}</div>
        </div>
      </div>

      <!-- Phần 3: Thông tin lịch khám (chỉ hiển thị cho 'Ngoài đơn' và 'Tổng hợp' hoặc khi có appointmentId) -->
      <div v-if="selectedBillDetail.appointmentId && (selectedBillDetail.billType === 'Ngoài đơn' || selectedBillDetail.billType === 'Tổng hợp')" class="detail-section">
        <h4 class="section-title">
          <i class="fas fa-calendar-alt icon-val" style="vertical-align: middle;" />
          <span style="vertical-align: middle; margin-left: 6px;">Thông tin lịch khám</span>
        </h4>
        <div class="info-grid">
          <div class="info-item"><strong>AppointmentId:</strong> {{ selectedBillDetail.appointmentId }}</div>
          <div class="info-item"><strong>Bác sĩ khám:</strong> {{ selectedBillDetail.appointmentDoctor || '–' }}</div>
          <div class="info-item"><strong>Dịch vụ khám:</strong> {{ selectedBillDetail.appointmentService || '–' }}</div>
          <div class="info-item"><strong>Ngày khám:</strong> {{ selectedBillDetail.appointmentDate || '–' }}</div>
          <div class="info-item"><strong>Phí khám:</strong> <span class="price-val" style="font-weight: 600;">{{ (selectedBillDetail.appointmentFee || 0).toLocaleString() }} đ</span></div>
        </div>
      </div>

      <!-- Phần 4: Thông tin đơn thuốc (chỉ hiển thị cho 'Theo đơn bác sĩ' và 'Tổng hợp' hoặc khi có prescriptionId) -->
      <div v-if="selectedBillDetail.prescriptionId && (selectedBillDetail.billType === 'Theo đơn bác sĩ' || selectedBillDetail.billType === 'Tổng hợp')" class="detail-section">
        <h4 class="section-title">
          <i class="fas fa-file-prescription icon-val" style="vertical-align: middle;" />
          <span style="vertical-align: middle; margin-left: 6px;">Thông tin đơn thuốc</span>
        </h4>
        <div class="info-grid">
          <div class="info-item"><strong>PrescriptionId:</strong> {{ selectedBillDetail.prescriptionId }}</div>
          <div class="info-item"><strong>Bác sĩ kê đơn:</strong> {{ selectedBillDetail.prescriptionDoctor || '–' }}</div>
          <div class="info-item"><strong>Ngày kê đơn:</strong> {{ selectedBillDetail.prescriptionDate || '–' }}</div>
          <div class="info-item"><strong>Chẩn đoán:</strong> {{ selectedBillDetail.prescriptionDiagnosis || '–' }}</div>
          <div class="info-item" style="grid-column: span 2;"><strong>Ghi chú đơn thuốc:</strong> {{ selectedBillDetail.prescriptionNote || '–' }}</div>
        </div>
      </div>

      <!-- Phần 5: Danh sách thuốc trong đơn (chỉ hiển thị cho 'Theo đơn bác sĩ' và 'Tổng hợp') -->
      <div v-if="selectedBillDetail.billType === 'Theo đơn bác sĩ' || selectedBillDetail.billType === 'Tổng hợp'" class="detail-section">
        <h4 class="section-title">
          <i class="fas fa-pills icon-val" style="vertical-align: middle;" />
          <span style="vertical-align: middle; margin-left: 6px;">Danh sách thuốc trong đơn</span>
        </h4>
        <div v-if="selectedBillDetail.medicineItems && selectedBillDetail.medicineItems.length > 0" class="table-container">
          <table class="detail-table">
            <thead>
              <tr>
                <th style="width: 50px; text-align: center;">STT</th>
                <th>Tên thuốc</th>
                <th>Hoạt chất</th>
                <th style="width: 80px; text-align: center;">Số lượng</th>
                <th style="width: 80px; text-align: center;">Đơn vị</th>
                <th>Liều dùng</th>
                <th style="width: 100px; text-align: right;">Đơn giá</th>
                <th style="width: 120px; text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in selectedBillDetail.medicineItems" :key="item.id">
                <td style="text-align: center;">{{ idx + 1 }}</td>
                <td style="font-weight: 600; color: #1e293b;">{{ item.name }}</td>
                <td style="color: #64748b; font-style: italic;">{{ item.activeIngredient || '–' }}</td>
                <td style="text-align: center; font-weight: 600; color: #0047AB;">{{ item.quantity }}</td>
                <td style="text-align: center;">{{ item.unit }}</td>
                <td style="font-size: 0.8rem; color: #475569;">{{ item.dosage || '–' }}</td>
                <td style="text-align: right;">{{ item.unitPrice.toLocaleString() }} đ</td>
                <td style="text-align: right; font-weight: 600; color: #0f172a;">{{ item.lineTotal.toLocaleString() }} đ</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-section-message">
          Chưa có dữ liệu thuốc
        </div>
      </div>

      <!-- Phần 6: Bảng chi tiết giá tiền -->
      <div class="detail-section">
        <h4 class="section-title">
          <i class="fas fa-file-invoice-dollar icon-val" style="vertical-align: middle;" />
          <span style="vertical-align: middle; margin-left: 6px;">Bảng chi tiết giá tiền</span>
        </h4>
        <div class="price-summary-box">
          <div class="price-row">
            <span class="price-label">Tiền thuốc:</span>
            <span class="price-val-bold">{{ selectedBillDetail.medicineCost.toLocaleString() }} đ</span>
          </div>
          <div class="price-row">
            <span class="price-label">Tiền dịch vụ khám bệnh:</span>
            <span class="price-val-bold">{{ selectedBillDetail.examCost.toLocaleString() }} đ</span>
          </div>
          <div class="price-row">
            <span class="price-label">Chiết khấu giảm giá:</span>
            <span class="price-val-bold discount-text">-{{ selectedBillDetail.discountAmt.toLocaleString() }} đ</span>
          </div>
          <div class="price-row">
            <span class="price-label">Thuế VAT (5%):</span>
            <span class="price-val-bold">+{{ selectedBillDetail.vatAmt.toLocaleString() }} đ</span>
          </div>
          <a-divider style="margin: 10px 0; border-color: #e2e8f0;" />
          <div class="price-row total-row">
            <span class="total-label">TỔNG THANH TOÁN:</span>
            <span class="total-val">{{ selectedBillDetail.total.toLocaleString() }} đ</span>
          </div>
          <div class="price-row sub-row">
            <span class="price-label">Số tiền đã thanh toán:</span>
            <span class="paid-val">{{ selectedBillDetail.paidAmount.toLocaleString() }} đ</span>
          </div>
          <div class="price-row sub-row">
            <span class="price-label">Số tiền còn lại phải thu:</span>
            <span :class="[selectedBillDetail.remaining > 0 ? 'remaining-val-red' : 'remaining-val']">
              {{ selectedBillDetail.remaining.toLocaleString() }} đ
            </span>
          </div>
        </div>
      </div>

      <!-- Phần 7: Lịch sử thanh toán -->
      <div class="detail-section">
        <h4 class="section-title">
          <i class="fas fa-history icon-val" style="vertical-align: middle;" />
          <span style="vertical-align: middle; margin-left: 6px;">Lịch sử thanh toán</span>
        </h4>
        <div v-if="getRelatedTransactions(selectedBillDetail.code).length > 0" class="table-container">
          <table class="detail-table text-small">
            <thead>
              <tr>
                <th>Mã giao dịch</th>
                <th style="text-align: right; width: 120px;">Số tiền</th>
                <th style="width: 130px;">Phương thức</th>
                <th>Người xác nhận</th>
                <th>Vai trò</th>
                <th>Thời gian</th>
                <th>Ghi chú</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tx in getRelatedTransactions(selectedBillDetail.code)" :key="tx.id">
                <td class="code-blue">{{ tx.txCode }}</td>
                <td style="text-align: right; font-weight: 600; color: #10b981;">{{ tx.amount.toLocaleString() }} đ</td>
                <td>{{ getMethodLabel(tx.payMethod) }}</td>
                <td>{{ tx.staffName }}</td>
                <td>{{ tx.role }}</td>
                <td>{{ tx.time }}</td>
                <td style="color: #64748b; font-size: 0.8rem;">{{ tx.note }}</td>
                <td>
                  <span :class="['mi-badge', tx.txStatus === 'Thành công' ? 'mi-badge-paid' : 'mi-badge-cancelled']">
                    {{ tx.txStatus }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-section-message">
          Chưa có giao dịch thanh toán
        </div>
      </div>

    </div>
    
    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 8px;">
        <a-button @click="printInvoiceDetail" type="primary" style="background-color: #0047AB; border-color: #0047AB; display: flex; align-items: center; gap: 6px;">
          <i class="fas fa-print" style="font-size: 14px;" />
          In hóa đơn
        </a-button>
        <a-button @click="detailModalVisible = false">Đóng</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import PharmacySidebar from '@/components/PharmacySidebar.vue';
import AppHeader from '@/components/AppHeader.vue';
import { useAuthStore } from '@/stores/authStore';
import { getBills, payBill, getPrescriptions } from '@/services/pharmacyService';
import { medicalRecordService, mapUserIdToGuid } from '@/services/medicalRecordService';

const props = withDefaults(
  defineProps<{
    inline?: boolean
  }>(),
  {
    inline: false
  }
)

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const loading = ref(false);

interface PaymentTransaction {
  id: number;
  txCode: string;
  billCode: string;
  patientName: string;
  amount: number;
  payMethod: string;
  staffName: string;
  role: string;
  time: string;
  note?: string;
  txStatus: 'Thành công' | 'Thất bại';
}

const transactionsList = ref<PaymentTransaction[]>([]);

// Check if admin role
const isAdmin = computed(() => {
  const role = (authStore.user.value?.role || '').toLowerCase();
  return role === 'admin';
});

// Check if role is allowed to view billing management/history
const canManageBilling = computed(() => {
  const role = (authStore.user.value?.role || '').toLowerCase();
  return role === 'admin' || role === 'receptionist' || role === 'cashier';
});

// Active Tab Control
const activeTab = ref<'list' | 'history' | 'report'>('list');

const activeTabLabel = computed(() => {
  switch (activeTab.value) {
    case 'list': return 'Danh sách thanh toán';
    case 'history': return 'Lịch sử thanh toán';
    case 'report': return 'Báo cáo thanh toán';
    default: return 'Danh sách thanh toán';
  }
});

// Staff list
const STAFF_LIST = [
  { id: 1, name: 'Lê Thị Mai' },
  { id: 2, name: 'Nguyễn Văn D' },
  { id: 3, name: 'Admin' },
];
const staffList = STAFF_LIST;

// ----------------------------------------
// MOCK DATA STRUCTURES FOR BILLS (Tab 1)
// ----------------------------------------
interface MedicineItem {
  id: string;
  name: string;
  activeIngredient?: string;
  quantity: number;
  unit: string;
  dosage?: string;
  unitPrice: number;
  lineTotal: number;
}

interface AdminPayBill {
  id: number;
  code: string;
  patientName: string;
  patientPhone: string;
  billType: string;
  total: number;
  paidAmount: number;
  remaining: number;
  medicineCost: number;
  examCost: number;
  discountAmt: number;
  vatAmt: number;
  payStatus: 'pending' | 'partial' | 'paid' | 'cancelled';
  payMethod: string;
  paidBy: string;
  createdDate: string;
  paidDate: string;
  
  patientCode?: string;
  patientGender?: string;
  patientDob?: string;

  appointmentId?: string;
  appointmentDoctor?: string;
  appointmentService?: string;
  appointmentFee?: number;
  appointmentDate?: string;

  prescriptionId?: string;
  prescriptionDoctor?: string;
  prescriptionDate?: string;
  prescriptionDiagnosis?: string;
  prescriptionNote?: string;

  medicineItems?: MedicineItem[];
}

const payBills = ref<AdminPayBill[]>([]);

function getActiveIngredient(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('paracetamol')) return 'Paracetamol';
  if (n.includes('amoxicillin')) return 'Amoxicillin';
  if (n.includes('vitamin c')) return 'Acid Ascorbic';
  if (n.includes('decolgen')) return 'Acetaminophen, Phenylephrine, Chlorpheniramine';
  if (n.includes('panadol')) return 'Paracetamol, Caffeine';
  if (n.includes('ibuprofen')) return 'Ibuprofen';
  if (n.includes('omeprazole')) return 'Omeprazole';
  if (n.includes('cetirizine')) return 'Cetirizine Hydrochloride';
  if (n.includes('gaviscon')) return 'Sodium Alginate, Calcium Carbonate';
  if (n.includes('salbutamol')) return 'Salbutamol';
  return 'Đang cập nhật';
}

async function initBills() {
  loading.value = true;
  try {
    const [billsData, presData, patientsData] = await Promise.all([
      getBills().catch(() => []),
      getPrescriptions().catch(() => []),
      medicalRecordService.getAllPatients().catch(() => [])
    ]);

    const patientMap = new Map<string, any>();
    (patientsData || []).forEach((p: any) => {
      if (p.id) {
        patientMap.set(p.id.toLowerCase(), p);
      }
    });

    payBills.value = (billsData || []).map((b: any, idx: number) => {
      const billType = b.examinationFee > 0 ? 'Tổng hợp' : 'Theo đơn bác sĩ';
      const total = b.totalAmount || 0;
      const discountAmt = 0;
      const vatAmt = 0;

      const medicineCost = b.medicineFee || 0;
      const examCost = b.examinationFee || 0;
      
      let paidAmount = 0;
      let payStatus = b.status?.toLowerCase() === 'paid' ? 'paid' : b.status?.toLowerCase() === 'cancelled' ? 'cancelled' : 'pending';
      let payMethod = '';
      let paidDate = '';

      if (payStatus === 'paid') {
        paidAmount = total;
        payMethod = 'cash';
        paidDate = b.createdAt ? new Date(b.createdAt).toLocaleString('vi-VN') : '';
      }

      const createdDateFull = b.createdAt ? new Date(b.createdAt).toLocaleString('vi-VN') : 'Vừa xong';
      
      const patientGuid = mapUserIdToGuid(b.patientId);
      const patientProfile = patientMap.get(patientGuid);
      
      const patientName = patientProfile ? patientProfile.fullName : `Bệnh nhân #${b.patientId}`;
      const patientGender = patientProfile ? (patientProfile.gender === 'male' || patientProfile.gender === 'Nam' ? 'Nam' : 'Nữ') : 'Nam';
      const patientDob = patientProfile && patientProfile.dateOfBirth 
        ? new Date(patientProfile.dateOfBirth).toLocaleDateString('vi-VN') 
        : '01/01/1990';
      const patientCode = `PT${String(b.patientId || 5).padStart(5, '0')}`;

      const hasAppointment = b.appointmentId ? true : false;
      const appointmentId = b.appointmentId;
      const appointmentDoctor = hasAppointment ? 'Bác sĩ điều trị' : undefined;
      const appointmentService = hasAppointment ? 'Dịch vụ khám bệnh' : undefined;
      const appointmentFee = b.examinationFee;
      const appointmentDate = b.createdAt ? new Date(b.createdAt).toLocaleDateString('vi-VN') : undefined;

      const prescriptionId = b.prescriptionId ? `PRC${String(b.prescriptionId).padStart(5, '0')}` : undefined;
      const prescriptionDoctor = 'Bác sĩ điều trị';
      const prescriptionDate = b.createdAt ? new Date(b.createdAt).toLocaleDateString('vi-VN') : undefined;
      const prescriptionDiagnosis = 'Chẩn đoán lâm sàng';
      const prescriptionNote = 'Theo dõi và tái khám';

      // Look up prescription details from presData or localStorage
      let medicineItems: any[] = [];
      const storedItemsStr = localStorage.getItem(`bill_items_${b.id}`);
      if (storedItemsStr) {
        try {
          const parsed = JSON.parse(storedItemsStr);
          medicineItems = parsed.map((m: any, medIdx: number) => ({
            id: `MED_ITEM_${idx}_${medIdx}`,
            name: m.name,
            activeIngredient: getActiveIngredient(m.name),
            quantity: m.qty,
            unit: m.form || 'Viên',
            dosage: m.dosage || 'Theo chỉ dẫn',
            unitPrice: m.price || 1000,
            lineTotal: m.total || (m.price * m.qty)
          }));
        } catch (e) {
          medicineItems = [];
        }
      }

      if (medicineItems.length === 0) {
        const foundPres = (presData || []).find((p: any) => p.id === b.prescriptionId || p.code === b.prescriptionId);
        if (foundPres && foundPres.medications) {
          medicineItems = foundPres.medications.map((m: any, medIdx: number) => {
            return {
              id: `MED_ITEM_${idx}_${medIdx}`,
              name: m.name,
              activeIngredient: getActiveIngredient(m.name),
              quantity: m.qty,
              unit: 'Viên',
              dosage: m.dosage || 'Theo chỉ dẫn',
              unitPrice: m.price || 10000,
              lineTotal: (m.price || 10000) * m.qty
            };
          });
        }
      }

      if (medicineItems.length === 0 && medicineCost > 0) {
        medicineItems = [{
          id: `MED_ITEM_${idx}_0`,
          name: 'Thuốc điều trị / Vật tư y tế',
          activeIngredient: 'Đang cập nhật',
          quantity: 1,
          unit: 'Gói',
          dosage: 'Theo chỉ dẫn của bác sĩ',
          unitPrice: medicineCost,
          lineTotal: medicineCost
        }];
      }

      return {
        id: b.id,
        code: b.code || `INV${String(b.id).padStart(8, '0')}`,
        patientName: patientName,
        patientPhone: patientProfile ? patientProfile.phone || '0901234567' : '0901234567',
        billType,
        total,
        paidAmount,
        remaining: total - paidAmount,
        medicineCost,
        examCost,
        discountAmt,
        vatAmt,
        payStatus,
        payMethod,
        paidBy: b.paidBy || (payStatus === 'paid' ? 'Thu ngân hệ thống' : ''),
        createdDate: createdDateFull,
        paidDate,
        
        patientCode,
        patientGender,
        patientDob,
        
        appointmentId,
        appointmentDoctor,
        appointmentService,
        appointmentFee,
        appointmentDate,
        
        prescriptionId,
        prescriptionDoctor,
        prescriptionDate,
        prescriptionDiagnosis,
        prescriptionNote,
        medicineItems
      };
    });

    // Initialize transactions from bills
    const tList: PaymentTransaction[] = [];
    let txId = 1;

    payBills.value.forEach((bill) => {
      if (bill.payStatus === 'paid') {
        tList.push({
          id: txId++,
          txCode: `TX${String(15049 + txId).padStart(6, '0')}`,
          billCode: bill.code,
          patientName: bill.patientName,
          amount: bill.total,
          payMethod: bill.payMethod || 'cash',
          staffName: bill.paidBy || 'Thu ngân hệ thống',
          role: 'Thu ngân',
          time: bill.paidDate || bill.createdDate,
          note: 'Thanh toán hoàn tất hóa đơn',
          txStatus: 'Thành công',
        });
      }
    });
    transactionsList.value = tList;

  } catch (err: any) {
    message.error('Lỗi tải dữ liệu thanh toán: ' + err.message);
  } finally {
    loading.value = false;
  }
}

function initTransactions() {
  // handled in initBills
}

function idxOf(id: number) {
  return payBills.value.findIndex(b => b.id === id);
}

// Route ↔ Tab synchronization
function getTabFromRoute(path: string): 'list' | 'history' | 'report' {
  if (path.endsWith('/history')) return 'history';
  if (path.endsWith('/report')) return 'report';
  return 'list'; // default for /payments, /payments/list, or any unknown sub-path
}

function getRouteFromTab(tab: string): string {
  switch (tab) {
    case 'history': return '/pharmacy/payments/history';
    case 'report': return '/pharmacy/payments/report';
    default: return '/pharmacy/payments/list';
  }
}

onMounted(() => {
  initBills();
  initTransactions();

  // Sync initial tab from current route
  const initialTab = getTabFromRoute(route.path);
  if (initialTab === 'report' && !isAdmin.value) {
    activeTab.value = 'list';
    router.replace('/pharmacy/payments/list');
  } else {
    activeTab.value = initialTab;
  }
});

// When tab changes, update the route
watch(activeTab, (newTab) => {
  const targetPath = getRouteFromTab(newTab);
  if (route.path !== targetPath) {
    router.replace(targetPath);
  }
});

// When route changes externally (e.g. sidebar navigation), sync tab
watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/pharmacy/payments')) {
    const mappedTab = getTabFromRoute(newPath);
    if (mappedTab === 'report' && !isAdmin.value) {
      router.replace('/pharmacy/payments/list');
      return;
    }
    if (activeTab.value !== mappedTab) {
      activeTab.value = mappedTab;
    }
  }
});

// ==================== TAB 1 Logic ====================
const searchQuery = ref('');
const filterStatus = ref('all');
const filterMethod = ref('all');
const filterType = ref('all');
const filterDateRange = ref<any>(null);
const selectedBill = ref<AdminPayBill | null>(null);
const confirmPayMethod = ref('cash');

const detailModalVisible = ref(false);
const selectedBillDetail = ref<AdminPayBill | null>(null);

const listColumns = [
  { title: 'Mã hóa đơn', dataIndex: 'code', key: 'code', width: 140 },
  { title: 'Bệnh nhân', dataIndex: 'patientName', key: 'patientName' },
  { title: 'Loại hóa đơn', dataIndex: 'billType', key: 'billType' },
  { title: 'Tổng tiền', dataIndex: 'total', key: 'total', width: 125 },
  { title: 'Đã trả', dataIndex: 'paidAmount', key: 'paidAmount', width: 120 },
  { title: 'Còn lại', dataIndex: 'remaining', key: 'remaining', width: 120 },
  { title: 'Trạng thái', key: 'payStatus', width: 160 },
  { title: 'Người xác nhận', dataIndex: 'paidBy', key: 'paidBy' },
  { title: 'Ngày tạo', dataIndex: 'createdDate', key: 'createdDate', width: 140, sorter: (a: any, b: any) => a.createdDate.localeCompare(b.createdDate) },
  { title: 'Ngày thanh toán', dataIndex: 'paidDate', key: 'paidDate', width: 140 },
  { title: 'Thao tác', key: 'actions', width: 110, align: 'center' as const, fixed: 'right' as const },
];

const filteredBills = computed(() => {
  return payBills.value.filter(b => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      if (!(b.code.toLowerCase().includes(q) || b.patientName.toLowerCase().includes(q))) return false;
    }
    if (filterStatus.value !== 'all' && b.payStatus !== filterStatus.value) return false;
    if (filterMethod.value !== 'all' && b.payMethod !== filterMethod.value) return false;
    if (filterType.value !== 'all' && b.billType !== filterType.value) return false;

    if (filterDateRange.value && filterDateRange.value.length === 2) {
      const start = dayjs(filterDateRange.value[0]).startOf('day');
      const end = dayjs(filterDateRange.value[1]).endOf('day');
      const billDate = dayjs(b.createdDate, 'DD/MM/YYYY HH:mm');
      if (billDate.isBefore(start) || billDate.isAfter(end)) return false;
    }
    return true;
  });
});

function selectBill(bill: AdminPayBill) {
  selectedBill.value = bill;
}

function viewFullDetail(bill: AdminPayBill) {
  selectedBillDetail.value = bill;
  detailModalVisible.value = true;
}

function printInvoiceDetail() {
  if (selectedBillDetail.value) {
    message.success(`Đang gửi lệnh in hóa đơn ${selectedBillDetail.value.code}...`);
  }
}

function resetFilters() {
  searchQuery.value = '';
  filterStatus.value = 'all';
  filterMethod.value = 'all';
  filterType.value = 'all';
  filterDateRange.value = null;
}

async function confirmPayment(bill: AdminPayBill) {
  try {
    await payBill(bill.id);
    const staffName = authStore.user.value?.fullName || 'Thu ngân hệ thống';
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    bill.payStatus = 'paid';
    bill.paidAmount = bill.total;
    bill.remaining = 0;
    bill.paidBy = staffName;
    bill.paidDate = dateStr;
    bill.payMethod = confirmPayMethod.value;

    // Also add a transaction record
    const txId = transactionsList.value.length + 1;
    transactionsList.value.unshift({
      id: txId,
      txCode: `TX${String(15049 + txId).padStart(6, '0')}`,
      billCode: bill.code,
      patientName: bill.patientName,
      amount: bill.total,
      payMethod: bill.payMethod,
      staffName: staffName,
      role: 'Thu ngân',
      time: dateStr,
      note: 'Xác nhận thanh toán bởi ' + staffName,
      txStatus: 'Thành công',
    });

    message.success(`Đã xác nhận thanh toán hóa đơn ${bill.code} thành công!`);
  } catch (err: any) {
    message.error('Lỗi xác nhận thanh toán: ' + err.message);
  }
}

// ==================== TAB 2 Logic ====================
const historySearchQuery = ref('');
const historyFilterMethod = ref('all');
const historyFilterStaff = ref('all');
const historyFilterStatus = ref('all');
const historyFilterDateRange = ref<any>(null);
const selectedTransaction = ref<PaymentTransaction | null>(null);

const historyListColumns = [
  { title: 'Mã giao dịch', dataIndex: 'txCode', key: 'txCode', width: 130 },
  { title: 'Mã hóa đơn', dataIndex: 'billCode', key: 'billCode', width: 130 },
  { title: 'Bệnh nhân', dataIndex: 'patientName', key: 'patientName' },
  { title: 'Số tiền thanh toán', dataIndex: 'amount', key: 'amount', width: 155 },
  { title: 'Phương thức', dataIndex: 'payMethod', key: 'payMethod' },
  { title: 'Người xác nhận', dataIndex: 'staffName', key: 'staffName' },
  { title: 'Vai trò', dataIndex: 'role', key: 'role', width: 100 },
  { title: 'Thời gian', dataIndex: 'time', key: 'time', width: 150 },
  { title: 'Trạng thái GD', dataIndex: 'txStatus', key: 'txStatus', width: 130 },
  { title: 'Thao tác', key: 'actions', width: 100, align: 'center' as const },
];

const filteredTransactions = computed(() => {
  return transactionsList.value.filter(t => {
    if (historySearchQuery.value) {
      const q = historySearchQuery.value.toLowerCase();
      if (!(t.txCode.toLowerCase().includes(q) || t.billCode.toLowerCase().includes(q) || t.patientName.toLowerCase().includes(q))) return false;
    }
    if (historyFilterMethod.value !== 'all' && t.payMethod !== historyFilterMethod.value) return false;
    if (historyFilterStaff.value !== 'all' && t.staffName !== historyFilterStaff.value) return false;
    if (historyFilterStatus.value !== 'all' && t.txStatus !== historyFilterStatus.value) return false;

    if (historyFilterDateRange.value && historyFilterDateRange.value.length === 2) {
      const start = dayjs(historyFilterDateRange.value[0]).startOf('day');
      const end = dayjs(historyFilterDateRange.value[1]).endOf('day');
      const txDate = dayjs(t.time, 'DD/MM/YYYY HH:mm');
      if (txDate.isBefore(start) || txDate.isAfter(end)) return false;
    }
    return true;
  });
});

function selectTransaction(tx: PaymentTransaction) {
  selectedTransaction.value = tx;
}

function getRelatedTransactions(billCode: string) {
  return transactionsList.value.filter(t => t.billCode === billCode && t.txStatus === 'Thành công');
}

function resetHistoryFilters() {
  historySearchQuery.value = '';
  historyFilterMethod.value = 'all';
  historyFilterStaff.value = 'all';
  historyFilterStatus.value = 'all';
  historyFilterDateRange.value = null;
}

// ==================== TAB 3 Logic ====================
const reportDateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(7, 'day'), dayjs()]);

const totalRevenue = computed(() => {
  return payBills.value.filter(b => b.payStatus !== 'cancelled').reduce((sum, b) => sum + b.paidAmount, 0);
});

const totalBillsCount = computed(() => payBills.value.length);
const paidBillsCount = computed(() => payBills.value.filter(b => b.payStatus === 'paid').length);
const unpaidBillsCount = computed(() => payBills.value.filter(b => b.payStatus === 'pending').length);
const partialBillsCount = computed(() => payBills.value.filter(b => b.payStatus === 'partial').length);
const remainingRevenue = computed(() => {
  return payBills.value.filter(b => b.payStatus !== 'cancelled').reduce((sum, b) => sum + b.remaining, 0);
});

// Custom daily revenue mock data inside charts
const dailyRevenueData = [
  { day: 'T2', val: 12.4, height: 110 },
  { day: 'T3', val: 18.6, height: 160 },
  { day: 'T4', val: 14.2, height: 125 },
  { day: 'T5', val: 24.5, height: 210 },
  { day: 'T6', val: 19.8, height: 170 },
  { day: 'T7', val: 28.3, height: 250 },
  { day: 'CN', val: 22.1, height: 195 },
];

function applyReportFilter() {
  message.success('Đã áp dụng lọc khoảng ngày báo cáo!');
}

function exportReport(type: 'Excel' | 'PDF') {
  message.success(`Đang tạo và tải xuống báo cáo thanh toán dạng ${type}...`);
}

// ==================== General Helpers ====================
function getBadgeClass(status: string) {
  switch (status) {
    case 'paid': return 'mi-badge-paid';
    case 'pending': return 'mi-badge-pending';
    case 'partial': return 'mi-badge-partial';
    case 'cancelled': return 'mi-badge-cancelled';
    default: return '';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'paid': return 'Đã thanh toán';
    case 'pending': return 'Chưa thanh toán';
    case 'partial': return 'Thanh toán một phần';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
}

function getMethodLabel(method: string) {
  switch (method) {
    case 'cash': return 'Tiền mặt';
    case 'transfer': return 'Chuyển khoản';
    case 'card': return 'Thẻ ngân hàng';
    default: return method || 'Chưa chọn';
  }
}

function printInvoice(bill: any) {
  message.success(`Đang gửi lệnh in hóa đơn ${bill.code}...`);
}

function printReceipt(tx: any) {
  message.success(`Đang gửi lệnh in biên nhận giao dịch ${tx.txCode}...`);
}
</script>

<style scoped>
.breadcrumb-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bc-item { color: #94a3b8; font-weight: 500; cursor: pointer; }
.bc-item:hover { color: #0047AB; }
.bc-sep { font-size: 0.65rem; color: #cbd5e1; }
.bc-active { color: #0f172a; font-weight: 700; }

/* Tabs Layout */
.pay-tabs :deep(.ant-tabs-nav::before) { border-bottom: 2px solid #f0f4f9; }
.pay-tabs :deep(.ant-tabs-tab) { font-weight: 600; font-size: 0.92rem; color: #64748b; padding: 10px 16px; }
.pay-tabs :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) { color: #0047AB !important; font-weight: 700; }
.pay-tabs :deep(.ant-tabs-ink-bar) { background: #0047AB; height: 3px; border-radius: 2px; }

/* Filter bar styles */
.filter-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px 0;
}

/* Card layout components */
.main-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.selected-row {
  background: #f0f7ff !important;
}
:deep(.selected-row td) {
  background: #f0f7ff !important;
}

.bill-code-link {
  font-weight: 700;
  color: #0047AB;
  cursor: pointer;
}
.bill-code-link:hover { text-decoration: underline; }

/* Drawer Side Panel Details styling */
.detail-panel {
  position: sticky;
  top: 24px;
}

.detail-section {
  margin-bottom: 12px;
}

.detail-title {
  font-weight: 700;
  font-size: 0.85rem;
  color: #0f172a;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dl {
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 500;
}

.dv {
  font-size: 0.82rem;
  color: #1e293b;
  font-weight: 600;
}

.code-blue {
  color: #0047AB;
  font-weight: 700;
}

/* Status Badges */
.mi-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.74rem;
  font-weight: 700;
  text-align: center;
}
.mi-badge-paid { background: #ecfdf5; color: #10b981; }
.mi-badge-pending { background: #fef2f2; color: #ef4444; }
.mi-badge-partial { background: #fff7ed; color: #ea580c; }
.mi-badge-cancelled { background: #f1f5f9; color: #64748b; }

/* Reports Specific Layouts */
.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e2e8f0;
  min-height: 85px;
  height: auto;
}

.stat-icon-pay {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.stat-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.stat-body .lbl {
  font-size: 0.74rem;
  color: #64748b;
  font-weight: 600;
}

.stat-body .val {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e293b;
  margin-top: 2px;
}

.report-chart-card {
  min-height: 260px;
}

.legend-dot-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748b;
}

.dot-c {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

:deep(.ant-table-thead > tr > th) {
  background: #f8fafc !important;
  font-weight: 700 !important;
  font-size: 0.78rem !important;
  color: #475569 !important;
  border-bottom: 2px solid #e2e8f0 !important;
  text-transform: uppercase;
}

:deep(.ant-table-tbody > tr > td) {
  font-size: 0.85rem;
}

/* Full Invoice Detail Modal CSS */
.detail-section {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}
.section-title {
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f172a;
  margin-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.icon-val {
  color: #0047AB;
  font-size: 1.1rem;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.info-grid.three-cols {
  grid-template-columns: repeat(3, 1fr);
}
.info-item {
  font-size: 0.85rem;
  color: #334155;
}
.price-val {
  font-weight: 600;
  color: #0f172a;
}
.table-container {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-top: 8px;
}
.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}
.detail-table th {
  background: #f8fafc;
  font-weight: 700;
  color: #475569;
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.75rem;
  text-transform: uppercase;
}
.detail-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
}
.detail-table.text-small {
  font-size: 0.8rem;
}
.empty-section-message {
  padding: 20px;
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  font-size: 0.85rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px dashed #cbd5e1;
}
.price-summary-box {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  max-width: 500px;
  margin-left: auto;
}
.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.85rem;
}
.price-label {
  color: #64748b;
}
.price-val-bold {
  font-weight: 600;
  color: #1e293b;
}
.discount-text {
  color: #ef4444;
}
.total-row {
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
.total-label {
  font-weight: 700;
  font-size: 0.95rem;
  color: #0f172a;
}
.total-val {
  font-weight: 800;
  font-size: 1.25rem;
  color: #0047AB;
}
.price-row.sub-row {
  font-size: 0.82rem;
  margin-top: 4px;
}
.paid-val {
  font-weight: 700;
  color: #10b981;
}
.remaining-val {
  font-weight: 700;
  color: #64748b;
}
.remaining-val-red {
  font-weight: 700;
  color: #ef4444;
}
</style>
