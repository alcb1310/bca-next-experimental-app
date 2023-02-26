// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getOneSupplier from '@/helpers/api/supplier/getOneSupplier';
import { validateLoginInformation } from '@/helpers/api/users';
import prisma from '@/prisma/client';
import { ErrorInterface, SupplierResponseType } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  detail: string | ErrorInterface | SupplierResponseType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req);
  if ('errorStatus' in user)
    return res.status(user.errorStatus).json({ detail: user });

  const { uuid } = req.query;
  const supplierUuid = uuid as string;

  if (req.method === 'GET') {
    const supplier = await getOneSupplier(supplierUuid, user.companyUuid);

    if (supplier === null)
      return res.status(404).json({
        detail: {
          errorStatus: 404,
          errorDescription: 'Supplier not found',
        },
      });

    return res.status(200).json({ detail: supplier });
  }

  if (req.method === 'PUT') {
    const supplier = await getOneSupplier(supplierUuid, user.companyUuid);

    if (supplier === null)
      return res.status(404).json({
        detail: {
          errorStatus: 404,
          errorDescription: 'Supplier not found',
        },
      });

    const { supplier_id, name, contact_name, contact_email, contact_phone } =
      req.body;
    try {
      const response = await prisma.supplier.update({
        where: {
          uuid: supplierUuid,
        },
        data: {
          supplier_id: supplier_id ? supplier_id : supplier.supplier_id,
          name: name ? name : supplier.name,
          contact_name: contact_name ? contact_name : supplier.contact_name,
          contact_email: contact_email ? contact_email : supplier.contact_email,
          contact_phone: contact_phone ? contact_phone : supplier.contact_phone,
        },
        select: {
          uuid: true,
          supplier_id: true,
          name: true,
          contact_name: true,
          contact_email: true,
          contact_phone: true,
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
      console.error(error.code);
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
