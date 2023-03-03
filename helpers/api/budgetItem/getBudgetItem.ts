import prisma from "@/prisma/client"

export default async function getBudgetItem(uuid: string) {
  const response = await prisma.budget_item.findFirstOrThrow({
    where: {
      uuid: uuid,
    },
  })

  return response
}

export async function getOneBudgetItem(
  budgetItemUuid: string,
  companyUuid: string
) {
  return await prisma.budget_item.findFirst({
    where: {
      uuid: budgetItemUuid,
      companyUuid: companyUuid,
    },
    select: {
      uuid: true,
      code: true,
      name: true,
      accumulates: true,
      level: true,
      budget_item: {
        select: {
          uuid: true,
          code: true,
          name: true,
          accumulates: true,
          level: true,
        },
      },
    },
  })
}
