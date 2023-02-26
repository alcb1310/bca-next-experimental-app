// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getOneBudgetItem } from '@/helpers/api/budgetItem';
import { validateLoginInformation } from '@/helpers/api/users';
import prisma from '@/prisma/client';
import { BudgetItemResponseType, ErrorInterface } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  detail: string | ErrorInterface | BudgetItemResponseType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req);
  if ('errorStatus' in user)
    return res.status(user.errorStatus).json({ detail: user });

  const { uuid } = req.query;

  const budgetItem = await getOneBudgetItem(uuid as string, user.companyUuid);

  if (budgetItem === null)
    return res.status(404).json({
      detail: {
        errorStatus: 404,
        errorDescription: 'Budget Item not found',
      },
    });

  if (req.method === 'GET') {
    return res.status(200).json({ detail: budgetItem });
  }

  if (req.method === 'PUT') {
    const { code, name, accumulates, level, parentUuid } = req.body;

    if (accumulates !== undefined && typeof accumulates !== 'boolean')
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'accumulates',
          errorDescription: 'accumulates must be boolean',
        },
      });

    const acc =
      accumulates === undefined
        ? budgetItem.accumulates
        : (accumulates as boolean);
    let lev: number;
    let parent: string | null;

    if (parentUuid === undefined)
      parent = budgetItem.budget_item ? budgetItem.budget_item.uuid : null;
    else if (parentUuid === '') parent = null;
    else parent = parentUuid as string;

    if (level === undefined) lev = budgetItem.level;
    else lev = Number.parseInt(level as string, 10);

    if (Number.isNaN(lev))
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: 'level',
          errorDescription: 'level must be a number',
        },
      });

    try {
      const response = await prisma.budget_item.update({
        where: {
          uuid: uuid as string,
        },
        data: {
          code: code ? (code as string) : budgetItem.code,
          name: name ? (name as string) : budgetItem.name,
          parentUuid: parent,
          accumulates: acc,
          level: lev,
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
      });

      return res.status(200).json({ detail: response });
    } catch (error: any) {
      if ('code' in error && error.code === 'P2002')
        return res.status(409).json({
          detail: {
            errorStatus: 409,
            errorKey: error.meta.target[0],
            errorDescription: `${error.meta.target[0]} already exists`,
          },
        });
      console.error(error);
      return res.status(406).json({
        detail: {
          errorStatus: 406,
          errorDescription: 'unknown error, please check your server logs',
        },
      });
    }
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: 'Method not implemented',
    },
  });
}
