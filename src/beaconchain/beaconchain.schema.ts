import { ApiProperty } from '@nestjs/swagger';
import {
  ValidatorInfo as ValidatorInfoInterface,
  ValidatorIndexPubKey as ValidatorIndexPubKeyInterface,
  WaitTimes as WaitTimesInterface,
  BeaconChainStatus,
  Validator as ValidatorInterface,
  ValidatorStats as ValidatorStatsInterface,
} from './interfaces/beaconchain.interface';

import {
  ValidatorPerformance as ValidatorPerformanceInterface,
  Rewards as RewardsInterface,
  RawBlockData as RawBlockDataInterface,
} from './interfaces/performance.interface';

export class ValidatorInfo implements ValidatorInfoInterface {
  @ApiProperty({
    description: 'Validators public key',
    example:
      '0xabd66dab2143de9814ee0631fdd1e83f296af4e296d804192318b601f971def96552bd4e5fdc4ada4b57cd609def0b96',
  })
  pubKey: string;
  @ApiProperty({ description: 'Validators index', example: '69' })
  index: string;
  @ApiProperty({
    description: 'Validators name (if set on beaconcha.in)',
    example: 'jeb',
  })
  name: string;
  @ApiProperty({ description: 'Validators status', example: 'active_online' })
  status: BeaconChainStatus;
  @ApiProperty({
    description: 'Validators deposit timestamp',
    example: 1604509262,
  })
  depositTime: number;
}

export class ValidatorIndexPubKey implements ValidatorIndexPubKeyInterface {
  @ApiProperty({
    description: 'Validators public key',
    example:
      '0xabd66dab2143de9814ee0631fdd1e83f296af4e296d804192318b601f971def96552bd4e5fdc4ada4b57cd609def0b96',
  })
  pubKey: string;
  @ApiProperty({ description: 'Validators index', example: '69' })
  index: number;
}

export class WaitTimes implements WaitTimesInterface {
  @ApiProperty({
    description: 'Estimated entry times (human readable and number of seconds)',
    example: {
      entryWaitingTime: '27 days, 16 hours',
      entryWaitingTimeSeconds: 2389620,
    },
  })
  entryTimes: {
    entryWaitingTime: string;
    entryWaitingTimeSeconds: number;
  };
  @ApiProperty({
    description: 'Estimated exit times (human readable and number of seconds)',
    example: { exitWaitingTime: '0 minutes', entryWaitingTimeSeconds: 0 },
  })
  exitTimes: {
    exitWaitingTime: string;
    exitWaitingTimeSeconds: number;
  };
  @ApiProperty({ description: 'Number of active validators', example: 1000 })
  activeValidators: number;
  @ApiProperty({ description: 'Current max validator index', example: 1000 })
  maxIndex: number;
}

class Rewards implements RewardsInterface {
  @ApiProperty({
    type: String,
    description: 'Execution layer rewards (in ETH 18 decimals)',
    example: '17692504000000000',
  })
  el;
  @ApiProperty({
    type: String,
    description: 'Consensus layer rewards (in ETH 18 decimals)',
    example: '315082000000000',
  })
  cl;
}

export class ValidatorPerformance implements ValidatorPerformanceInterface {
  @ApiProperty({ description: 'Consensus layer rewards', example: 1000 })
  index: number;
  @ApiProperty({
    type: String,
    description: 'Consensus layer rewards',
    example: '32013292120000000000',
  })
  balance /*: BigNumber;*/;
  @ApiProperty({ description: 'One day rewards', type: Rewards })
  earnt1D: Rewards;
  @ApiProperty({ description: '7 day rewards' })
  earnt7D: Rewards;
  @ApiProperty({ description: '31 day rewards' })
  earnt31D: Rewards;
  @ApiProperty({ description: '365 day rewards' })
  earnt365D: Rewards;
  @ApiProperty({ description: 'Todays rewards' })
  earntToday: Rewards;
  @ApiProperty({ description: 'All rewards' })
  earntTotal: Rewards;
  @ApiProperty({ description: 'Consensus layer rewards', example: 1000 })
  rank7D: number;
}

export class RawBlockData implements RawBlockDataInterface {
  @ApiProperty({ description: 'Block timestamp' })
  timestamp: number;
  @ApiProperty({ description: 'Block reward (including MEV reward)' })
  blockReward: number;
  @ApiProperty({ description: 'Blocks MEV reward' })
  blockMevReward: number;
  @ApiProperty({
    description: 'Consensus information including proposerIndex',
    example: { proposerIndex: '1000' },
  })
  posConsensus: {
    proposerIndex: number;
  };
  @ApiProperty({
    description: 'Relay information',
    example: { tag: 'Epic Relay' },
  })
  relay: {
    tag: string;
  };
}

class Stats implements ValidatorStatsInterface {
  @ApiProperty({
    description:
      'Number of times validator has been slashed due to attestations',
  })
  attester_slashings: number;
  @ApiProperty({ description: 'Day number', example: 957 })
  day: number;
  @ApiProperty({ description: 'Timestamp of when the day ended' })
  day_end: string;
  @ApiProperty({ description: 'Timestamp of when the day started' })
  day_start: string;
  @ApiProperty({ description: 'Number of deposits' })
  deposits: number;
  @ApiProperty({ description: 'The deposit amount' })
  deposits_amount: number;
  @ApiProperty({ description: 'Validators balance at the end of the day' })
  end_balance: number;
  @ApiProperty({
    description: 'Validators effective balance at the end of the day',
  })
  end_effective_balance: number;
  // @ApiProperty({ description: 'Validator index' })
  // max_balance: number;
  // @ApiProperty({ description: 'Validator index' })
  // max_effective_balance: number;
  // @ApiProperty({ description: 'Validator index' })
  // min_balance: number;
  // @ApiProperty({ description: 'Validators min requierd balance at the end of the day' })
  // min_effective_balance: number;
  @ApiProperty({ description: 'Number of missed attestations' })
  missed_attestations: number;
  @ApiProperty({ description: 'Number of missed blocks' })
  missed_blocks: number;
  @ApiProperty({ description: 'Number of missed syncs' })
  missed_sync: number;
  @ApiProperty({ description: 'Number of orphaned attestations' })
  orphaned_attestations: number;
  @ApiProperty({ description: 'Number of orphaned blocks' })
  orphaned_blocks: number;
  @ApiProperty({ description: 'Number of orphaned syncs' })
  orphaned_sync: number;
  @ApiProperty({ description: 'Number of participated syncs' })
  participated_sync: number;
  @ApiProperty({ description: 'Number of proposed blocks' })
  proposed_blocks: number;
  @ApiProperty({
    description:
      'Number of times the validator has been slashed due to proposals',
  })
  proposer_slashings: number;
  @ApiProperty({ description: 'Validators balance at the start of the day' })
  start_balance: number;
  @ApiProperty({
    description: 'Validators effective balance at the start of the day',
  })
  start_effective_balance: number;
  @ApiProperty({ description: 'Validator index' })
  validatorindex: number;
  @ApiProperty({ description: 'Number of withdrawals in this day' })
  withdrawals: number;
  @ApiProperty({ description: 'Amount that was withdrawn' })
  withdrawals_amount: number;
}

export class ValidatorStats implements ValidatorInterface {
  @ApiProperty({ description: 'Validator index' })
  index: string;
  @ApiProperty({ description: 'Validator stats', isArray: true, type: Stats })
  stats;
}
