import { Decimal } from "@prisma/client/runtime/library";

// Card Base
interface CardBase {
  id: number;
  name: string;
  creditLimit: Decimal | null;
  closingDay: number;
  dueDay: number;
} 

// Payload to create on model
export type CardPayloadDTO = Omit<CardBase, 'id'>

// Payload to update on model
export type UpdateCardDTO = CardBase

// FindMany query
export interface FindManyQuery {
  month: string
}

// FindMany Response
export type FindManyResponse = CardBase