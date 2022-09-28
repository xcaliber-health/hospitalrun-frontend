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

export const getAllPatients = () => {
  return axios
    .get(`${endpoint}/Patient`, config)
    .then(async (response) => {
      console.log(response)
      const data = await response.data
      console.log(data)
      return data
    })
    .catch((error) => {
      console.log(error)
    })
}

export const getPatientNameById = (id: number) => {
  return axios
    .get(`${endpoint}/Patient/${id}`, config)
    .then(async (response) => {
      console.log(response)
      const data = await response.data
      console.log(data)
      console.log(data.data.name[0].given.join(' '))
      const name = data.data.name[0].given.join(' ')
      return name
    })
    .catch((error) => {
      console.log(error)
    })
}
