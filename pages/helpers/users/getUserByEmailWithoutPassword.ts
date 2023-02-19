import prisma from "@/prisma/client";
// import { ModuleInterface } from "@/types";

export default async function getUserByEmailWithoutPassword(email: string) {
    const res = await prisma.user.findFirst({
        where: {
            email
        },
        select: {
            password: false,
            email: true,
            companyUuid: true,
            name: true
        }
    });

    return res;
}