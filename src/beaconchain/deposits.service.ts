import { Injectable } from '@nestjs/common';
import { BEACON_CHAIN_API } from './common';

@Injectable()
export class DepositsService {
  // Mapping from validator index to deposit timestamp
  private deposits: Record<string, number> = {};

  async syncDeposits(
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
}
