import prisma from '@/prisma/client'
import { UserResponseType } from '@/types'
import { BudgetItemView, budget_item } from '@prisma/client'
import { getChildrenBudgetItems } from '../budgetItem'

export default async function getAllSpent(
  budgetItem: budget_item,
  date: Date,
  projectUuid: string,
  user: UserResponseType
) {
  if (!budgetItem.accumulates) {
    const queryMonth: number = date.getUTCMonth() + 1
    const queryYear: number = date.getFullYear()

    let lteMonth: number = queryMonth + 1
    let lteYear: number = queryYear

    if (queryMonth === 12) {
      lteMonth = 1
      lteYear = queryYear + 1
    }

    const data = await prisma.budgetItemView.findMany({
      where: {
        company_uuid: user.companyUuid,
        project_uuid: projectUuid,
        budget_item_uuid: budgetItem.uuid,
        date: {
          gte: new Date(`${queryYear}-${queryMonth}-01`),
          lt: new Date(`${lteYear}-${lteMonth}-01`),
        },
      },
    })
    return data
  }

  const nextBudgetItems = await getChildrenBudgetItems(budgetItem.uuid)

  let returnArray: BudgetItemView[] = []

  for (let i = 0; i < nextBudgetItems.length; i += 1) {
    const nextBudgetItem = nextBudgetItems[i]
    const allSpent = await getAllSpent(nextBudgetItem, date, projectUuid, user)

    returnArray = [...returnArray, ...allSpent]
  }

  return returnArray
}
