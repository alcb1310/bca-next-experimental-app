import { BudgetItemDataType, InvoiceResponseType } from "."

export type DetailResponseType = {
  uuid: string
  quantity: number
  cost: number
  total: number
  budget_item: BudgetItemDataType
  invoice: InvoiceResponseType
}
