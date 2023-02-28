import type { NextApiRequest, NextApiResponse } from "next"
import { validateLoginInformation } from "@/helpers/api/users"
import { ErrorInterface } from "@/types"
import { getAllSpent } from "@/helpers/api/reports"
import { getBudgetItem } from "@/helpers/api/budgetItem"
import { BudgetItemViewResponseType } from "@/types/BudgetItemViewResponseType"
import { formatManyBudgetItemViewResponse } from "@/helpers/formatBudgetItemResponse"

type Data = {
  detail: string | ErrorInterface | BudgetItemViewResponseType[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const user = await validateLoginInformation(req)
    if ("errorStatus" in user) {
      return res.status(user.errorStatus).json({ detail: user })
    }

    const { uuid, project, date } = req.query

    if (project === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "project",
          errorDescription: "project is required",
        },
      })

    if (date === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "date",
          errorDescription: "date is required",
        },
      })

    const dateValue = new Date(date as string)
    if (dateValue.toString() === "Invalid Date")
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "date",
          errorDescription: "Date is invalid",
        },
      })

    const budgetItem = await getBudgetItem(uuid as string)

    const data = await getAllSpent(
      budgetItem,
      dateValue,
      project as string,
      user
    )
    return res
      .status(200)
      .json({ detail: formatManyBudgetItemViewResponse(data) })
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: "Method not implemented",
    },
  })
}
