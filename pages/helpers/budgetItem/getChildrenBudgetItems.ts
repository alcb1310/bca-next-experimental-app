import prisma from '@/prisma/client'

export default async function getChildrenBudgetItems(uuid: string) {
  const response = await prisma.budget_item.findMany({
    where: {
      parentUuid: uuid,
    },
  })

  return response
}
