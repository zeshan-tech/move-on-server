import { Module } from '@nestjs/common';
import { TrailerService } from './trailer.service';
import { TrailerResolver } from './trailer.resolver';
import { VideoModule } from '../video/video.module';
import { MediaBasicInfoModule } from '../media-basic-info/media-basic-info.module';
import { ManagerModule } from '../manager/manager.module';
import { MediaResourceModule } from '../media-resource/media-resource.module';
import { MediaImageModule } from '../media-image/media-image.module';
import { TrailerRepository } from './trailer.repository';
import { MovieModule } from '../movie/movie.module';
import { SeriesModule } from '../series/series.module';
import { SeasonModule } from '../season/season.module';

@Module({
  imports: [VideoModule, MediaBasicInfoModule, ManagerModule, MediaResourceModule, MediaImageModule, MovieModule, SeriesModule, SeasonModule],
  providers: [TrailerResolver, TrailerService, TrailerRepository],
})
export class TrailerModule {}
