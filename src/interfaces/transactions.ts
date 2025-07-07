import { $Enums } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

export interface TransactionBase {
  name: string
  type: $Enums.transactions_type
  amount: Decimal
  transactionDate: Date
  source: $Enums.transactions_source
  referenceMonth: number
  referenceYear: number
  currenInstallment: number | null
  totalInstallments: number | null
  categoryId: number | null
  accountId: number | null
  cardId: number | null
}

export type TransactionPayloadForm = TransactionBase

export type TransactionListResponse = {
  id: number,
  name: string,
  type: $Enums.transactions_type,
  amount: Decimal,
  transactionDate: Date,
  source: $Enums.transactions_source,
  referenceMonth: number,
  referenceYear: number,
  currenInstallment: number | null,
  totalInstallments: number | null,
  categories: {
    id: number
    name: string
  } | null,
  accounts: {
    id: number,
    name: string,
    balance: Decimal | null
  } | null,
  cards: {
    id: number,
    name: string,
    creditLimit: Decimal | null,
    closingDay: number,
    dueDay: number,
  } | null
}[]

export interface FindAllQueryParams {
  limit: number,
  offset: number,
  all: boolean
  month?: number
}