import { PrismaClient } from "@prisma/client";
import { AccountPayloadDTO, FindOneParams, UpdateAccountDTO } from "../interfaces/accounts";

export class AccountsModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(card: AccountPayloadDTO) { 
    return await this.prisma.accounts.create({ 
      data: card,
    }); 
  }
  
  public async findMany(userId: number) { 
    return await this.prisma.accounts.findMany({ 
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
    return await this.prisma.accounts.findFirst({ 
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
    return await this.prisma.accounts.update({ 
      where: { id, userId },
      data: card
    });    
  }

  public async remove(id: number, userId: number) { 
    return await this.prisma.accounts.update({ 
      where: { id, userId },
      data: { deletedAt: new Date() }
    });    
  }
}