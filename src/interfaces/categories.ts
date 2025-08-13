export interface CategoryModel {
  id: number;
  name: string;
}

export type CategoryFormPayloadDTO = Omit<CategoryModel, "id"> & {
  userId: number
};

export type UpdateCategoryPayloadDTO = CategoryModel & {
  userId: number
};;

export type FindManyCategoryListResponse = CategoryModel[];

export type FindOneParamsDTO = {
  userId: number;
  id?: number;
  name?: string;
  excludeId?: number;
};
