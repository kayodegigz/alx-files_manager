import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.header('Authorization') || null;
    if (!authHeader) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const buffer = Buffer.from(authHeader.replace('Basic ', ''), 'base64');

    const credentials = {
      email: buffer.toString('utf-8').split(':')[0],
      password: buffer.toString('utf-8').split(':')[1],
    };

    if (!(credentials.email && credentials.password)) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    credentials.password = sha1(credentials.password);

    const existingUser = await DBClient
      .db
      .collection('users')
      .findOne(credentials);

    if (!existingUser) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    await RedisClient.set(key, existingUser._id.toString(), 86400);

    return res.status(200).send({ token });
  }

  static async getDisconnect(req, res) {
    const tokenHeader = req.header('X-Token') || null;
    if (!tokenHeader) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const userId = await RedisClient.get(`auth_${tokenHeader}`);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    await RedisClient.del(`auth_${tokenHeader}`);
    return res.status(204).send();
  }
}

module.exports = AuthController;
