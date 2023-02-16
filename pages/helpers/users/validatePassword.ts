import bcrypt from 'bcrypt';

export async function validatePassword(
    plainPassword: string,
    hashedPassword: string,
): Promise<boolean> {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isValid;
}