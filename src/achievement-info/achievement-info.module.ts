import { Module } from '@nestjs/common';
import { AchievementInfoService } from './achievement-info.service';
import { AchievementInfoResolver } from './achievement-info.resolver';

@Module({
  providers: [AchievementInfoResolver, AchievementInfoService],
  exports: [AchievementInfoService],
})
export class AchievementInfoModule {}
