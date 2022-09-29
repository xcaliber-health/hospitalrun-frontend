import { Select, Label, Alert } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import DateTimePickerWithLabelFormGroup from '../../shared/components/input/DateTimePickerWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import Appointment from '../../shared/model/Appointment'
import Patient from '../../shared/model/Patient'
import { appointmentTypes, appointmentStatus } from '../appointments/constants/Appointment'
import { getAllPatients } from './service/Patients'

interface Props {
  appointment: Appointment
  patient?: Patient
  isEditable: boolean
  error?: any
  onFieldChange?: (key: string, value: string | boolean | Date | number) => void
  setAppointment?: (appointment: Appointment) => void
}

const AppointmentDetailForm = (props: Props) => {
  const { appointment, patient, isEditable, error, setAppointment } = props
  const { t } = useTranslator()
  const [patientDetails, setPatientDetails] = useState<any>()
  const [options, setOptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // const selectedValues: any[] = []

  // const patientName: string = String(patient)
  // console.log(patientName)
  // if (patientName) {
  //   selectedValues.push(patientName)
  //   console.log('selected values', selectedValues)
  // }

  useEffect(() => {
    console.log('appointment details', appointment)
    if (!patientDetails) {
      ;(async () => {
        setPatientDetails(await getAllPatients())
      })()
    }
  }, [])

  return (
    <>
      {error?.message && <Alert className="alert" color="danger" message={t(error?.message)} />}
      <div className="row">
        <div className="col">
          <div className="form-group">
            <Label
              htmlFor="patientTypeahead"
              isRequired
              text={t('scheduling.appointment.patient')}
            />
            <AsyncTypeahead
              id="patientTypeahead"
              disabled={!isEditable || patient !== undefined}
              defaultInputValue={String(patient)}
              placeholder={t('scheduling.appointment.patient')}
              onChange={(p: any) => {
                appointment.patientId = p[0] && p[0].resource.id
              }}
              onSearch={async (query: string) => {
                setIsLoading(true)
                setOptions(
                  patientDetails?.filter((detail: any) =>
                    String(detail.resource.name[0].text)
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  ),
                )
                setIsLoading(false)
              }}
              options={options}
              labelKey={(option) => `${option.resource?.name[0].text} `}
              renderMenuItemChildren={(p: any) => {
                return <div>{`${p.resource.name[0].text} ${p.resource.id}`}</div>
              }}
              isInvalid={!!error?.patient}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <DateTimePickerWithLabelFormGroup
            name="startDate"
            label={t('scheduling.appointment.startDate')}
            value={appointment.start ? new Date(appointment.start) : new Date(Date.now())}
            isEditable={isEditable}
            isInvalid={error?.startDateTime}
            feedback={t(error?.startDateTime)}
            onChange={(date: Date) => {
              appointment.start = String(date)
              if (setAppointment) setAppointment(appointment)
            }}
            isRequired
          />
        </div>
        <div className="col">
          <DateTimePickerWithLabelFormGroup
            name="endDate"
            label={t('scheduling.appointment.endDate')}
            value={appointment.end ? new Date(appointment.end) : new Date(Date.now())}
            isEditable={isEditable}
            onChange={(date: Date) => {
              appointment.end = String(date)
              if (new Date(appointment.end) < new Date(appointment.start)) {
                appointment.end = JSON.stringify(new Date(appointment.start))
              }
              appointment.minutesDuration =
                new Date(appointment.end).getMinutes() - new Date(appointment.start).getMinutes()
              if (setAppointment) setAppointment(appointment)
            }}
            isRequired
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-group" data-testid="typeSelect">
            <Label text={t('scheduling.appointment.type')} title="type" />
            <Select
              id="type"
              options={appointmentTypes}
              defaultSelected={appointmentTypes.filter(
                ({ value }) => value === appointment?.appointmentType?.text,
              )}
              onChange={(values) => {
                appointment.appointmentType = { text: values[0] }
                if (setAppointment) setAppointment(appointment)
              }}
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-group" data-testid="typeSelect">
            <Label text="Status" title="Status" />
            <Select
              id="status"
              options={appointmentStatus}
              defaultSelected={appointmentStatus.filter(
                ({ value }) => value == appointment?.status,
              )}
              onChange={(values) => {
                appointment.status = values[0]
                if (setAppointment) setAppointment(appointment)
              }}
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>
    </>
  )
}

AppointmentDetailForm.defaultProps = {
  isEditable: true,
}

export default AppointmentDetailForm
