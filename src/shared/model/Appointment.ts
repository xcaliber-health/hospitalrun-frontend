import AbstractDBModel from './AbstractDBModel'

export default interface AppointmentDB extends AbstractDBModel {
  startDateTime: string
  endDateTime: string
  patient: string
  location: string
  reason: string
  type: string
}

export default interface Appointment {
  appointmentType: {
    text: string
  }
  participant: {
    actor: {
      reference: string
    }
  }[]
  id: string
  start: string
  end:string
  minutesDuration: number
  status: string
  patientId:string
}

