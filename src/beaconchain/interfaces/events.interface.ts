import { BigNumber } from '@ethersproject/bignumber';

export type RewardsBreakdown = {
  validatorIndex: number;
  headRewards: BigNumber;
  sourceRewards: BigNumber;
  targetRewards: BigNumber;
};

export type RawIncomeHistoryCapture = {
  income: {
    attestation_head_reward: number;
    attestation_source_reward: number;
    attestation_target_reward: number;
  };
  validatorindex: number;
  // "epoch": 0,
  // "week": 0,
  // "week_end": "string",
  // "week_start": "string"
};
