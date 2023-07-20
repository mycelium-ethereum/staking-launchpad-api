import { Controller, Get, Req, Param } from '@nestjs/common';
import { Request } from 'express';
import { BeaconchainService } from './beaconchain.service';
import {
  Validator,
  ValidatorInfo,
  WaitTimes,
} from './interfaces/beaconchain.interface';

@Controller('validators')
export class BeaconchainController {
  constructor(private beaconchainService: BeaconchainService) {}

  @Get('stats/:validators')
  getAllValidators(
    @Param('validators') validators: string,
  ): Promise<Validator[]> {
    return this.beaconchainService.getAllValidators(validators);
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

  @Get('queue_info')
  getEstimatedWaitTimes(): Promise<WaitTimes> {
    return this.beaconchainService.getEstimatedWaitTimes();
  }
}
