import { Test } from '@nestjs/testing';
import { ListCacheManager } from './listCacheManager.service';
import { CacheModule } from '@nestjs/cache-manager';

describe('ListCacheManager', () => {
  let listCacheManager: ListCacheManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          isGlobal: true,
        }),
      ],
      providers: [ListCacheManager],
    }).compile();

    listCacheManager = moduleRef.get<ListCacheManager>(ListCacheManager);
  });

  describe('handles set and get', () => {
    it('Simple set and get', async () => {
      const expected = ['1', 2];
      const key = 'value';
      await Promise.all([
        listCacheManager.set(`${key}/1`, expected[0]),
        listCacheManager.set(`${key}/2`, expected[1]),
      ]);
      const values = await Promise.all([
        listCacheManager.get(`${key}/1`),
        listCacheManager.get(`${key}/2`),
      ]);
      expect(values).toStrictEqual(expected);
    });

    it('getMissing returns objects', async () => {
      const expected = [{ nested: 1 }, { nested: 2 }];
      const expected2 = [{ nested: 1 }];
      const key = 'object';
      await listCacheManager.set(`${key}/1`, expected);
      await listCacheManager.set(`${key}/2`, expected2);

      const missingValues = await listCacheManager.getMissing(
        '1,2,3',
        key,
        'object',
      );
      expect(missingValues.missing).toBe('3');
      expect(missingValues.cached).toStrictEqual({ 1: expected, 2: expected2 });
    });

    it('getMissing returns list', async () => {
      const expected = [{ nested: 1 }, { nested: 2 }];
      const expected3 = [{ nested: 1 }];
      const key = 'list';
      await listCacheManager.set(`${key}/1`, expected);
      await listCacheManager.set(`${key}/3`, expected3);

      const missingValues = await listCacheManager.getMissing('1,2,3', key);
      expect(missingValues.missing).toBe('2');
      expect(missingValues.cached).toStrictEqual([expected, expected3]);
    });
  });
});
