import axios from 'axios'
import dotenv from 'dotenv'
import Appointment from '../../../shared/model/Appointment'
dotenv.config()

const endpoint = `${process.env.REACT_APP_ENDPOINT}`

const config = {
  headers: {
    Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
    'x-source-id': `${process.env.REACT_APP_XSOURCEID}`,
  },
}

export const getAppointment = () => {
  return axios
    .get(`${endpoint}/Appointment?practitioner=140857915539458`, config)
    .then(async (response) => {
      console.log(response)
      const data = await response.data
      console.log(data)
      console.log(data.data.entry)
      return data.data.entry
    })
    .catch((error) => {
      console.log(error)
    })
}

export const getAppointmentId = (id: number) => {
  return axios
    .get(`${endpoint}/Appointment/${id}`, config)
    .then(async (response) => {
      console.log(response)
      const data = await response.data
      console.log(data)
      console.log(data.data)
      return data.data
    })
    .catch((error) => {
      console.log(error)
    })
}

export const createAppointment = (appointment: Appointment) => {
  console.log(appointment)

  const data = {
    data: {
      resourceType: 'Appointment',
      start: new Date(appointment.start),
      minutesDuration: appointment.minutesDuration,
      description: '',
      meta: {},
      created: new Date(Date.now()),
      status: appointment.status ? appointment.status : 'Scheduled',
      participant: [
        {
          actor: {
            reference: `Patient/${appointment.patientId}`,
          },
        },
        {
          actor: {
            reference: 'Practitioner/140857915539458',
          },
        },
        {
          actor: {
            reference: 'HealthcareService/140857911017476',
          },
        },
      ],
      extension: [
        {
          url: 'http://xcaliber-fhir/structureDefinition/slot-type',
          valueString: 'appointment',
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/appointment-mode',
          valueString: 'IN_PERSON',
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/status',
          extension: [
            {
              url: 'http://xcaliber-fhir/structureDefinition/status',
              valueString: `${appointment.status ? appointment.status : 'Scheduled'}`,
            },
            {
              url: 'http://xcaliber-fhir/structureDefinition/room',
              valueString: null,
            },
          ],
        },
      ],
      appointmentType: {
        coding: [
          {
            system: 'https://hl7.org/fhir/v2/ValueSet/appointment-type',
            code: `${
              appointment.appointmentType ? appointment.appointmentType.text : 'Routine Visit'
            }`,
            display: `${
              appointment.appointmentType ? appointment.appointmentType.text : 'Routine Visit'
            }`,
          },
        ],
        text: `${appointment.appointmentType ? appointment.appointmentType.text : 'Routine Visit'}`,
      },
      patientInstruction: null,
      contained: [],
    },
  }

  console.log(data)

  return axios
    .post(`${endpoint}/Appointment`, data, config)
    .then(async (response) => {
      console.log(response)
      const data = response.data
      console.log(data.data)
      return data.data
    })
    .catch((error) => {
      console.log(error)
      return { id: 404, status: 'error' }
    })
}

export const updateAppointment = (appointment: Appointment) => {
  console.log(appointment)
  const data = {
    data: {
      resourceType: 'Appointment',
      start: new Date(appointment.start),
      minutesDuration: appointment.minutesDuration,
      description: '',
      meta: {},
      created: new Date(Date.now()),
      status: appointment.status,
      participant: [
        {
          actor: {
            reference: `Patient/${
              appointment.patientId
                ? appointment.patientId
                : appointment?.participant[0].actor.reference.substring(8)
            }`,
          },
        },
        {
          actor: {
            reference: 'Practitioner/140857915539458',
          },
        },
        {
          actor: {
            reference: 'HealthcareService/140857911017476',
          },
        },
      ],
      extension: [
        {
          url: 'http://xcaliber-fhir/structureDefinition/slot-type',
          valueString: 'appointment',
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/appointment-mode',
          valueString: 'IN_PERSON',
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/status',
          extension: [
            {
              url: 'http://xcaliber-fhir/structureDefinition/status',
              valueString: `${appointment.status ? appointment.status : 'Scheduled'}`,
            },
            {
              url: 'http://xcaliber-fhir/structureDefinition/room',
              valueString: null,
            },
          ],
        },
      ],
      appointmentType: {
        coding: [
          {
            system: 'https://hl7.org/fhir/v2/ValueSet/appointment-type',
            code: `${
              appointment.appointmentType.text ? appointment.appointmentType.text : 'Routine visit'
            }`,
            display: `${
              appointment.appointmentType.text ? appointment.appointmentType.text : 'Routine visit'
            }`,
          },
        ],
        text: `${
          appointment.appointmentType.text ? appointment.appointmentType.text : 'Routine visit'
        }`,
      },
      patientInstruction: null,
      contained: [],
    },
  }

  console.log(data)
  return axios
    .put(`${endpoint}/Appointment/${appointment.id}`, data, config)
    .then(async (response) => {
      console.log(response)
      const data = response.data
      console.log(data.data)
      return data.data
    })
    .catch((error) => {
      console.log(error)
      return { id: 404, status: 'error' }
    })
}

export const deleteAppointment = (id: number) => {
  return axios
    .delete(`${endpoint}/Appointment/${id}`, config)
    .then((response) => {
      console.log(response)
      return 'success'
    })
    .catch((error) => {
      console.log(error)
      return 'error'
    })
}
