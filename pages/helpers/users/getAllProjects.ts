import prisma from "@/prisma/client";
// import { ModuleInterface } from "@/types";

export default async function getAllProjects(companyUuid: string, active: boolean | undefined) {
    let res;

    if (active === undefined)
        res = await prisma.project.findMany({
            where: {
                companyUuid
            },
            select: {
                uuid: true,
                name: true
            },
            orderBy: {
                name: 'asc'
            }
        });
    else
        res = await prisma.project.findMany({
            where: {
                companyUuid,
                is_active: active
            },
            select: {
                uuid: true,
                name: true
            },
            orderBy: {
                name: 'asc'
            }
        });

    return res;
}