import { PrismaClient } from "@prisma/client";

export class CategoriesModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(card: any) { 
    return await this.prisma.categories.create({ data: card }); 
  }
}