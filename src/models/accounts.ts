import { PrismaClient } from "@prisma/client";
import { IFindManyAccountsResponse } from "../interfaces/accounts";

export class AccountsModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(card: any) { 
    return await this.prisma.accounts.create({ data: card }); 
  }

  public async findMany(): Promise<IFindManyAccountsResponse[]> { 
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
}