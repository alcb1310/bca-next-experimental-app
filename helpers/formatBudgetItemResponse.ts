import { BudgetItemViewResponseType } from '@/types/BudgetItemViewResponseType'
import { BudgetItemView } from '@prisma/client'

export function formatManyBudgetItemViewResponse(
  budgetItems: BudgetItemView[]
) {
  return budgetItems.map((budgetItem) =>
    formatOneBudgetItemViewResponse(budgetItem)
  )
}

export function formatOneBudgetItemViewResponse(
  budgetItem: BudgetItemView
): BudgetItemViewResponseType {
  return {
    uuid: budgetItem.id,
    quantity: budgetItem.quantity,
    cost: budgetItem.cost,
    total: budgetItem.total,
    company: {
      uuid: budgetItem.company_uuid,
      name: budgetItem.company_name,
    },
    budgetItem: {
      uuid: budgetItem.budget_item_uuid,
      code: budgetItem.code,
      name: budgetItem.budget_item_name,
      level: budgetItem.level,
      accumulates: budgetItem.accumulates,
    },
    invoice: {
      uuid: budgetItem.invoice_uuid,
      invoice_number: budgetItem.invoice_number,
      date: budgetItem.date,
    },
    project: {
      uuid: budgetItem.project_uuid as string,
      name: budgetItem.project_name as string,
    },
  }
}
