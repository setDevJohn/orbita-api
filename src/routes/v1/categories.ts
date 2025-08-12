import { Router } from "express";
import { CategoriesController } from "../../controller/categories";
import { CategoriesMiddleware } from "../../middleware/categories";

const categoriesRoutes = Router();

const categoriesMiddleware = new CategoriesMiddleware();
const categoriesController = new CategoriesController();

categoriesRoutes.post('/',
  categoriesMiddleware.create,
  async (req, res) => {
    await categoriesController.create(req, res)
  }
);

categoriesRoutes.patch('/', 
  categoriesMiddleware.update,
  async (req, res) => {
    await categoriesController.update(req, res);
  }
);

categoriesRoutes.get('/', 
  async (req, res) => {
    await categoriesController.findMany(req, res);
  }
);

categoriesRoutes.delete('/:categoryId', 
  categoriesMiddleware.remove,
  async (req, res) => {
    await categoriesController.remove(req, res);
  }
);

export {categoriesRoutes}  