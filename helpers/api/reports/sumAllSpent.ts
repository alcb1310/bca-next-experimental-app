import prisma from '@/prisma/client'
import { budget_item } from '@prisma/client'
import { getChildrenBudgetItems } from '../budgetItem'

export default async function sumAllSpent(
  budgetData: budget_item,
  date: Date,
  project: string,
  companyUuid: string
) {
  if (!budgetData.accumulates) {
    const queryMonth: number = date.getUTCMonth() + 1
    const queryYear: number = date.getFullYear()

    let lteMonth: number = queryMonth + 1
    let lteYear: number = queryYear

    if (queryMonth === 12) {
      lteMonth = 1
      lteYear = queryYear + 1
    }
    const totalSum = await prisma.budgetItemView.aggregate({
      _sum: {
        total: true,
      },
      where: {
        company_uuid: companyUuid,
        budget_item_uuid: budgetData.uuid,
        date: {
          gte: new Date(`${queryYear}-${queryMonth}-01`),
          lt: new Date(`${lteYear}- ${lteMonth}-01`),
        },
      },
    })

    return totalSum._sum.total
  }

  const nextBudgetItems = await getChildrenBudgetItems(budgetData.uuid)

  let total: number = 0

  for (let i = 0; i < nextBudgetItems.length; i += 1) {
    const nextBudgetItem = nextBudgetItems[i]
    const currentSum = await sumAllSpent(
      nextBudgetItem,
      date,
      project,
      companyUuid
    )

    total += currentSum ? currentSum : 0
  }

  return total
}
