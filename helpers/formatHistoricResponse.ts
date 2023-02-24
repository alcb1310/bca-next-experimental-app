import { HistoricResponseType } from '@/types/HistoricResponseType'
import { HistoricView } from '@prisma/client'

export function formatManyHistoricResponse(historics: HistoricView[]) {
  return historics.map((historic) => formatOneHistoricResponse(historic))
}

export function formatOneHistoricResponse(
  historic: HistoricView
): HistoricResponseType {
  return {
    uuid: historic.id,
    date: historic.date,
    initial_quantity: historic.initial_quantity,
    initial_cost: historic.initial_cost,
    initial_total: historic.initial_total,
    spent_quantity: historic.spent_quantity,
    spent_total: historic.spent_total,
    to_spend_quantity: historic.to_spend_quantity,
    to_spend_cost: historic.to_spend_cost,
    to_spend_total: historic.to_spend_total,
    updated_budget: historic.updated_budget,
    company: {
      uuid: historic.company_uuid,
      name: historic.company_name,
    },
    project: {
      uuid: historic.project_uuid,
      name: historic.project_name,
    },
    budgetItem: {
      uuid: historic.budget_item_uuid,
      code: historic.code,
      name: historic.budget_item_name,
      accumulates: historic.accumulates,
      level: historic.level,
    },
  }
}
