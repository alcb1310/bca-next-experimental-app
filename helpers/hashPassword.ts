import bcrypt from "bcrypt"

export async function hashPassword(plainPassword: string) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(plainPassword, salt)
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}
