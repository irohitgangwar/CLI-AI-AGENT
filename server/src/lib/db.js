import {PrismaClient} from "@prisma/client"; //Bring Prisma (tool to talk to DB)

const globalForPrisma=global //Use global memory-shared across server (avoid multiple DB connections in development)
const prisma =
  globalForPrisma.prisma ?? //If Prisma already exists → reuse Else → create new one
  new PrismaClient();

if(process.env.NODE_ENV!=="production") globalForPrisma.prisma = prisma; //So server restart doesn’t create too many DB connections

export default prisma