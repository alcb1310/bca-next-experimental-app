// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import { serialize } from "cookie"
import { getUserByEmail } from "@/helpers/api/users"
import { ErrorInterface } from "@/types"
import { verifyPassword } from "@/helpers/hashPassword"

type Data = {
  status: string;
};

interface LoginInterface {
  email?: string;
  password?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorInterface>
) {
  const { method, body } = req

  if (method === "POST") {
    const { email, password } = body as LoginInterface

    if (email === undefined)
      return res.status(422).json({
        errorStatus: 422,
        errorKey: "email",
        errorDescription: "Need to provide an email to login",
      })

    if (password === undefined)
      return res.status(422).json({
        errorStatus: 422,
        errorKey: "password",
        errorDescription: "Need to provide an password to login",
      })

    const userData = await getUserByEmail(email)
    if (userData === null)
      return res.status(401).json({
        errorStatus: 401,
        errorKey: "credentials",
        errorDescription: "Invalid credentials",
      })

    if (!(await verifyPassword(password, userData.password)))
      return res.status(401).json({
        errorStatus: 401,
        errorKey: "credentials",
        errorDescription: "Invalid credentials",
      })

    const token = jwt.sign(
      {
        email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // Token valid for 30 days
      },
      process.env.SECRET as string
    )

    const serialized = serialize("bca-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1, // Cookie valid for 1 day,
      path: "/",
    })
    res.setHeader("Set-Cookie", serialized)

    return res.status(200).json({ status: "login succesfull" })
  }

  return res.status(404).json({
    errorStatus: 404,
    errorKey: "method",
    errorDescription: `No implementation of the ${method} request`,
  })
}
