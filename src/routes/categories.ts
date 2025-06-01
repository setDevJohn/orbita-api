import { Router } from "express";
import { CategoriesController } from "../controller/categories";

const categoriesRoutes = Router();

const categoriesController = new CategoriesController();

categoriesRoutes.post('/', async (req, res) => {
  await categoriesController.create(req, res);
});

categoriesRoutes.patch('/', async (req, res) => {
  await categoriesController.update(req, res);
});

categoriesRoutes.get('/', async (req, res) => {
  await categoriesController.findMany(req, res);
});

categoriesRoutes.delete('/:categoryId', async (req, res) => {
  await categoriesController.remove(req, res);
});

export {categoriesRoutes}  