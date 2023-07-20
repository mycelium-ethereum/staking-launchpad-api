type BeaconChainStatus =
  | 'pending'
  | 'active_online'
  | 'active_offline'
  | 'slashing_online'
  | 'slashing_offline'
  | 'slashed'
  | 'exiting_online'
  | 'exiting_offline'
  | 'exited'
  | 'deposited';

interface ValidatorStats {
  // "attester_slashings": 0,
  // "day": 957,
  // "day_end": "2023-07-17T12:00:23Z",
  // "day_start": "2023-07-16T12:00:23Z",
  // "deposits": 0,
  // "deposits_amount": 0,
  // "end_balance": 32005411136,
  // "end_effective_balance": 32000000000,
  // "max_balance": 32005411136,
  // "max_effective_balance": 32005411136,
  // "min_balance": 32002813333,
  // "min_effective_balance": 32000000000,
  // "missed_attestations": 0,
  // "missed_blocks": 0,
  // "missed_sync": 0,
  // "orphaned_attestations": 0,
  // "orphaned_blocks": 0,
  // "orphaned_sync": 0,
  // "participated_sync": 0,
  // "proposed_blocks": 0,
  // "proposer_slashings": 0,
  // "start_balance": 32002813333,
  // "start_effective_balance": 32000000000,
  // "validatorindex": 555555,
  // "withdrawals": 0,
  // "withdrawals_amount": 0
}

export interface Validator {
  index: string;
  stats: ValidatorStats[];
}

export interface ValidatorInfo {
  pubKey: string;
  index: string;
  name: string;
  status: BeaconChainStatus;
  depositTime: number;
}

export interface WaitTimes {
  entryTimes: {
    entryWaitingTime: string;
    entryWaitingTimeSeconds: number;
  };
  exitTimes: {
    exitWaitingTime: string;
    exitWaitingTimeSeconds: number;
  };
  activeValidators: number;
}
