import { prisma } from "../lib/prisma";
import { CardParamsDTO, CardPayloadDTO, FindManyQuery, FindManyResponse, UpdateCardDTO } from "../interfaces/cards";

export class CardsModel {
  public constructor () {}

  public async create(card: CardPayloadDTO) { 
    return await prisma.cards.create({ data: card }); 
  }

  public async update({id, userId, ...card}: UpdateCardDTO) { 
    return await prisma.cards.update({ 
      where: { id, userId }, 
      data: card
    }); 
  }

  public async remove(id : number, userId: number) { 
    return await prisma.cards.update({ 
      where: { id, userId },
      data: { deletedAt: new Date() }
    }); 
  }

  public async findMany({ userId, month, year }: FindManyQuery): Promise<FindManyResponse[]> {
    return prisma.cards.findMany({ 
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
        transactions: {
          where: {
            deletedAt: null,
            ...(month && year && {
              OR: [
                { referenceYear: { gt: year } },
                {
                  referenceYear: year,
                  referenceMonth: { gte: month }
                }
              ]
            })
          },
          select: {
            id: true,
            name: true,
            type: true,
            amount: true,
            transactionDate: true,
            source: true,
            referenceMonth: true,
            referenceYear: true,
            currenInstallment: true,
            totalInstallments: true,
            cardId: true,
          }
        }
      }
    });
  }

  public async findOne({ userId, id, name, excludeId }: CardParamsDTO) { 
    return await prisma.cards.findFirst({
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