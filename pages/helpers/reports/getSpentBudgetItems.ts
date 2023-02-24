import prisma from '@/prisma/client'
import { UserResponseType } from '@/types'
import { budget_item } from '@prisma/client'
import { sumAllSpent } from '.'
import { getBudgetItem } from '../budgetItem'

export default async function getSpentBudgetItem(
  project: string,
  date: Date,
  level: number,
  user: UserResponseType
) {
  const budgetResponse = await prisma.budgetView.findMany({
    where: {
      company_uuid: user.companyUuid,
      level: level,
      project_uuid: project,
    },
  })

  const response: Array<{
    budgetItem: budget_item
    spent: number
  }> = []

  for (let i = 0; i < budgetResponse.length; i += 1) {
    const budgetData = budgetResponse[i]

    const budgetItemInfo = await getBudgetItem(budgetData.budget_item_uuid)
    const totalSpent = await sumAllSpent(
      budgetItemInfo,
      date,
      project,
      user.companyUuid
    )

    if (totalSpent !== null && totalSpent > 0)
      response.push({
        budgetItem: budgetItemInfo,
        spent: totalSpent,
      })
  }

  return response
}
