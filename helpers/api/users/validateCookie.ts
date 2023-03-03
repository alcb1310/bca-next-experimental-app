import { NextApiRequest } from "next"
import { verify } from "jsonwebtoken"

interface JWTPayload {
  email: string
  exp: number
  iat: number
}

export default function validateCookie(req: NextApiRequest): string | false {
  const token = req.cookies["bca-token"]
  if (token === undefined) return false

  try {
    const user = verify(token, process.env.SECRET as string) as JWTPayload
    return user.email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error)
    return false
  }
}

export function validateCookieInformation(token: string): string | false {
  try {
    const user = verify(token, process.env.SECRET as string) as JWTPayload
    return user.email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error)
    return false
  }
}
