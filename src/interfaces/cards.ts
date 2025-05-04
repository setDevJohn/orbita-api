import { Decimal } from "@prisma/client/runtime/library";

export interface IFindManyCardsResponse {
  id: number;
  name: string;
  creditLimit: Decimal | null;
  closingDay: number;
  dueday: number; 
}