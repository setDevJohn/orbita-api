import { prisma } from "../lib/prisma";
import { AccountPayloadDTO, FindOneParams, UpdateAccountDTO, UpdateBalanceParams } from "../interfaces/accounts";

export class AccountsModel {
  public constructor () {}

  public async create(card: AccountPayloadDTO) { 
    return await prisma.accounts.create({ 
      data: card,
    }); 
  }
  
  public async findMany(userId: number) { 
    return await prisma.accounts.findMany({ 
      where: {
        userId,
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        balance: true
      }
    }); 
  }
  
  public async findOne({userId, id, name, excludeId}: FindOneParams) { 
    return await prisma.accounts.findFirst({ 
      where: {
        userId,
        deletedAt: null,
        ...(id && { id }),
        ...(name && { name }),    
        ...(excludeId && { NOT: {id : excludeId } }),
      },
    }); 
  }

  public async update({id, userId, ...card}: UpdateAccountDTO) { 
    return await prisma.accounts.update({ 
      where: { id, userId },
      data: card
    });    
  }

  public async remove(id: number, userId: number) { 
    return await prisma.accounts.update({ 
      where: { id, userId },
      data: { deletedAt: new Date() }
    });    
  }

  public async updateBalance({ id, userId, type, value }: UpdateBalanceParams) {
    return prisma.accounts.update({
      where: { id, userId },
      data: {
        balance: type === 'increment' 
          ? { increment: value } : { decrement: value }
      }
    })
  }
}