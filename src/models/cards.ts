import { PrismaClient } from "@prisma/client";
import { CardParamsDTO, CardPayloadDTO, FindManyQuery, FindManyResponse, UpdateCardDTO } from "../interfaces/cards";

export class CardsModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(card: CardPayloadDTO) { 
    return await this.prisma.cards.create({ data: card }); 
  }

  public async update({id, userId, ...card}: UpdateCardDTO) { 
    return await this.prisma.cards.update({ 
      where: { id, userId }, 
      data: card
    }); 
  }

  public async remove(id : number, userId: number) { 
    return await this.prisma.cards.update({ 
      where: { id, userId },
      data: { deletedAt: new Date() }
    }); 
  }

  public async findMany({ userId, month }: FindManyQuery): Promise<FindManyResponse[]> { 
    const cardList = await this.prisma.cards.findMany({ 
      where: {
        userId,
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        creditLimit: true,
        closingDay: true,
        dueDay: true,
        userId: true
      }
    });

    // TODO: Calcular limite restante do cartão
    console.log(month)
    return cardList
  }

  public async findOne({ userId, id, name, excludeId }: CardParamsDTO) { 
    return await this.prisma.cards.findFirst({
      where: { 
        userId,
        deletedAt: null,
        ...(id && { id }),
        ...(name && { name }),    
        ...(excludeId && { NOT: {id : excludeId } }),
      }
    }); 
  }
}