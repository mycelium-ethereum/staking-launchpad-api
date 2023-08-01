import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const ONE_HOUR = 60 * 60 * 1000;

@Injectable()
export class ListCacheManager {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getMissing(
    validatorList: string,
    key: string,
    returnType: 'list' | 'object' = 'list',
  ): Promise<{ missing: string; cached: any }> {
    const validators = validatorList.split(',');

    const cachedList: { index: string; info: any | null }[] = await Promise.all(
      validators.map(async (index) => ({
        index,
        info: await this.cacheManager.get(`${key}/${index}`),
      })),
    );

    const missing = cachedList
      .filter((v) => !v.info)
      .map((v) => v.index)
      .join(',');

    let cached;
    if (returnType === 'list') {
      cached = cachedList.filter((v) => !!v.info).map((v) => v.info);
    } else {
      cached = cachedList
        .filter((v) => !!v.info)
        .reduce((o, v) => {
          o[v.index] = v.info;
          return o;
        }, {});
    }

    return {
      missing,
      cached,
    };
  }

  async set(key: string, value: any): Promise<void> {
    return this.cacheManager.set(key, value, ONE_HOUR);
  }

  async get(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }
}
