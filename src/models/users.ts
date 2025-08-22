import { prisma } from "../lib/prisma";
import { FindOneParams, UpdateUserParams, UserBase, UserPayloadDTO } from "../interfaces/users";

export class UsersModel {
  public constructor () {}

  public async create(data: UserPayloadDTO) {
    return prisma.users.create({
      data
    })
  }

  public async findOne({ id, email }: FindOneParams): Promise<UserBase | null> { 
    return prisma.users.findFirst({ 
      where: {
        deletedAt: null,
        ...(id && { id }),
        ...(email && { email })
      },
    }); 
  }

  public async update(id: number, data: UpdateUserParams) {
    return prisma.users.update({
      where: { id },
      data: { 
        ...(data.password && { password: data.password }),
        ...(data.passwordResetToken && { passwordResetToken: data.passwordResetToken })
      }
    })
  }
}