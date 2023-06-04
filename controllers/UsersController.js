import sha1 from 'sha1';
import DBClient from '../utils/db';

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
      .insertOne(finalRequestBody, (err) => {
        if (err) {
          console.log('An error was encountered while saving user', err);
        } else {
          console.log('New User successfully created');
        }
      });

    return res
      .status(201)
      .send({ id: result.insertedId, email: finalRequestBody.email });
  }
}

module.exports = UsersController;
