export type CompanyCreateType = {
  name: string
  ruc: string
  employees: number
}

export type CompanyResponseType = {
  uuid: string
  name: string
  ruc: string
  employees: number
  isActive: boolean
}
