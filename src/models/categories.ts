import { PrismaClient } from "@prisma/client";
import { CategoryFormPayloadDTO, FindManyCategoryListResponse, FindOneParamsDTO, UpdateCategoryPayloadDTO } from "../interfaces/categories";

export class CategoriesModel {
  prisma = new PrismaClient();

  public constructor () {
    this.prisma = new PrismaClient(); 
  }

  public async create(category: CategoryFormPayloadDTO) { 
    return await this.prisma.categories.create({ data: category }); 
  }

  public async update({id, userId, ...category}: UpdateCategoryPayloadDTO) { 
    return await this.prisma.categories.update({ 
      where: { id, userId },
      data: category
    }); 
  }

  public async findMany(userId: number): Promise<FindManyCategoryListResponse> { 
    return await this.prisma.categories.findMany({ 
      where: {
        userId,
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
      }
    }); 
  }

  public async findOne({userId, id, name, excludeId}: FindOneParamsDTO) {
    return await this.prisma.categories.findFirst({
      where: {
        userId,
        ...(id && { id }),
        ...(name && { name }),    
        ...(excludeId && { NOT: {id : excludeId } }),
      },
      select: {
        id: true,
        name: true
      }
    });   
  }

  public async remove(id: number, userId: number) { 
    await this.prisma.categories.delete({ 
      where: { id, userId }
    }); 
  }
}