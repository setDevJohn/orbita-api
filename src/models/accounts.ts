import { PrismaClient } from "@prisma/client";
import { AccountPayloadDTO, FindOneParams, UpdateAccountDTO } from "../interfaces/accounts";

export class AccountsModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(card: AccountPayloadDTO) { 
    return await this.prisma.accounts.create({ data: card }); 
  }
  
  public async findMany() { 
    return await this.prisma.accounts.findMany({ 
      where: {
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        balance: true
      }
    }); 
  }
  
  public async findOne({id, name, excludeId}: FindOneParams) { 
    return await this.prisma.accounts.findFirst({ 
      where: {
        deletedAt: null,
        ...(id && { id }),
        ...(name && { name }),    
        ...(excludeId && { NOT: {id : excludeId } }),
      },
    }); 
  }

  public async update({id, ...card}: UpdateAccountDTO) { 
    return await this.prisma.accounts.update({ 
      where: { id },
      data: card
    });    
  }

  public async remove(id: number) { 
    return await this.prisma.accounts.update({ 
      where: { id },
      data: { deletedAt: new Date() }
    });    
  }
}