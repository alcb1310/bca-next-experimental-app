// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getOneSupplier from '@/pages/helpers/supplier/getOneSupplier'
import { validateLoginInformation } from '@/pages/helpers/users'
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
    return res.status(200).json({ detail: supplier })
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: 'Method not implemented',
    },
  })
}
