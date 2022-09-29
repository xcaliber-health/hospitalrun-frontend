// import { Button, Spinner, Toast } from '@hospitalrun/components'
import { Button, Spinner, Toast } from '@hospitalrun/components'
import isEmpty from 'lodash/isEmpty'
// import addMinutes from 'date-fns/addMinutes'
// import roundToNearestMinutes from 'date-fns/roundToNearestMinutes'
// import isEmpty from 'lodash/isEmpty'
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import useAddBreadcrumbs from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../../page-header/title/TitleContext'
import useTranslator from '../../../shared/hooks/useTranslator'
import Appointment from '../../../shared/model/Appointment'
// import Appointment from '../../../shared/model/Appointment'
import Patient from '../../../shared/model/Patient'
import useScheduleAppointment from '../../hooks/useScheduleAppointment'
import AppointmentDetailForm from '../AppointmentDetailForm'
import { createAppointment } from '../service/Appointments'
import { AppointmentError } from '../util/validate-appointment'
// import { Appointment } from '../ViewAppointments'

const breadcrumbs = [
  { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
  { i18nKey: 'scheduling.appointments.new', location: '/appointments/new' },
]

interface LocationProps {
  pathname: string
  state?: {
    patient: Patient
  }
}

const NewAppointment = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const location: LocationProps = useLocation()
  const patient = location.state?.patient
  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('scheduling.appointments.new'))
  })
  useAddBreadcrumbs(breadcrumbs, true)

  // const startDateTime = roundToNearestMinutes(new Date(), { nearestTo: 15 })
  // const endDateTime = addMinutes(startDateTime, 60)
  const [saved, setSaved] = useState(false)
  const [newAppointmentMutateError, setError] = useState<AppointmentError>({} as AppointmentError)

  const [newAppointment, setAppointment] = useState({} as Appointment)

  const [aptId, setAptId] = useState()

  const {
    mutate: newAppointmentMutate,
    isLoading: isLoadingNewAppointment,
    isError: isErrorNewAppointment,
    validator: validateNewAppointment,
  } = useScheduleAppointment()

  const onCancelClick = () => {
    history.push('/appointments')
  }

  // const func = async () => {
  //   return await createAppointment(newAppointment)
  // }

  const onSave = async () => {
    console.log(newAppointment)
    let data = await createAppointment(newAppointment)
    console.log('data', await data)
    setAptId(await data)
    setSaved(true)
    setError(validateNewAppointment(newAppointment))
  }

  useEffect(() => {
    console.log(newAppointment)
  }, [newAppointment])

  useEffect(() => {
    // if save click and no error proceed, else give error message.
    if (saved) {
      if (isEmpty(newAppointmentMutateError) && !isErrorNewAppointment) {
        newAppointmentMutate(newAppointment).then((_result) => {
          Toast('success', t('states.success'), t('scheduling.appointment.successfullyCreated'))
          console.log(aptId)
          history.push(`/appointments/${aptId}`)
        })
      } else if (!isEmpty(newAppointmentMutateError)) {
        newAppointmentMutateError.message = 'scheduling.appointment.errors.createAppointmentError'
      }
    }
    setSaved(false)
  }, [
    saved,
    newAppointmentMutateError,
    isErrorNewAppointment,
    newAppointmentMutate,
    newAppointment,
    t,
    history,
  ])

  if (isLoadingNewAppointment) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  return (
    <div>
      <form aria-label="new appointment form">
        <AppointmentDetailForm
          appointment={newAppointment as Appointment}
          patient={patient as Patient}
          error={newAppointmentMutateError}
          setAppointment={async (appointmentDetail) => {
            setAppointment({ ...appointmentDetail })
          }}
        />
        <div className="row float-right">
          <div className="btn-group btn-group-lg mr-3">
            <Button className="mr-2" color="success" onClick={onSave}>
              {t('scheduling.appointments.createAppointment')}
            </Button>
            <Button color="danger" onClick={onCancelClick}>
              {t('actions.cancel')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewAppointment
