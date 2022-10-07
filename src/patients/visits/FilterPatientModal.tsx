import React, { useState } from 'react'
import { Label, Modal, Select } from '@hospitalrun/components'
import useTranslator from '../../shared/hooks/useTranslator'
import { Button } from 'react-bootstrap'
import {
  appointmentStatus,
  appointmentTypes,
} from '../../scheduling/appointments/constants/Appointment'
// import { getAllPatients } from '../../scheduling/appointments/service/Patients'

interface Props {
  show: boolean
  onCloseButtonClick: () => void
  onFieldChange?: (patientId: any, type: any) => void
}

const FilterPatientModal = ({ show, onCloseButtonClick, onFieldChange }: Props) => {
  // const func = () => {
  //   console.log('ALL PATIENTS DATA', getAllPatients())
  // }

  // useEffect(() => {
  //   func()
  // }, [])

  const { t } = useTranslator()

  const [patientStatus, setPatientStatus] = useState('')
  const [appointmentType, setappointmentType] = useState('')

  const clearValues = () => {
    setPatientStatus('')
    setappointmentType('')
  }

  const body = (
    <div className="row">
      <div className="col">
        <div className="form-group">
          <Label text={t('scheduling.appointment.type')} title="type" />
          <Select
            id="type"
            defaultSelected={appointmentTypes.filter(({ value }) => value === appointmentType)}
            options={appointmentTypes}
            onChange={(values) => setappointmentType(values[0])}
          />
        </div>
        <div className="form-group">
          <Label text="Status" title="Status" />
          <Select
            defaultSelected={appointmentStatus.filter(({ value }) => value == patientStatus)}
            id="status"
            options={appointmentStatus}
            onChange={(values) => setPatientStatus(values[0])}
          />
        </div>
        <Button
          onClick={() => {
            onFieldChange && onFieldChange(patientStatus, appointmentType)
            clearValues()
            onCloseButtonClick()
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  )

  return <Modal show={show} toggle={onCloseButtonClick} body={body} />
}

export default FilterPatientModal
