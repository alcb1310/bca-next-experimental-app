// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { validateLoginInformation } from "@/helpers/api/users"
import prisma from "@/prisma/client"
import { DetailResponseType, ErrorInterface } from "@/types"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  detail: string | ErrorInterface | DetailResponseType
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req)
  if ("errorStatus" in user)
    return res.status(user.errorStatus).json({ detail: user })

  const { uuid, detailId } = req.query

  try {
    const invoiceDetail = await prisma.invoice_detail.findFirst({
      where: {
        companyUuid: user.companyUuid,
        invoiceUuid: uuid as string,
        uuid: detailId as string,
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

    if (invoiceDetail === null)
      return res
        .status(404)
        .json({
          detail: {
            errorStatus: 404,
            errorDescription: "invoiceDetail not found",
          },
        })

    if (req.method === "GET")
      return res.status(200).json({ detail: invoiceDetail })

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
