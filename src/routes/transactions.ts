import { Router } from "express";
import { TransactionsController } from "../controller/transactions";

const transactionsRoutes = Router();

const transactionsController = new TransactionsController();

transactionsRoutes.post('/', async (req, res) => {
  await transactionsController.create(req, res);
});

export {transactionsRoutes}  