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
  month: string
}

export interface CardParamsDTO {
  userId: number
  id?: number
  name?: string
  excludeId?: number
}

// FindMany Response
export type FindManyResponse = CardBase