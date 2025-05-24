import { Decimal } from "@prisma/client/runtime/library";

export interface FindManyResponse {
  id: number;
  name: string;
  balance: Decimal | null;
}
