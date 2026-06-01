declare module '@/services/appointmentService' {
  interface Appointment {
    id: string | number;
    status: number;
    // add other fields as needed
    [key: string]: any;
  }

  export const appointmentService: {
    getAllAppointments(): Promise<Appointment[]>;
    getPendingAppointments(): Promise<Appointment[]>;
    bookAppointment(data: any): Promise<any>;
    approveAppointment(id: string | number): Promise<any>;
    generateSlots(doctorId: string | number, date: string): Promise<any>;
    getAvailableSlots(doctorId: string | number, date: string): Promise<any>;
    cancelAppointment(id: string | number): Promise<any>;
    updateAppointment(id: string | number, data: any): Promise<any>;
  };
}
