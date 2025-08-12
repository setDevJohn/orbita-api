import { Router } from "express";
import { v1routes } from './v1';

const routes = Router()

routes.use('/v1', v1routes)

export { routes };