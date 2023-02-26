// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@/prisma/client'
import { validateLoginInformation } from '@/helpers/api/users'
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

    let filter: any = { company_uuid: user.companyUuid }

    if (project !== undefined) filter = { ...filter, project_uuid: project }
    if (level !== undefined)
      filter = { ...filter, level: { lte: parseInt(level as string, 10) } }

    const results = (await prisma.budgetView.findMany({
      where: filter,
      orderBy: {
        code: 'asc',
      },
    })) as BudgetResponseType[]

    return res.status(200).json({ detail: formatManyBudgetResponse(results) })
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorKey: 'method',
      errorDescription: 'Method not implemented',
    },
  })
}
