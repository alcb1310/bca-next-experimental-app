import prisma from "@/prisma/client"
import { UserResponseType } from "@/types"
import { v4 } from "uuid"

export default async function createDetail(
  invoice: string,
  budgetItem: string,
  quantity: number,
  cost: number,
  user: UserResponseType
) {
  const total = quantity * cost

  const response = await prisma.$transaction(async (tx) => {
    // Validate the data
    const invoiceData = await tx.invoice.findFirst({
      where: {
        uuid: invoice,
        companyUuid: user.companyUuid,
      },
    })
    if (invoiceData === null)
      throw new Error(
        JSON.stringify({
          errorStatus: 422,
          errorDescription: "Invalid project id",
        })
      )

    const budgetItemData = await tx.budget_item.findFirst({
      where: {
        uuid: budgetItem,
        companyUuid: user.companyUuid,
      },
    })
    if (budgetItemData === null)
      throw new Error(
        JSON.stringify({
          errorStatus: 422,
          errorDescription: "Invalid budget item id",
        })
      )

    const budget = await tx.budget.findFirst({
      where: {
        projectUuid: invoiceData.projectUuid,
        budgetItemUuid: budgetItemData.uuid,
        companyUuid: user.companyUuid,
      },
    })
    if (budget === null)
      throw new Error(
        JSON.stringify({
          errorStatus: 422,
          errorDescription: "Invalid budget id",
        })
      )
    if (
      budget.spent_quantity === null ||
      budget.to_spend_quantity === null ||
      budget.to_spend_cost === null
    )
      throw new Error(
        JSON.stringify({
          errorStatus: 400,
          errorDescription:
            "The budget you are trying to update does not have a quantity",
        })
      )

    // Actually save the invoice detail
    const result = await tx.invoice_detail.create({
      data: {
        uuid: v4(),
        companyUuid: user.companyUuid,
        userUuid: user.uuid,
        invoiceUuid: invoiceData.uuid,
        budgetItemUuid: budgetItemData.uuid,
        quantity,
        cost,
        total,
      },
    })

    // Update the invoce's total
    await tx.invoice.update({
      where: { uuid: invoiceData.uuid },
      data: { total: { increment: total } },
    })

    // Update the budget
    const savedBudget = await tx.budget.update({
      where: { uuid: budget.uuid },
      data: {
        spent_quantity: { increment: quantity },
        spent_total: { increment: total },
        to_spend_quantity: { decrement: quantity },
        to_spend_cost: cost,
        to_spend_total: budget.to_spend_quantity * budget.to_spend_cost,
        updated_budget: budget.spent_total + budget.to_spend_total,
      },
      include: { budget_item: true },
    })

    const diff = savedBudget.updated_budget - budget.updated_budget

    if (savedBudget.budget_item.parentUuid !== null) {
      let nextBudget = await tx.budget.findFirst({
        where: {
          budgetItemUuid: savedBudget.budget_item.parentUuid,
          projectUuid: savedBudget.projectUuid,
          companyUuid: user.companyUuid,
        },
        include: { budget_item: true },
      })

      while (nextBudget !== null) {
        const to_spend = nextBudget.to_spend_total - total + diff

        await tx.budget.update({
          where: { uuid: nextBudget.uuid },
          data: {
            spent_total: { increment: total },
            to_spend_total: to_spend,
            updated_budget: nextBudget.to_spend_total + nextBudget.spent_total,
          },
        })

        const nextBI = nextBudget.budget_item.parentUuid
        if (nextBI === null) nextBudget = null
        else
          nextBudget = await tx.budget.findFirst({
            where: {
              budgetItemUuid: nextBI,
              projectUuid: savedBudget.projectUuid,
              companyUuid: user.companyUuid,
            },
            include: { budget_item: true },
          })
      }
    }

    return result
  })

  return response
}
