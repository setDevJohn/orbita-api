import { PrismaClient } from "@prisma/client";
import { CardPayloadDTO, FindManyResponse } from "../interfaces/cards";

export class CardsModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(card: CardPayloadDTO) { 
    return await this.prisma.cards.create({ data: card }); 
  }

  public async findMany(): Promise<FindManyResponse[]> { 
    return await this.prisma.cards.findMany({ 
      where: {
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        creditLimit: true,
        closingDay: true,
        dueDay: true,
      }
    }); 
  }
}