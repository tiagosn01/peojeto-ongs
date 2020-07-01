import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import InstitutionController from './app/controllers/InstitutionController';
import AdminController from './app/controllers/AdminController';
import AnimalController from './app/controllers/AnimalController';

const upload = multer(multerConfig);
const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.post('/users', UserController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.post('/institutions', InstitutionController.store);
routes.put('/institutions', InstitutionController.update);

routes.post('/animals', AnimalController.store);

routes.post('/admins', AdminController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
