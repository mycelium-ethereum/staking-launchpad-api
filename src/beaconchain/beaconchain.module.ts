import { Module } from '@nestjs/common';
import { BeaconchainController } from './beaconchain.controller';
import { BeaconchainService } from './beaconchain.service';
import { DepositsService } from './deposits.service';
import { PerformanceService } from './performance.service';
import { ListCacheManager } from './listCacheManager.service';

@Module({
  controllers: [BeaconchainController],
  providers: [
    BeaconchainService,
    DepositsService,
    ListCacheManager,
    PerformanceService,
  ],
})
export class BeaconchainModule {}
