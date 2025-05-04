import { PrismaClient } from "@prisma/client";

export class TransactionsModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(card: any) { 
    return await this.prisma.transactions.create({ data: card }); 
  }
}