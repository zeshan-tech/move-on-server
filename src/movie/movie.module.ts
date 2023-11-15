import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieResolver } from './movie.resolver';
import { VideoModule } from '../video/video.module';
import { ManagerModule } from '../manager/manager.module';
import { MediaBasicInfoModule } from '../media-basic-info/media-basic-info.module';
import { MediaAdditionalInfoModule } from '../media-additional-info/media-additional-info.module';
import { AchievementInfoModule } from '../achievement-info/achievement-info.module';
import { RadisModule } from '../radis/radis.module';
import { AwsModule } from '../aws/aws.module';
import { MediaResourceModule } from '../media-resource/media-resource.module';

@Module({
  imports: [VideoModule, ManagerModule, MediaBasicInfoModule, MediaAdditionalInfoModule, AchievementInfoModule, RadisModule, AwsModule, MediaResourceModule],
  providers: [MovieResolver, MovieService],
})
export class MovieModule {}
