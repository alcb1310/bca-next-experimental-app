// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getOneBudgetItem } from '@/pages/helpers/budgetItem'
import { validateLoginInformation } from '@/pages/helpers/users'
import { BudgetItemResponseType, ErrorInterface } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  detail: string | ErrorInterface | BudgetItemResponseType
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req)
  if ('errorStatus' in user)
    return res.status(user.errorStatus).json({ detail: user })

  const { uuid } = req.query
  console.log(uuid, user)

  if (req.method === 'GET') {
    const budgetItem = await getOneBudgetItem(uuid as string, user.companyUuid)

    if (budgetItem === null)
      return res.status(404).json({
        detail: {
          errorStatus: 404,
          errorDescription: 'Budget Item not found',
        },
      })

    return res.status(200).json({ detail: budgetItem })
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: 'Method not implemented',
    },
  })
}
