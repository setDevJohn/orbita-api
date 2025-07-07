import { PrismaClient } from "@prisma/client";
import { FindAllQueryParams, TransactionListResponse, TransactionPayloadForm } from "../interfaces/transactions";

export class TransactionsModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async createMany(payloadList: TransactionPayloadForm[]) { 
    return await this.prisma.transactions.createMany({
      data: payloadList
    }); 
  }

  public async findAll({
    limit,
    offset,
    all,
    month
  } :FindAllQueryParams): Promise<TransactionListResponse> {

    return await this.prisma.transactions.findMany({
      where: {
        deletedAt: null,
        ...(month && { referenceMonth: month })
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
        categories: {
          select: {
            id: true,
            name: true
          }
        },
        accounts: {
          select: {
            id: true,
            name: true,
            balance: true
          }
        },
        cards: {
          select: {
            id: true,
            name: true,
            creditLimit: true,
            closingDay: true,
            dueDay: true,
          }
        }
      },
      orderBy: {
        transactionDate: 'desc'
      },
      ...(!all && {
        take: limit,
        skip: offset
      })
    })
  }
}