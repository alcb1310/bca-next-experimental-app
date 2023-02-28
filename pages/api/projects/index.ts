// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { getAllProjects, validateLoginInformation } from "@/helpers/api/users"
import { ErrorInterface, ProjectType } from "@/types"
import prisma from "@/prisma/client"
import { v4 } from "uuid"

type Data = {
  detail: ErrorInterface | ProjectType[] | ProjectType
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await validateLoginInformation(req)
  if ("errorStatus" in user) {
    return res.status(user.errorStatus).json({ detail: user })
  }

  if (req.method === "GET") {
    // reading data from the projects
    let active: boolean | undefined = undefined
    switch (req.query.active) {
      case "true":
        active = true
        break
      case "false":
        active = false
        break
      default:
        active = undefined
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const projects = await getAllProjects(user.companyUuid!, active)

    return res.status(200).json({ detail: projects })
  }

  if (req.method === "POST") {
    const { name, is_active } = req.body

    if (name === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "name",
          errorDescription: "name is required",
        },
      })

    if (is_active === undefined)
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "is_active",
          errorDescription: "is_active is required",
        },
      })
    if (typeof is_active !== "boolean")
      return res.status(400).json({
        detail: {
          errorStatus: 400,
          errorKey: "is_active",
          errorDescription: "is_active must be boolean",
        },
      })
    try {
      const data = await prisma.project.create({
        data: {
          uuid: v4(),
          name,
          is_active,
          userUuid: user.uuid,
          companyUuid: user.companyUuid,
        },
        select: {
          uuid: true,
          name: true,
          is_active: true,
        },
      })

      return res.status(200).json({ detail: data })
      // eslint-disable-next-line
    } catch (error: any) {
      if ("code" in error && error.code === "P2002")
        return res.status(409).json({
          detail: {
            errorStatus: 409,
            errorKey: error.meta.target[0],
            errorDescription: `${error.meta.target[0]} already exists`,
          },
        })
      console.error(error)
      return res.status(406).json({
        detail: {
          errorStatus: 406,
          errorDescription: "unknown error, please check your server logs",
        },
      })
    }
  }

  res.status(500).json({
    detail: {
      errorStatus: 500,
      errorDescription: "Metod not implemented",
      errorKey: "method",
    },
  })
}
