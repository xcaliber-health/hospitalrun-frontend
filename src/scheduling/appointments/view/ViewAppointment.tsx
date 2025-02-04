import { Spinner, Button, Modal, Toast } from '@hospitalrun/components'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import useAddBreadcrumbs from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useButtonToolbarSetter } from '../../../page-header/button-toolbar/ButtonBarProvider'
import { useUpdateTitle } from '../../../page-header/title/TitleContext'
import Loading from '../../../shared/components/Loading'
// import usePatient from '../../../patients/hooks/usePatient'
import useTranslator from '../../../shared/hooks/useTranslator'
import Appointment from '../../../shared/model/Appointment'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'
// import useAppointment from '../../hooks/useAppointment'
// import useDeleteAppointment from '../../hooks/useDeleteAppointment'
import AppointmentDetailForm from '../AppointmentDetailForm'
import { deleteAppointment, getAppointmentId } from '../service/Appointments'
import { getPatientNameById } from '../service/Patients'
import { getAppointmentLabel } from '../util/scheduling-appointment.util'
// import { getAppointmentLabel } from '../util/scheduling-appointment.util'
// import { Appointment } from '../ViewAppointments'

const ViewAppointment = () => {
  const { t } = useTranslator()
  const updateTitle = useUpdateTitle()

  useEffect(() => {
    if (updateTitle) {
      updateTitle(t('scheduling.appointments.viewAppointment'))
    }
  }, [updateTitle, t])

  const { id } = useParams<any>()
  const history = useHistory()
  // const [deleteMutate] = useDeleteAppointment()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
  const setButtonToolBar = useButtonToolbarSetter()
  const { permissions } = useSelector((state: RootState) => state.user)

  // const { data: appointment } = useAppointment(id)

  const [appointment, setAppointment] = useState<Appointment>()
  const [patientName, setPatientName] = useState<Patient>()
  const [isLoading, setIsLoading] = useState(true)

  const appointmentFunc = async () => {
    setAppointment(await getAppointmentId(id))
    setIsLoading(false)
  }

  const patientFunc = async () => {
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

  // const { data: patient } = usePatient(appointment ? appointment.patient : id)
  const breadcrumbs = [
    { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
    { text: appointment ? getAppointmentLabel(appointment) : '', location: `/patients/${id}` },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  const onAppointmentDeleteButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowDeleteConfirmation(true)
  }

  const onDeleteConfirmationButtonClick = async () => {
    if (!appointment) {
      return
    }

    console.log(appointment)

    // deleteMutate({ appointmentId: appointment.id }).then(() => {
    //   history.push('/appointments')
    //   Toast('success', t('states.success'), t('scheduling.appointment.successfullyDeleted'))
    // })

    let status = await deleteAppointment(parseInt(appointment.id))

    if (status === 'success') {
      history.push('/appointments')
      Toast('success', t('states.success'), t('scheduling.appointment.successfullyDeleted'))
    } else {
      Toast('error', t('states.error'), 'Could not delete appointment')
    }

    setShowDeleteConfirmation(false)
  }

  const getButtons = useCallback(() => {
    const buttons: React.ReactNode[] = []
    if (appointment && permissions.includes(Permissions.WriteAppointments)) {
      buttons.push(
        <Button
          key="editAppointmentButton"
          color="success"
          icon="edit"
          outlined
          onClick={() => {
            history.push(`/appointments/edit/${appointment.id}`)
          }}
        >
          {t('actions.edit')}
        </Button>,
      )
    }

    if (permissions.includes(Permissions.DeleteAppointment)) {
      buttons.push(
        <Button
          key="deleteAppointmentButton"
          color="danger"
          icon="appointment-remove"
          onClick={onAppointmentDeleteButtonClick}
        >
          {t('scheduling.appointments.deleteAppointment')}
        </Button>,
      )
    }

    return buttons
  }, [appointment, history, permissions, t])

  useEffect(() => {
    setButtonToolBar(getButtons())

    return () => {
      setButtonToolBar([])
    }
  }, [getButtons, setButtonToolBar])

  if (isLoading || appointment === undefined) {
    return <Loading />
  }

  return (
    <>
      {patientName && appointment ? (
        <div>
          <AppointmentDetailForm
            appointment={appointment}
            isEditable={false}
            patient={patientName}
          />
          <Modal
            body={t('scheduling.appointment.deleteConfirmationMessage')}
            buttonsAlignment="right"
            show={showDeleteConfirmation}
            closeButton={{
              children: t('actions.delete'),
              color: 'danger',
              onClick: onDeleteConfirmationButtonClick,
            }}
            title={t('actions.confirmDelete')}
            toggle={() => setShowDeleteConfirmation(false)}
          />
        </div>
      ) : (
        <Spinner type="BarLoader" loading />
      )}
    </>
  )
}

export default ViewAppointment
