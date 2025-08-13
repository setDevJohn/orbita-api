import { Decimal } from "@prisma/client/runtime/library";

interface AccountBase {
  id: number;
  name: string;
  balance: Decimal;
  userId: number
}

export type AccountPayloadDTO = Omit<AccountBase, "id">;

export type UpdateAccountDTO = AccountBase;

export interface FindOneParams {
  userId: number;
  id?: number;
  name?: string;
  excludeId?: number;
}

export interface FindManyResponse {
  id: number;
  name: string;
  balance: Decimal | null;
}
