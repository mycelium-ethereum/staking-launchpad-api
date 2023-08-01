import { Controller, Get, Req, Param } from '@nestjs/common';
import { Request } from 'express';
import { BeaconchainService } from './beaconchain.service';
import {
  Validator,
  ValidatorInfo,
  WaitTimes,
  ValidatorIndexPubKey,
} from './interfaces/beaconchain.interface';
import { RawBlockData } from './interfaces/performance.interface';

@Controller('validators')
export class BeaconchainController {
  constructor(private beaconchainService: BeaconchainService) {}

  @Get('stats/:validators')
  getValidatorsStats(
    @Param('validators') validators: string,
  ): Promise<Validator[]> {
    return this.beaconchainService.getValidatorsStats(validators);
  }

  @Get('info/:validators')
  getValidatorsInfo(
    @Param('validators') validators: string,
  ): Promise<ValidatorInfo[]> {
    return this.beaconchainService.getValidatorsInfo(validators);
  }

  @Get('performance/:validators')
  getValidatorsPerformance(
    @Param('validators') validators: string,
  ): Promise<ValidatorInfo[]> {
    return this.beaconchainService.getValidatorsPerformance(validators);
  }
  @Get('blocks/:validators')
  getValidatorsBlocks(
    @Param('validators') validators: string,
  ): Promise<Record<string, RawBlockData[]>> {
    return this.beaconchainService.getValidatorsBlocks(validators);
  }

  @Get('user/:account')
  getUsersValidators(
    @Param('account') account: string,
  ): Promise<ValidatorIndexPubKey[]> {
    return this.beaconchainService.getUsersValidators(account);
  }

  @Get('queue_info')
  getEstimatedWaitTimes(): Promise<WaitTimes> {
    return this.beaconchainService.getEstimatedWaitTimes();
  }
}
