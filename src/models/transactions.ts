import { PrismaClient } from "@prisma/client";
import { TransactionPayloadForm } from "../interfaces/transactions";

export class TransactionsModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async createMany(payloadList: TransactionPayloadForm[]) { 
    return await this.prisma.transactions.createMany({
      data: payloadList
    }); 
  }
}