import { Router } from "express";
import { v1routes } from './v1routes';

const routes = Router()

routes.use('/v1', v1routes)

export { routes };