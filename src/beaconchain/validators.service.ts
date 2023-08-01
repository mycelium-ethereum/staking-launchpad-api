import { Injectable } from '@nestjs/common';
import { BEACON_CHAIN_API } from './common';
import {
  RawIncomeHistoryCapture,
  RewardsBreakdown,
} from './interfaces/events.interface';
import { ListCacheManager } from './listCacheManager.service';
import { BigNumber } from '@ethersproject/bignumber';
import { Validator, ValidatorInfo } from './interfaces/beaconchain.interface';

type PartialValidatorInfo = Omit<ValidatorInfo, 'depositTime'>;

@Injectable()
export class ValidatorsService {
  // Mapping from validator index to deposit timestamp this is static so does not need to be in cacheManager
  private deposits: Record<string, number> = {};

  constructor(private readonly listCacheManager: ListCacheManager) {}

  private async syncDeposits(
    validators: { index: string; pubKey: string }[],
  ): Promise<Record<string, number>> {
    // sync any missing deposits
    const needDepositsList = validators
      .filter((v) => !this.deposits[v.pubKey])
      .map((v) => v.index)
      .join(',');
    if (needDepositsList !== '') {
      console.debug(`Missing deposits for ${needDepositsList}`);
      const deposits = await fetch(
        `${BEACON_CHAIN_API}/validator/${needDepositsList}/deposits`,
      ).then((res) => res.json());

      deposits.data.forEach((d: any) => {
        this.deposits[d.publickey] = d.block_ts;
      });
    }
    return this.deposits;
  }

  private async syncMissingInfo(
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

  async getInfo(validatorsList: string): Promise<ValidatorInfo[]> {
    const validators = validatorsList.split(',');

    const { missing, cached } = await this.listCacheManager.getMissing(
      validatorsList,
      'info',
    );

    const missingInfo = await this.syncMissingInfo(missing);
    const joinedValidators: PartialValidatorInfo[] = missingInfo.concat(cached);

    const deposits = await this.syncDeposits(joinedValidators);

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

  async getStats(validators: string): Promise<Validator[]> {
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
}
