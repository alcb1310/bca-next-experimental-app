// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { BudgetResponseType, ErrorInterface } from '@/types'
import prisma from '@/prisma/client'
import { getUserByEmailWithoutPassword, validateCookie } from '../helpers/users'
import { formatManyBudgetResponse } from '@/helpers/formatBudgetResponse'

type Data = {
  detail: string | ErrorInterface
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const email = validateCookie(req)

    if (email === false)
      return res.status(401).json({
        detail: {
          errorStatus: 401,
          errorKey: 'cookie',
          errorDescription: 'Invalid cookie information',
        },
      })

    const user = await getUserByEmailWithoutPassword(email)
    if (user === null)
      return res.status(401).json({
        detail: {
          errorStatus: 401,
          errorKey: 'cookie',
          errorDescription: 'Invalid cookie information',
        },
      })

    const { project, level } = req.query
    console.log(user.companyUuid, project, level)

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

      console.log(formatManyBudgetResponse(results))
      return res.status(200).json({ detail: 'Budget Information' })
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
