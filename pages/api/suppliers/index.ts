// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/prisma/client"
import { ErrorInterface, SupplierResponseType } from "@/types"
import type { NextApiRequest, NextApiResponse } from "next"
import { v4 } from "uuid"
import { validateLoginInformation } from "@/helpers/api/users"

type Data = {
  detail:
    | string
    | ErrorInterface
    | SupplierResponseType[]
    | SupplierResponseType
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req)
  if ("errorStatus" in user)
    return res.status(user.errorStatus).json({ detail: user })

  if (req.method === "GET") {
    const suppliers = await prisma.supplier.findMany({
      where: {
        companyUuid: user.companyUuid,
      },
      select: {
        uuid: true,
        supplier_id: true,
        name: true,
        contact_name: true,
        contact_email: true,
        contact_phone: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return res.status(200).json({ detail: suppliers })
  }

  if (req.method === "POST") {
    const { supplier_id, name, contact_name, contact_email, contact_phone } =
      req.body

    if (supplier_id === null || supplier_id === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "supplier_id",
          errorDescription: "supplier_id is required",
        },
      })

    if (name === null || name === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "name",
          errorDescription: "name is required",
        },
      })

    try {
      const response = await prisma.supplier.create({
        data: {
          uuid: v4(),
          supplier_id,
          name,
          contact_name,
          contact_email,
          contact_phone,
          companyUuid: user.companyUuid,
          userUuid: user.uuid,
        },
        select: {
          uuid: true,
          supplier_id: true,
          name: true,
          contact_name: true,
          contact_email: true,
          contact_phone: true,
        },
      })

      return res.status(201).json({ detail: response })
      // eslint-disable-next-line
    } catch (error: any) {
      if ("code" in error && error.code === "P2002")
        return res.status(409).json({
          detail: {
            errorStatus: 409,
            errorKey: error.meta.target[0],
            errorDescription: `${error.meta.target[0]} already exists`,
          },
        })
      console.error(error.code)
      return res.status(406).json({
        detail: {
          errorStatus: 406,
          errorKey: "unknown",
          errorDescription: "unknown error, please check your server logs",
        },
      })
    }
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: "Method not implemented",
    },
  })
}
