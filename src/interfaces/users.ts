import { Decimal } from "@prisma/client/runtime/library";

export interface UserBase {
  id: number;
  name: string;
  email: string;
  password: string;
  cellPhone: string | null;
  profileImage: string | null
  wage: Decimal | null;
  payday: number | null;
  active: boolean;
  verified: boolean | null;
  failedAttempts: number | null;
  passwordResetToken: string | null;
  accountVerificationToken: string | null;
  lockedUntil: Date | null;
  lastLogin: Date | null;
}

export interface UserPayloadDTO {
  name: string,
  email: string,
  password: string,
}

export interface FindOneParams {
  id?: number;
  email?: string;
}

export interface UpdateUserParams {
  name?: string 
  cellPhone?: string | null
  email?: string 
  wage?: string | null
  payday?: number | null
  active?: boolean 
  profileImage?: string | null
  verified?: boolean | null
  failedAttempts?: number | null
  accountVerificationToken?: string | null
  lockedUntil?: Date | null
  lastLogin?: Date | null
  password?: string
  passwordResetToken?: string | null
}