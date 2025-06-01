import { CardsMiddleware } from './../middleware/cards';
import { Request, Response, Router } from "express";
import { CardsController } from "../controller/cards";

const cardsRoutes = Router();

const cardsMiddleware = new CardsMiddleware();
const cardsController = new CardsController();

cardsRoutes.post('/',
  cardsMiddleware.create,
  async (req, res) => {
    await cardsController.create(req, res);
  }
);

cardsRoutes.patch('/',
  cardsMiddleware.update,
  async (req, res) => {
    await cardsController.update(req, res);
  }
);

cardsRoutes.delete('/:cardId',
  cardsMiddleware.remove,  
  async (req, res) => {
    await cardsController.remove(req, res);
  }
);

cardsRoutes.get('/', 
  async (req, res) => {
    await cardsController.findMany(req, res);
  }
);

export {cardsRoutes}