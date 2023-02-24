import { BudgetItemDataType, CompanyDataResponseType, ProjectType } from './'

export type HistoricResponseType = {
  uuid: string
  date: Date
  initial_quantity: number | null
  initial_cost: number | null
  initial_total: number
  spent_quantity: number | null
  spent_total: number
  to_spend_quantity: number | null
  to_spend_cost: number | null
  to_spend_total: number
  updated_budget: number
  company: CompanyDataResponseType
  project: ProjectType
  budgetItem: BudgetItemDataType
}
