// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { validateLoginInformation } from '@/helpers/api/users'
import { formatOneBudgetResponse } from '@/helpers/formatBudgetResponse'
import prisma from '@/prisma/client'
import {
  BudgetFormattedResponseType,
  BudgetResponseType,
  ErrorInterface,
} from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  detail: string | ErrorInterface | BudgetFormattedResponseType
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req)
  if ('errorStatus' in user)
    return res.status(user.errorStatus).json({ detail: user })

  const { uuid } = req.query

  if (req.method === 'GET') {
    const budget = (await prisma.budgetView.findFirst({
      where: {
        id: uuid as string,
        company_uuid: user.companyUuid,
      },
    })) as BudgetResponseType

    if (budget === null)
      return res.status(404).json({
        detail: { errorStatus: 404, errorDescription: 'Budget not found' },
      })

    return res.status(200).json({ detail: formatOneBudgetResponse(budget) })
  }

  res.status(500).json({
    detail: { errorStatus: 500, errorDescription: 'Method not implemented' },
  })
}
