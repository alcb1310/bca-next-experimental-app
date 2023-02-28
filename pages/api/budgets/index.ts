// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/prisma/client"
import { validateLoginInformation } from "@/helpers/api/users"
import { formatManyBudgetResponse } from "@/helpers/formatBudgetResponse"
import type { NextApiRequest, NextApiResponse } from "next"
import type {
  BudgetFormattedResponseType,
  BudgetResponseType,
  ErrorInterface,
} from "@/types"
import { getOneProject } from "@/helpers/projects"
import { getOneBudgetItem } from "@/helpers/api/budgetItem"
import { createBudget } from "@/helpers/api/budget"

type Data = {
  detail: string | ErrorInterface | BudgetFormattedResponseType[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req)
  if ("errorStatus" in user) {
    return res.status(user.errorStatus).json({ detail: user })
  }

  if (req.method === "GET") {
    const { project, level } = req.query

    let filter: any = { company_uuid: user.companyUuid }

    if (project !== undefined) filter = { ...filter, project_uuid: project }
    if (level !== undefined)
      filter = { ...filter, level: { lte: parseInt(level as string, 10) } }

    const results = (await prisma.budgetView.findMany({
      where: filter,
      orderBy: {
        code: "asc",
      },
    })) as BudgetResponseType[]

    return res.status(200).json({ detail: formatManyBudgetResponse(results) })
  }

  if (req.method === "POST") {
    const { project, budgetItem, quantity, cost } = req.body
    if (project === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "project",
          errorDescription: "project is required",
        },
      })
    if (budgetItem === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "budgetItem",
          errorDescription: "budgetItem is required",
        },
      })
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

    if (typeof project !== "string")
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "project",
          errorDescription: "project must be a string",
        },
      })
    if (typeof budgetItem !== "string")
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "budgetItem",
          errorDescription: "budgetItem must be a string",
        },
      })
    if (typeof quantity !== "number")
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "quantity",
          errorDescription: "quantity must be numeric",
        },
      })
    if (typeof cost !== "number")
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "cost",
          errorDescription: "cost must be numeric",
        },
      })

    try {
      const projectData = await getOneProject(project, user.companyUuid)
      if (projectData === null)
        return res.status(404).json({
          detail: {
            errorStatus: 404,
            errorKey: "project",
            errorDescription: "project not found",
          },
        })

      const budgetItemData = await getOneBudgetItem(
        budgetItem,
        user.companyUuid
      )
      if (budgetItemData === null)
        return res.status(404).json({
          detail: {
            errorStatus: 404,
            errorKey: "budgetItem",
            errorDescription: "budgetItem not found",
          },
        })

      const createdBudget = await createBudget(
        project,
        budgetItemData,
        quantity,
        cost,
        user
      )

      return res.status(201).json({ detail: createdBudget })
    } catch (error: any) {
      if ("code" in error) {
        if (error.code === "P2023")
          return res.status(400).json({
            detail: { errorStatus: 400, errorDescription: error.meta.message },
          })

        if (error.code === "P2002")
          return res
            .status(409)
            .json({
              detail: { errorStatus: 409, errorDescription: error.meta },
            })
      }
      console.error(error)
    }
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorKey: "method",
      errorDescription: "Method not implemented",
    },
  })
}
