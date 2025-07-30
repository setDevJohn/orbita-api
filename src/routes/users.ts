import { UsersController } from '../controller/users';
import { Router } from "express";
import { UsersMiddleware } from '../middleware/users';

const usersRoutes = Router();

const usersController = new UsersController();
const usersMiddleware = new UsersMiddleware();
// const accountsMiddleware = new AccountsMiddleware();

usersRoutes.post('/auth', 
  usersMiddleware.auth,
  async (req, res) => {
    await usersController.auth(req, res);
  }
);

usersRoutes.post('/',
  usersMiddleware.create,
  async (req, res) => {
    await usersController.create(req, res);
  }
)

export { usersRoutes }  