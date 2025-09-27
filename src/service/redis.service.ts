import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

class RedisService {
  private redis: Redis

  constructor() {
    // Khoi tao ket noi Redis
    this.redis = new Redis({
      host: process.env.REDIS_DB_HOST,
      port: parseInt(process.env.REDIS_DB_PORT || '6379', 10),
      password: process.env.REDIS_DB_PASSWORD,
      db: parseInt(process.env.REDIS_DB_NAME || '0', 10)
    })

    this.redis.on('connect', () => {
      console.log('🔌 Connected to Redis')
    })

    this.redis.on('error', (err: Error) => {
      console.error('❌ Redis error:', err)
    })
  }

  async set(key: string, value: any, ttlInSec: number | null = null): Promise<void> {
    const stringValue = JSON.stringify(value)
    if (ttlInSec) {
      await this.redis.set(key, stringValue, 'EX', ttlInSec)
    } else {
      await this.redis.set(key, stringValue)
    }
  }

  // set lock for booking
  async setLock(key: string, value: any, ttlInSec: number) {
    const stringValue = JSON.stringify(value)
    return await this.redis.set(key, stringValue, 'EX', ttlInSec, 'NX') // NX (only set if not exists), EX (expire time) de tao lock, tranh 2 tien trinh cung thao tac mot tai nguyen
  }

  // handle for map
  async setMap(key: string, map: Map<string, any>, ttlInSec: number | null = null): Promise<void> {
    const obj = Object.fromEntries(map)
    await this.set(key, obj, ttlInSec)
  }

  async getMap<K extends string, V = any>(key: string): Promise<Map<K, V> | null> {
    const obj = await this.get(key)
    if (!obj) return null
    return new Map(Object.entries(obj)) as Map<K, V>
  }

  // del keys
  async delMany(keys: string[]): Promise<number> {
    if (keys.length === 0) return 0
    return await this.redis.del(...keys)
  }

  async has(key: string): Promise<boolean> {
    const exists = await this.redis.exists(key)
    return exists === 1
  }

  async get<T = any>(key: string): Promise<T | null> {
    const data = await this.redis.get(key)
    return data ? (JSON.parse(data) as T) : null
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key)
  }

  async exists(key: string): Promise<boolean> {
    const exists = await this.redis.exists(key)
    return exists === 1
  }

  async sadd(key: string, member: string): Promise<number> {
    return await this.redis.sadd(key, member)
  }

  /**
   * Get all members from Redis set
   * @param key - set key
   */
  async smembers(key: string): Promise<string[]> {
    return await this.redis.smembers(key)
  }

  async srem(key: string, member: string): Promise<number> {
    return await this.redis.srem(key, member)
  }

  async sismember(key: string, member: string): Promise<number> {
    return await this.redis.sismember(key, member)
  }

  async scard(key: string): Promise<number> {
    return await this.redis.scard(key)
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await this.redis.expire(key, seconds)
  }

  async getTtl(key: string): Promise<number> {
    return await this.redis.ttl(key)
  }

  async scanKeys(pattern: string): Promise<string[]> {
    const stream = this.redis.scanStream({ match: pattern })
    const keys: string[] = []

    return new Promise<string[]>((resolve, reject) => {
      stream.on('data', (resultKeys: string[]) => {
        keys.push(...resultKeys)
      })
      stream.on('end', () => {
        resolve(keys)
      })
      stream.on('error', (err) => {
        reject(err)
      })
    })
  }

  async tryLockWithRetry(lockKey: string, value: any, ttl: number, maxRetry = 5, delayMs = 300): Promise<boolean> {
    for (let i = 0; i < maxRetry; i++) {
      const lock = await this.setLock(lockKey, value, ttl)
      if (lock) return true
      // Nếu chưa lấy được lock, chờ delayMs rồi thử lại
      await new Promise((res) => setTimeout(res, delayMs))
    }
    return false
  }
}

export default new RedisService()