// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createDetail } from "@/helpers/api/invoice"
import { validateLoginInformation } from "@/helpers/api/users"
import prisma from "@/prisma/client"
import { DetailResponseType, ErrorInterface } from "@/types"
import { invoice_detail } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  detail:
    | string
    | ErrorInterface
    | DetailResponseType[]
    | DetailResponseType
    | invoice_detail
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req)
  if ("errorStatus" in user)
    return res.status(user.errorStatus).json({ detail: user })

  const { uuid } = req.query

  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        uuid: uuid as string,
        companyUuid: user.companyUuid,
      },
      select: {
        uuid: true,
        invoice_number: true,
        date: true,
        total: true,
        project: {
          select: {
            uuid: true,
            name: true,
          },
        },
        supplier: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
    })

    if (invoice === null)
      return res.status(404).json({
        detail: { errorStatus: 404, errorDescription: "Invoice not found" },
      })

    if (req.method === "GET") {
      const invoiceDetails = await prisma.invoice_detail.findMany({
        where: {
          companyUuid: user.companyUuid,
          invoiceUuid: invoice.uuid,
        },
        select: {
          uuid: true,
          quantity: true,
          cost: true,
          total: true,
          budget_item: {
            select: {
              uuid: true,
              code: true,
              name: true,
              level: true,
              accumulates: true,
              parentUuid: true,
            },
          },
          invoice: {
            select: {
              uuid: true,
              invoice_number: true,
              date: true,
              total: true,
              project: {
                select: {
                  uuid: true,
                  name: true,
                },
              },
              supplier: {
                select: {
                  uuid: true,
                  name: true,
                },
              },
            },
          },
        },
      })

      return res.status(200).json({ detail: invoiceDetails })
    }

    if (req.method === "POST") {
      const { budgetItem, quantity, cost } = req.body

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

      const result = await createDetail(
        uuid as string,
        budgetItem,
        quantity,
        cost,
        user
      )
      return res.status(201).json({ detail: result })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if ("meta" in error) {
      if (error.code === "P2023")
        return res.status(422).json({
          detail: {
            errorStatus: 422,
            errorDescription: error.meta.message as string,
          },
        })
    }
    console.error(error)
    return res.status(500).json({
      detail: {
        errorStatus: 500,
        errorDescription: "Unknown error, check your logs",
      },
    })
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: "Method not implemented",
    },
  })
}
