import { Request, Response, Router } from "express";
import { CardsController } from "../controller/cards";

const cardsRoutes = Router();

const cardsController = new CardsController();

cardsRoutes.post('/', async (req, res) => {
  await cardsController.create(req, res);
});

cardsRoutes.patch('/', async (req, res) => {
  await cardsController.update(req, res);
});

cardsRoutes.get('/', async (req, res) => {
  await cardsController.findMany(req, res);
});

export {cardsRoutes}