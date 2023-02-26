// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@/prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllProjects, validateLoginInformation } from '@/helpers/api/users';
import { ErrorInterface } from '@/types';

type Data = {
  detail: Array<{ uuid: string; name: string; }> | ErrorInterface;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    // reading thata from the projects
    const user = await validateLoginInformation(req);
    if ('errorStatus' in user) {
      return res.status(user.errorStatus).json({ detail: user });
    }

    let active: boolean | undefined = undefined;
    switch (req.query.active) {
      case 'true':
        active = true;
        break;
      case 'false':
        active = false;
        break;
      default:
        active = undefined;
    }

    const projects = await getAllProjects(user.companyUuid!, active);

    return res.status(200).json({ detail: projects });
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: 'Metod not implemented',
      errorKey: 'method',
    },
  });
}
