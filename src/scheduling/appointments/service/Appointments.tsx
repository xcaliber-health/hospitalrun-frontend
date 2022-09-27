import axios from 'axios'

const endpoint = 'https://xchange-blitz.xcaliberapis.com/api/v1'

const config = {
  headers: {
    Authorization:
      'Bearer U2FsdGVkX19caQ9ns7zpCc63TYcjet5+EwgvjJdFhoamk4ySvXGPdtFeEkmagYxF6V7M48JruyIoOKjRCQW86DYvsmkGugdlHEiaxV91ImmzDbkv0bfJ1haN9leQkbQecf0LpRSKzhBBRGefuihTM1CLaqJzjhvTCOQwHMVXiZpEToQSxp/EzRSnFYg80uLaqw465Pgl53yCTe4CyvES4Lrb6zGVd9nAyNDIutijH015OaYNIrlQJRJujlZl6qk6qzV3gEwcJPvfndw0/XdtsCwG/+AGVsqdI4DxifDUGDnIdsqnxTc0MrH8EUOlYT/BWZAVuZdVfqK4qsW+pPnLdCP4N3AqaIG8UKGM8yRlKsKAxTxUPbOSvHlJnyfCOazPOzyICqPuIpkUSh64enj8qw==',
    'x-source-id': '24f8d20c-fd00-4068-9f47-90887a1666ce',
  },
}

export const getAllPatients = () => {
  return axios
    .get(`${endpoint}/Patient?_count=10&_offset=1`, config)
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

export const getAppointment = () => {
  return axios
    .get(
      `${endpoint}/Appointment?departmentId=150&practiceId=195903&practitioner=140857915539458&patient=140919926030337`,
      config,
    )
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
