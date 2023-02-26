import prisma from '@/prisma/client'
// import { ModuleInterface } from "@/types";

export default async function getAllProjects(
  companyUuid: string,
  active: boolean | undefined
) {
  let filter: any = { companyUuid: companyUuid }

  if (active !== undefined) filter = { ...filter, is_active: active }

  const res = await prisma.project.findMany({
    where: filter,
    select: {
      uuid: true,
      name: true,
      is_active: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return res
}
