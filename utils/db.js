const { MongoClient } = require('mongodb');

// getting values from env vars
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const db = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}`;

class DBClient {
  constructor() {
    MongoClient.connect(url, (error, client) => {
      if (!error) {
        this.db = client.db(db);
      } else {
        this.db = false;
      }
    });
  }

  isAlive() {
    return this.db && true;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dBClient = new DBClient();
export default dBClient;
