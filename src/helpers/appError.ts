export enum HttpStatus {
  OK = 200, // Sucesso
  CREATED = 201, // Criado
  BAD_REQUEST = 400, // Requisição inválida
  UNAUTHORIZED = 401, // Não autenticado
  FORBIDDEN = 403, // Não autorizado
  NOT_FOUND = 404, // Recurso não encontrado
  CONFLICT = 409, // Conflito de dados
  INTERNAL_SERVER_ERROR = 500, // Erro interno do servidor
}

export class AppError extends Error {
  public readonly statusCode: HttpStatus;

  constructor(message: string, statusCode: HttpStatus) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this);
  }
}