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
  doctorId: string
  symptoms: string
  diagnosis: string
  notes?: string
  createdAt?: string
  prescription?: Prescription | null
}

export interface Prescription {
  id?: string
  instructions?: string
  prescribedAt?: string
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
    symptoms: string
    diagnosis: string
    notes?: string
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
  }
}
