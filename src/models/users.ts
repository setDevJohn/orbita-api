import { PrismaClient } from "@prisma/client";
import { FindOneParams, UpdateUserParams, UserBase, UserPayloadDTO } from "../interfaces/users";

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

  public async findOne({ email }: FindOneParams): Promise<UserBase | null> { 
    return this.prisma.users.findFirst({ 
      where: {
        deletedAt: null,
        ...(email && { email })
      },
    }); 
  }

  public async update(id: number, data: UpdateUserParams) {
    return this.prisma.users.update({
      where: { id },
      data: { 
        ...(data.password && { password: data.password }),
        ...(data.passwordResetToken && { passwordResetToken: data.passwordResetToken })
      }
    })
  }
}