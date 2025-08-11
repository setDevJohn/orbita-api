import { PrismaClient } from "@prisma/client";
import { FindOneParams, UserPayloadDTO } from "../interfaces/users";

export class UsersModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(data: UserPayloadDTO) {
    return this.prisma.users.create({
      data
    })
  }

  public async findOne({ email }: FindOneParams) { 
    return this.prisma.users.findFirst({ 
      where: {
        deletedAt: null,
        ...(email && { email })
      },
    }); 
  }
}