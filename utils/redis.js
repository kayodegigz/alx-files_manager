const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('error', (err) => console.log('Redis Client Error', err));
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key) {
    const value = await this.client.getAsync(key);
    return value;
  }

  async set(key, value, duration) {
    this.client.set(key, value);
    this.client.expire(key, duration);
  }

  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
