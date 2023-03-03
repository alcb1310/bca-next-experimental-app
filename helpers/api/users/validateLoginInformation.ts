import { validateCookie, getUserByEmailWithoutPassword } from "./"
import type { NextApiRequest } from "next"

export default async function validateLoginInformation(req: NextApiRequest) {
  const cookie = validateCookie(req)
  if (cookie === false)
    return {
      errorStatus: 401,
      errorDescription: "You need to log in",
      errorKey: "credentials",
    }

  const user = await getUserByEmailWithoutPassword(cookie)
  if (user === null)
    return {
      errorStatus: 417,
      errorDescription: "Invalid cookie information",
      errorKey: "credentials",
    }

  return user
}
