import AppController from '../controllers/AppController';

const express = require('express');

const router = (app) => {
  const route = express.Router();
  app.use('/', route);

  route.get('/status', (req, res) => AppController.getStatus(req, res));
  route.get('/stats', (req, res) => AppController.getStats(req, res));
};
export default router;
