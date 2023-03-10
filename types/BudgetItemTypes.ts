export type BudgetItemDataType = {
  uuid: string
  code: string
  name: string
  accumulates: boolean
  level: number
  parentUuid?: string | null
}

export type BudgetItemResponseType = {
  uuid: string
  code: string
  name: string
  accumulates: boolean
  level: number
  budget_item?: BudgetItemDataType | null
}

export type BudgetItemCreateType = {
  uuid?: string
  code?: string
  name?: string
  accumulates?: boolean
  level?: number
  budget_item?: BudgetItemDataType | null
}
