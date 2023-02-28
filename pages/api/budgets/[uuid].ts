// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { updateBudgetInformation } from "@/helpers/api/budget"
import { getOneBudgetItem } from "@/helpers/api/budgetItem"
import { validateLoginInformation } from "@/helpers/api/users"
import { formatOneBudgetResponse } from "@/helpers/formatBudgetResponse"
import prisma from "@/prisma/client"
import {
  BudgetFormattedResponseType,
  BudgetResponseType,
  ErrorInterface,
} from "@/types"
import { budget } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  detail: string | ErrorInterface | BudgetFormattedResponseType | budget
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req)
  if ("errorStatus" in user)
    return res.status(user.errorStatus).json({ detail: user })

  const { uuid } = req.query

  if (req.method === "GET") {
    const budget = (await prisma.budgetView.findFirst({
      where: {
        id: uuid as string,
        company_uuid: user.companyUuid,
      },
    })) as BudgetResponseType

    if (budget === null)
      return res.status(404).json({
        detail: { errorStatus: 404, errorDescription: "Budget not found" },
      })

    return res.status(200).json({ detail: formatOneBudgetResponse(budget) })
  }

  if (req.method === "PUT") {
    const budget = await prisma.budget.findFirst({
      where: {
        uuid: uuid as string,
        companyUuid: user.companyUuid,
      },
    })

    if (budget === null)
      return res.status(404).json({
        detail: { errorStatus: 404, errorDescription: "Budget not found" },
      })
    const budget_item = await getOneBudgetItem(
      budget.budgetItemUuid,
      user.companyUuid
    )

    if (budget_item?.accumulates)
      return res.status(422).json({
        detail: {
          errorStatus: 422,
          errorDescription:
            "Can not update budget of a budget item that accumulates",
        },
      })

    try {
      const { quantity, cost } = req.body

      if (quantity === undefined)
        return res.status(400).json({
          detail: {
            errorStatus: 400,
            errorKey: "quantity",
            errorDescription: "quantity is required",
          },
        })
      if (cost === undefined)
        return res.status(400).json({
          detail: {
            errorStatus: 400,
            errorKey: "cost",
            errorDescription: "cost is required",
          },
        })

      if (typeof quantity !== "number")
        return res.status(400).json({
          detail: {
            errorStatus: 400,
            errorKey: "quantity",
            errorDescription: "quantity must be a number",
          },
        })
      if (typeof cost !== "number")
        return res.status(400).json({
          detail: {
            errorStatus: 400,
            errorKey: "cost",
            errorDescription: "cost must be a number",
          },
        })

      const updatedBudget = await updateBudgetInformation(
        budget,
        quantity,
        cost
      )

      return res.status(200).json({ detail: updatedBudget })
    } catch (error: any) {
      console.error(error)
      return res.status(428).json({ detail: "Failed while updating" })
    }
  }

  res.status(500).json({
    detail: { errorStatus: 500, errorDescription: "Method not implemented" },
  })
}
