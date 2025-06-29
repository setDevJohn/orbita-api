import { Request, Response } from "express";
import { errorHandler } from "../helpers/errorHandler";
import { ResponseHandler } from "../helpers/responseHandler";
import { TransactionsModel } from "../models/transactions";
import { generateCustomDateRange } from "../helpers/generateCustomDateRange";
import { TransactionBase } from "../interfaces/transactions";

export class TransactionsController {
  private transactionsModel: TransactionsModel;

  public constructor () {
    this.transactionsModel = new TransactionsModel();
  }

  public async create (req: Request, res: Response) {
    try {
      const data = req.body

      const payloadBase = {
        name: data.name,
        type: data.type,
        amount: data.amount,
        transactionDate: new Date(data.transactionDate),
        source: data.source,
        categoryId: data.categoryId,
        referenceMonth: new Date(data.transactionDate).getMonth() + 1,
        referenceYear: new Date(data.transactionDate).getFullYear(),
        currenInstallment: null,
        totalInstallments: null,
        accountId: data.accountId ?? null,
        cardId: data.cardId ?? null,
      }

      let payload: TransactionBase[] = [payloadBase]

      if (data.source === 'card') {
        // verificar se a data de fechamento ja passou
      }

      if (data.transferAccountId) {
        // transferencia de uma conta para a outra
      }

      const isRecurrence = !!data.recurrenceDateRange?.length

      if (isRecurrence) {
        const range: [string, string] = data.recurrenceDateRange
        const baseDate =  data.transactionDate  
        const recurrenceType = data.recurrenceDateType as keyof typeof generateCustomDateRange

        const dateList = generateCustomDateRange[recurrenceType]({range, baseDate})

        payload = dateList.map((date, index) => {
          // verificar se a data de fechamento ja passou

          return {
            ...payloadBase,
            transactionDate: new Date(date),
            referenceMonth: new Date(date).getMonth() + 1,
            referenceYear: new Date(date).getFullYear(),
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
}