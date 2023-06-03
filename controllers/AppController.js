import RedisClient from '../utils/redis';
import DBClient from '../utils/db';

class AppController {
  static getStatus(req, res) {
    const resBody = {
      redis: RedisClient.isAlive(),
      db: DBClient.isAlive(),
    };
    return res.status(200).send(resBody);
  }

  static async getStats(req, res) {
    const resBody = {
      users: await DBClient.nbUsers(),
      files: await DBClient.nbFiles(),
    };
    return res.status(200).send(resBody);
  }
}

module.exports = AppController;
