interface Context {
  requestId?: string
  source?: string
  quorum?: boolean
  notify?: boolean
}

interface Name {
  use?: string
  family?: string
  given?: string[]
  text?: string
}

interface Address {
  line?: string[]
  city?: string
  state?: string
  postalCode?: string
}

interface Telecom {
  system?: string
  value?: string
  use?: string
  period?: any
}

interface Data {
  resourceType?: string
  id?: string
  name?: Name
  identifier?: any
  address?: Address[]
  birthDate?: any
  gender?: string
  generalPractitioner?: any
  contact?: any
  extension?: any
  telecom?: Telecom
  meta?: any
  contained?: any
}

export interface PatientNew {
  context?: Context
  data?: Data
}
