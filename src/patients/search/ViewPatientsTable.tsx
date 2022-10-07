import { Table } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getAllPatients } from '../../service/service'
import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import { formatDate } from '../../shared/util/formatDate'
import usePatients from '../hooks/usePatients'
import PatientSearchRequest from '../models/PatientSearchRequest'
import NoPatientsExist from './NoPatientsExist'

export interface Props {
  searchRequest: PatientSearchRequest
  filtered: Boolean
  patientData: Patient[]
}

export interface TableObj {
  id: string
  type: string
  value: string
}

export interface TableData {
  addresses?: TableObj[]
  bloodType?: string
  code?: string
  createdAt?: any
  dateOfBirth?: any
  emails?: TableObj[]
  familyName?: string
  fullName?: string
  givenName?: string
  id?: string
  occupation?: string
  phoneNumbers?: TableObj[]
  preferredLanuage?: string
  prefix?: string
  rev?: string
  sex?: string
  type?: string
  updatedAt?: any
  suffix?: string
}

const ViewPatientsTable = (props: Props) => {
  const { searchRequest } = props
  const { t } = useTranslator()
  const history = useHistory()
  const { data, status } = usePatients(searchRequest)
  const [awaitd, setAwait] = useState(true)
  const [newData, setNewData] = useState<{ patients: any; totalCount: number }>({
    patients: [],
    totalCount: 0,
  })

  const func = async () => {
    const d: any = await getAllPatients()
    console.log('data', d)
    // const newData =await parserFunc(d.data.entry)
    // console.log('parsedFuncdata', newData)
    // console.log('parsedFunc', newData)
    let mock = { patients: d, totalCount: d.length }
    console.log('mock: ', mock)
    setNewData(mock)
    setAwait(false)
    console.log('data2: ', newData)
  }

  useEffect(() => {
    func()
  }, [])

  if (awaitd) {
    console.log(status)
    return <Loading />
  }

  if (newData.totalCount === 0) {
    return <NoPatientsExist />
  }

  return (
    <>
      {console.log('newData: ', newData)}
      {console.log('olddata: ', data)}

      <Table
        data={props.filtered ? props.patientData : newData.patients}
        getID={(row: any) => row.id}
        columns={[
          { label: t('patient.code'), key: 'code' },
          { label: t('patient.givenName'), key: 'givenName' },
          { label: t('patient.familyName'), key: 'familyName' },
          { label: t('patient.sex'), key: 'sex' },
          {
            label: t('patient.dateOfBirth'),
            key: 'dateOfBirth',
            formatter: (row) => formatDate(row.dateOfBirth),
          },
        ]}
        actionsHeaderText={t('actions.label')}
        actions={[
          { label: t('actions.view'), action: (row) => history.push(`/patients/${row.id}`) },
        ]}
      />
    </>
  )
}

export default ViewPatientsTable

// import { Table } from '@hospitalrun/components'
// import React, { useEffect, useState } from 'react'
// import { useHistory } from 'react-router-dom'
// import { getAllPatients } from '../../service/service'
// import Loading from '../../shared/components/Loading'
// import useTranslator from '../../shared/hooks/useTranslator'
// import Patient from '../../shared/model/Patient'
// import { formatDate } from '../../shared/util/formatDate'
// import usePatients from '../hooks/usePatients'
// import PatientSearchRequest from '../models/PatientSearchRequest'
// import NoPatientsExist from './NoPatientsExist'

// interface Props {
//   searchRequest: PatientSearchRequest
//   filtered: Boolean
//   patientData: Patient[]
// }

// interface TableObj {
//   id: string
//   type: string
//   value: string
// }

// interface TableData {
//   address?: TableObj[]
//   bloodType?: string
//   code?: string
//   createdAt?: any
//   dateOfBirth?: any
//   emails?: TableObj[]
//   familyName?: string
//   fullName?: string
//   givenName?: string
//   id?: string
//   occupation?: string
//   phoneNumbers?: TableObj[]
//   preferredLanuage?: string
//   prefix?: string
//   rev?: string
//   sex?: string
//   type?: string
//   updatedAt?: any
// }

// const ViewPatientsTable = (props: Props) => {
//   const { searchRequest } = props
//   const { t } = useTranslator()
//   const history = useHistory()
//   const { data, status } = usePatients(searchRequest)
//   const [data2, setData2]= useState<{patients:any;totalCount:number}>({patients:[],totalCount:0})

//   const tableObjParser = (data: any, type: string) => {
//     let count = 1
//     let ads: any = []
//     if (type === 'address') {
//       let adsObj: any = { id: '' + count, value: '', type: 'home' }
//       let ad = ''
//       let line = data.line?.map((i: any) => {
//         ad += i + ' '
//       })
//       console.log(line)
//       ad += data.city + ' '
//       ad += data.state + ' -'
//       ad += data.postalCode
//       console.log(ad)
//       adsObj.value = ad
//       ads.push(adsObj)
//       count++
//     }
//     return ads
//   }

//   const parserFunc = (data: any) => {
//     let dataHolder: TableData[] = []
//     data?.map((item: any) => {
//       let tempObj: TableData = {}
//       tempObj.bloodType = 'bloodType'
//       tempObj.address = tableObjParser(item.resource.address, 'address')
//       tempObj.code = item.resource.id
//       tempObj.dateOfBirth = item.resource.birthDate
//       tempObj.familyName = item.resource.name[0].family
//       tempObj.fullName = item.resource.name[0].text
//       tempObj.givenName = 'mockName'
//       tempObj.id = item.resource.id
//       tempObj.sex = item.resource.gender
//       tempObj.type = 'mockType'
//       dataHolder.push(tempObj)
//     })
//     return dataHolder
//   }
//   // let mock= {'patients':[],'totalCount':0}

//   const func = async () => {
//     const d = await getAllPatients()
//     console.log('data', d)
//     const newData =await parserFunc(d.data.entry)
//     console.log('parsedFuncdata', newData)
//     console.log('parsedFunc', newData)
//     let mock= {patients:newData,totalCount:newData.length}
//     console.log('mock: ',mock)
//     setData2(mock)
//     console.log('data2: ',data2)

//   }

//   useEffect(() => {
//     func()
//   }, [])

//   if (data === undefined || status === 'loading') {
//     return <Loading />
//   }

//   if (data.totalCount === 0) {
//     return <NoPatientsExist />
//   }

//   return (
//     <>
//       {console.log('newData: ', data2)}
//       {console.log('olddata: ', data)}

//       <Table
//         data={props.filtered ? props.patientData : data.patients}
//         getID={(row: any) => row.id}
//         columns={[
//           { label: t('patient.code'), key: 'code' },
//           { label: t('patient.givenName'), key: 'givenName' },
//           { label: t('patient.familyName'), key: 'familyName' },
//           { label: t('patient.sex'), key: 'sex' },
//           {
//             label: t('patient.dateOfBirth'),
//             key: 'dateOfBirth',
//             formatter: (row) => formatDate(row.dateOfBirth),
//           },
//         ]}
//         actionsHeaderText={t('actions.label')}
//         actions={[
//           { label: t('actions.view'), action: (row) => history.push(`/patients/${row.id}`) },
//         ]}
//       />
//     </>
//   )
// }

// export default ViewPatientsTable
