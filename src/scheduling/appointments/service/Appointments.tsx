import axios from 'axios'
import dotenv from 'dotenv'
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
