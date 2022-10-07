import { Select, Label, Alert } from '@hospitalrun/components'
import { addMinutes, roundToNearestMinutes } from 'date-fns'
import moment from 'moment'
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

  const startDateTime = roundToNearestMinutes(new Date(), { nearestTo: 15 })
  const endDateTime = addMinutes(startDateTime, 60)

  if (!appointment.start) {
    appointment.start = String(new Date(Date.now()))
  }

  if (!appointment.end) {
    appointment.end = String(endDateTime)
  }

  if (!appointment.minutesDuration) {
    appointment.minutesDuration = Math.round(
      Math.floor(
        (new Date(appointment.end).getTime() - new Date(appointment.start).getTime()) / 60000 / 5,
      ) * 5,
    )
  }

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
              defaultInputValue={patient ? String(patient) : ''}
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
            value={appointment?.start ? new Date(appointment.start) : new Date(Date.now())}
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
            value={
              appointment?.start && appointment.minutesDuration
                ? moment(appointment.start).add(appointment.minutesDuration, 'minute').toDate()
                : endDateTime
            }
            isEditable={isEditable}
            onChange={(date: Date) => {
              appointment.end = String(date)
              var difference =
                new Date(appointment.end).getTime() - new Date(appointment.start).getTime()
              appointment.minutesDuration = Math.round(difference / 60000)
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
