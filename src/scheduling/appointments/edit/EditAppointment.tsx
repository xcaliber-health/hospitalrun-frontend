import { Button, Spinner, Toast } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useAddBreadcrumbs from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../../page-header/title/TitleContext'
import useTranslator from '../../../shared/hooks/useTranslator'
import Appointment from '../../../shared/model/Appointment'
import Patient from '../../../shared/model/Patient'
import AppointmentDetailForm from '../AppointmentDetailForm'
import { getAppointmentId, updateAppointment } from '../service/Appointments'
import { getPatientNameById } from '../service/Patients'
import { getAppointmentLabel } from '../util/scheduling-appointment.util'

const EditAppointment = () => {
  const { t } = useTranslator()
  const { id } = useParams<any>()

  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('scheduling.appointments.editAppointment'))
  }, [updateTitle, t])
  const history = useHistory()

  const [appointment, setAppointment] = useState({} as Appointment)
  const [patientName, setPatientName] = useState<Patient>()

  const appointmentFunc = async () => {
    setAppointment(await getAppointmentId(id))
  }

  const patientFunc = async () => {
    if (Array.isArray(appointment.participant))
      setPatientName(
        await getPatientNameById(
          parseInt(String(appointment?.participant[0].actor.reference.substr(8))),
        ),
      )
  }

  useEffect(() => {
    console.log(id)
    appointmentFunc()
  }, [])

  useEffect(() => {
    if (appointment) {
      console.log('view appointment', appointment)
      patientFunc()
    }
  }, [appointment])

  useEffect(() => {
    console.log('editing appointment', appointment)
  }, [appointment])

  const breadcrumbs = [
    { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
    {
      text: getAppointmentLabel(appointment),
      location: `/appointments/${id}`,
    },
    {
      i18nKey: 'scheduling.appointments.editAppointment',
      location: `/appointments/edit/${id}`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  const onCancel = () => {
    history.push(`/appointments/${id}`)
  }

  const onSave = async () => {
    console.log(appointment)
    let { id, status } = await updateAppointment(appointment)
    console.log('response id', id)
    console.log('response status', status)
    if (status === 'success') {
      console.log('updated the values successfully')
      Toast('success', t('states.success'), t('scheduling.appointment.successfullyUpdated'))
      history.push(`/appointments/${id}`)
    }
  }

  // if (isLoadingAppointment || isLoadingUpdate) {
  //   return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  // }

  // if (isLoadingAppointment) {
  //   return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  // }

  return (
    <>
      {patientName && appointment ? (
        <div>
          <AppointmentDetailForm
            isEditable
            appointment={appointment}
            patient={patientName}
            setAppointment={(appointmentDetail) => {
              setAppointment({ ...appointmentDetail })
            }}
          />
          <div className="row float-right">
            <div className="btn-group btn-group-lg mr-3">
              <Button className="mr-2" color="success" onClick={onSave}>
                {t('scheduling.appointments.updateAppointment')}
              </Button>
              <Button color="danger" onClick={onCancel}>
                {t('actions.cancel')}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Spinner type="BarLoader" loading />
      )}
    </>
  )
}

export default EditAppointment
