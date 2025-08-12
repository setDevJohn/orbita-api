import { AuthMiddleware } from '../../middleware/auth';
import { Router } from "express";
import { usersRoutes } from './users';
import { cardsRoutes } from "./cards";
import { accountsRoutes } from "./accounts";
import { categoriesRoutes } from "./categories";
import { transactionsRoutes } from "./transactions";

const v1routes = Router()
const authMiddleware = new AuthMiddleware();

v1routes.use('/users', usersRoutes)
v1routes.use('/cards', authMiddleware.validate, cardsRoutes)
v1routes.use('/accounts', authMiddleware.validate, accountsRoutes)
v1routes.use('/categories', authMiddleware.validate, categoriesRoutes)
v1routes.use('/transactions', authMiddleware.validate, transactionsRoutes)

export { v1routes };