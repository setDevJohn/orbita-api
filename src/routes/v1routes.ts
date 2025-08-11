import { Router } from "express";
import { cardsRoutes } from "./cards";
import { accountsRoutes } from "./accounts";
import { categoriesRoutes } from "./categories";
import { transactionsRoutes } from "./transactions";

const v1routes = Router()

v1routes.use('/cards', cardsRoutes)
v1routes.use('/accounts', accountsRoutes)
v1routes.use('/categories', categoriesRoutes)
v1routes.use('/transactions', transactionsRoutes)

export { v1routes };