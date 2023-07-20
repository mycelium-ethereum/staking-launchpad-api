import { Injectable } from '@nestjs/common';
import {
  ValidatorPerformance,
  CLPerformance,
  CLPerformanceData,
  ELPerformance,
  ELPerformanceData,
  RawBlockData,
} from './interfaces/performance.interface';
import { ListCacheManager } from './listCacheManager.service';
import { BEACON_CHAIN_API, reduceToObject } from './common';
import { parseUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';

// @dev Handles fetching validator information about performance
@Injectable()
export class PerformanceService {
  constructor(private listCacheManager: ListCacheManager) {}

  async findAll(
    validatorsList: string,
  ): Promise<Record<string, ValidatorPerformance>> {
    const clData = await this.getClPerformance(validatorsList);
    const elData = await this.getElPerformance(validatorsList);
    const blockData = await this.getBlockData(validatorsList);

    const blockTotals = Object.keys(blockData).reduce(
      (o: any, k: string) => ({
        ...o,
        [k]: blockData[k].reduce(
          (sum: BigNumber, b: RawBlockData) =>
            sum.add(b.blockReward.toString()),
          BigNumber.from(0),
        ),
      }),
      {} as Record<number, BigNumber>,
    );
    const elObject = reduceToObject(elData);

    // combines clData and elPerformance
    const validatorsPerformance = clData.reduce((o: any, v: CLPerformance) => {
      return {
        ...o,
        [v.index]: {
          index: v.index,
          balance: v.balance.toString(),
          earnt1D: {
            cl: v.earnt1D.toString(),
            el: (
              elObject[v.index]?.performance1D ?? BigNumber.from('0')
            ).toString(),
          },
          earnt7D: {
            cl: v.earnt7D.toString(),
            el: (
              elObject[v.index]?.performance7D ?? BigNumber.from('0')
            ).toString(),
          },
          earnt31D: {
            cl: v.earnt31D.toString(),
            el: (
              elObject[v.index]?.performance31D ?? BigNumber.from('0')
            ).toString(),
          },
          earnt365D: {
            cl: v.earnt365D.toString(),
            el: BigNumber.from('0').toString(), // TODO get el rewards 365 days
          },
          earntToday: {
            cl: v.earntToday.toString(),
            el: BigNumber.from('0').toString(), // TODO get el rewards today
          },
          earntTotal: {
            cl: v.earntTotal.toString(),
            el: (blockTotals?.[v.index] ?? BigNumber.from('0')).toString(),
          },
          rank7D: v.rank7D,
        },
      };
    }, {});

    return validatorsPerformance;
  }

  async getClPerformance(validatorsList: string): Promise<CLPerformance[]> {
    const { missing, cached } = await this.listCacheManager.getMissing(
      validatorsList,
      'cl',
    );
    if (missing !== '') {
      console.debug(`Missing performance info for ${missing}`);
      const clPerformanceData = await fetch(
        `${BEACON_CHAIN_API}/validator/${validatorsList}/performance`,
      ).then((res) => res.json());
      // clPerformance amounts are in 9 decimal units need to parse them to 18
      const missingPerformance = clPerformanceData.data.map(
        (v: CLPerformanceData) => ({
          index: v.validatorindex,
          balance: parseUnits(v.balance.toString(), 9),
          earnt1D: parseUnits(v.performance1d.toString(), 9),
          earnt7D: parseUnits(v.performance7d.toString(), 9),
          earnt31D: parseUnits(v.performance31d.toString(), 9),
          earnt365D: parseUnits(v.performance365d.toString(), 9),
          earntToday: parseUnits(v.performancetoday.toString(), 9),
          earntTotal: parseUnits(v.performancetotal.toString(), 9),
          rank7D: v.rank7d,
        }),
      );
      missingPerformance.forEach((v) =>
        this.listCacheManager.set(`cl/${v.index}`, v),
      );
      const joinedValidators: CLPerformance[] =
        missingPerformance.concat(cached);

      return joinedValidators;
    }

    return cached;
  }

  async getElPerformance(validatorsList: string): Promise<ELPerformance[]> {
    const { missing, cached } = await this.listCacheManager.getMissing(
      validatorsList,
      'el',
    );
    if (missing !== '') {
      console.debug(`Missing performance info for ${missing}`);
      const elPerformanceData = await fetch(
        `${BEACON_CHAIN_API}/validator/${validatorsList}/execution/performance`,
      ).then((res) => res.json());

      // clPerformance amounts are in 9 decimal units need to parse them to 18
      const missingPerformance: ELPerformance[] = elPerformanceData.data.map(
        (v: ELPerformanceData) => ({
          index: v.validatorindex,
          // these amounts are already in 18 decimal units
          performance1d: BigNumber.from(v.performance1d.toString()),
          performance7d: BigNumber.from(v.performance7d.toString()),
          performance31d: BigNumber.from(v.performance31d.toString()),
        }),
      );

      missingPerformance.forEach((v) =>
        this.listCacheManager.set(`el/${v.index}`, v),
      );
      const joinedValidators: ELPerformance[] =
        missingPerformance.concat(cached);

      return joinedValidators;
    }
    return cached;
  }

  async getBlockData(
    validatorsList: string,
  ): Promise<Record<string, RawBlockData[]>> {
    const { missing, cached } = await this.listCacheManager.getMissing(
      validatorsList,
      'bl',
      'object',
    );
    // const cachedObject = cached.reduce((o, c) => { o[c.posConsensus.proposerindex] = c; return o}, {})
    if (missing !== '') {
      console.debug(`Missing performance info for ${missing}`);
      const blockData = await fetch(
        `${BEACON_CHAIN_API}/execution/${validatorsList}/produced`,
      ).then((res) => res.json());

      const splitBlockData = blockData.data.reduce((o, d: RawBlockData) => {
        const index = d.posConsensus.proposerIndex;
        if (!o[index]) {
          o[index] = [];
        }
        o[index].push(d);
        return o;
      }, {});

      Object.keys(splitBlockData).forEach((k) =>
        this.listCacheManager.set(`bl/${k}`, splitBlockData[k]),
      );

      return { ...splitBlockData, ...cached };
    }
    console.debug(`Returning cache for ${validatorsList}`);
    return cached;
  }
}
