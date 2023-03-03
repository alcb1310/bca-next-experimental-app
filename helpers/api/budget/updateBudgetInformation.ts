import prisma from "@/prisma/client"
import { budget } from "@prisma/client"
import { getOneBudgetItem } from "../budgetItem"

export default async function updateBudgetInformation(
  budgetToUpdate: budget,
  quantity: number,
  cost: number
) {
  const total = quantity * cost
  const diff = total - budgetToUpdate.to_spend_total

  return await prisma.$transaction(async (tx) => {
    // 1. upodate the current budget
    const updatedBudget = await tx.budget.update({
      where: { uuid: budgetToUpdate.uuid },
      data: {
        to_spend_quantity: quantity,
        to_spend_cost: cost,
        to_spend_total: total,
        updated_budget: { increment: diff },
      },
    })

    let budgetItem = await getOneBudgetItem(
      budgetToUpdate.budgetItemUuid,
      budgetToUpdate.companyUuid
    )

    while (budgetItem?.budget_item?.uuid) {
      budgetItem = await getOneBudgetItem(
        budgetItem.budget_item.uuid,
        budgetToUpdate.companyUuid
      )
      if (!budgetItem) throw new Error("unable to get budget info")

      const budget = await prisma.budget.findFirst({
        where: {
          budgetItemUuid: budgetItem.uuid,
          companyUuid: budgetToUpdate.companyUuid,
        },
      })
      if (budget === null) throw new Error("unable to find budget")

      await tx.budget.update({
        where: {
          uuid: budget.uuid,
        },
        data: {
          to_spend_total: { increment: diff },
          updated_budget: { increment: diff },
        },
      })
    }

    return updatedBudget
  })
}
