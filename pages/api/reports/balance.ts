// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getUserByEmailWithoutPassword, validateCookie } from '@/pages/helpers/users';
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
        const cookie = validateCookie(req);
        if (cookie === false) return res.status(401).json({
            detail: {
                errorStatus: 401,
                errorDescription: 'You need to log in',
                errorKey: 'credentials'
            }
        });

        const user = await getUserByEmailWithoutPassword(cookie);
        if (user === null) return res.status(417).json({
            detail: {
                errorStatus: 417,
                errorDescription: 'Invalid cookie information',
                errorKey: 'credentials'
            }
        });
        const { project, date } = req.query as Query;

        if (project === undefined) return res.status(400).json({
            detail: {
                errorStatus: 400,
                errorKey: 'project',
                errorDescription: 'Project is required'
            }
        });

        if (date === undefined) return res.status(400).json({
            detail: {
                errorStatus: 400,
                errorKey: 'date',
                errorDescription: 'Date is required'
            }
        });

        const dateValue = new Date(date);

        if (dateValue.toString() === 'Invalid Date') return res.status(400).json({
            detail: {
                errorStatus: 400,
                errorKey: 'date',
                errorDescription: 'Date is invalid'
            }
        });
        const queryMonth = dateValue.getUTCMonth() + 1;
        const queryYear = dateValue.getUTCFullYear();

        const results = await prisma.invoice.findMany({
            where: {
                companyUuid: user.companyUuid,
                date: {
                    lt: new Date(`${queryYear}-${queryMonth + 1}-01`),
                    gte: new Date(`${queryYear}-${queryMonth}-01`)
                }
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
                        name: true
                    }
                }
            },
            orderBy: {
                date: 'desc',
            }
        });

        // console.log(results);


        return res.status(200).json({ detail: results });
    }

    res.status(500).json({
        detail: {
            errorStatus: 500,
            errorKey: 'method',
            errorDescription: 'Unknown method'
        }
    });
}
