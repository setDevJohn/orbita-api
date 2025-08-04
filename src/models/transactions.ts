import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { 
  FindAllQueryParams,
  TransactionListResponse,
  TransactionPayloadForm,
  TransactionValuesByType
} from "../interfaces/transactions";

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
    type,
    month,
    extract,
    projection,
    description,
    date,
  } :FindAllQueryParams): Promise<{ 
    transactions: TransactionListResponse,
    valuesByType: TransactionValuesByType
  }> {
    const customDate = date 
      ? {
        gte: DateTime.fromISO(date).startOf('day').toJSDate(),
        lte: DateTime.fromISO(date).endOf('day').toJSDate()
      } : undefined
      
    const today = DateTime.now().setZone("America/Sao_Paulo").toString();

    const dateFilter = extract 
      ? { lte: today } : projection 
        ? { gt: today } : undefined;

    const transactions = await this.prisma.transactions.findMany({
      where: {
        deletedAt: null,
        ...(type && { type }),
        ...(month && { referenceMonth: month }),
        ...(customDate || dateFilter && { 
          transactionDate: customDate || dateFilter 
        }),
        ...(description && { OR: [
          { name: { contains: description } },
          { categories: { name: { contains: description } }},
        ]}),
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
    });

    const valuesByType = await this.prisma.transactions.findMany({
      where: {
       deletedAt: null,
        ...(month && { referenceMonth: month }),
        ...(customDate || dateFilter && { 
          transactionDate: customDate || dateFilter 
        }),
        ...(description && { OR: [
          { name: { contains: description } },
          { categories: { name: { contains: description } }},
        ]}),
      },
      select: {
        type: true,
        amount: true,
      },
    });

    return { transactions, valuesByType }
  }
}