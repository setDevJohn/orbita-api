import { AuthMiddleware } from './../middleware/auth';
import { Router } from "express";
import { cardsRoutes } from "./cards";
import { accountsRoutes } from "./accounts";
import { categoriesRoutes } from "./categories";
import { transactionsRoutes } from "./transactions";
import { usersRoutes } from "./users";

const routes = Router()
const authMiddleware = new AuthMiddleware()

routes.use('/cards', authMiddleware.validate, cardsRoutes)
routes.use('/accounts', authMiddleware.validate, accountsRoutes)
routes.use('/categories', authMiddleware.validate, categoriesRoutes)
routes.use('/transactions', authMiddleware.validate, transactionsRoutes)
routes.use('/users', usersRoutes)

export {routes};