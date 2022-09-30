import { Label, DateTimePicker } from '@hospitalrun/components'
import React from 'react'
import moment from 'moment'

interface Props {
  name: string
  label: string
  value: Date
  isEditable?: boolean
  isRequired?: boolean
  onChange?: (date: Date) => void
  feedback?: string
  isInvalid?: boolean
}

const DateTimePickerWithLabelFormGroup = (props: Props) => {
  const { onChange, label, name, isEditable, value, isRequired, feedback, isInvalid } = props
  const id = `${name}DateTimePicker`
  return (
    <div className="form-group" data-testid={id}>
      <Label text={label} isRequired={isRequired} htmlFor={id} />
      <DateTimePicker
        dateFormat="MM/dd/yyyy h:mm aa"
        dateFormatCalendar="LLLL yyyy"
        dropdownMode="scroll"
        disabled={!isEditable}
        selected={value}
        isInvalid={isInvalid}
        feedback={feedback}
        onChange={(inputDate) => {
          console.log('date time picker', inputDate)
          if (onChange) {
            onChange(new Date(inputDate))
          }
        }}
        showTimeSelect
        timeCaption="time"
        timeFormat="h:mm aa"
        timeIntervals={15}
        withPortal={false}
        minDate={moment().toDate()}
        maxDate={moment().add(3, 'months').toDate()}
        minTime={moment().toDate()}
        maxTime={new Date(new Date().setHours(19, 0, 0, 0))}
      />
    </div>
  )
}

export default DateTimePickerWithLabelFormGroup
