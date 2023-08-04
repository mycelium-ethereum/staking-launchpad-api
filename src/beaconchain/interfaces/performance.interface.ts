import { BigNumber } from '@ethersproject/bignumber';

type Rewards = {
  el: BigNumber;
  cl: BigNumber;
};

export interface ValidatorPerformance {
  index: number;
  balance: BigNumber;
  earnt1D: Rewards;
  earnt31D: Rewards;
  earnt7D: Rewards;
  earnt365D: Rewards;
  earntToday: Rewards;
  earntTotal: Rewards;
  rank7D: number;
}

export interface CLPerformanceData {
  balance: number;
  performance1d: number;
  performance31d: number;
  performance365d: number;
  performance7d: number;
  performancetoday: number;
  performancetotal: number;
  rank7d: number;
  validatorindex: number;
}

export interface CLPerformance {
  index: number;
  balance: BigNumber;
  earnt1D: BigNumber;
  earnt31D: BigNumber;
  earnt7D: BigNumber;
  earnt365D: BigNumber;
  earntToday: BigNumber;
  earntTotal: BigNumber;
  rank7D: number;
}

export interface RawBlockData {
  timestamp: number;
  blockReward: number;
  blockMevReward: number;
  posConsensus: {
    proposerIndex: number;
    // "executionBlockNumber": 17520426,
    // "slot": 6702853,
    // "epoch": 209464,
    // "finalized": true
  };
  relay: {
    tag: string;
    // "builderPubkey": "0xb26f96664274e15fb6fcda862302e47de7e0e2a6687f8349327a9846043e42596ec44af676126e2cacbdd181f548e681",
    // "producerFeeRecipient": "0x8306300ffd616049fd7e4b0354a64da835c1a81c"
  };
  // "blockHash": "0x3f252c1f9189162ce7a0eca5986e0663fde446b6ee8f959ac8f5a50261906edc",
  // "blockNumber": 17520426,
  // "producerReward": 36560709165250310,
  // "feeRecipient": "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
  // "gasLimit": 30000000,
  // "gasUsed": 29993850,
  // "baseFee": 13934507525,
  // "txCount": 138,
  // "internalTxCount": 35,
  // "uncleCount": 0,
  // "parentHash": "0xb21c241ff2d1b0f0e94ed46e86477f795f765d53edaf937a092ecab870b6f5af",
  // "uncleHash": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
  // "difficulty": 0,
  // "consensusAlgorithm": "pos"
}

export interface ProducedBlocks {}

export interface ELPerformanceData {
  performance1d: number;
  performance31d: number;
  performance7d: number;
  validatorindex: number;
}

export interface ELPerformance {
  index: number;
  performance1D: BigNumber;
  performance31D: BigNumber;
  performance7D: BigNumber;
}
