import { AccountsController } from '../controller/accounts';
import { accounts } from './../../node_modules/.prisma/client/index.d';
import { Router } from "express";

const accountsRoutes = Router();

const accountsController = new AccountsController();

accountsRoutes.post('/', async (req, res) => {
  await accountsController.create(req, res);
});

accountsRoutes.get('/', async (req, res) => {
  await accountsController.findMany(req, res);
});

export {accountsRoutes}  