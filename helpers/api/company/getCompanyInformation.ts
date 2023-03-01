import prisma from "@/prisma/client"

export default async function getCompanyInformation(companyUuid: string) {
  return await prisma.company.findFirst({
    where: {
      uuid: companyUuid,
    },
    select: {
      uuid: true,
      name: true,
      ruc: true,
      employees: true,
      isActive: true,
    },
  })
}
