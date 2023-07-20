import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeaconchainModule } from './beaconchain';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    BeaconchainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
