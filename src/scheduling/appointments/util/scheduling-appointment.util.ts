import Appointment from '../../../shared/model/Appointment'

const options : Intl.DateTimeFormatOptions= {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
}

function toLocaleString(date: Date) {
  return date.toLocaleString([],options)
}

export function getAppointmentLabel(appointment: Appointment | undefined) {
  if (!appointment) {
    return ''
  }

  const { id, start,minutesDuration} = appointment

  return start
    ? `${toLocaleString(new Date(start))} - ${toLocaleString(new Date(
      new Date(start).setMinutes(new Date(start).getMinutes() + minutesDuration),
    ))}`
    : id
}
