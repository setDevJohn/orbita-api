import { PrismaClient } from "@prisma/client";

export class CardsModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(card: any) { 
    return await this.prisma.cards.create({ data: card }); 
  }
}