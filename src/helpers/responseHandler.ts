import { Response } from "express";
import { HttpStatus } from "./appError";

export class ResponseHandler {
  constructor(){
  }

  public success(res: Response, data: any, statusCode?: number) {
    res.status(statusCode || HttpStatus.OK).json({ 
      status: statusCode,
      resource: data,
    });
  }
}