export interface Medicine {
  id: number;
  code: string;
  name: string;
  price: number; // selling price
  purchasePrice: number; // import price
  unit: string;
  stockQuantity: number;
}

export interface Patient {
  id: number;
  name: string;
  phone: string;
}

export interface Staff {
  id: number;
  name: string;
}

export interface Supplier {
  code: string;
  name: string;
  taxCode: string;
  phone: string;
  address: string;
  email: string;
}

export interface PrescriptionItem {
  name: string;
  qty: number;
  dosage: string;
}

export interface Prescription {
  id: number;
  code: string;
  patient: string; // "Name - Phone"
  doctorName: string;
  date: string;
  medications: PrescriptionItem[];
  status: 'pending' | 'processing' | 'completed';
}

export interface BillItem {
  id: number;
  code: string;
  billType: string;
  patientName: string;
  patientPhone: string;
  createdDate: string;
  createdTime: string;
  total: number;
  payStatus: 'paid' | 'pending' | 'cancelled';
  billStatus: 'completed' | 'pending' | 'cancelled';
  paidBy: string;
  items?: any[];
}

export interface ImportBill {
  code: string;
  supplierCode: string;
  supplierName: string;
  date: string;
  creator: string;
  goodsTotal: number;
  discountTotal: number;
  vatTotal: number;
  finalTotal: number;
  status: string;
  medications: {
    code: string;
    name: string;
    batch: string;
    expiryDate: string;
    qty: number;
    unit: string;
    price: number; // purchase price
  }[];
}

// ---------- Shared Mock Data ----------

export const MEDICINE_FALLBACK: Medicine[] = [
  { id: 1, code: 'MED001', name: 'Paracetamol 500mg', price: 1000, purchasePrice: 800, unit: 'Viên', stockQuantity: 11800 },
  { id: 2, code: 'MED002', name: 'Amoxicillin 500mg', price: 2500, purchasePrice: 2000, unit: 'Viên', stockQuantity: 6300 },
  { id: 3, code: 'MED003', name: 'Vitamin C 500mg', price: 1500, purchasePrice: 1200, unit: 'Viên', stockQuantity: 2900 },
  { id: 4, code: 'MED004', name: 'Decolgen Forte', price: 1800, purchasePrice: 1500, unit: 'Viên', stockQuantity: 240 },
  { id: 5, code: 'MED005', name: 'Panadol Extra', price: 2200, purchasePrice: 1800, unit: 'Viên', stockQuantity: 180 },
  { id: 6, code: 'MED006', name: 'Ibuprofen 400mg', price: 3000, purchasePrice: 2500, unit: 'Viên', stockQuantity: 1500 },
  { id: 7, code: 'MED007', name: 'Omeprazole 20mg', price: 4500, purchasePrice: 4000, unit: 'Viên', stockQuantity: 2880 },
  { id: 8, code: 'MED008', name: 'Cetirizine 10mg', price: 2000, purchasePrice: 1800, unit: 'Viên', stockQuantity: 1800 },
  { id: 9, code: 'MED009', name: 'Gaviscon Dual Action', price: 8500, purchasePrice: 8000, unit: 'Gói', stockQuantity: 95 },
  { id: 10, code: 'MED010', name: 'Salbutamol 2mg', price: 1200, purchasePrice: 1000, unit: 'Viên', stockQuantity: 70 },
];

export const PATIENT_LIST: Patient[] = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0901234567' },
  { id: 2, name: 'Trần Thị B', phone: '0912345678' },
  { id: 3, name: 'Phạm Văn C', phone: '0923456789' },
  { id: 4, name: 'Lê Thị D', phone: '0934567890' },
  { id: 5, name: 'Hoàng Văn E', phone: '0945678901' },
  { id: 6, name: 'Nguyễn Thị F', phone: '0956789012' },
  { id: 7, name: 'Trương Văn G', phone: '0967890123' },
  { id: 8, name: 'Lê Thị H', phone: '0978901234' },
];

export const STAFF_LIST: Staff[] = [
  { id: 1, name: 'Lê Thị Mai' },
  { id: 2, name: 'Nguyễn Văn D' },
  { id: 3, name: 'Admin' },
];

export const SUPPLIER_LIST: Supplier[] = [
  { code: 'NCC001', name: 'Công ty Dược phẩm Hà Nội', taxCode: '0101234567', phone: '024 3765 4321', address: '123 Đường Nguyễn Trãi, Thanh Xuân, Hà Nội', email: 'contact@duocphamhanoi.vn' },
  { code: 'NCC002', name: 'Công ty CP Dược phẩm Imexpharm', taxCode: '0105678901', phone: '028 3939 0123', address: 'Số 4, Đường 30/4, Q. Ninh Kiều, Cần Thơ', email: 'info@imexpharm.com' },
  { code: 'NCC003', name: 'Công ty TNHH Dược phẩm Mediplan', taxCode: '0109876543', phone: '024 3556 7890', address: '88 Phố Trần Đăng Ninh, Cầu Giấy, Hà Nội', email: 'sales@mediplan.vn' },
  { code: 'NCC004', name: 'Công ty CP Thiết bị Y tế Việt Đức', taxCode: '0112345678', phone: '024 6688 9900', address: 'Số 1, Ngõ 12, Đường Láng, Đống Đa, Hà Nội', email: 'info@vietducmedical.vn' },
  { code: 'NCC005', name: 'Công ty TNHH Y tế Tâm An', taxCode: '0115678901', phone: '028 7300 5577', address: '45/12 Nguyễn Thị Minh Khai, P. Bến Nghé, Q.1, TP. HCM', email: 'taman.med@gmail.com' },
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 1,
    code: 'PRC000210',
    patient: 'Phạm Minh Đức - 0918234567',
    doctorName: 'Bác sĩ Nguyễn Văn A',
    date: '20/05/2025',
    medications: [
      { name: 'Paracetamol 500mg', qty: 20, dosage: 'Ngày uống 2 lần, mỗi lần 1 viên sau ăn' },
      { name: 'Amoxicillin 500mg', qty: 14, dosage: 'Ngày uống 2 lần, mỗi lần 1 viên sáng tối' },
      { name: 'Vitamin C 500mg', qty: 10, dosage: 'Ngày uống 1 lần, mỗi lần 1 viên sáng' },
    ],
    status: 'pending',
  },
  {
    id: 2,
    code: 'PRC000211',
    patient: 'Nguyễn Thị Hằng - 0987654321',
    doctorName: 'Bác sĩ Phạm Văn C',
    date: '18/05/2025',
    medications: [
      { name: 'Amoxicillin 500mg', qty: 21, dosage: 'Ngày uống 3 lần, mỗi lần 1 viên sau ăn' },
      { name: 'Decolgen Forte', qty: 10, dosage: 'Uống 1 viên khi có triệu chứng nghẹt mũi, sổ mũi' },
    ],
    status: 'processing',
  },
  {
    id: 3,
    code: 'PRC000212',
    patient: 'Lê Văn Thành - 0909111222',
    doctorName: 'Bác sĩ Nguyễn Văn A',
    date: '16/05/2025',
    medications: [
      { name: 'Paracetamol 500mg', qty: 10, dosage: 'Uống 1 viên khi sốt trên 38.5 độ (cách tối thiểu 4-6 tiếng)' },
    ],
    status: 'completed',
  },
  {
    id: 4,
    code: 'PRC000213',
    patient: 'Trần Quang Minh - 0933444555',
    doctorName: 'Bác sĩ Lê Thị D',
    date: '14/05/2025',
    medications: [
      { name: 'Vitamin C 500mg', qty: 30, dosage: 'Ngày uống 1 viên sáng sau ăn để tăng đề kháng' },
      { name: 'Panadol Extra', qty: 12, dosage: 'Uống 1 viên khi đau đầu, mệt mỏi' },
    ],
    status: 'pending',
  },
  {
    id: 5,
    code: 'PRC000214',
    patient: 'Hoàng Thị Mai - 0966777888',
    doctorName: 'Bác sĩ Phạm Văn C',
    date: '12/05/2025',
    medications: [
      { name: 'Amoxicillin 500mg', qty: 14, dosage: 'Ngày uống 2 lần, mỗi lần 1 viên, uống đủ liều 7 ngày' },
      { name: 'Paracetamol 500mg', qty: 10, dosage: 'Uống khi đau nhức răng' },
    ],
    status: 'completed',
  },
  {
    id: 6,
    code: 'PRC000215',
    patient: 'Vũ Hoàng Nam - 0944123456',
    doctorName: 'Bác sĩ Lê Thị D',
    date: '10/05/2025',
    medications: [
      { name: 'Ibuprofen 400mg', qty: 10, dosage: 'Uống 1 viên sau ăn khi đau khớp' },
      { name: 'Omeprazole 20mg', qty: 14, dosage: 'Uống 1 viên trước ăn sáng 30 phút' },
    ],
    status: 'pending',
  },
  {
    id: 7,
    code: 'PRC000216',
    patient: 'Đỗ Thùy Chi - 0977888999',
    doctorName: 'Bác sĩ Hoàng Minh E',
    date: '08/05/2025',
    medications: [
      { name: 'Cetirizine 10mg', qty: 10, dosage: 'Uống 1 viên tối trước khi đi ngủ (tránh buồn ngủ ban ngày)' },
    ],
    status: 'processing',
  },
  {
    id: 8,
    code: 'PRC000217',
    patient: 'Ngô Quốc Trung - 0922333444',
    doctorName: 'Bác sĩ Nguyễn Văn A',
    date: '06/05/2025',
    medications: [
      { name: 'Gaviscon Dual Action', qty: 24, dosage: 'Uống 1 gói sau các bữa ăn chính và trước khi đi ngủ' },
      { name: 'Omeprazole 20mg', qty: 28, dosage: 'Ngày uống 2 lần, mỗi lần 1 viên trước ăn 30 phút' },
    ],
    status: 'completed',
  },
  {
    id: 9,
    code: 'PRC000218',
    patient: 'Bùi Tuyết Mai - 0911222333',
    doctorName: 'Bác sĩ Hoàng Minh E',
    date: '04/05/2025',
    medications: [
      { name: 'Salbutamol 2mg', qty: 20, dosage: 'Uống ngày 2 lần, mỗi lần 1 viên khi có biểu hiện khó thở' },
      { name: 'Vitamin C 500mg', qty: 20, dosage: 'Uống 1 viên sáng sau ăn' },
    ],
    status: 'pending',
  },
  {
    id: 10,
    code: 'PRC000219',
    patient: 'Trịnh Gia Bảo - 0900112233',
    doctorName: 'Bác sĩ Lê Thị D',
    date: '02/05/2025',
    medications: [
      { name: 'Decolgen Forte', qty: 15, dosage: 'Uống ngày 3 lần, mỗi lần 1 viên sau ăn' },
      { name: 'Vitamin C 500mg', qty: 15, dosage: 'Uống ngày 1 viên sáng' },
    ],
    status: 'completed',
  },
];

export const MOCK_BILLS = [
  { id: 1, code: 'INV2505120001', billType: 'prescription', patientName: 'Nguyễn Văn A', patientPhone: '0901234567', createdDate: '12/05/2025', createdTime: '09:15', total: 850000, payStatus: 'paid', billStatus: 'completed', paidBy: 'Lê Thị Mai' },
  { id: 2, code: 'INV2505120002', billType: 'otc', patientName: 'Trần Thị B', patientPhone: '0912345678', createdDate: '12/05/2025', createdTime: '09:45', total: 320000, payStatus: 'pending', billStatus: 'pending', paidBy: '' },
  { id: 3, code: 'INV2505120003', billType: 'prescription', patientName: 'Phạm Văn C', patientPhone: '0923456789', createdDate: '12/05/2025', createdTime: '10:10', total: 1250000, payStatus: 'paid', billStatus: 'completed', paidBy: 'Nguyễn Văn D' },
  { id: 4, code: 'INV2505120004', billType: 'combined', patientName: 'Nhiều bệnh nhân', patientPhone: '', createdDate: '12/05/2025', createdTime: '10:30', total: 2850000, payStatus: 'paid', billStatus: 'completed', paidBy: 'Lê Thị Mai' },
  { id: 5, code: 'INV2505120005', billType: 'otc', patientName: 'Hoàng Văn E', patientPhone: '0934567890', createdDate: '12/05/2025', createdTime: '11:05', total: 150000, payStatus: 'cancelled', billStatus: 'cancelled', paidBy: '' },
  { id: 6, code: 'INV2505120006', billType: 'prescription', patientName: 'Nguyễn Thị F', patientPhone: '0945678901', createdDate: '12/05/2025', createdTime: '11:20', total: 980000, payStatus: 'pending', billStatus: 'pending', paidBy: '' },
  { id: 7, code: 'INV2505120007', billType: 'otc', patientName: 'Trương Văn G', patientPhone: '0956789012', createdDate: '12/05/2025', createdTime: '13:30', total: 480000, payStatus: 'paid', billStatus: 'completed', paidBy: 'Nguyễn Văn D' },
  { id: 8, code: 'INV2505120008', billType: 'combined', patientName: 'Nhiều bệnh nhân', patientPhone: '', createdDate: '12/05/2025', createdTime: '14:10', total: 3250000, payStatus: 'pending', billStatus: 'pending', paidBy: '' },
  { id: 9, code: 'INV2505120009', billType: 'prescription', patientName: 'Đỗ Thị H', patientPhone: '0967890123', createdDate: '11/05/2025', createdTime: '08:30', total: 1680000, payStatus: 'paid', billStatus: 'completed', paidBy: 'Lê Thị Mai' },
  { id: 10, code: 'INV2505120010', billType: 'otc', patientName: 'Lý Văn K', patientPhone: '0978901234', createdDate: '11/05/2025', createdTime: '09:00', total: 275000, payStatus: 'paid', billStatus: 'completed', paidBy: 'Nguyễn Văn D' },
  { id: 11, code: 'INV2505120011', billType: 'prescription', patientName: 'Vũ Thị L', patientPhone: '0989012345', createdDate: '11/05/2025', createdTime: '10:15', total: 2100000, payStatus: 'pending', billStatus: 'pending', paidBy: '' },
  { id: 12, code: 'INV2505120012', billType: 'combined', patientName: 'Nhiều bệnh nhân', patientPhone: '', createdDate: '11/05/2025', createdTime: '11:40', total: 4500000, payStatus: 'paid', billStatus: 'completed', paidBy: 'Lê Thị Mai' },
  { id: 13, code: 'INV2505120013', billType: 'otc', patientName: 'Bùi Văn M', patientPhone: '0990123456', createdDate: '11/05/2025', createdTime: '14:20', total: 185000, payStatus: 'cancelled', billStatus: 'cancelled', paidBy: '' },
  { id: 14, code: 'INV2505120014', billType: 'prescription', patientName: 'Ngô Thị N', patientPhone: '0901112233', createdDate: '10/05/2025', createdTime: '08:45', total: 1450000, payStatus: 'paid', billStatus: 'completed', paidBy: 'Nguyễn Văn D' },
  { id: 15, code: 'INV2505120015', billType: 'otc', patientName: 'Đinh Văn P', patientPhone: '0912223344', createdDate: '10/05/2025', createdTime: '09:30', total: 520000, payStatus: 'paid', billStatus: 'completed', paidBy: 'Lê Thị Mai' },
];

export const MOCK_IMPORT_BILLS: ImportBill[] = [
  {
    code: 'PN000231',
    supplierCode: 'NCC001',
    supplierName: 'Công ty Dược phẩm Hà Nội',
    date: '20/05/2025',
    creator: 'Lê Thị Mai',
    goodsTotal: 25400000,
    discountTotal: 1270000,
    vatTotal: 2413000,
    finalTotal: 26543000,
    status: 'completed',
    medications: [
      { code: 'MED001', name: 'Paracetamol 500mg', batch: 'LO001', expiryDate: '30/08/2026', qty: 20000, unit: 'Viên', price: 800 },
      { code: 'MED002', name: 'Amoxicillin 500mg', batch: 'LO002', expiryDate: '15/12/2026', qty: 4700, unit: 'Viên', price: 2000 },
    ],
  },
  {
    code: 'PN000230',
    supplierCode: 'NCC002',
    supplierName: 'Công ty CP Dược phẩm Imexpharm',
    date: '18/05/2025',
    creator: 'Nguyễn Văn D',
    goodsTotal: 18750000,
    discountTotal: 937500,
    vatTotal: 1875000,
    finalTotal: 19687500,
    status: 'completed',
    medications: [
      { code: 'MED003', name: 'Vitamin C 500mg', batch: 'LO003', expiryDate: '20/11/2026', qty: 15625, unit: 'Viên', price: 1200 },
    ],
  },
  {
    code: 'PN000229',
    supplierCode: 'NCC003',
    supplierName: 'Công ty TNHH Dược phẩm Mediplan',
    date: '16/05/2025',
    creator: 'Lê Thị Mai',
    goodsTotal: 32000000,
    discountTotal: 1600000,
    vatTotal: 3200000,
    finalTotal: 33600000,
    status: 'draft',
    medications: [
      { code: 'MED002', name: 'Amoxicillin 500mg', batch: 'LO004', expiryDate: '01/01/2027', qty: 16000, unit: 'Viên', price: 2000 },
    ],
  },
  {
    code: 'PN000228',
    supplierCode: 'NCC001',
    supplierName: 'Công ty Dược phẩm Hà Nội',
    date: '14/05/2025',
    creator: 'Nguyễn Văn D',
    goodsTotal: 12600000,
    discountTotal: 630000,
    vatTotal: 1260000,
    finalTotal: 13230000,
    status: 'completed',
    medications: [
      { code: 'MED001', name: 'Paracetamol 500mg', batch: 'LO005', expiryDate: '10/10/2026', qty: 15750, unit: 'Viên', price: 800 },
    ],
  },
  {
    code: 'PN000227',
    supplierCode: 'NCC002',
    supplierName: 'Công ty CP Dược phẩm Imexpharm',
    date: '12/05/2025',
    creator: 'Lê Thị Mai',
    goodsTotal: 9800000,
    discountTotal: 490000,
    vatTotal: 980000,
    finalTotal: 10290000,
    status: 'cancelled',
    medications: [
      { code: 'MED003', name: 'Vitamin C 500mg', batch: 'LO006', expiryDate: '15/09/2026', qty: 8166, unit: 'Viên', price: 1200 },
    ],
  },
  {
    code: 'PN000226',
    supplierCode: 'NCC003',
    supplierName: 'Công ty TNHH Dược phẩm Mediplan',
    date: '10/05/2025',
    creator: 'Nguyễn Văn D',
    goodsTotal: 22500000,
    discountTotal: 1125000,
    vatTotal: 2250000,
    finalTotal: 23625000,
    status: 'completed',
    medications: [
      { code: 'MED002', name: 'Amoxicillin 500mg', batch: 'LO007', expiryDate: '20/12/2026', qty: 11250, unit: 'Viên', price: 2000 },
    ],
  },
];


