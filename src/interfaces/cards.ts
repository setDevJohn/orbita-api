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

// FindMany Response
export type FindManyResponse = CardBase