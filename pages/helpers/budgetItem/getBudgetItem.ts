import prisma from '@/prisma/client'

export default async function getBudgetItem(uuid: string) {
  const response = await prisma.budget_item.findFirstOrThrow({
    where: {
      uuid: uuid,
    },
  })

  return response
}
