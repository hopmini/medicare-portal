import { medicalApi } from '@/services/api'

export function mapUserIdToGuid(userId: number | string): string {
  const strId = String(userId);
  if (strId.includes('-') && strId.length === 36) {
    return strId.toLowerCase();
  }
  const cleanId = strId.replace(/\D/g, '') || '0'
  return `00000000-0000-0000-0000-${cleanId.padStart(12, '0')}`
}

export interface MedicalRecord {
  id?: string
  patientId: string
  gatewayPatientId?: number
  doctorId: string
  title?: string
  symptoms: string
  diagnosis: string
  preliminaryDiagnosis?: string
  finalDiagnosis?: string
  medicalHistorySnapshot?: string
  allergiesSnapshot?: string
  diagnosisCode?: string
  diagnosisCodeName?: string
  notes?: string
  weight?: number
  height?: number
  bloodPressure?: string
  heartRate?: number
  temperature?: number
  customMetricsJson?: string
  attachmentsJson?: string
  createdAt?: string
  admissionDate?: string
  dischargeDate?: string
  dischargeDiagnosis?: string
  dischargeInstructions?: string
  followUpInstructions?: string
  followUpClinic?: string
  followUpDate?: string
  updatedAt?: string
  updatedBy?: string
  status?: string
  isDeleted?: boolean
  isLocked?: boolean
  lockedBy?: string
  prescription?: Prescription | null
  labTests?: LabTest[]
  treatmentPlans?: TreatmentPlan[]
}

export interface LabTest {
  id?: string
  medicalRecordId: string
  testName: string
  testCode?: string
  result?: string
  normalRange?: string
  unit?: string
  status: string
  notes?: string
  attachmentFileJson?: string
  performedBy?: string
  requestedAt: string
  completedAt?: string
}

export interface TreatmentPlan {
  id?: string
  medicalRecordId: string
  planName: string
  description?: string
  startDate: string
  endDate?: string
  status: string
  createdBy?: string
  createdAt: string
  progressions?: TreatmentProgression[]
}

export interface TreatmentProgression {
  id?: string
  recordedAt: string
  notes: string
  status?: string
  recordedBy?: string
}

export interface AuditLogEntry {
  id: string
  recordId: string
  field?: string
  oldValue?: string
  newValue?: string
  changedBy?: string
  changedAt: string
}

export interface Prescription {
  id?: string
  instructions?: string
  prescribedAt?: string
  status?: string
  expiryDate?: string
  refillCount?: number
  details: PrescriptionDetail[]
}

export interface PrescriptionDetail {
  id?: string
  medicationId: string
  medicationName: string
  quantity: number
  dosage: string
}

export interface PatientProfile {
  id?: string
  fullName: string
  dateOfBirth: string
  gender: string
  medicalHistory: string
  allergies: string
  bloodGroup?: string
  phone?: string
  email?: string
  address?: string
  identityCard?: string
  insuranceNumber?: string
  occupation?: string
  ethnicity?: string
  nationality?: string
  emergencyContact?: string
  emergencyPhone?: string
}

export const medicalRecordService = {
  async getPatientProfile(userId: number | string): Promise<PatientProfile | null> {
    try {
      const patientGuid = mapUserIdToGuid(userId)
      const response = await medicalApi.get(`/Patients/${patientGuid}`)
      return response.data || null
    } catch (error) {
      console.error('Failed to get patient profile:', error)
      return null
    }
  },

  async updatePatientProfile(userId: number | string, data: {
    fullName: string
    dateOfBirth: string
    gender: string
    medicalHistory: string
    allergies: string
    bloodGroup?: string
  }): Promise<{ success: boolean; message?: string }> {
    try {
      const patientGuid = mapUserIdToGuid(userId)
      const response = await medicalApi.put(`/Patients/${patientGuid}`, data)
      return {
        success: true,
        message: response.data?.message
      }
    } catch (error: any) {
      console.error('Failed to update patient profile:', error)
      return {
        success: false,
        message: error.response?.data || 'Không thể cập nhật hồ sơ sức khỏe.'
      }
    }
  },

  async getRecordsByPatient(userId: number | string): Promise<MedicalRecord[]> {
    try {
      const patientGuid = mapUserIdToGuid(userId)
      const response = await medicalApi.get(`/MedicalRecords/patient/${patientGuid}`)
      return response.data || []
    } catch (error) {
      console.error('Failed to get medical records:', error)
      return []
    }
  },

  async getRecordsByDoctor(doctorId: string): Promise<MedicalRecord[]> {
    try {
      const response = await medicalApi.get(`/MedicalRecords/doctor/${doctorId}`)
      return response.data || []
    } catch (error) {
      console.error('Failed to get doctor medical records:', error)
      return []
    }
  },

  async getAllRecords(): Promise<MedicalRecord[]> {
    try {
      const response = await medicalApi.get('/MedicalRecords')
      return response.data || []
    } catch (error) {
      console.error('Failed to get all medical records:', error)
      return []
    }
  },

  async getAllPatients(): Promise<PatientProfile[]> {
    try {
      const response = await medicalApi.get('/Patients')
      return response.data || []
    } catch (error) {
      console.error('Failed to get all patients:', error)
      return []
    }
  },

  async createRecord(data: {
    patientId: string
    doctorId: string
    title?: string
    symptoms: string
    diagnosis: string
    diagnosisCode?: string
    diagnosisCodeName?: string
    notes?: string
    weight?: number
    height?: number
    bloodPressure?: string
    heartRate?: number
    temperature?: number
    customMetricsJson?: string
    attachmentsJson?: string
    appointmentId?: string
    patientName?: string
    gatewayPatientId?: number
  }): Promise<{ success: boolean; recordId?: string; message?: string }> {
    try {
      const response = await medicalApi.post('/MedicalRecords', data)
      return {
        success: true,
        recordId: response.data?.recordId,
        message: response.data?.message
      }
    } catch (error: any) {
      console.error('Failed to create medical record:', error)
      return {
        success: false,
        message: error.response?.data || 'Không thể ghi bệnh án.'
      }
    }
  },

  async deletePatient(patientId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.delete(`/Patients/${patientId}`)
      return {
        success: true,
        message: response.data?.message
      }
    } catch (error: any) {
      console.error('Failed to delete patient:', error)
      return {
        success: false,
        message: error.response?.data || 'Không thể xóa hồ sơ bệnh nhân.'
      }
    }
  },

  async deleteRecord(recordId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.delete(`/MedicalRecords/${recordId}`)
      return {
        success: true,
        message: response.data?.message
      }
    } catch (error: any) {
      console.error('Failed to delete medical record:', error)
      return {
        success: false,
        message: error.response?.data || 'Không thể xóa bệnh án.'
      }
    }
  },

  async createPrescription(data: {
    medicalRecordId: string
    instructions?: string
    details: Array<{
      medicationId: string
      medicationName: string
      quantity: number
      dosage: string
    }>
  }): Promise<{ success: boolean; prescriptionId?: string; message?: string }> {
    try {
      const response = await medicalApi.post('/Prescriptions', data)
      return {
        success: true,
        prescriptionId: response.data?.prescriptionId,
        message: response.data?.message
      }
    } catch (error: any) {
      console.error('Failed to create prescription:', error)
      return {
        success: false,
        message: error.response?.data || 'Không thể kê đơn thuốc.'
      }
    }
  },

  async updateRecord(recordId: string, data: any): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.put(`/MedicalRecords/${recordId}`, data)
      return {
        success: true,
        message: response.data?.message
      }
    } catch (error: any) {
      console.error('Failed to update medical record:', error)
      return {
        success: false,
        message: error.response?.data || 'Không thể cập nhật bệnh án.'
      }
    }
  },

  async getRecordById(recordId: string): Promise<MedicalRecord | null> {
    try {
      const response = await medicalApi.get(`/MedicalRecords/${recordId}`)
      return response.data || null
    } catch (error) {
      console.error('Failed to get record:', error)
      return null
    }
  },

  async setDischargeSummary(recordId: string, data: {
    dischargeDate?: string
    dischargeDiagnosis?: string
    dischargeInstructions?: string
    followUpInstructions?: string
    followUpClinic?: string
    followUpDate?: string
  }): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.put(`/MedicalRecords/${recordId}/discharge`, data)
      return {
        success: true,
        message: response.data?.message
      }
    } catch (error: any) {
      console.error('Failed to set discharge summary:', error)
      return {
        success: false,
        message: error.response?.data || 'Không thể lưu giấy ra viện.'
      }
    }
  },

  async updatePrescription(prescriptionId: string, data: {
    instructions?: string
    status?: string
    expiryDate?: string
    details?: Array<{
      medicationId: string
      medicationName: string
      quantity: number
      dosage: string
    }>
  }): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.put(`/Prescriptions/${prescriptionId}`, data)
      return {
        success: true,
        message: response.data?.message
      }
    } catch (error: any) {
      console.error('Failed to update prescription:', error)
      return {
        success: false,
        message: error.response?.data || 'Không thể cập nhật đơn thuốc.'
      }
    }
  },

  async deletePrescription(prescriptionId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.delete(`/Prescriptions/${prescriptionId}`)
      return {
        success: true,
        message: response.data?.message
      }
    } catch (error: any) {
      console.error('Failed to delete prescription:', error)
      return {
        success: false,
        message: error.response?.data || 'Không thể xóa đơn thuốc.'
      }
    }
  },

  async updateRecordStatus(recordId: string, status: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.put(`/MedicalRecords/${recordId}/status`, { status })
      return { success: true, message: response.data?.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data || 'Không thể cập nhật trạng thái.' }
    }
  },

  async lockRecord(recordId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.put(`/MedicalRecords/${recordId}/lock`)
      return { success: true, message: response.data?.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data || 'Không thể khóa bệnh án.' }
    }
  },

  async unlockRecord(recordId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.put(`/MedicalRecords/${recordId}/unlock`)
      return { success: true, message: response.data?.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data || 'Không thể mở khóa bệnh án.' }
    }
  },

  async softDeleteRecord(recordId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.put(`/MedicalRecords/${recordId}/soft-delete`)
      return { success: true, message: response.data?.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data || 'Không thể xóa bệnh án.' }
    }
  },

  async restoreRecord(recordId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.put(`/MedicalRecords/${recordId}/restore`)
      return { success: true, message: response.data?.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data || 'Không thể khôi phục bệnh án.' }
    }
  },

  async getDeletedRecords(): Promise<MedicalRecord[]> {
    try {
      const response = await medicalApi.get('/MedicalRecords/deleted')
      return response.data || []
    } catch (error) {
      console.error('Failed to get deleted records:', error)
      return []
    }
  },

  async getRecordHistory(recordId: string): Promise<AuditLogEntry[]> {
    try {
      const response = await medicalApi.get(`/MedicalRecords/${recordId}/history`)
      return response.data || []
    } catch (error) {
      console.error('Failed to get record history:', error)
      return []
    }
  },

  // Lab Tests
  async addLabTest(recordId: string, data: { testName: string; testCode?: string; normalRange?: string; unit?: string; notes?: string }): Promise<{ success: boolean; labTestId?: string; message?: string }> {
    try {
      const response = await medicalApi.post(`/MedicalRecords/${recordId}/lab-tests`, data)
      return { success: true, labTestId: response.data?.labTestId, message: response.data?.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data || 'Không thể thêm xét nghiệm.' }
    }
  },

  async getLabTests(recordId: string): Promise<LabTest[]> {
    try {
      const response = await medicalApi.get(`/MedicalRecords/${recordId}/lab-tests`)
      return response.data || []
    } catch (error) {
      console.error('Failed to get lab tests:', error)
      return []
    }
  },

  async updateLabTest(labTestId: string, data: { result?: string; status?: string; notes?: string; attachmentFileJson?: string; performedBy?: string; completedAt?: string }): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.put(`/LabTests/${labTestId}`, data)
      return { success: true, message: response.data?.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data || 'Không thể cập nhật xét nghiệm.' }
    }
  },

  async deleteLabTest(labTestId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.delete(`/LabTests/${labTestId}`)
      return { success: true, message: response.data?.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data || 'Không thể xóa xét nghiệm.' }
    }
  },

  // Treatment Plans
  async addTreatmentPlan(recordId: string, data: { planName: string; description?: string; startDate?: string; endDate?: string }): Promise<{ success: boolean; planId?: string; message?: string }> {
    try {
      const response = await medicalApi.post(`/MedicalRecords/${recordId}/treatment-plans`, data)
      return { success: true, planId: response.data?.planId, message: response.data?.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data || 'Không thể thêm phác đồ.' }
    }
  },

  async getTreatmentPlans(recordId: string): Promise<TreatmentPlan[]> {
    try {
      const response = await medicalApi.get(`/MedicalRecords/${recordId}/treatment-plans`)
      return response.data || []
    } catch (error) {
      console.error('Failed to get treatment plans:', error)
      return []
    }
  },

  async updateTreatmentPlan(planId: string, data: { planName?: string; description?: string; startDate?: string; endDate?: string; status?: string }): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.put(`/TreatmentPlans/${planId}`, data)
      return { success: true, message: response.data?.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data || 'Không thể cập nhật phác đồ.' }
    }
  },

  async deleteTreatmentPlan(planId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await medicalApi.delete(`/TreatmentPlans/${planId}`)
      return { success: true, message: response.data?.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data || 'Không thể xóa phác đồ.' }
    }
  },

  async addProgression(planId: string, data: { notes: string; status?: string }): Promise<{ success: boolean; progressionId?: string; message?: string }> {
    try {
      const response = await medicalApi.post(`/TreatmentPlans/${planId}/progressions`, data)
      return { success: true, progressionId: response.data?.progressionId, message: response.data?.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data || 'Không thể ghi nhận diễn biến.' }
    }
  },

  async searchIcd10(search: string): Promise<Array<{ code: string; name: string; category: string }>> {
    try {
      const q = encodeURIComponent(search)
      const response = await medicalApi.get(`/Icd10?search=${q}`)
      return response.data || []
    } catch (error) {
      console.error('Failed to search ICD-10:', error)
      return []
    }
  }
}
