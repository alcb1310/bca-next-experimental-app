// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { validateLoginInformation } from '@/helpers/api/users';
import type { ErrorInterface } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSpentBudgetItem } from '@/helpers/api/reports';
import { budget_item } from '@prisma/client';

type Data = {
  detail:
  | string
  | ErrorInterface
  | Array<{ budgetItem: budget_item; spent: number; }>;
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
    const { date, level, project } = req.query;

    if (project === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'project',
          errorDescription: 'project is required',
        },
      });

    if (level === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'level',
          errorDescription: 'level is required',
        },
      });

    if (date === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'date',
          errorDescription: 'date is required',
        },
      });

    const levelNumber = parseInt(level as string, 10);
    if (Number.isNaN(levelNumber))
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'level',
          errorDescription: 'level has to be a number',
        },
      });

    const dateValue = new Date(date as string);
    if (dateValue.toString() === 'Invalid Date')
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'date',
          errorDescription: 'Date is invalid',
        },
      });

    const result = await getSpentBudgetItem(
      project as string,
      dateValue,
      levelNumber,
      user
    );

    return res.status(200).json({ detail: result });
  }
  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: 'Method not implemented',
    },
  });
}
