import { prisma } from "../lib/prisma";
import { DateTime } from "luxon";
import { 
  FindAllQueryParams,
  TransactionListResponse,
  TransactionPayloadForm,
  TransactionValuesByType
} from "../interfaces/transactions";

export class TransactionsModel {
  public constructor () {}

  public async createMany(payloadList: TransactionPayloadForm[]) { 
    return await prisma.transactions.createMany({
      data: payloadList
    }); 
  }

  public async findAll({
    limit,
    offset,
    all,
    userId,
    type,
    month,
    year,
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

    const orderClause: Record<
      'home' | 'extract' | 'projection', Record<string, string>
    > = {
      home: { createdAt: 'desc' },
      extract: { transactionDate: 'desc' },
      projection: { transactionDate: 'asc' }
    }

    const transactions = await prisma.transactions.findMany({
      where: {
        userId,
        deletedAt: null,
        ...(type && { type }),
        ...(month && { referenceMonth: month }),
        ...(year && { referenceYear: year }),
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
        ...(orderClause[extract 
          ? 'extract' : projection 
            ? 'projection' : 'home'
        ])
      },
      ...(!all && {
        take: limit,
        skip: offset
      })
    });

    const valuesByType = await prisma.transactions.findMany({
      where: {
        userId,
        deletedAt: null,
        ...(month && { referenceMonth: month }),
        ...(year && { referenceYear: year }),
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