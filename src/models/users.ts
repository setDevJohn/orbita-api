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
        ...(data.name && { name: data.name }),
        ...(data.cellPhone && { cellPhone: data.cellPhone }),
        ...(data.email && { email: data.email }),
        ...(data.wage && { wage: data.wage }),
        ...(data.payday && { payday: data.payday }),
        ...(data.active && { active: data.active }),
        ...(data.verified && { verified: data.verified }),
        ...(data.failedAttempts && { failedAttempts: data.failedAttempts }),
        ...(data.accountVerificationToken && { accountVerificationToken: data.accountVerificationToken }),
        ...(data.lockedUntil && { lockedUntil: data.lockedUntil }),
        ...(data.lastLogin && { lastLogin: data.lastLogin }),
        ...(data.password && { password: data.password }),
        ...(data.passwordResetToken && { passwordResetToken: data.passwordResetToken })
      }
    })
  }
}