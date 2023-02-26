// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@/prisma/client'
import { BudgetItemResponseType, ErrorInterface } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 } from 'uuid'
import { validateLoginInformation } from '../helpers/users'

type Data = {
  detail:
    | string
    | ErrorInterface
    | BudgetItemResponseType[]
    | BudgetItemResponseType
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

  if (req.method === 'POST') {
    const { code, name, accumulates, level, parentUuid } = req.body

    // Validate all of the required fields
    if (code === undefined || code === null)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'code',
          errorDescription: 'code is required',
        },
      })
    if (name === undefined || name === null)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'name',
          errorDescription: 'name is required',
        },
      })
    if (accumulates === undefined || accumulates === null)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'accumulates',
          errorDescription: 'accumulates is required',
        },
      })
    if (level === undefined || level === null)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'level',
          errorDescription: 'level is required',
        },
      })

    if (typeof accumulates !== 'boolean')
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'accumulates',
          errorDescription: 'accumulates must be boolean',
        },
      })
    if (typeof level !== 'number')
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'level',
          errorDescription: 'level must be a number',
        },
      })

    try {
      const result = await prisma.budget_item.create({
        data: {
          uuid: v4(),
          code,
          name,
          level,
          accumulates,
          parentUuid: parentUuid === undefined ? null : (parentUuid as string),
          companyUuid: user.companyUuid,
          userUuid: user.uuid,
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
      })
      return res.status(201).json({ detail: result })
    } catch (error: any) {
      console.error(error)
      if ('code' in error && error.code === 'P2002')
        return res.status(409).json({
          detail: {
            errorStatus: 409,
            errorKey: error.meta.target[0],
            errorDescription: `${error.meta.target[0]} already exists`,
          },
        })
      console.error(error)
      return res.status(406).json({
        detail: {
          errorStatus: 406,
          errorDescription: 'unknown error, please check your server logs',
        },
      })
    }
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: 'Method not implemented',
    },
  })
}
