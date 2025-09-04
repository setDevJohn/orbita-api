import { prisma } from "../lib/prisma";
import { DateTime } from "luxon";
import { 
  FindAllQueryParams,
  TransactionListResponse,
  TransactionPayloadForm,
  TransactionValuesByType
} from "../interfaces/transactions";
import { AccountsModel } from "./accounts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export class TransactionsModel {
  private readonly accountModel: AccountsModel
  public constructor () {
    this.accountModel = new AccountsModel()
  }

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
    noInstallments,
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
        ...(noInstallments && { OR: [
          { currenInstallment: null },
          { currenInstallment: { lte: 1 } }
        ]})
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
        ...(noInstallments && { OR: [
          { currenInstallment: null },
          { currenInstallment: { lte: 1 } }
        ]})
      },
      select: {
        type: true,
        amount: true,
      },
    });

    return { transactions, valuesByType }
  }

  public async updateFutureTransactions() {
    const endOfDay = dayjs()
      .set("hour", 23)
      .set("minute", 59)
      .set("second", 59)
      .set("millisecond", 999)
      .tz("America/Sao_Paulo")
      .format("YYYY-MM-DD HH:mm:ssZ");

    const futureTransactions = await prisma.transactions.findMany({
      where: {
        isApplied: false,
        transactionDate: { lte: endOfDay },
      }
    });

    for (const tx of futureTransactions) {
      if (tx.accountId) {
        await this.accountModel.updateBalance({
          id: tx.accountId,
          userId: 1,
          type: tx.type === 'income' ? 'increment' : 'decrement',
          value: +tx.amount
        })

        await prisma.transactions.update({
          where: { id: tx.id },
          data: { isApplied: true }
        })
      }
    }
  }
}