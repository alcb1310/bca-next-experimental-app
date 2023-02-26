// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { validateLoginInformation } from '@/helpers/api/users'
import { getOneProject } from '@/helpers/projects'
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

  if (req.method === 'GET') {
    const project = await getOneProject(uuid as string, user.companyUuid)

    if (project === null)
      return res.status(404).json({
        detail: { errorStatus: 404, errorDescription: 'Project not found' },
      })

    return res.status(200).json({ detail: project })
  }

  res.status(500).json({
    detail: { errorStatus: 500, errorDescription: 'Method not implemented' },
  })
}
