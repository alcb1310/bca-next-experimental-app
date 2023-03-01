// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { validateLoginInformation } from "@/helpers/api/users"
import prisma from "@/prisma/client"
import { ErrorInterface, InvoiceResponseType } from "@/types"
import type { NextApiRequest, NextApiResponse } from "next"
import { v4 } from "uuid"

type Data = {
  detail: string | ErrorInterface | InvoiceResponseType[] | InvoiceResponseType
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req)
  if ("errorStatus" in user)
    return res.status(user.errorStatus).json({ detail: user })

  if (req.method === "GET") {
    const { project } = req.query

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let where: any = { companyUuid: user.companyUuid }

    if (project !== undefined)
      where = {
        ...where,
        project: {
          name: project,
        },
      }

    const invoices = await prisma.invoice.findMany({
      where,
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

    return res.status(200).json({ detail: invoices })
  }

  if (req.method === "POST") {
    const { project, supplier, date, invoice_number } = req.body

    if (project === undefined || typeof project !== "string")
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "project",
          errorDescription: "project is required",
        },
      })
    if (supplier === undefined || typeof supplier !== "string")
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "supplier",
          errorDescription: "supplier is required",
        },
      })
    if (date === undefined || typeof date !== "string")
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "date",
          errorDescription: "date is required",
        },
      })
    if (invoice_number === undefined || typeof invoice_number !== "string")
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "invoice_number",
          errorDescription: "invoice_number is required",
        },
      })

    try {
      const result = await prisma.invoice.create({
        data: {
          uuid: v4(),
          projectUuid: project,
          supplierUuid: supplier,
          date: new Date(date),
          invoice_number,
          total: 0,
          userUuid: user.uuid,
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

      return res.status(201).json({ detail: result })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if ("code" in error) {
        if (error.code === "P2009")
          return res.status(422).json({
            detail: { errorStatus: 422, errorDescription: "Invalid data" },
          })
      }
      console.error(error)
    }
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: "Method not implemented",
    },
  })
}
