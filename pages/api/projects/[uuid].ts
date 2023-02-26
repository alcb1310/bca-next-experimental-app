// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { validateLoginInformation } from '@/helpers/api/users'
import { getOneProject } from '@/helpers/projects'
import prisma from '@/prisma/client'
import { ErrorInterface, ProjectType } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  detail: string | ErrorInterface | ProjectType
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req)
  if ('errorStatus' in user)
    return res.status(user.errorStatus).json({ detail: user })

  const { uuid } = req.query

  const project = await getOneProject(uuid as string, user.companyUuid)

  if (project === null)
    return res.status(404).json({
      detail: { errorStatus: 404, errorDescription: 'Project not found' },
    })

  if (req.method === 'GET') {
    return res.status(200).json({ detail: project })
  }

  if (req.method === 'PUT') {
    const { name, is_active } = req.body

    try {
      const data = await prisma.project.update({
        where: {
          uuid: uuid as string,
        },
        data: {
          name: name ? name : project.name,
          is_active: is_active === undefined ? project.is_active : is_active,
        },
        select: {
          uuid: true,
          name: true,
          is_active: true,
        },
      })

      return res.status(200).json({ detail: data })
    } catch (error: any) {
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
    detail: { errorStatus: 500, errorDescription: 'Method not implemented' },
  })
}
