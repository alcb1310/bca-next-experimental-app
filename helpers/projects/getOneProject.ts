import prisma from "@/prisma/client"

export default async function getOneProject(
  projectUuid: string,
  companyUuid: string
) {
  return await prisma.project.findFirst({
    where: {
      uuid: projectUuid,
      companyUuid: companyUuid,
    },
    select: {
      uuid: true,
      name: true,
      is_active: true,
    },
  })
}
