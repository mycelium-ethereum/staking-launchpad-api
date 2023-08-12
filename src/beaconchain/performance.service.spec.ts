import { Test } from '@nestjs/testing';
import { PerformanceService } from './performance.service';
import { ListCacheManager } from './listCacheManager.service';
import { CacheModule } from '@nestjs/cache-manager';
import {
  CLPerformanceData,
  CLPerformance,
  ELPerformanceData,
  ELPerformance,
  RawBlockData,
} from './interfaces/performance.interface';
import { BigNumber } from '@ethersproject/bignumber';
import { parseUnits } from '@ethersproject/units';

const mockedValidatorsList = '1,2';

const mockedClBeaconchainData: CLPerformanceData[] = [
  {
    validatorindex: 1,
    balance: Number(parseUnits('100', 9).toString()),
    performance1d: Number(parseUnits('10', 9).toString()),
    performance7d: Number(parseUnits('70', 9).toString()),
    performance31d: Number(parseUnits('310', 9).toString()),
    performance365d: Number(parseUnits('3650', 9).toString()),
    performancetoday: Number(parseUnits('1', 9).toString()),
    performancetotal: Number(parseUnits('3650', 9).toString()),
    rank7d: 1,
  },
];

const mockedClPerformance: CLPerformance[] = [
  {
    index: 1,
    balance: parseUnits('100'),
    earnt1D: parseUnits('10'),
    earnt7D: parseUnits('70'),
    earnt31D: parseUnits('310'),
    earnt365D: parseUnits('3650'),
    earntToday: parseUnits('1'),
    earntTotal: parseUnits('3650'),
    rank7D: 1,
  },
  {
    index: 2,
    balance: parseUnits('200'),
    earnt1D: parseUnits('20'),
    earnt7D: parseUnits('140'),
    earnt31D: parseUnits('620'),
    earnt365D: parseUnits('7300'),
    earntToday: parseUnits('2'),
    earntTotal: parseUnits('7300'),
    rank7D: 2,
  },
];

const mockedElBeaconchainData: ELPerformanceData[] = [
  {
    validatorindex: 1,
    performance1d: Number(parseUnits('1').toString()),
    performance7d: Number(parseUnits('2').toString()),
    performance31d: Number(parseUnits('3').toString()),
  },
];

const mockedElPerformance: ELPerformance[] = [
  {
    index: 1,
    performance1D: parseUnits('1'),
    performance7D: parseUnits('2'),
    performance31D: parseUnits('3'),
  },
  {
    index: 2,
    performance1D: parseUnits('4'),
    performance7D: parseUnits('5'),
    performance31D: parseUnits('6'),
  },
];

const mockedBeaconchainBlockData: RawBlockData[] = [
  {
    timestamp: 1,
    blockReward: Number(parseUnits('2')),
    blockMevReward: 1,
    posConsensus: {
      proposerIndex: 1,
    },
    relay: {
      tag: '0xFirstValidator1Relay',
    },
  },
  {
    timestamp: 2,
    blockReward: Number(parseUnits('2')),
    blockMevReward: 2,
    posConsensus: {
      proposerIndex: 1,
    },
    relay: {
      tag: '0xSecondValidator1Relay',
    },
  },
  {
    timestamp: 1,
    blockReward: Number(parseUnits('15')),
    blockMevReward: 1,
    posConsensus: {
      proposerIndex: 2,
    },
    relay: {
      tag: '0xFirstValidator2Relay',
    },
  },
];

const mockedBlockData: Record<string, RawBlockData[]> = {
  '1': [
    {
      timestamp: 1,
      blockReward: Number(parseUnits('2')),
      blockMevReward: 1,
      posConsensus: {
        proposerIndex: 1,
      },
      relay: {
        tag: '0xFirstValidator1Relay',
      },
    },
    {
      timestamp: 2,
      blockReward: Number(parseUnits('2')),
      blockMevReward: 2,
      posConsensus: {
        proposerIndex: 1,
      },
      relay: {
        tag: '0xSecondValidator1Relay',
      },
    },
  ],
  '2': [
    {
      timestamp: 1,
      blockReward: Number(parseUnits('15')),
      blockMevReward: 1,
      posConsensus: {
        proposerIndex: 2,
      },
      relay: {
        tag: '0xFirstValidator2Relay',
      },
    },
  ],
};
const mockedPerformance = {
  '1': {
    index: 1,
    balance: '100000000000000000000',
    earnt1D: { cl: '10000000000000000000', el: '1000000000000000000' },
    earnt7D: { cl: '70000000000000000000', el: '2000000000000000000' },
    earnt31D: { cl: '310000000000000000000', el: '3000000000000000000' },
    earnt365D: { cl: '3650000000000000000000', el: '0' },
    earntToday: { cl: '1000000000000000000', el: '0' },
    earntTotal: { cl: '3650000000000000000000', el: '4000000000000000000' },
    rank7D: 1,
  },
  '2': {
    index: 2,
    balance: '200000000000000000000',
    earnt1D: { cl: '20000000000000000000', el: '4000000000000000000' },
    earnt7D: { cl: '140000000000000000000', el: '5000000000000000000' },
    earnt31D: { cl: '620000000000000000000', el: '6000000000000000000' },
    earnt365D: { cl: '7300000000000000000000', el: '0' },
    earntToday: { cl: '2000000000000000000', el: '0' },
    earntTotal: { cl: '7300000000000000000000', el: '15000000000000000000' },
    rank7D: 2,
  },
};

describe('PerformanceService', () => {
  let performanceService: PerformanceService;
  let listCacheManager: ListCacheManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          isGlobal: true,
        }),
      ],
      providers: [PerformanceService, ListCacheManager],
    }).compile();

    performanceService = moduleRef.get<PerformanceService>(PerformanceService);
    listCacheManager = moduleRef.get<ListCacheManager>(ListCacheManager);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create PerformanceService instance', () => {
      expect(performanceService).toBeDefined();
      expect(performanceService).toBeInstanceOf(PerformanceService);
    });

    it('should inject the ListCacheManager', () => {
      expect(listCacheManager).toBeDefined();
    });
  });

  describe('getClPerformance', () => {
    it('should return cached data if no missing data', async () => {
      const jsonMock = jest.fn(() => Promise.resolve({ data: {} }));
      jest.spyOn(global, 'fetch').mockReturnValueOnce(
        // @ts-ignore
        Promise.resolve({
          json: jsonMock,
        }),
      );
      jest
        .spyOn(listCacheManager, 'getMissing')
        .mockReturnValueOnce(
          Promise.resolve({ missing: '', cached: mockedClPerformance }),
        );

      const cachedPerformance = await performanceService.getClPerformance(
        mockedValidatorsList,
      );
      expect(cachedPerformance).toEqual(mockedClPerformance);
      expect(jsonMock).toHaveBeenCalledTimes(0);
    });

    it('should return joined data when missing data is fetched', async () => {
      const jsonMock = jest.fn(() =>
        Promise.resolve({ data: mockedClBeaconchainData }),
      );
      jest.spyOn(global, 'fetch').mockReturnValueOnce(
        // @ts-ignore
        Promise.resolve({
          json: jsonMock,
        }),
      );
      jest
        .spyOn(listCacheManager, 'getMissing')
        .mockReturnValueOnce(
          Promise.resolve({ missing: '1', cached: [mockedClPerformance[1]] }),
        );

      const joinedPerformance = await performanceService.getClPerformance(
        mockedValidatorsList,
      );
      expect(joinedPerformance).toEqual(mockedClPerformance);
      expect(jsonMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getElPerformance', () => {
    it('should return cached data if no missing data', async () => {
      const jsonMock = jest.fn(() => Promise.resolve({ data: {} }));
      jest.spyOn(global, 'fetch').mockReturnValueOnce(
        // @ts-ignore
        Promise.resolve({
          json: jsonMock,
        }),
      );
      jest
        .spyOn(listCacheManager, 'getMissing')
        .mockReturnValueOnce(
          Promise.resolve({ missing: '', cached: mockedElPerformance }),
        );

      const cachedPerformance = await performanceService.getElPerformance(
        mockedValidatorsList,
      );
      expect(cachedPerformance).toEqual(mockedElPerformance);
      expect(jsonMock).toHaveBeenCalledTimes(0);
    });

    it('should return joined data when missing data is fetched', async () => {
      const jsonMock = jest.fn(() =>
        Promise.resolve({ data: mockedElBeaconchainData }),
      );
      jest.spyOn(global, 'fetch').mockReturnValueOnce(
        // @ts-ignore
        Promise.resolve({
          json: jsonMock,
        }),
      );
      jest
        .spyOn(listCacheManager, 'getMissing')
        .mockReturnValueOnce(
          Promise.resolve({ missing: '1', cached: [mockedElPerformance[1]] }),
        );

      const joinedPerformance = await performanceService.getElPerformance(
        mockedValidatorsList,
      );
      expect(joinedPerformance).toEqual(mockedElPerformance);
      expect(jsonMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBlockData', () => {
    it('should return cached data if no missing data', async () => {
      const jsonMock = jest.fn(() => Promise.resolve({ data: {} }));
      jest.spyOn(global, 'fetch').mockReturnValueOnce(
        // @ts-ignore
        Promise.resolve({
          json: jsonMock,
        }),
      );
      jest
        .spyOn(listCacheManager, 'getMissing')
        .mockReturnValueOnce(
          Promise.resolve({ missing: '', cached: mockedBlockData }),
        );

      const cachedBlockData = await performanceService.getBlockData(
        mockedValidatorsList,
      );
      expect(cachedBlockData).toEqual(mockedBlockData);
      expect(jsonMock).toHaveBeenCalledTimes(0);
    });

    it('all missing data', async () => {
      const jsonMock = jest.fn(() =>
        Promise.resolve({ data: mockedBeaconchainBlockData }),
      );
      jest.spyOn(global, 'fetch').mockReturnValueOnce(
        // @ts-ignore
        Promise.resolve({
          json: jsonMock,
        }),
      );
      jest
        .spyOn(listCacheManager, 'getMissing')
        .mockReturnValueOnce(Promise.resolve({ missing: '1,2', cached: {} }));

      const allBlockData = await performanceService.getBlockData(
        mockedValidatorsList,
      );
      expect(allBlockData).toEqual(mockedBlockData);
      expect(jsonMock).toHaveBeenCalledTimes(1);
    });

    it('partially missing data', async () => {
      const jsonMock = jest.fn(() =>
        Promise.resolve({ data: mockedBeaconchainBlockData.slice(0, 2) }),
      );
      jest.spyOn(global, 'fetch').mockReturnValueOnce(
        // @ts-ignore
        Promise.resolve({
          json: jsonMock,
        }),
      );
      jest.spyOn(listCacheManager, 'getMissing').mockReturnValueOnce(
        Promise.resolve({
          missing: '1',
          cached: { '2': mockedBlockData['2'] },
        }),
      );

      const allBlockData = await performanceService.getBlockData(
        mockedValidatorsList,
      );
      expect(allBlockData).toEqual(mockedBlockData);
      expect(jsonMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAll', () => {
    it('should return all', async () => {
      jest
        .spyOn(performanceService, 'getClPerformance')
        .mockReturnValueOnce(Promise.resolve(mockedClPerformance));
      jest
        .spyOn(performanceService, 'getElPerformance')
        .mockReturnValueOnce(Promise.resolve(mockedElPerformance));
      jest
        .spyOn(performanceService, 'getBlockData')
        .mockReturnValueOnce(Promise.resolve(mockedBlockData));

      const performanceData = await performanceService.getAll(
        mockedValidatorsList,
      );
      expect(performanceData).toEqual(mockedPerformance);
    });

    it('should return partial', async () => {
      jest
        .spyOn(performanceService, 'getClPerformance')
        .mockReturnValueOnce(Promise.resolve(mockedClPerformance.slice(0, 1)));
      jest
        .spyOn(performanceService, 'getElPerformance')
        .mockReturnValueOnce(Promise.resolve(mockedElPerformance));
      jest
        .spyOn(performanceService, 'getBlockData')
        .mockReturnValueOnce(Promise.resolve(mockedBlockData));

      const performanceData = await performanceService.getAll('1');
      expect(performanceData).toEqual({ '1': mockedPerformance['1'] });
    });

    it('should return none', async () => {
      jest
        .spyOn(performanceService, 'getClPerformance')
        .mockReturnValueOnce(Promise.resolve([]));
      jest
        .spyOn(performanceService, 'getElPerformance')
        .mockReturnValueOnce(Promise.resolve(mockedElPerformance));
      jest
        .spyOn(performanceService, 'getBlockData')
        .mockReturnValueOnce(Promise.resolve(mockedBlockData));

      const performanceData = await performanceService.getAll(
        mockedValidatorsList,
      );
      expect(performanceData).toEqual({});
    });
  });
});
