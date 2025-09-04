import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { TransactionsModel } from "../models/transactions";
import { generateCustomDateRange } from "../helpers/generateCustomDateRange";
import { TransactionBase } from "../interfaces/transactions";
import { CardsModel } from "../models/cards";
import { CardBase } from "../interfaces/cards";
import { Decimal } from "@prisma/client/runtime/library";
import { $Enums } from "@prisma/client";
import { ITokenData } from "../helpers/jwt";
import { HttpStatus } from "../helpers/appError";
import { AccountsModel } from "../models/accounts";
import { AccountBase } from "../interfaces/accounts";
import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export class TransactionsController {
  private transactionsModel: TransactionsModel;
  private accountsModel: AccountsModel;
  private cardsModel: CardsModel;

  public constructor () {
    this.transactionsModel = new TransactionsModel();
    this.accountsModel = new AccountsModel()
    this.cardsModel = new CardsModel();
  }

  public async create (req: Request, res: Response) {
    try {
      const data = req.body
      const { id: userId } = res.locals.user as ITokenData

      let card: CardBase | null = null
      let account: AccountBase | null = null

      if (data.source === 'card') {
        card = await this.cardsModel.findOne({
          userId,
          id: data.cardId
        })
      } else {
        account = await this.accountsModel.findOne({
          userId,
          id: data.accountId
        })
      }

      const currentDay = dayjs(data.transactionDate).date()
      const closingDay = data.source === 'card' ? (card?.closingDay || 0) : Infinity

      const getTZ = (date: Dayjs) => date.tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ssZ");
      data.transactionDate = getTZ(dayjs(data.transactionDate))
      const endOfDay = getTZ(dayjs().set("hour", 23).set("minute", 59).set("second", 59).set("millisecond", 999))

      const calculateReference = (
        date: string | Date,
        closingDay: number,
        currentDay: number
      ) => {
        const dt = dayjs(date)
        const monthsToAdd = currentDay >= closingDay ? 1 : 0
        const refDate = dt.add(monthsToAdd, 'month')

        return {
          referenceMonth: refDate.month() + 1,
          referenceYear: refDate.year()
        }
      }

      const baseReference = calculateReference(data.transactionDate, closingDay, currentDay)

      const payloadBase = {
        name: data.name,
        type: data.type,
        amount: data.amount,
        transactionDate: data.transactionDate,
        source: data.source,
        categoryId: data.categoryId ?? undefined,
        referenceMonth: baseReference.referenceMonth,
        referenceYear: baseReference.referenceYear,
        currenInstallment: null,
        totalInstallments: null,
        accountId: data.accountId ?? null,
        cardId: data.cardId ?? null,
        userId,
        isApplied: data.transactionDate <= endOfDay
      }

      let payload: TransactionBase[] = [payloadBase]

      if (data.transferAccountId) {
        // TODO: transferência de uma conta para a outra
      }

      const isRecurrence = !!data.recurrenceDateRange?.length

      if (isRecurrence) {
        const range: [string, string] = data.recurrenceDateRange
        const baseDate = data.transactionDate
        const recurrenceType = data.recurrenceDateType as keyof typeof generateCustomDateRange

        const dateList = generateCustomDateRange[recurrenceType]({ range, baseDate })

        payload = dateList.map((date, index) => {
          const currentDay = dayjs(date).date()
          const reference = calculateReference(date, closingDay, currentDay)
          const transactionDate = getTZ(dayjs(date));

          return {
            ...payloadBase,
            transactionDate,
            referenceMonth: reference.referenceMonth,
            referenceYear: reference.referenceYear,
            currenInstallment: index + 1,
            totalInstallments: dateList.length,
            isApplied: transactionDate <= endOfDay
          }
        })
      }

      await this.transactionsModel.createMany(payload);

      const transactionsToApply = payload.filter(tx =>  tx.isApplied)

      for (const tx of transactionsToApply) {
        if (tx.source === 'account' && account) {
          await this.accountsModel.updateBalance({
            id: account.id,
            userId,
            type: tx.type === 'income' ? 'increment' : 'decrement',
            value: +tx.amount
          })
        }
      } 

      return new ResponseHandler().success(
        res,
        null,
        HttpStatus.CREATED,
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }

  public async findAll(req: Request, res: Response) {
    try {
      const { id: userId } = res.locals.user as ITokenData
      const { 
        page = '1',
        limit = '10',
        all,
        month,
        year,
        extract,
        projection,
        noInstallments,
        type,
        description,
        date,
      } = req.query
  
      const query = {
        offset: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
        all: all === 'true',
        userId,
        ...(type && $Enums.transactions_type[type as $Enums.transactions_type] && { 
          type: type as $Enums.transactions_type
        }),
        ...(month && !Number.isNaN(+month) && { month: +month }),
        ...(year && !Number.isNaN(+year) && { year: +year }),
        ...(extract === 'true' && { extract: true }),
        ...(projection === 'true' && { projection: true }),
        ...(noInstallments === 'true' && { noInstallments: true }),
        ...(description && { description: String(description) }),
        ...(date && { date: date as string }),
      }

      const transactions = await this.transactionsModel.findAll(query)

      await this.transactionsModel.updateFutureTransactions()
      
      const formattedTransactions = {
        ...transactions,
        valuesByType: transactions.valuesByType.reduce((acc, cur) => {
          acc[cur.type] = (acc[cur.type] || new Decimal(0)).add(cur.amount)
          return acc
        }, {} as Record<string, Decimal>)
      }

      return new ResponseHandler().success(res, formattedTransactions)
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
}