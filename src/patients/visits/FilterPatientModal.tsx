import React, { useState } from 'react'
import { Label, Modal, Select } from '@hospitalrun/components'
import useTranslator from '../../shared/hooks/useTranslator'
import { Button } from 'react-bootstrap'
import { appointmentTypes } from '../../scheduling/appointments/constants/Appointment'

interface Props {
  show: boolean
  onCloseButtonClick: () => void
  onFieldChange?: (patientId: any, type: any) => void
}

const FilterPatientModal = ({ show, onCloseButtonClick, onFieldChange }: Props) => {
  const { t } = useTranslator()

  const [patientId, setpatientId] = useState('')
  const [appointmentType, setappointmentType] = useState('')

  const clearValues = () => {
    setpatientId('')
    setappointmentType('')
  }

  const body = (
    <div className="row">
      <div className="col">
        <div className="form-group">
          <Label text={t('scheduling.appointment.type')} title="type" />
          <Select
            id="type"
            options={appointmentTypes}
            onChange={(values) => setappointmentType(values[0])}
          />
        </div>
        <Button
          onClick={() => {
            onFieldChange && onFieldChange(patientId, appointmentType)
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
