import { Injectable, Inject } from '@nestjs/common';
import {
  Validator,
  WaitTimes,
  ValidatorInfo,
  RawValidatorIndexPubKey,
  ValidatorIndexPubKey,
} from './interfaces/beaconchain.interface';
import { RawBlockData } from './interfaces/performance.interface';
import { ValidatorsService } from './validators.service';
import { PerformanceService } from './performance.service';
import { ListCacheManager } from './listCacheManager.service';
import {
  estimateExitWaitingTime,
  estimateEntryWaitingTime,
} from './beaconchain.utils';
import { BEACON_CHAIN_API } from './common';

@Injectable()
export class BeaconchainService {
  constructor(
    private readonly listCacheManager: ListCacheManager,
    private readonly validatorsService: ValidatorsService,
    private readonly performanceService: PerformanceService,
  ) {}

  // VALIDATOR EVENTS AND STATS
  async getValidatorsStats(validatorsList: string): Promise<Validator[]> {
    console.info('Fetching validators stats', validatorsList);
    return this.validatorsService.getStats(validatorsList);
  }
  async getValidatorsInfo(validatorsList: string): Promise<ValidatorInfo[]> {
    console.info('Fetching validators info', validatorsList);
    return this.validatorsService.getInfo(validatorsList);
  }

  // PERFORMANCE
  async getValidatorsBlocks(
    validatorsList: string,
  ): Promise<Record<string, RawBlockData[]>> {
    console.info('Fetching block data', validatorsList);
    return this.performanceService.getBlockData(validatorsList);
  }
  async getValidatorsPerformance(validatorsList: string): Promise<any> {
    console.info('Fetching performance data', validatorsList);
    return this.performanceService.getAll(validatorsList);
  }

  // GENERAL
  async getEstimatedWaitTimes(): Promise<WaitTimes> {
    console.info('Fetching wait times');
    const cached: WaitTimes | null = await this.listCacheManager.get(
      'wait_times',
    );
    if (cached) {
      console.debug(`Serving cached estimated wait times`);
      return cached;
    }
    const queueData: {
      data: {
        validatorscount: number;
        beaconchain_exiting: number;
        beaconchain_entering: number;
      };
    } = await fetch(`${BEACON_CHAIN_API}/validators/queue`).then((res) =>
      res.json(),
    );

    const activeValidators = queueData.data['validatorscount'];
    const beaconExiting = queueData.data['beaconchain_exiting'];
    const beaconEntering = queueData.data['beaconchain_entering'];

    const entryTimes = estimateEntryWaitingTime(
      beaconEntering,
      activeValidators,
    );
    const exitTimes = estimateExitWaitingTime(beaconExiting, activeValidators);

    // TODO these are hardcoded but should be dynamic
    const EXITED = 79456;
    const DEPOSITED = 185;

    const waitTimes = {
      entryTimes,
      exitTimes,
      activeValidators,
      maxIndex: activeValidators + beaconEntering + EXITED + DEPOSITED,
    };
    await this.listCacheManager.set('wait_times', waitTimes);
    return waitTimes;
  }

  async getUsersValidators(account: string): Promise<ValidatorIndexPubKey[]> {
    const usersValidators: { data: RawValidatorIndexPubKey[] } = await fetch(
      `${BEACON_CHAIN_API}/validator/eth1/${account}`,
    ).then((res) => res.json());

    return usersValidators.data.map((v: RawValidatorIndexPubKey) => ({
      pubKey: v.publickey,
      index: v.validatorindex,
    }));
  }
}
