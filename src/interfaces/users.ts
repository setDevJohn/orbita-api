export interface UserBase {
  id: number;
  name: string;
  email: string;
  password: string;
  active: boolean;
  verified: boolean | null;
  failedAttempts: number | null;
  passwordResetToken: string | null;
  accountVerificationToken: string | null;
  lockedUntil: Date | null;
  lastLogin: Date | null;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
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
  password?: string
  passwordResetToken?: string
}