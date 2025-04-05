import { Response } from "express";

export class ResponseHandler {
  constructor(){
  }

  public success(res: Response, statusCode: number, data: any, message: string) {
    res.status(statusCode).json({ 
      status: statusCode,
      message,
      resource: data,
    });
  }
}