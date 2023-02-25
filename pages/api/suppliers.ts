// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@/prisma/client'
import { ErrorInterface, SupplierResponseType } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { validateLoginInformation } from '../helpers/users'

type Data = {
  detail: string | ErrorInterface | SupplierResponseType[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req)
  if ('errorStatus' in user)
    return res.status(user.errorStatus).json({ detail: user })

  if (req.method === 'GET') {
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
        name: 'asc',
      },
    })

    return res.status(200).json({ detail: suppliers })
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: 'Method not implemented',
    },
  })
}
