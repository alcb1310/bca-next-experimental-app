// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@/prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllProjects, getUserByEmailWithoutPassword, validateCookie } from '../helpers/users';
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
            errorKey: 'method'
        }
    });
}
