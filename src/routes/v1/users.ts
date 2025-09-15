import { UsersController } from '../../controller/users';
import { Router } from "express";
import { UsersMiddleware } from '../../middleware/users';
import { AuthMiddleware } from '../../middleware/auth';
import { upload } from '../../multerConfig';

const usersRoutes = Router();

const usersMiddleware = new UsersMiddleware();
const usersController = new UsersController();

const authMiddleware = new AuthMiddleware();

usersRoutes.post('/auth', 
  usersMiddleware.auth,
  async (req, res) => {
    await usersController.auth(req, res);
  }
);

usersRoutes.post('/',
  usersMiddleware.create,
  async (req, res) => {
    await usersController.create(req, res);
  }
)

usersRoutes.get('/verify', 
  async (req, res) => {
    await usersController.verify(req, res);
  }
)

usersRoutes.post('/logout',
  async (req, res) => {
    await usersController.logout(req, res);
  }
)

usersRoutes.patch('/password-recovery',
  usersMiddleware.recoverPassword,
  async (req, res) => {
    await usersController.recoverPassword(req, res);
  }
)

usersRoutes.post('/password-recovery/send-email',
  usersMiddleware.sendEmailToRecoverPassword,
  async (req, res) => {
    await usersController.sendEmailToRecoverPassword(req, res);
  }
)

usersRoutes.post('/password-recovery/confirm-token',
  usersMiddleware.confirmTokenToRecoverPassword,
  async (req, res) => {
    await usersController.confirmTokenToRecoverPassword(req, res);
  }
)

usersRoutes.put('/',
  authMiddleware.validate,
  usersMiddleware.update,
  async (req, res) => {
    await usersController.update(req, res)
  } 
)

usersRoutes.patch('/update-password',
  authMiddleware.validate,
  usersMiddleware.updatePassword,
  async (req, res) => {
    await usersController.updatePassword(req, res)
  } 
)

usersRoutes.get('/info',
  authMiddleware.validate,
  async (req, res) => {
    await usersController.findInfo(req, res)
  }
)

usersRoutes.put('/update-profile-image',
  authMiddleware.validate,
  upload.single("file"),
  async (req, res) => {
    await usersController.updateProfileImage(req, res)
  }
)

export { usersRoutes }  