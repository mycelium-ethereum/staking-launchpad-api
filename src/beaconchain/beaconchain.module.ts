import { Module } from '@nestjs/common';
import { BeaconchainController } from './beaconchain.controller';
import { BeaconchainService } from './beaconchain.service';
import { ValidatorsService } from './validators.service';
import { PerformanceService } from './performance.service';
import { ListCacheManager } from './listCacheManager.service';

@Module({
  controllers: [BeaconchainController],
  providers: [
    BeaconchainService,
    ValidatorsService,
    ListCacheManager,
    PerformanceService,
  ],
})
export class BeaconchainModule {}
