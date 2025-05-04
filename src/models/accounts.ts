import { PrismaClient } from "@prisma/client";

export class AccountsModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(card: any) { 
    return await this.prisma.accounts.create({ data: card }); 
  }
}