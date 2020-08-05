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
import AuthController from './app/controllers/AuthController';
import AdoptionController from './app/controllers/AdoptionController';

const upload = multer(multerConfig);
const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.post('/users', UserController.store);

routes.put('/forgot-password', AuthController.update);

routes.use(authMiddleware);
routes.get('/users', UserController.index);
routes.put('/users', UserController.update);
routes.patch('/users/avatar/:id', UserController.patch);

// mostra instituição selecionada
routes.get('/institution-show/:id', InstitutionController.display);

// mostra instituição somente para os admins no dashboard
routes.get('/institutions-admin', InstitutionController.show);

// mostra intituição para o owner EDITAR
routes.get('/institution-owner', InstitutionController.owner);

// Busca de instituição no dashboard
routes.post('/institution-search', InstitutionController.search);

routes.get('/institutions', InstitutionController.index);
routes.post('/institutions', InstitutionController.store);
routes.put('/institutions', InstitutionController.update);
routes.patch('/institutions/avatar/:id', InstitutionController.patch);
routes.delete('/institutions/:id', InstitutionController.delete);

routes.get('/animals-show/:id', AnimalController.show);
routes.get('/animals/:id', AnimalController.index);
routes.post('/animals', AnimalController.store);
routes.put('/animals/:id', AnimalController.update);
routes.patch('/animals/avatar/:id', AnimalController.patch);
routes.delete('/animals/:id', AnimalController.delete);

routes.get('/adoptions/:id', AdoptionController.index);
routes.post('/adoptions/:id', AdoptionController.store);
routes.delete('/adoptions/:id', AdoptionController.delete);

routes.post('/adoption-search/:id', AdoptionController.search);
// mostra botões de admins para cadastros
routes.get('/isadmins/:id', AdminController.show);

// mostra todos admins respectivos
routes.get('/admins', AdminController.index);
routes.post('/admins', AdminController.store);
routes.delete('/admins/:id', AdminController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
