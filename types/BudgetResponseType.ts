export type BudgetResponseType = {
  id: string
  initial_quantity?: number
  initial_cost?: number
  initial_total: number
  spent_quantity?: number
  spent_total: number
  to_spend_quantity?: number
  to_spend_cost?: number
  to_spend_total: number
  updated_budget: number
  project_uuid: string
  project_name: string
  budget_item_uuid: string
  code: string
  budget_item_name: string
  level: number
  company_uuid: string
  company_name: string
}

export type BudgetFormattedResponseType = {
  uuid: string
  initial_quantity?: number
  initial_cost?: number
  initial_total: number
  spent_quantity?: number
  spent_total: number
  to_spend_quantity?: number
  to_spend_cost?: number
  to_spend_total: number
  updated_budget: number
  project: {
    uuid: string
    name: string
  }
  budgetItem: {
    uuid: string
    code: string
    name: string
    level: number
  }
  company: {
    uuid: string
    name: string
  }
}
