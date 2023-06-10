import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const express = require('express');

const router = (app) => {
  const route = express.Router();
  app.use(express.json());
  app.use('/', route);

  route.get('/status', (req, res) => AppController.getStatus(req, res));
  route.get('/stats', (req, res) => AppController.getStats(req, res));
  route.post('/users', (req, res) => UsersController.postNew(req, res));
  route.get('/connect', (req, res) => AuthController.getConnect(req, res));
  route.get('/disconnect', (req, res) => AuthController.getDisconnect(req, res));
  route.get('/users/me', (req, res) => UsersController.getMe(req, res));
  route.post('/files', (req, res) => FilesController.postUpload(req, res));
  route.get('/files/:id', (req, res) => FilesController.getShow(req, res));
  route.get('/files', (req, res) => FilesController.getIndex(req, res));
  route.put('/files/:id/publish', (req, res) => FilesController.putPublish(req, res));
  route.put('/files/:id/unpublish', (req, res) => FilesController.putUnpublish(req, res));
  route.get('/files/:id/data', (req, res) => FilesController.getFile(req, res));
};
export default router;
