// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { hashPassword } from '@/helpers/hashPassword'
import prisma from '@/prisma/client'
import { ErrorInterface, CompanyResponseType } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 } from 'uuid'
import { getCompanyInformation } from '../helpers/company'
import { validateLoginInformation } from '../helpers/users'

type Data = {
  detail: string | ErrorInterface | CompanyResponseType
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { name, ruc, employees, email, password, username } = req.body

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

    if (email === null || email === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'email',
          errorDescription: 'email must be a number',
        },
      })

    if (password === null || password === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'password',
          errorDescription: 'password must be a number',
        },
      })

    if (username === null || username === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'username',
          errorDescription: 'username must be a number',
        },
      })

    const companyUuid = v4()
    const hashedPassword = await hashPassword(password)

    try {
      const [company] = await prisma.$transaction([
        prisma.company.create({
          data: {
            uuid: companyUuid,
            name: name,
            ruc: ruc,
            employees: employees,
            isActive: true,
          },
        }),
        prisma.user.create({
          data: {
            uuid: v4(),
            name: username,
            email,
            password: hashedPassword,
            companyUuid,
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

  if (req.method === 'GET') {
    const user = await validateLoginInformation(req)
    if ('errorStatus' in user)
      return res.status(user.errorStatus).json({ detail: user })

    const company = await getCompanyInformation(user.companyUuid)

    if (company === null || company === undefined)
      return res.status(417).json({
        detail: {
          errorStatus: 417,
          errorDescription: 'Invalid cookie information',
        },
      })

    return res.status(200).json({ detail: company })
  }

  if (req.method === 'PUT') {
    const user = await validateLoginInformation(req)
    if ('errorStatus' in user)
      return res.status(user.errorStatus).json({ detail: user })

    const { name, ruc, employees } = req.body

    const company = await getCompanyInformation(user.companyUuid)
    if (company === null || company === undefined)
      return res.status(417).json({
        detail: {
          errorStatus: 417,
          errorDescription: 'Invalid cookie information',
        },
      })

    const result = await prisma.company.update({
      where: {
        uuid: user.companyUuid,
      },
      data: {
        name: name ? name : company.name,
        ruc: ruc ? ruc : company.ruc,
        employees: employees ? employees : company.employees,
      },
    })

    return res.status(200).json({
      detail: {
        uuid: result.uuid,
        ruc: result.ruc,
        name: result.name,
        employees: result.employees,
        isActive: result.isActive,
      },
    })
  }

  res.status(500).json({ detail: 'Method not implemented' })
}
