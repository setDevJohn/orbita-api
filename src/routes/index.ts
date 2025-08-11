import { AuthMiddleware } from './../middleware/auth';
import { Router } from "express";

const routes = Router()
const authMiddleware = new AuthMiddleware()

routes.use('/v1', v1routes)

export { routes };