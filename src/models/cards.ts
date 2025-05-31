import { PrismaClient } from "@prisma/client";
import { CardPayloadDTO, FindManyQuery, FindManyResponse, UpdateCardDTO } from "../interfaces/cards";

export class CardsModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(card: CardPayloadDTO) { 
    return await this.prisma.cards.create({ data: card }); 
  }

  public async update({id, ...card}: UpdateCardDTO) { 
    return await this.prisma.cards.update({ 
      where: { id }, 
      data: card
    }); 
  }

  public async findMany({month}: FindManyQuery): Promise<FindManyResponse[]> { 
    const cardList = await this.prisma.cards.findMany({ 
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

    // Buscar registros
    console.log(month)
    return cardList
  }
}