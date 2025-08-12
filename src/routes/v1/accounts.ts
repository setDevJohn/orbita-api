import { AccountsController } from '../../controller/accounts';
import { AccountsMiddleware } from '../../middleware/accounts';
import { Router } from "express";

const accountsRoutes = Router();

const accountsController = new AccountsController();
const accountsMiddleware = new AccountsMiddleware();

accountsRoutes.post('/', 
  accountsMiddleware.create,
  async (req, res) => {
    await accountsController.create(req, res);
  }
);

accountsRoutes.get('/', 
  async (req, res) => {
    await accountsController.findMany(req, res);
  }
);

accountsRoutes.patch('/', 
  accountsMiddleware.update,
  async (req, res) => {
    await accountsController.update(req, res);
  }
);

accountsRoutes.delete('/:id',
  accountsMiddleware.remove,
  async (req, res) => {
    await accountsController.remove(req, res);
  }
);

export {accountsRoutes}  