import { Router } from "express";
import { ImagesController } from "../../controller/images";

const imagesRoutes = Router();

const imagesController = new ImagesController();

imagesRoutes.get('/:fileName', async (req, res) => {
  await imagesController.findOne(req, res)
});

export {imagesRoutes}  