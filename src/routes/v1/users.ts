import { UsersController } from '../../controller/users';
import { Router } from "express";
import { UsersMiddleware } from '../../middleware/users';

const usersRoutes = Router();

const usersMiddleware = new UsersMiddleware();
const usersController = new UsersController();

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

usersRoutes.get('/verify', 
  async (req, res) => {
    await usersController.verify(req, res);
  }
)

usersRoutes.post('/logout',
  async (req, res) => {
    await usersController.logout(req, res);
  }
)

export { usersRoutes }  