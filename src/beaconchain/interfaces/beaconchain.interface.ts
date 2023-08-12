export interface ValidatorInfo {
  pubKey: string;
  index: string;
  name: string;
  status: BeaconChainStatus;
  depositTime: number;
}

export interface ValidatorIndexPubKey {
  pubKey: string;
  index: number;
}

export interface Validator {
  index: string;
  stats: ValidatorStats[];
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
  maxIndex: number;
}

export type BeaconChainStatus =
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

export interface ValidatorStats {
  attester_slashings: number;
  day: number;
  day_end: string;
  day_start: string;
  deposits: number;
  deposits_amount: number;
  end_balance: number;
  end_effective_balance: number;
  // max_balance: number;
  // max_effective_balance: number;
  // min_balance: number;
  // min_effective_balance: number;
  missed_attestations: number;
  missed_blocks: number;
  missed_sync: number;
  orphaned_attestations: number;
  orphaned_blocks: number;
  orphaned_sync: number;
  participated_sync: number;
  proposed_blocks: number;
  proposer_slashings: number;
  start_balance: number;
  start_effective_balance: number;
  validatorindex: number;
  withdrawals: number;
  withdrawals_amount: number;
}

export interface RawValidatorIndexPubKey {
  publickey: string;
  valid_signature: boolean;
  validatorindex: number;
}
