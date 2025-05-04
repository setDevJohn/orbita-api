import { Router } from "express";
import { cardsRoutes } from "./cards";
import { accountsRoutes } from "./accounts";
import { categoriesRoutes } from "./categories";
import { transactionsRoutes } from "./transactions";

const routes = Router()

routes.use('/cards', cardsRoutes)
routes.use('/accounts', accountsRoutes)
routes.use('/categories', categoriesRoutes)
routes.use('/transactions', transactionsRoutes)

export {routes};