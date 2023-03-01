// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { validateLoginInformation } from "@/helpers/api/users"
import prisma from "@/prisma/client"
import { ErrorInterface, InvoiceResponseType } from "@/types"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  detail: string | ErrorInterface | InvoiceResponseType[]
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

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: "Method not implemented",
    },
  })
}
