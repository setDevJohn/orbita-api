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

  public async update({id, ...category}: UpdateCategoryPayloadDTO) { 
    return await this.prisma.categories.update({ 
      where: { id },
      data: category
    }); 
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

  public async findOne({id, name, excludeId}: FindOneParamsDTO) {
    return await this.prisma.categories.findFirst({
      where: {
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

  public async remove(id: number) { 
    await this.prisma.categories.delete({ 
      where: { id }
    }); 
  }
}