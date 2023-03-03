import prisma from "@/prisma/client"
import { DetailResponseType } from "@/types"

export default async function deleteInvoiceDetail(
  detail: DetailResponseType,
  companyUuid: string
) {
  return await prisma.$transaction(async (tx) => {
    await tx.invoice_detail.delete({
      where: { uuid: detail.uuid },
    })

    await tx.invoice.update({
      where: {
        uuid: detail.invoice.uuid,
      },
      data: {
        total: {
          decrement: detail.total,
        },
      },
    })

    // get budget information
    let budget = await tx.budget.findFirst({
      where: {
        projectUuid: detail.invoice.project.uuid,
        budgetItemUuid: detail.budget_item.uuid,
        companyUuid,
      },
      include: { budget_item: true },
    })

    if (budget === null)
      throw new Error(
        JSON.stringify({
          errorStatus: 404,
          errorDescription: "Unable to find budget",
        })
      )

    await tx.budget.update({
      where: {
        uuid: budget.uuid,
      },
      data: {
        spent_quantity: {
          decrement: detail.quantity,
        },
        spent_total: {
          decrement: detail.total,
        },
        to_spend_quantity: {
          increment: detail.quantity,
        },
        to_spend_total: {
          increment: detail.total,
        },
      },
    })

    while (budget?.budget_item.parentUuid) {
      budget = await tx.budget.findFirst({
        where: {
          projectUuid: detail.invoice.project.uuid,
          companyUuid,
          budget_item: {
            uuid: budget?.budget_item.parentUuid,
          },
        },
        include: { budget_item: true },
      })

      if (budget === null)
        throw new Error(
          JSON.stringify({
            errorStatus: 404,
            errorDescription: "Unable to find budget",
          })
        )

      await tx.budget.update({
        where: {
          uuid: budget?.uuid,
        },
        data: {
          spent_total: {
            decrement: detail.total,
          },
          to_spend_total: {
            increment: detail.total,
          },
        },
      })
    }

    return
  })
}
