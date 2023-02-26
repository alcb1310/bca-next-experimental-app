import { validateCookie } from '@/helpers/api/users';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { ErrorInterface } from '@/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string | ErrorInterface>
) {
    const { method } = req;

    if (method === 'POST') {
        if (validateCookie(req) === false)
            return res.status(403).json({
                errorStatus: 403,
                errorDescription: 'Invalid token',
                errorKey: 'token'
            });

        const serialized = serialize('bca-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Cookie always invalid
            path: '/'
        });
        res.setHeader('Set-Cookie', serialized);
        return res.status(200).json('logout successfull');
    }

    return res.status(404).json({
        errorStatus: 404,
        errorKey: 'method',
        errorDescription: `No implementation of the ${method} request`,
    });
}
