import Appointment from '../../../shared/model/Appointment'
import Lab from '../../../shared/model/Lab'
import { PatientHistoryRecord, HistoryRecordType } from '../../../shared/model/PatientHistoryRecord'

export const convertLab = (lab: Lab): PatientHistoryRecord[] => {
  const labEvents = []
  if (lab.requestedOn) {
    labEvents.push({
      date: new Date(lab.requestedOn),
      type: HistoryRecordType.LAB,
      info: `Requested - ${lab.type}`,
      recordId: lab.id,
      id: `requestedLab${lab.id}`,
    })
  }
  if (lab.canceledOn) {
    labEvents.push({
      date: new Date(lab.canceledOn),
      type: HistoryRecordType.LAB,
      info: `Canceled - ${lab.type}`,
      recordId: lab.id,
      id: `canceledLab${lab.id}`,
    })
  } else if (lab.completedOn) {
    labEvents.push({
      date: new Date(lab.completedOn),
      type: HistoryRecordType.LAB,
      info: `Completed - ${lab.type}`,
      recordId: lab.id,
      id: `completedLab${lab.id}`,
    })
  }
  return labEvents
}

export const convertAppointment = (appt: Appointment): PatientHistoryRecord[] => {
  const apptEvents = []
  if (appt.start) {
    apptEvents.push({
      date: new Date(appt.start),
      type: HistoryRecordType.APPOINTMENT,
      info: `Started - ${appt.appointmentType.text}`,
      recordId: appt.id,
      id: `startedAppt${appt.id}`,
    })
  }
  if (new Date(appt.start).setMinutes(new Date(appt.start).getMinutes() + appt.minutesDuration)) {
    apptEvents.push({
      date: new Date(
        new Date(appt.start).setMinutes(new Date(appt.start).getMinutes() + appt.minutesDuration),
      ),
      type: HistoryRecordType.APPOINTMENT,
      info: `Ended - ${appt.appointmentType.text}`,
      recordId: appt.id,
      id: `endedAppt${appt.id}`,
    })
  }
  return apptEvents
}
