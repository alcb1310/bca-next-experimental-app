// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@/prisma/client'
import { BudgetItemResponseType, ErrorInterface } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { validateLoginInformation } from '../helpers/users'

type Data = {
  detail: string | ErrorInterface | BudgetItemResponseType[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req)
  if ('errorStatus' in user)
    return res.status(user.errorStatus).json({ detail: user })

  if (req.method === 'GET') {
    const budgetItems = await prisma.budget_item.findMany({
      where: {
        companyUuid: user.companyUuid,
      },
      select: {
        uuid: true,
        code: true,
        name: true,
        level: true,
        accumulates: true,
        budget_item: {
          select: {
            uuid: true,
            code: true,
            name: true,
            level: true,
            accumulates: true,
          },
        },
      },
      orderBy: {
        code: 'asc',
      },
    })

    return res.status(200).json({ detail: budgetItems })
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: 'Method not implemented',
    },
  })
}
