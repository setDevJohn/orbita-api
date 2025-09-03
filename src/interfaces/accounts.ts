import { Decimal } from "@prisma/client/runtime/library";

export interface AccountBase {
  id: number;
  name: string;
  balance: Decimal | null;
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

export interface UpdateBalanceParams {
  id: number
  userId: number
  type: 'increment' | 'decrement'
  value: number
}