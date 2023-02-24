import { BudgetResponseType } from '@/types'

export function formatManyBudgetResponse(budgets: BudgetResponseType[]) {
  const formattedBudget = budgets.map((budget) =>
    formatOneBudgetResponse(budget)
  )

  return formattedBudget
}

export function formatOneBudgetResponse(budget: BudgetResponseType) {
  const budgetResponse = {
    uuid: budget.id,
    initial_quantity: budget.initial_quantity,
    initial_cost: budget.initial_cost,
    initial_total: budget.initial_total,
    spent_quantity: budget.spent_quantity,
    spent_total: budget.spent_total,
    to_spend_quantity: budget.to_spend_quantity,
    to_spend_cost: budget.to_spend_cost,
    to_spend_total: budget.to_spend_total,
    updated_budget: budget.updated_budget,
    project: {
      uuid: budget.project_uuid,
      name: budget.project_name,
    },
    budgetItem: {
      uuid: budget.budget_item_uuid,
      code: budget.code,
      name: budget.budget_item_name,
      level: budget.level,
    },
    company: {
      uuid: budget.company_uuid,
      name: budget.company_name,
    },
  }

  return budgetResponse
}
