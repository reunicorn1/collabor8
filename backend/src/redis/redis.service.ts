import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: 'localhost', // Replace with your Redis host
      port: 6379,         // Replace with your Redis port
    });
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      return this.redis.set(key, value, 'EX', ttl);
    }
    return this.redis.set(key, value);
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async getRevoked(key: string) {
    return this.redis.get(`revoked:${key}`);
  }

  async del(key: string) {
    return this.redis.del(key);
  }

  async exists(key: string) {
    return this.redis.exists(key);
  }
}
