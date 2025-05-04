import { PrismaClient } from "@prisma/client";
import { IFindManyCardsResponse } from "../interfaces/cards";

export class CardsModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(card: any) { 
    return await this.prisma.cards.create({ data: card }); 
  }

  public async findMany(): Promise<IFindManyCardsResponse[]> { 
    return await this.prisma.cards.findMany({ 
      where: {
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        creditLimit: true,
        closingDay: true,
        dueday: true,
      }
    }); 
  }
}