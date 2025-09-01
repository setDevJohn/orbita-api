import { $Enums } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// Card Base
export interface CardBase {
  id: number;
  name: string;
  creditLimit: Decimal | null;
  closingDay: number;
  dueDay: number;
} 

// Payload to create on model
export type CardPayloadDTO = Omit<CardBase, 'id'> & {
  userId: number
}

// Payload to update on model
export type UpdateCardDTO = CardBase & {
  userId: number
}

// FindMany query
export interface FindManyQuery {
  userId: number
  month?: number
  year?: number
}

export interface CardParamsDTO {
  userId: number
  id?: number
  name?: string
  excludeId?: number
}

// FindMany Response
export type FindManyResponse = CardBase & {
  transactions: Array<{
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
    cardId: number | null,
  }>
}