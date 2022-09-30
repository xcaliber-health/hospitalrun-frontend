import { Calendar, Button } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useButtonToolbarSetter } from '../../page-header/button-toolbar/ButtonBarProvider'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import FilterPatientModal from '../../patients/visits/FilterPatientModal'
import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Appointment from '../../shared/model/Appointment'
import { getAppointment } from './service/Appointments'
import { getPatientNameById } from './service/Patients'

interface Event {
  id: string
  patient: string
  start: Date
  end: Date
  title: string
  allDay: boolean
  type: string
  status: string
}

// export interface Appointment {
//   resource: {
//     appointmentType: {
//       text: string
//     }
//     participant: {
//       actor: {
//         reference: string
//       }
//     }[]
//     id: string
//     start: Date
//     minutesDuration: number
//     status: string
//   }
// }

const breadcrumbs = [{ i18nKey: 'scheduling.appointments.label', location: '/appointments' }]

const ViewAppointments = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('scheduling.appointments.label'))
  })
  const [appointments, setAppointment] = useState<any[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const setButtonToolBar = useButtonToolbarSetter()
  useAddBreadcrumbs(breadcrumbs, true)
  const [showFilter, setshowFilter] = useState(false)
  const [patientStatus, setpatientStatus] = useState('')
  const [appointmentType, setappointmentType] = useState('')

  const func = async () => {
    setAppointment(await getAppointment())
    setIsLoading(false)
    console.log('appointment data', await getAppointment())
  }

  useEffect(() => {
    func()
    // (async () => {
    //   setAppointment(await getAppointment())
    //   console.log('appointment data', await getAppointment())
    //   console.log('patient data', await getPatientNameById(140998131777537))
    // })()
  }, [])

  useEffect(() => {
    setButtonToolBar([
      <Button
        key="newAppointmentButton"
        outlined
        color="success"
        icon="appointment-add"
        onClick={() => history.push('/appointments/new')}
      >
        {t('scheduling.appointments.new')}
      </Button>,
      <Button key="Filter" outlined color="success" onClick={() => setshowFilter(!showFilter)}>
        Filter
      </Button>,
      <Button
        key="Clear Filter"
        outlined
        color="success"
        onClick={() => {
          setpatientStatus('')
          setappointmentType('')
        }}
      >
        Clear Filter
      </Button>,
    ])

    return () => {
      setButtonToolBar([])
    }
  }, [setButtonToolBar, history, t])

  useEffect(() => {
    if (appointments) {
      appointments.map(async (appointment: { resource: Appointment }) => {
        const patientName = await getPatientNameById(
          parseInt(String(appointment.resource.participant[0].actor.reference.substr(8))),
        )
        console.log('minutes duration: ', appointment.resource.minutesDuration)
        var end = new Date(appointment.resource.start)
        end.setMinutes(end.getMinutes() + appointment.resource.minutesDuration)
        console.log('start: ' + new Date(appointment.resource.start) + ' end: ' + end)
        setEvents((eventsArray) => [
          ...eventsArray,
          {
            id: appointment.resource.id,
            patient: appointment.resource.participant[0].actor.reference.substr(8),
            type: appointment.resource.appointmentType.text,
            start: new Date(appointment.resource.start),
            end: end,
            title: patientName,
            allDay: false,
            status: appointment.resource.status,
          },
        ])
      })
    }
  }, [appointments])

  if (isLoading || appointments === undefined) {
    return <Loading />
  }

  return (
    <div style={{ cursor: 'pointer' }}>
      <Calendar
        events={
          appointmentType.length !== 0 && patientStatus.length !== 0
            ? events.filter(
                (event) => event.status === patientStatus && event.type === appointmentType,
              )
            : patientStatus.length !== 0
            ? events.filter((event) => event.status === patientStatus)
            : appointmentType.length !== 0
            ? events.filter((event) => event.type === appointmentType)
            : events
        }
        onEventClick={(event) => {
          history.push({
            pathname: `/appointments/${event.id}`,
          })
        }}
      />
      <FilterPatientModal
        show={showFilter}
        onCloseButtonClick={() => setshowFilter(false)}
        onFieldChange={(patientId: any, type: any) => {
          setpatientStatus(patientId)
          setappointmentType(type)
        }}
      />
    </div>
  )
}

export default ViewAppointments
