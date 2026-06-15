import { pharmacyApi } from '@/services/api'

export async function getMedicines() {
  try {
    const response = await pharmacyApi.get('/Medicines')
    const data = response.data || []
    return data.map((m: any) => ({
      ...m,
      category: m.activeIngredient || 'Generic',
      stock: m.stockQuantity ?? m.stock ?? 0
    }))
  } catch (err) {
    console.error('Failed to fetch medicines from backend:', err)
    return []
  }
}

export async function createMedicine(medicine: any) {
  const response = await pharmacyApi.post('/Medicines', {
    name: medicine.name,
    activeIngredient: medicine.activeIngredient || '',
    unit: medicine.unit || 'Viên',
    price: Number(medicine.price),
    stockQuantity: Number(medicine.stockQuantity || medicine.stock || 0),
    expiryDate: medicine.expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString()
  })
  return response.data
}

export async function updateMedicine(id: number, medicine: any) {
  const response = await pharmacyApi.put(`/Medicines/${id}`, {
    id: id,
    name: medicine.name,
    activeIngredient: medicine.activeIngredient || '',
    unit: medicine.unit || 'Viên',
    price: Number(medicine.price),
    stockQuantity: Number(medicine.stockQuantity || medicine.stock || 0),
    expiryDate: medicine.expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString()
  })
  return response.data
}

export async function deleteMedicine(id: number) {
  const response = await pharmacyApi.delete(`/Medicines/${id}`)
  return response.data
}

export async function adjustStock(id: number, quantity: number) {
  const response = await pharmacyApi.post(`/Inventory/adjust/${id}`, quantity)
  return response.data
}

export async function getInventoryTransactions() {
  try {
    const [logsRes, medsRes] = await Promise.all([
      pharmacyApi.get('/EventLogs'),
      pharmacyApi.get('/Medicines')
    ])
    const logs = logsRes.data || []
    const medicines = medsRes.data || []
    const medMap: Record<number, string> = {}
    medicines.forEach((m: any) => { medMap[m.id] = m.name })

    const transactions = logs
      .filter((l: any) => l.eventType === 'prescription.created')
      .map((l: any) => {
        try {
          const payload = JSON.parse(l.payload)
          return (payload.medicines || payload.Medicines || []).map((m: any, mIdx: number) => {
            const medId = m.medicineId || m.MedicineId
            return {
              id: Number(`${l.id}${mIdx}`),
              type: 'out',
              medicine: medMap[medId] || `Thuốc #${medId}`,
              qty: m.quantity || m.Quantity || 0,
              date: new Date(l.timestamp).toISOString().split('T')[0]
            }
          })
        } catch (e) {
          return []
        }
      })
      .flat()

    return transactions
  } catch (err) {
    console.error('Failed to fetch inventory transactions from backend:', err)
    return []
  }
}

export async function getBills() {
  try {
    const response = await pharmacyApi.get('/Bills')
    const data = response.data || []
    return data.map((b: any, idx: number) => ({
      ...b,
      patient: `Bệnh nhân #${b.patientId}`,
      total: b.totalAmount || (b.examinationFee + b.medicineFee),
      date: new Date(b.createdAt).toLocaleString('vi-VN')
    }))
  } catch (err) {
    console.error('Failed to fetch bills from backend:', err)
    return []
  }
}

export async function getPrescriptions() {
  try {
    const medicinesRes = await pharmacyApi.get('/Medicines')
    const medicines = medicinesRes.data || []
    const medicineMap: Record<number, string> = {}
    medicines.forEach((m: any) => {
      medicineMap[m.id] = m.name
    })

    const response = await pharmacyApi.get('/Prescription')
    const logs = response.data || []

    const prescriptions = logs
      .filter((l: any) => l.eventType === 'prescription.created')
      .map((l: any) => {
        try {
          const payload = JSON.parse(l.payload)
          const rawMeds = payload.medicines || payload.Medicines || []

          const medications = rawMeds.map((m: any) => {
            const medId = m.medicineId || m.MedicineId
            return {
              name: medicineMap[medId] || `Thuốc #${medId}`,
              qty: m.quantity || m.Quantity || 1,
              dosage: m.dosage || 'Ngày uống 2 lần, mỗi lần 1 viên sau ăn'
            }
          })

          const medicineNames = medications.map((m: any) => `${m.name} (x${m.qty})`).join(', ')

          return {
            id: l.id,
            code: `PRC${String(l.id).padStart(5, '0')}`,
            patient: `Bệnh nhân #${payload.patientId || payload.PatientId}`,
            medicine: medicineNames || 'Không rõ',
            medications: medications,
            dosage: 'Theo chỉ định bác sĩ',
            date: new Date(l.timestamp || l.createdAt).toLocaleString('vi-VN'),
            status: l.status === 'Processed' ? 'completed' : 'pending'
          }
        } catch (e) {
          return null
        }
      })
      .filter(Boolean)

    return prescriptions
  } catch (err) {
    console.error('Failed to fetch prescriptions from backend:', err)
    return []
  }
}

export async function createBill(bill: any) {
  const patientId = parseInt(bill.patientCode?.replace(/\D/g, '')) || 1
  const medicineFee = (bill.medicines || []).reduce((sum: number, m: any) => sum + (m.price || 0) * (m.qty || 0), 0)

  const payload = {
    patientId: patientId,
    examinationFee: bill.consultFee || 0,
    medicineFee: medicineFee,
    totalAmount: (bill.consultFee || 0) + medicineFee,
    status: 'Pending',
    createdAt: new Date().toISOString()
  }

  const response = await pharmacyApi.post('/Bills', payload)
  return response.data
}

export async function payBill(id: number) {
  try {
    const response = await pharmacyApi.post(`/Bills/${id}/pay`)
    return response.data
  } catch (err) {
    console.error(`Failed to pay bill ${id}:`, err)
    throw err
  }
}


export async function processPrescription(id: number) {
  try {
    const response = await pharmacyApi.post(`/Prescription/process/${id}`)
    return response.data
  } catch (err) {
    console.error(`Failed to process prescription ${id}:`, err)
    throw err
  }
}

// Supplier Management Services
export async function getSuppliers() {
  try {
    const response = await pharmacyApi.get('/Suppliers')
    return response.data || []
  } catch (err) {
    console.error('Failed to fetch suppliers from backend:', err)
    return []
  }
}

export async function createSupplier(supplier: any) {
  try {
    const response = await pharmacyApi.post('/Suppliers', {
      code: supplier.code,
      name: supplier.name,
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      group: supplier.group || 'Dược phẩm',
      status: supplier.status || 'active',
      createdDate: supplier.createdDate || new Date().toISOString()
    })
    return response.data
  } catch (err) {
    console.error('Failed to create supplier in backend:', err)
    throw err
  }
}

export async function updateSupplier(id: number, supplier: any) {
  try {
    const response = await pharmacyApi.put(`/Suppliers/${id}`, {
      id: id,
      code: supplier.code,
      name: supplier.name,
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      group: supplier.group || 'Dược phẩm',
      status: supplier.status || 'active',
      createdDate: supplier.createdDate || new Date().toISOString()
    })
    return response.data
  } catch (err) {
    console.error(`Failed to update supplier ${id} in backend:`, err)
    throw err
  }
}

export async function deleteSupplier(id: number) {
  try {
    const response = await pharmacyApi.delete(`/Suppliers/${id}`)
    return response.data
  } catch (err) {
    console.error(`Failed to delete supplier ${id} from backend:`, err)
    throw err
  }
}

export async function getImportBills() {
  try {
    const response = await pharmacyApi.get('/ImportBills')
    return response.data || []
  } catch (err) {
    console.error('Failed to fetch import bills from backend:', err)
    return []
  }
}

export async function createImportBill(bill: any) {
  try {
    const response = await pharmacyApi.post('/ImportBills', {
      supplierCode: bill.supplierCode,
      supplierName: bill.supplierName,
      date: bill.date || new Date().toISOString(),
      creator: bill.creator || 'admin',
      note: bill.note || '',
      goodsTotal: bill.goodsTotal || 0,
      discountTotal: bill.discountTotal || 0,
      vatTotal: bill.vatTotal || 0,
      finalTotal: bill.finalTotal || 0,
      medications: (bill.medications || []).map((m: any) => ({
        code: m.code,
        name: m.name,
        batch: m.batch,
        expiryDate: m.expiryDate,
        qty: m.qty,
        unit: m.unit || 'Viên',
        price: m.price,
        total: m.price * m.qty
      }))
    })
    return response.data
  } catch (err) {
    console.error('Failed to create import bill:', err)
    throw err
  }
}

