// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { validateLoginInformation } from "@/helpers/api/users"
import prisma from "@/prisma/client"
import { ErrorInterface, InvoiceResponseType } from "@/types"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  detail: string | ErrorInterface | InvoiceResponseType
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
      where: { uuid: uuid as string },
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
      return res.status(200).json({ detail: invoice })
    }

    if (req.method === "PUT") {
      const { project, supplier, date, invoice_number } = req.body

      let data = {}

      if (project !== undefined && typeof project === "string")
        data = { ...data, projectUuid: project }

      if (supplier !== undefined && typeof supplier === "string")
        data = { ...data, supplierUuid: supplier }

      if (date !== undefined && typeof date === "string")
        data = { ...data, date: new Date(date) }

      if (invoice_number !== undefined && typeof invoice_number === "string")
        data = { ...data, invoice_number }

      const response = await prisma.invoice.update({
        where: { uuid: invoice.uuid },
        data,
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

      return res.status(200).json({ detail: response })
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
