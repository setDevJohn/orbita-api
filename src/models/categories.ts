import { prisma } from "../lib/prisma";
import { CategoryFormPayloadDTO, FindManyCategoryListResponse, FindOneParamsDTO, UpdateCategoryPayloadDTO } from "../interfaces/categories";

export class CategoriesModel {
  public constructor () {}

  public async create(category: CategoryFormPayloadDTO) { 
    return await prisma.categories.create({ data: category }); 
  }

  public async update({id, userId, ...category}: UpdateCategoryPayloadDTO) { 
    return await prisma.categories.update({ 
      where: { id, userId },
      data: category
    }); 
  }

  public async findMany(userId: number): Promise<FindManyCategoryListResponse> { 
    return await prisma.categories.findMany({ 
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
    return await prisma.categories.findFirst({
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
    await prisma.categories.delete({ 
      where: { id, userId }
    }); 
  }
}