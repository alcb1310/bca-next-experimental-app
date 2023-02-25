// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getOneSupplier from '@/pages/helpers/supplier/getOneSupplier'
import { validateLoginInformation } from '@/pages/helpers/users'
import prisma from '@/prisma/client'
import { ErrorInterface, SupplierResponseType } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  detail: string | ErrorInterface | SupplierResponseType
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req)
  if ('errorStatus' in user)
    return res.status(user.errorStatus).json({ detail: user })

  const { uuid } = req.query
  const supplierUuid = uuid as string

  if (req.method === 'GET') {
    const supplier = await getOneSupplier(supplierUuid, user.companyUuid)

    if (supplier === null)
      return res.status(404).json({
        detail: {
          errorStatus: 404,
          errorDescription: 'Supplier not found',
        },
      })

    return res.status(200).json({ detail: supplier })
  }

  if (req.method === 'PUT') {
    const supplier = await getOneSupplier(supplierUuid, user.companyUuid)

    if (supplier === null)
      return res.status(404).json({
        detail: {
          errorStatus: 404,
          errorDescription: 'Supplier not found',
        },
      })

    const { supplier_id, name, contact_name, contact_email, contact_phone } =
      req.body

    const response = await prisma.supplier.update({
      where: {
        uuid: supplierUuid,
      },
      data: {
        supplier_id: supplier_id ? supplier_id : supplier.supplier_id,
        name: name ? name : supplier.name,
        contact_name: contact_name ? contact_name : supplier.contact_name,
        contact_email: contact_email ? contact_email : supplier.contact_email,
        contact_phone: contact_phone ? contact_phone : supplier.contact_phone,
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

    return res.status(200).json({ detail: response })
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: 'Method not implemented',
    },
  })
}
