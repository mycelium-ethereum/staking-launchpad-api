import { Test } from '@nestjs/testing';
import { BeaconchainController } from './beaconchain.controller';
import { BeaconchainService } from './beaconchain.service';
import { DepositsService } from './deposits.service';
import { PerformanceService } from './performance.service';
import { ListCacheManager } from './listCacheManager.service';
import { ValidatorInfo } from './interfaces/beaconchain.interface';
import { CacheModule } from '@nestjs/cache-manager';

const mockInfo = (index: string): ValidatorInfo => ({
  pubKey: `0x${index}`,
  index: index,
  name: '',
  status: 'active_online',
  depositTime: undefined,
});

describe('BeaconchainController', () => {
  let beaconchainController: BeaconchainController;
  let beaconchainService: BeaconchainService;
  let listCacheManager: ListCacheManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          isGlobal: true,
        }),
      ],
      controllers: [BeaconchainController],
      providers: [
        BeaconchainService,
        DepositsService,
        ListCacheManager,
        PerformanceService,
      ],
    }).compile();

    beaconchainService = moduleRef.get<BeaconchainService>(BeaconchainService);
    beaconchainController = moduleRef.get<BeaconchainController>(
      BeaconchainController,
    );
    listCacheManager = moduleRef.get<ListCacheManager>(ListCacheManager);
  });

  describe('stats', () => {
    it('Returns an empty list if there are no stats', async () => {
      jest
        .spyOn(listCacheManager, 'getMissing')
        .mockReturnValueOnce(Promise.resolve({ missing: '1,2', cached: [] }));
      jest
        .spyOn(beaconchainService, 'syncMissingInfo')
        .mockReturnValueOnce(Promise.resolve([]));

      expect(
        await beaconchainController.getValidatorsInfo('1,2'),
      ).toStrictEqual([]);
    });

    it('Correctly returns validator stats', async () => {
      jest
        .spyOn(listCacheManager, 'getMissing')
        .mockReturnValueOnce(Promise.resolve({ missing: '1,2', cached: [] }));
      jest
        .spyOn(beaconchainService, 'syncMissingInfo')
        .mockReturnValueOnce(Promise.resolve([mockInfo('1'), mockInfo('2')]));

      let value = await beaconchainController.getValidatorsInfo('1,2');

      expect(value).toStrictEqual([mockInfo('1'), mockInfo('2')]);

      jest.spyOn(listCacheManager, 'getMissing').mockReturnValueOnce(
        Promise.resolve({
          missing: '3',
          cached: [mockInfo('1'), mockInfo('2')],
        }),
      );
      jest.spyOn(beaconchainService, 'syncMissingInfo').mockReturnValueOnce(
        Promise.resolve([
          {
            pubKey: '0x3',
            index: '3',
            name: '',
            status: 'active_online',
            depositTime: undefined,
          },
        ]),
      );

      value = await beaconchainController.getValidatorsInfo('1,2,3');

      expect(value).toStrictEqual([
        mockInfo('3'),
        mockInfo('1'),
        mockInfo('2'),
      ]);
    });
  });

  describe('info', () => {
    // TODO
  });

  describe('performance', () => {
    // TODO
  });

  describe('queue_info', () => {
    it('Fetches and caches queue_info', async () => {
      const jsonMock = jest.fn(() =>
        Promise.resolve({
          data: {
            beaconchain_entering: 79104,
            beaconchain_exiting: 0,
            validatorscount: 701870,
          },
        }),
      );
      jest.spyOn(global, 'fetch').mockReturnValueOnce(
        // @ts-ignore
        Promise.resolve({
          json: jsonMock,
        }),
      );

      const first = await beaconchainController.getEstimatedWaitTimes();

      expect(first).toStrictEqual({
        entryTimes: {
          entryWaitingTime: '32 days, 18 hours',
          entryWaitingTimeSeconds: 2827867,
        },
        exitTimes: {
          exitWaitingTime: '0 minutes',
          exitWaitingTimeSeconds: 0,
        },
        activeValidators: 701870,
        maxIndex: 860615,
      });

      const cached = await beaconchainController.getEstimatedWaitTimes();

      expect(cached).toStrictEqual(first);
      expect(jsonMock).toHaveBeenCalledTimes(1);
    });
  });
});
