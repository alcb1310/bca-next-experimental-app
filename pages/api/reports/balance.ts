// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { validateLoginInformation } from '@/helpers/api/users';
import prisma from '@/prisma/client';
import { ErrorInterface, Balance } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  detail: Balance[] | ErrorInterface;
};

type Query = {
  project: string | undefined;
  date: string | undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const user = await validateLoginInformation(req);
    if ('errorStatus' in user) {
      return res.status(user.errorStatus).json({ detail: user });
    }

    const { project, date } = req.query as Query;

    if (project === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'project',
          errorDescription: 'Project is required',
        },
      });

    if (date === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'date',
          errorDescription: 'Date is required',
        },
      });

    const dateValue = new Date(date);

    if (dateValue.toString() === 'Invalid Date')
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'date',
          errorDescription: 'Date is invalid',
        },
      });

    const queryMonth: number = dateValue.getUTCMonth() + 1;
    const queryYear: number = dateValue.getFullYear();

    let lteMonth: number = queryMonth + 1;
    let lteYear: number = queryYear;

    if (queryMonth === 12) {
      lteMonth = 1;
      lteYear = queryYear + 1;
    }

    const results = await prisma.invoice.findMany({
      where: {
        companyUuid: user.companyUuid,
        date: {
          lt: new Date(`${lteYear}-${lteMonth}-01`),
          gte: new Date(`${queryYear}-${queryMonth}-01`),
        },
      },
      select: {
        uuid: true,
        invoice_number: true,
        date: true,
        total: true,
        supplier: {
          select: {
            uuid: true,
            supplier_id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    console.log(results);

    return res.status(200).json({ detail: results });
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorKey: 'method',
      errorDescription: 'Unknown method',
    },
  });
}
