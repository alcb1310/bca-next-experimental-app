// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { validateLoginInformation } from "@/helpers/api/users"
import prisma from "@/prisma/client"
import {
  BudgetItemDataType,
  ErrorInterface,
  InvoiceResponseType,
} from "@/types"
import type { NextApiRequest, NextApiResponse } from "next"

type DetailResponse = {
  uuid: string
  quantity: number
  cost: number
  total: number
  budget_item: BudgetItemDataType
  invoice: InvoiceResponseType
}

type Data = {
  detail: string | ErrorInterface | DetailResponse[] | DetailResponse
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if ("code" in error) {
      if (error.code === "P2023")
        return res.status(422).json({
          detail: { errorStatus: 422, errorDescription: error.meta.message },
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
