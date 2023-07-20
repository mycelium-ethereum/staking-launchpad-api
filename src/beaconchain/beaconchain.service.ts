import { Injectable, Inject } from '@nestjs/common';
import {
  Validator,
  WaitTimes,
  ValidatorInfo,
} from './interfaces/beaconchain.interface';
import { DepositsService } from './deposits.service';
import { PerformanceService } from './performance.service';
import { ListCacheManager } from './listCacheManager.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  estimateExitWaitingTime,
  estimateEntryWaitingTime,
} from './beaconchain.utils';
import { BEACON_CHAIN_API } from './common';

type PartialValidatorInfo = Omit<ValidatorInfo, 'depositTime'>;

@Injectable()
export class BeaconchainService {
  constructor(
    private readonly listCacheManager: ListCacheManager,
    private readonly depositsService: DepositsService,
    private readonly performanceService: PerformanceService,
  ) {}

  async getAllValidators(validators: string): Promise<Validator[]> {
    console.info('Fetching validators', validators);
    const validatorsArr = validators.split(',');

    const results = validatorsArr.map(async (index) => {
      const cached: Validator | null = await this.listCacheManager.get(
        `stats/${index}`,
      );
      if (cached) {
        console.debug(`Serving cached stats for validator: ${index}`);
        return cached;
      } else {
        const result = await fetch(
          `${BEACON_CHAIN_API}/validator/stats/${index}`,
        ).then((res) => res.json());
        const v: Validator = { index, stats: result.data };
        this.listCacheManager.set(`stats/${index}`, v);
        return v;
      }
    });
    return await Promise.all(results);
  }

  async syncMissingInfo(
    needsInfoList: string,
  ): Promise<PartialValidatorInfo[]> {
    let missingValidators: PartialValidatorInfo[] = [];
    if (needsInfoList !== '') {
      console.debug(`Missing info for ${needsInfoList}`);
      const validatorsInfo = await fetch(
        `${BEACON_CHAIN_API}/validator/${needsInfoList}`,
      ).then((res) => res.json());

      const parseValidator = (v: any): PartialValidatorInfo => ({
        pubKey: v.pubkey,
        index: v.validatorindex,
        name: v.name,
        status: v.status,
      });

      if (Array.isArray(validatorsInfo.data)) {
        missingValidators = validatorsInfo.data.map((v: any) =>
          parseValidator(v),
        );
      } else {
        try {
          // this is tempoarary since it returns
          // a single object if you only pass 1 validator in the request
          // set to change in https://github.com/gobitfly/eth2-beaconchain-explorer/issues/1673
          missingValidators = [parseValidator(validatorsInfo.data)];
        } catch (error) {
          throw Error(`Error processing validators: ${error}`);
        }
      }
    }
    return missingValidators;
  }

  async getValidatorsInfo(validatorsList: string): Promise<ValidatorInfo[]> {
    const validators = validatorsList.split(',');

    const { missing, cached } = await this.listCacheManager.getMissing(
      validatorsList,
      'info',
    );

    const missingInfo = await this.syncMissingInfo(missing);
    const joinedValidators: PartialValidatorInfo[] = missingInfo.concat(cached);

    const deposits = await this.depositsService.syncDeposits(joinedValidators);

    // append depoist times
    const validatorsWithDeposits: ValidatorInfo[] = [];
    for (let i = 0; i < joinedValidators.length; i++) {
      const info: ValidatorInfo = {
        ...joinedValidators[i],
        depositTime: deposits[joinedValidators[i].pubKey],
      };
      this.listCacheManager.set(`info/${info.index}`, info);
      validatorsWithDeposits.push(info);
    }

    return validatorsWithDeposits;
  }

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

    const waitTimes = {
      entryTimes,
      exitTimes,
      activeValidators,
    };
    this.listCacheManager.set('wait_times', waitTimes);
    return waitTimes;
  }

  async getValidatorsPerformance(validatorsList: string): Promise<any> {
    return this.performanceService.findAll(validatorsList);
  }
}
