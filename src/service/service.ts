import axios from 'axios'
import dotenv from 'dotenv'
// import { format } from 'date-fns'
import { TableData } from '../patients/search/ViewPatientsTable'
import moment from 'moment'
import { range } from 'lodash'
import { useMemo } from 'react'
dotenv.config()

const endpointUrl = 'https://xchange-blitz.xcaliberapis.com/api/v1'

const config = {
  headers: {
    Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
    'x-source-id': `${process.env.REACT_APP_XSOURCEID}`,
  },
}

const dateParser = (item: any) => {
  var date = new Date(item)
  console.log('date: ', date)
  // var formattedDate = format(date, 'yyyy-mm-dd')
  var formattedDate = moment(date).format('YYYY-MM-DD')
  console.log('formattedDate', formattedDate)
  // let year = formattedDate.substring(0, 5)
  // let month = formattedDate.substring(5, 7)
  // if (parseInt(month) < 10) {
  //   month = '0' + (parseInt(month) + 1)
  // } else {
  //   month = '' + (parseInt(month) + 1)
  // }
  // let day = formattedDate.substring(7, 10)
  // let finalDate = year + month + day
  // console.log("finaldate",finalDate)
  return formattedDate
}

export const deParsefunc = (item: TableData) => {
  let finalDate = dateParser(item.dateOfBirth)

  let tempObj = {
    context: {
      requestId: '5b316a07ceb2ee6422f53b837b65c4d0',
      source: 'ELATION',
      quorum: true,
      notify: true,
    },
    data: {
      resourceType: 'Patient',

      name: [
        {
          use: 'official',
          family: item.familyName,
          given: [item.givenName, item.suffix],
          text: item.givenName + ' ' + item.suffix + ' ' + item.familyName,
        },
      ],
      identifier: [
        {
          type: {
            text: 'ssn',
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                code: 'SS',
              },
            ],
          },
          system: 'http://hl7.org/fhir/sid/us-ssn',
          value: null,
        },
      ],
      address: tableObjDeparser(item.addresses, 'address'),
      birthDate: finalDate,
      gender: item.sex,
      generalPractitioner: [
        {
          reference: 'Practitioner/140857915539458',
        },
      ],
      contact: [
        {
          name: {
            use: 'official',
            family: 'EmergencyLName',
            given: ['EmergencyFName', ''],
            text: 'EmergencyFName EmergencyLName',
          },
          relationship: [
            {
              text: 'Child',
              coding: [
                {
                  code: 'C',
                  display: 'Emergency Contact',
                },
              ],
            },
          ],
          telecom: [
            {
              system: 'phone',
              value: '9876567898',
            },
          ],
          address: {
            line: ['test emergency address', '#456'],
            city: 'test emergency city',
            state: 'AL',
            postalCode: '98765',
          },
        },
      ],
      extension: [
        {
          url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex',
          valueCode: 'Male',
        },
        {
          url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity',
          valueString: 'Hispanic or Latino',
        },
        {
          url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race',
          valueString: 'Black or African American',
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/gender-marker',
          valueString: 'F',
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/pronouns',
          valueString: 'she_her_hers',
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/sexual-orientation',
          valueString: 'prefer_not_to_say',
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/notes',
          valueString: 'Test notes',
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/provider.html',
          valueString: 140983539597314,
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/provider-npi.html',
          valueString: '1730691296',
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/master-patient',
          valueString: 141002016555288,
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/created-date',
          valueString: '2022-09-28T08:07:14Z',
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/practice',
          valueInteger: 140857911017476,
        },
        {
          url: 'http://xcaliber-fhir/structureDefinition/modified-date',
          valueDateTime: '2022-09-28T08:07:14Z',
        },
      ],
      telecom: phnEmlParser(item.phoneNumbers, item.emails),
      meta: null,
      contained: [
        {
          resourceType: 'RelatedPerson',
          id: 141002015965544,
          name: [
            {
              use: 'official',
              family: 'Test',
              given: ['Other', ''],
            },
          ],
          relationship: [
            {
              coding: [
                {
                  code: 'O',
                },
              ],
              text: 'Other',
            },
          ],
          address: [
            {
              line: ['101 Lane Street'],
              city: 'Madison',
              state: 'WI',
              postalCode: '53711',
            },
          ],
          telecom: [
            {
              value: '1231231233',
            },
          ],
        },
      ],
      communication: [],
    },
  }
  return tempObj
}

export const tableObjParser = (dataM: any, type: string) => {
  let count = 1
  let ads: any = []
  if (type === 'address') {
    dataM?.map((data: any) => {
      let adsObj: any = { id: '' + count, value: '', type: 'home' }
      let ad = ''
      let line = data.line?.map((i: any) => {
        ad += i + ' '
      })
      console.log(line)
      console.log(ad)
      adsObj.value = ad
      ads.push(adsObj)
      count++
    })
  } else if (type === 'phone') {
    dataM?.map((data: any) => {
      if (data.system === 'phone') {
        let phnObj: any = { id: '' + count, value: data.value, type: data.use }
        ads.push(phnObj)
      }
    })
  } else {
    dataM?.map((data: any) => {
      let emlObj: any = { id: '' + count, value: data.value, type: 'mobile' }
      if (data.system === 'email') {
        ads.push(emlObj)
      }
    })
  }

  return ads
}

export const tableObjDeparser = (data: any, type: any) => {
  let ads: any = []

  if (type === 'address') {
    data?.map((item: any) => {
      let obj: any = { line: [], city: 'Madison', state: 'WI', postalCode: '53711' }
      obj.line[0] = item.value
      obj.line[1] = ' '
      ads.push(obj)
    })
  }
  return ads
}

export const phnEmlParser = (phnData: any, emlData: any) => {
  let ads: any = []

  phnData?.map((item: any) => {
    let obj: any = { system: 'phone', value: item.value, use: item.type }
    ads.push(obj)
  })

  emlData?.map((item: any) => {
    let obj: any = { system: 'email', value: item.value }
    ads.push(obj)
  })

  return ads
}

export const parserFunc = (data: any) => {
  let dataHolder: TableData[] = []
  data?.map((item: any) => {
    let tempObj: TableData = {}
    tempObj.bloodType = 'bloodType'
    tempObj.addresses = tableObjParser(item.resource.address, 'address')
    tempObj.code = item.resource.id
    tempObj.dateOfBirth = item.resource.birthDate
    tempObj.familyName = item.resource.name[0].family
    tempObj.fullName = item.resource.name[0].text
    tempObj.givenName = item.resource.name[0].given[0]
    tempObj.suffix = item.resource.name[0].given[1]
    tempObj.id = item.resource.id
    tempObj.sex = item.resource.gender
    tempObj.type = 'mockType'
    dataHolder.push(tempObj)
  })
  return dataHolder
}

const parserFuncSingle = (item: any) => {
  let tempObj: TableData = {}
  tempObj.bloodType = 'bloodType'
  tempObj.addresses = tableObjParser(item.address, 'address')
  tempObj.code = item.id
  tempObj.dateOfBirth = item.birthDate
  tempObj.familyName = item.name[0].family
  tempObj.fullName = item.name[0].text
  tempObj.givenName = item.name[0].given[0]
  tempObj.suffix = item.name[0].given[1]
  tempObj.id = item.id
  tempObj.sex = item.gender
  tempObj.type = 'mockType'
  tempObj.phoneNumbers = tableObjParser(item.telecom, 'phone')
  tempObj.emails = tableObjParser(item.telecom, 'email')
  console.log('tempObj:', tempObj)
  return tempObj
}

export const getAllPatients = () => {
  return axios
    .get(`${endpointUrl}/Patient`, config)
    .then(async (response) => {
      console.log(response)
      const data = await response.data
      const parsedData = parserFunc(data.data.entry)
      return parsedData
    })
    .catch((error) => {
      console.log(error)
    })
}

export const getPatientCount = async (name?: string) => {
  try {
    name = !name ? '' : name;
    const response = await axios.get(`${endpointUrl}/Patient?_count=1&_offset=1&name=${name}`,config)

    const patients = response.data.data.total;
    return patients;
  }
  catch(err) {
    console.log(err)
  }
}

export const getPatient = (id: string) => {
  return axios
    .get(`${endpointUrl}/Patient/${id}`, config)
    .then(async (response) => {
      const data = await response.data
      const parsedData = parserFuncSingle(data.data)
      return parsedData
    })
    .catch((error) => {
      console.log(error)
    })
}


export const getPatientsAtPage = (page: number, name?: string) => {
  name = !name ? '' : name;
  const offset = ((page*10)-10) + 1;
  return axios
    .get(`${endpointUrl}/Patient?_count=10&_offset=${offset}&name=${name}`, config)
    .then(async (response) => {
      const data = await response.data
      console.log(data.data.entry);
      const parsedData = parserFunc(data.data.entry);
      return parsedData
    })
    .catch((error) => {
      console.log(error)
    })
}

export const addPatient = (patient: any) => {
  let d = deParsefunc(patient)
  return axios
    .post(`${endpointUrl}/Patient`, d, config)
    .then(async (response) => {
      console.log(response)
      const data = await response
      console.log(data.data.data)
      return data.data.data
    })
    .catch((error) => {
      console.log(error)
    })
}

export const editPatient = (patient: any, id: any) => {
  console.log('>>>>>>>>>Patient', patient)
  let d = deParsefunc(patient)
  console.log('>>>>>>>>d', d)
  return axios
    .put(`${endpointUrl}/Patient/${id}`, d, config)
    .then(async (response) => {
      console.log(response)
      const data = await response
      console.log(data.data.data)
      return data.data.data
    })
    .catch((error) => {
      console.log(error)
    })
}



export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage
}: any) => {
  const DOTS = '...';
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }
	
    /*
    	Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /*
    	Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    /*
    	Case 3: No right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }
     
    /*
    	Case 4: Both left and right dots to be shown
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    else {
      return [];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};
