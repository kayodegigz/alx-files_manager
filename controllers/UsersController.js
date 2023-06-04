import sha1 from 'sha1';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

const { ObjectId } = require('mongodb');

class UsersController {
  static async postNew(req, res) {
    if (!req.body.email) {
      return res.status(400).send({ error: 'Missing email' });
    }
    if (!req.body.password) {
      return res.status(400).send({ error: 'Missing password' });
    }

    const hashPassword = sha1(req.body.password);
    const existingEmail = await DBClient.db
      .collection('users')
      .findOne({ email: req.body.email });

    if (existingEmail) {
      return res.status(400).send({ error: 'Already exist' });
    }

    const finalRequestBody = { email: req.body.email, password: hashPassword };

    const result = await DBClient.db.collection('users')
      .insertOne(finalRequestBody);

    return res
      .status(201)
      .send({ id: result.insertedId, email: finalRequestBody.email });
  }

  static async getMe(req, res) {
    const tokenHeader = req.header('X-Token') || null;
    if (!tokenHeader) {
      res.status(401).send({ error: 'Unauthorized' });
    }

    const userId = await RedisClient.get(`auth_${tokenHeader}`);
    if (!userId) {
      res.status(401).send({ error: 'Unauthorized' });
    }

    const user = await DBClient.db
      .collection('users')
      .findOne({ _id: ObjectId(userId) });

    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    delete user.password;

    return res.status(200).send({ id: user._id, email: user.email });
  }
}

module.exports = UsersController;
