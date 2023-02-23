import {
  BudgetItemDataType,
  CompanyDataResponseType,
  InvoiceDataType,
  ProjectType,
} from './'

export type BudgetItemViewResponseType = {
  uuid: string
  quantity: number
  cost: number
  total: number
  company: CompanyDataResponseType
  budgetItem: BudgetItemDataType
  invoice: InvoiceDataType
  project: ProjectType
}
