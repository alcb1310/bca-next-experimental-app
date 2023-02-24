import prisma from '@/prisma/client'
import { UserResponseType } from '@/types'

export default async function getAllHistoric(
  project: string,
  level: number,
  date: Date,
  user: UserResponseType
) {
  const queryMonth: number = date.getUTCMonth() + 1
  const queryYear: number = date.getFullYear()

  let lteMonth: number = queryMonth + 1
  let lteYear: number = queryYear

  if (queryMonth === 12) {
    lteMonth = 1
    lteYear = queryYear + 1
  }

  const historicResponse = await prisma.historicView.findMany({
    where: {
      project_uuid: project,
      company_uuid: user.companyUuid,
      level: {
        lte: level,
      },
      date: {
        gte: new Date(`${queryYear}-${queryMonth}-01`),
        lt: new Date(`${lteYear}-${lteMonth}-01`),
      },
    },
  })

  return historicResponse
}
