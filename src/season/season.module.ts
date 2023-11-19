import { Module } from '@nestjs/common';
import { SeasonService } from './season.service';
import { SeasonResolver } from './season.resolver';
import { SeasonRepository } from './season.repository';
import { SeriesModule } from '../series/series.module';
import { MediaBasicInfoModule } from '../media-basic-info/media-basic-info.module';
import { MediaImageModule } from '../media-image/media-image.module';

@Module({
  imports: [SeriesModule, MediaBasicInfoModule, MediaImageModule],
  providers: [SeasonResolver, SeasonService, SeasonRepository],
  exports: [SeasonService],
})
export class SeasonModule {}
