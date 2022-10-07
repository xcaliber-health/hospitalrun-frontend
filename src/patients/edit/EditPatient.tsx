import { Spinner, Button, Toast } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
//import { setConsole } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import { editPatient, getPatient } from '../../service/service'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import { RootState } from '../../shared/store'
import GeneralInformation from '../GeneralInformation'
import usePatient from '../hooks/usePatient'
import { updatePatient } from '../patient-slice'
import { getPatientCode, getPatientFullName } from '../util/patient-util'

const EditPatient = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const dispatch = useDispatch()
  const { id } = useParams<any>()
  const [givenPatient2, setGivenPatient2]=useState<any>()

  const { data: givenPatient, status } = usePatient(id)
  console.log(status)
  const getFunc = async()=>{
    let response=await getPatient(id)
    console.log("response: ",response)
    setGivenPatient2(response)
    return response
  }
  useEffect(()=>{
    getFunc()
  },[])
  // let givenPatient2= getFunc()
  console.log("givenPatient2:",givenPatient2)
  console.log("givenPatient: ",givenPatient)
  const [patient, setPatient] = useState({} as Patient)

  const { updateError } = useSelector((state: RootState) => state.patient)

  const updateTitle = useUpdateTitle()

  useEffect(() => {
    updateTitle(
      `${t('patients.editPatient')}: ${getPatientFullName(givenPatient2)} (${getPatientCode(
        givenPatient2,
      )})`,
    )
  })

  const breadcrumbs = [
    { i18nKey: 'patients.label', location: '/patients' },
    { text: getPatientFullName(givenPatient2), location: `/patients/${id}` },
    { i18nKey: 'patients.editPatient', location: `/patients/${id}/edit` },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  // useEffect(() => {
  //   setPatient(givenPatient2 || ({} as Patient))
  // }, [givenPatient])

  const onCancel = () => {
    history.push(`/patients/${patient.id}`)
  }


let newId=0

  const onSave = async () => {
    let putPatient = await editPatient(patient,id)
    newId=putPatient.id

    await dispatch(updatePatient(patient, onSuccessfulSave))
  }

  const onSuccessfulSave = (updatedPatient: Patient) => {
    console.log(updatedPatient)
    console.log(newId)
    history.push(`/patients/${newId}`)
    Toast(
      'success',
      t('states.success'),
      `${t('patients.successfullyUpdated')} ${patient.fullName}`,
    )
  }

  const onPatientChange = (newPatient: Partial<Patient>) => {
    setPatient(newPatient as Patient)
  }

  if (givenPatient2 === undefined || patient === undefined ) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  return (
    <div>
      {
        console.log("patient: ", patient)
      }
      <GeneralInformation
      
        patient={givenPatient2}
        isEditable
        onChange={onPatientChange}
        error={updateError}
      />
      <div className="row float-right">
        <div className="btn-group btn-group-lg mt-3 mr-3">
          <Button className="btn-save mr-2" color="success" onClick={onSave}>
            {t('patients.updatePatient')}
          </Button>
          <Button className="btn-cancel" color="danger" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditPatient
