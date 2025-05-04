import { Decimal } from "@prisma/client/runtime/library";

export interface IFindManyAccountsResponse {
  id: number;
  name: string;
  balance: Decimal | null;
}