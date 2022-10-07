import { Panel, Spinner, TabsHeader, Tab, Button } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  useParams,
  withRouter,
  Route,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useButtonToolbarSetter } from '../../page-header/button-toolbar/ButtonBarProvider'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import { getPatient } from '../../service/service'
import useTranslator from '../../shared/hooks/useTranslator'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import Allergies from '../allergies/Allergies'
import AppointmentsList from '../appointments/AppointmentsList'
import CareGoalTab from '../care-goals/CareGoalTab'
import CarePlanTab from '../care-plans/CarePlanTab'
import Diagnoses from '../diagnoses/Diagnoses'
import GeneralInformation from '../GeneralInformation'
import HistoryTab from '../history/HistoryTab'
import usePatient from '../hooks/usePatient'
import Labs from '../labs/Labs'
import Medications from '../medications/Medications'
import Note from '../notes/NoteTab'
import RelatedPerson from '../related-persons/RelatedPersonTab'
// import { TableData } from '../search/ViewPatientsTable'
import { getPatientFullName } from '../util/patient-util'
import VisitTab from '../visits/VisitTab'
import ImportantPatientInfo from './ImportantPatientInfo'

const ViewPatient = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const location = useLocation()
  const { path } = useRouteMatch()
  const setButtonToolBar = useButtonToolbarSetter()

  const { id } = useParams<any>()
  const { permissions } = useSelector((state: RootState) => state.user)
  const { data: patient, status } = usePatient(id)
  const [dataNew, setDataNew]=useState<any>();

  const getDataNew = async () => {
    const response = await getPatient(id)
    // const data2 = parserFunc(response.data)
    setDataNew(response)
    console.log("@DATA: ",response)
  }

  // const tableObjParser = (data: any, type: string) => {
  //   let count = 1
  //   let ads: any = []
  //   if (type === 'address') {
  //     let adsObj: any = { id: '' + count, value: '', type: 'home' }
  //     let ad = ''
  //     let line = data.line?.map((i: any) => {
  //       ad += i + ' '
  //     })
  //     console.log(line)
  //     ad += data.city + ' '
  //     ad += data.state + ' -'
  //     ad += data.postalCode    
  //     adsObj.value = ad
  //     ads.push(adsObj)
  //     count++
  //   }
  //   return ads
  // }

  // const parserFunc = (item: any) => {  
  //     let tempObj: TableData = {}
  //     tempObj.bloodType = 'bloodType'
  //     tempObj.address = tableObjParser(item.address, 'address')
  //     tempObj.code = item.id
  //     tempObj.dateOfBirth = item.birthDate
  //     tempObj.familyName = item.name[0].family
  //     tempObj.fullName = item.name[0].text
  //     tempObj.givenName = 'mockName'
  //     tempObj.id = item.id
  //     tempObj.sex = item.gender
  //     tempObj.type = 'mockType'
     
    
  //   return tempObj
  // }

  const updateTitle = useUpdateTitle()
  useEffect(() => {
   
    updateTitle(t('patient.label'))
  }, [updateTitle, t])

  useEffect(()=>{ getDataNew()},[])

  const breadcrumbs = [
    { i18nKey: 'patients.label', location: '/patients' },
    { text: getPatientFullName(patient), location: `/patients/${id}` },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  useEffect(() => {
    const buttons = []
    if (permissions.includes(Permissions.WritePatients)) {
      buttons.push(
        <Button
          key="editPatientButton"
          color="success"
          icon="edit"
          outlined
          onClick={() => {
            console.log("recieved patients: ",id)
            history.push(`/patients/edit/${id}`)
          }}
        >
          {t('actions.edit')}
        </Button>,
      )
    }

    setButtonToolBar(buttons)

    return () => {
      setButtonToolBar([])
    }
  }, [setButtonToolBar, history, id, permissions, t])

  // if (status === 'loading' || !patient) {
  //   return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  // }
  console.log(status)

  if (!dataNew) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  return (
    <div>
      {' '}
      {console.log("patient",patient)}
      <ImportantPatientInfo patient={dataNew} />
      <div>
        <TabsHeader>
          <Tab
            active={location.pathname === `/patients/${dataNew.id}`}
            label={t('patient.generalInformation')}
            onClick={() => history.push(`/patients/${dataNew.id}`)}
          />
          <Tab
            active={location.pathname === `/patients/${dataNew.id}/relatedpersons`}
            label={t('patient.relatedPersons.label')}
            onClick={() => history.push(`/patients/${dataNew.id}/relatedpersons`)}
          />
          <Tab
            active={location.pathname === `/patients/${dataNew.id}/appointments`}
            label={t('scheduling.appointments.label')}
            onClick={() => history.push(`/patients/${dataNew.id}/appointments`)}
          />
          <Tab
            active={location.pathname.startsWith(`/patients/${dataNew.id}/allergies`)}
            label={t('patient.allergies.label')}
            onClick={() => history.push(`/patients/${dataNew.id}/allergies`)}
          />
          <Tab
            active={location.pathname.startsWith(`/patients/${dataNew.id}/diagnoses`)}
            label={t('patient.diagnoses.label')}
            onClick={() => history.push(`/patients/${dataNew.id}/diagnoses`)}
          />
          <Tab
            active={location.pathname.startsWith(`/patients/${dataNew.id}/notes`)}
            label={t('patient.notes.label')}
            onClick={() => history.push(`/patients/${dataNew.id}/notes`)}
          />
          <Tab
            active={location.pathname === `/patients/${dataNew.id}/medications`}
            label={t('patient.medications.label')}
            onClick={() => history.push(`/patients/${dataNew.id}/medications`)}
          />
          <Tab
            active={location.pathname === `/patients/${dataNew.id}/labs`}
            label={t('patient.labs.label')}
            onClick={() => history.push(`/patients/${dataNew.id}/labs`)}
          />
          <Tab
            active={location.pathname.startsWith(`/patients/${dataNew.id}/care-plans`)}
            label={t('patient.carePlan.label')}
            onClick={() => history.push(`/patients/${dataNew.id}/care-plans`)}
          />
          <Tab
            active={location.pathname.startsWith(`/patients/${dataNew.id}/care-goals`)}
            label={t('patient.careGoal.label')}
            onClick={() => history.push(`/patients/${dataNew.id}/care-goals`)}
          />
          <Tab
            active={location.pathname.startsWith(`/patients/${dataNew.id}/visits`)}
            label={t('patient.visits.label')}
            onClick={() => history.push(`/patients/${dataNew.id}/visits`)}
          />
          <Tab
            active={location.pathname.startsWith(`/patients/${dataNew.id}/history`)}
            label={t('patient.history.label')}
            onClick={() => history.push(`/patients/${dataNew.id}/history`)}
          />
        </TabsHeader>
        <Panel>
          <Route exact path={path}>
            <GeneralInformation patient={dataNew} />
          </Route>
          <Route exact path={`${path}/relatedpersons`}>
            <RelatedPerson patient={dataNew} />
          </Route>
          <Route exact path={`${path}/appointments`}>
            <AppointmentsList patient={dataNew} />
          </Route>
          <Route path={`${path}/allergies`}>
            <Allergies patient={dataNew} />
          </Route>
          <Route path={`${path}/diagnoses`}>
            <Diagnoses />
          </Route>
          <Route exact path={`${path}/notes`}>
            <Note patient={dataNew} />
          </Route>
          <Route exact path={`${path}/medications`}>
            <Medications patient={dataNew} />
          </Route>
          <Route exact path={`${path}/labs`}>
            <Labs patient={dataNew} />
          </Route>
          <Route path={`${path}/care-plans`}>
            <CarePlanTab />
          </Route>
          <Route path={`${path}/care-goals`}>
            <CareGoalTab />
          </Route>
          <Route path={`${path}/visits`}>
            <VisitTab patientId={dataNew.id} />
          </Route>
          <Route path={`${path}/history`}>
            <HistoryTab patientId={dataNew.id} />
          </Route>
        </Panel>
      </div>
    </div>
  )
}

export default withRouter(ViewPatient)
