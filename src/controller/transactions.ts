import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { TransactionsModel } from "../models/transactions";
import { generateCustomDateRange } from "../helpers/generateCustomDateRange";

export class TransactionsController {
  private transactionsModel: TransactionsModel;

  public constructor () {
    this.transactionsModel = new TransactionsModel();
  }

  public async create (req: Request, res: Response) {
    try {
      const data = req.body
      const referenceMonth = new Date(data.transactionDate).getMonth() + 1
      const referenceYear = new Date(data.transactionDate).getFullYear()
      console.log('referenceMonth', referenceMonth)
      console.log('referenceYear', referenceYear)

      const payload = {
        name: data.name,
        type: data.type,
        amount: data.amount,
        transactionDate: data.transactionDate,
        source: data.source,
        categoryId: data.categoryId,
        referenceMonth,
        referenceYear,
        currenInstallment: null,
        totalInstallments: null,
        accountId: data.accountId ?? null,
        cardId: data.cardId ?? null,
      }

      if (data.transferAccountId) {
        // transferencia de uma conta para a outra
      }

      if (data.source === 'card') {
        // cerificar se  a data de fechamento já passou 
      }

      const isRecurrence = !!data.recurrenceDateRange?.length

      if (isRecurrence) {
        console.log(data.recurrenceDateRange)
        console.log(data.recurrenceDateType)
        console.log(data)

        const range: [string, string] = data.recurrenceDateRange
        const baseDate =  data.transactionDate

        // Usar o baseDate para iniciar as datas do mês e ano

        console.log('Month:', generateCustomDateRange(range, 'month'))
        console.log('Week:', generateCustomDateRange(range, 'week'))
        console.log('Day:', generateCustomDateRange(range, 'day'))
        console.log('Year:', generateCustomDateRange(range, 'year'))
      } else {
        await this.transactionsModel.create(payload);
      }


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
}