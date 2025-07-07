import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { TransactionsModel } from "../models/transactions";
import { generateCustomDateRange } from "../helpers/generateCustomDateRange";
import { TransactionBase } from "../interfaces/transactions";
import { CardsModel } from "../models/cards";
import dayjs from "dayjs";
import { CardBase } from "../interfaces/cards";

export class TransactionsController {
  private transactionsModel: TransactionsModel;
  private cardsModel: CardsModel;

  public constructor () {
    this.transactionsModel = new TransactionsModel();
    this.cardsModel = new CardsModel();
  }

  public async create (req: Request, res: Response) {
    try {
      const data = req.body

      let card: CardBase | null = null

      if (data.source === 'card') {
        card = await this.cardsModel.findOne({
          id: data.cardId
        })
      }

      const currentDay = dayjs(data.transactionDate).date()
      const closingDay = card?.closingDay || 0

      function calculateReference(date: string | Date, closingDay: number, currentDay: number) {
        const dt = dayjs(date)
        const monthsToAdd = currentDay > closingDay ? 1 : 0
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
        transactionDate: new Date(data.transactionDate),
        source: data.source,
        categoryId: data.categoryId,
        referenceMonth: baseReference.referenceMonth,
        referenceYear: baseReference.referenceYear,
        currenInstallment: null,
        totalInstallments: null,
        accountId: data.accountId ?? null,
        cardId: data.cardId ?? null,
      }

      let payload: TransactionBase[] = [payloadBase]

      if (data.transferAccountId) {
        // transferência de uma conta para a outra
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

          return {
            ...payloadBase,
            transactionDate: new Date(date),
            referenceMonth: reference.referenceMonth,
            referenceYear: reference.referenceYear,
            currenInstallment: index + 1,
            totalInstallments: dateList.length,
          }
        })
      }

      await this.transactionsModel.createMany(payload);

      return new ResponseHandler().success(
        res,
        201,
        {},
        'Transação criada com sucesso'
      );
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }

  public async findAll(req: Request, res: Response) {
    try {
      const { page = '1', limit = '10', all, month } = req.query
  
      const query = {
        offset: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
        all: all === 'true',
        ...(month && !Number.isNaN(+month) && { month: +month }),
      }

      const transactions = await this.transactionsModel.findAll(query)

      return new ResponseHandler().success(
        res,
        200,
        transactions,
        'Transações listadas com sucesso'
      )
    } catch (err) {
      return errorHandler(err as Error, res)
    }
  }
}