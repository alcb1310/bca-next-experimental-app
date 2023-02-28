import prisma from '@/prisma/client'
import { BudgetItemResponseType, UserResponseType } from '@/types'
import { v4 } from 'uuid'
import { getOneBudgetItem } from '../budgetItem'

export default async function createBudget(
  project: string,
  budgetItem: BudgetItemResponseType,
  quantity: number,
  cost: number,
  user: UserResponseType
) {
  const total = quantity * cost
  let budgetItemToAdd: BudgetItemResponseType | null = budgetItem
  return await prisma.$transaction(async (tx) => {
    const budget = await tx.budget.create({
      data: {
        uuid: v4(),
        initial_quantity: quantity,
        initial_cost: cost,
        initial_total: total,
        spent_quantity: 0,
        spent_total: 0,
        to_spend_quantity: quantity,
        to_spend_cost: cost,
        to_spend_total: total,
        updated_budget: total,
        projectUuid: project,
        budgetItemUuid: budgetItem.uuid,
        companyUuid: user.companyUuid,
        userUuid: user.uuid,
      },
    })

    while (budgetItemToAdd?.budget_item) {
      budgetItemToAdd = await getOneBudgetItem(
        budgetItemToAdd.budget_item.uuid,
        user.companyUuid
      )

      if (!budgetItemToAdd) throw new Error('Unable to find budget item')
      const nextBudget = await tx.budget.findFirst({
        where: {
          companyUuid: user.companyUuid,
          projectUuid: project,
          budgetItemUuid: budgetItemToAdd.uuid,
        },
      })

      if (!nextBudget) {
        // create the budget
        await tx.budget.create({
          data: {
            uuid: v4(),
            initial_total: total,
            spent_total: 0,
            to_spend_total: total,
            updated_budget: total,
            projectUuid: project,
            budgetItemUuid: budgetItemToAdd.uuid,
            companyUuid: user.companyUuid,
            userUuid: user.uuid,
          },
        })
      } else {
        // update the budget
        const increment = { increment: total }
        await tx.budget.update({
          where: {
            uuid: nextBudget.uuid,
          },
          data: {
            initial_total: increment,
            to_spend_total: increment,
            updated_budget: increment,
          },
        })
      }
    }

    return budget
  })
}
