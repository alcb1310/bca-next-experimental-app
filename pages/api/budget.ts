// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@/prisma/client'
import { validateLoginInformation } from '../helpers/users'
import { formatManyBudgetResponse } from '@/helpers/formatBudgetResponse'
import type { NextApiRequest, NextApiResponse } from 'next'
import type {
  BudgetFormattedResponseType,
  BudgetResponseType,
  ErrorInterface,
} from '@/types'

type Data = {
  detail: string | ErrorInterface | BudgetFormattedResponseType[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const user = await validateLoginInformation(req)
    if ('errorStatus' in user) {
      return res.status(user.errorStatus).json({ detail: user })
    }

    const { project, level } = req.query

    if (typeof project === 'string' && typeof level === 'string') {
      const results = (await prisma.budgetView.findMany({
        where: {
          company_uuid: user.companyUuid,
          project_uuid: project,
          level: {
            lte: parseInt(level, 10),
          },
        },
        orderBy: {
          code: 'asc',
        },
      })) as BudgetResponseType[]

      return res.status(200).json({ detail: formatManyBudgetResponse(results) })
    }

    return res.status(400).json({
      detail: {
        errorStatus: 400,
        errorKey: 'parameters',
        errorDescription: 'Invalid parameters',
      },
    })
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorKey: 'method',
      errorDescription: 'Method not implemented',
    },
  })
}
