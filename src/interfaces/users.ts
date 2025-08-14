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