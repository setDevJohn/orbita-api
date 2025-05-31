import { PrismaClient } from "@prisma/client";
import { CategoryFormPayloadDTO, FindManyCategoryListResponse } from "../interfaces/categories";

export class CategoriesModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(card: CategoryFormPayloadDTO) { 
    return await this.prisma.categories.create({ data: card }); 
  }

  public async findMany(): Promise<FindManyCategoryListResponse> { 
    return await this.prisma.categories.findMany({ 
      where: {
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
      }
    }); 
  }
}