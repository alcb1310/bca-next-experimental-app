// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CompanyResponseType } from '@/CompanyType'
import prisma from '@/prisma/client'
import { ErrorInterface } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 } from 'uuid'

type Data = {
  detail: string | ErrorInterface | CompanyResponseType
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { name, ruc, employees } = req.body

    if (name === null || name === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'name',
          errorDescription: 'name is required',
        },
      })

    if (ruc === null || ruc === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'ruc',
          errorDescription: 'ruc is required',
        },
      })

    if (employees === null || employees === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'employees',
          errorDescription: 'employees is required',
        },
      })

    const employeeNumber = parseInt(employees, 10)
    if (Number.isNaN(employeeNumber))
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'employees',
          errorDescription: 'employees must be a number',
        },
      })

    try {
      const [company] = await prisma.$transaction([
        prisma.company.create({
          data: {
            uuid: v4(),
            name: name,
            ruc: ruc,
            employees: employees,
            isActive: true,
          },
        }),
      ])

      return res.status(201).json({
        detail: {
          uuid: company.uuid,
          ruc: company.ruc,
          name: company.name,
          employees: company.employees,
          isActive: company.isActive,
        },
      })
    } catch (error: any) {
      if ('code' in error && error.code === 'P2002')
        return res.status(409).json({
          detail: {
            errorStatus: 409,
            errorKey: error.meta.target[0],
            errorDescription: `${error.meta.target[0]} already exists`,
          },
        })
      console.error(error.code)
      return res.status(406).json({
        detail: {
          errorStatus: 406,
          errorKey: 'unknown',
          errorDescription: 'unknown error, please check your server logs',
        },
      })
    }
  }

  res.status(500).json({ detail: 'Method not implemented' })
}
