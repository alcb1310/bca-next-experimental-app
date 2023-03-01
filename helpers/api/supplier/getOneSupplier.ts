import prisma from "@/prisma/client"
import { SupplierResponseType } from "@/types"

export default async function getOneSupplier(
  supplierUuid: string,
  companyUuid: string
) {
  return (await prisma.supplier.findFirst({
    where: {
      uuid: supplierUuid,
      companyUuid: companyUuid,
    },
    select: {
      uuid: true,
      supplier_id: true,
      name: true,
      contact_name: true,
      contact_email: true,
      contact_phone: true,
    },
  })) as SupplierResponseType
}
