import { Controller, Get, Req, Param } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BeaconchainService } from './beaconchain.service';
import {
  ValidatorInfo,
  ValidatorIndexPubKey,
  WaitTimes,
  ValidatorPerformance,
  RawBlockData,
  ValidatorStats,
} from './beaconchain.schema';

@ApiTags('validators')
@Controller('validators')
export class BeaconchainController {
  constructor(private beaconchainService: BeaconchainService) {}

  @ApiOperation({
    summary:
      'Returns daily stats of a given list of comma seperated validators.',
  })
  @ApiOkResponse({
    type: ValidatorStats,
    isArray: true,
  })
  @Get('stats/:validators')
  getValidatorsStats(
    @Param('validators') validators: string,
  ): Promise<ValidatorStats[]> {
    return this.beaconchainService.getValidatorsStats(validators);
  }

  @ApiOperation({
    summary:
      'Returns information of a given list of comma seperated validators.',
  })
  @ApiOkResponse({
    type: ValidatorInfo,
    isArray: true,
  })
  @Get('info/:validators')
  getValidatorsInfo(
    @Param('validators') validators: string,
  ): Promise<ValidatorInfo[]> {
    return this.beaconchainService.getValidatorsInfo(validators);
  }

  @ApiOperation({
    summary:
      'Returns the performance of a given list of comma seperated validators.',
  })
  @ApiOkResponse({
    type: ValidatorPerformance,
  })
  @Get('performance/:validators')
  getValidatorsPerformance(
    @Param('validators') validators: string,
  ): Promise<Record<string, ValidatorPerformance>> {
    return this.beaconchainService.getValidatorsPerformance(validators);
  }

  @ApiOperation({
    summary:
      'Returns a list produced blocks by a given list of comma seperated validators. Object return is in the form Record<VALIDATOR_INDEX, RawBlockData[]>',
  })
  @ApiOkResponse({
    type: RawBlockData,
  })
  @Get('blocks/:validators')
  getValidatorsBlocks(
    @Param('validators') validators: string,
  ): Promise<Record<string, RawBlockData[]>> {
    return this.beaconchainService.getValidatorsBlocks(validators);
  }

  @ApiOperation({ summary: 'Returns a list of users validators.' })
  @Get('user/:account')
  @ApiOkResponse({
    type: ValidatorIndexPubKey,
    isArray: true,
  })
  getUsersValidators(
    @Param('account') account: string,
  ): Promise<ValidatorIndexPubKey[]> {
    return this.beaconchainService.getUsersValidators(account);
  }

  @ApiOperation({
    summary:
      'Returns the estimated wait times for entering and exiting validators.',
  })
  @ApiOkResponse({
    type: WaitTimes,
    isArray: true,
  })
  @Get('queue_info')
  getEstimatedWaitTimes(): Promise<WaitTimes> {
    return this.beaconchainService.getEstimatedWaitTimes();
  }
}
