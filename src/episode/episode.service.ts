import { Injectable } from '@nestjs/common';
import { VideoService } from '../video/video.service';
import { Episode } from './entities/episode.entity';
import { EpisodeInputDto } from './dto/episode.input.dto';
import { Transactional } from 'typeorm-transactional';
import { CommonOutputDto } from '../common/dto/common.dto';
import { MediaBasicInfoService } from '../media-basic-info/media-basic-info.service';
import { MediaResourceService } from '../media-resource/media-resource.service';
import { EntitySaveService } from '../adapter/save.service';
import { MediaImageService } from '../media-image/media-image.service';
import { SeasonService } from '../season/season.service';

@Injectable()
export class EpisodeService {
  constructor(
    private readonly videoService: VideoService,
    private readonly mediaBasicInfoService: MediaBasicInfoService,
    private readonly seasonService: SeasonService,
    private readonly mediaResourceService: MediaResourceService,
    private readonly entitySaveService: EntitySaveService,
    private readonly mediaImageService: MediaImageService,
  ) {}

  @Transactional()
  async createEpisode(input: EpisodeInputDto.CreateEpisodeInput): Promise<CommonOutputDto.SuccessOutput> {
    try {
      const episode = new Episode();

      const video = await this.videoService.assignVideoToMedia(input.VideoId, episode, this.entitySaveService);
      const mediaImage = await this.mediaImageService.assignMediaImageToMedia(input.MediaImageId, episode, this.entitySaveService);
      const season = await this.seasonService.assignEpisodeToSeason(input.SeasonId, episode, this.entitySaveService);

      const mediaResource = await this.mediaResourceService.createMediaResource({ SignedUrlKeyId: input.SignedUrlKeyId }, episode, this.entitySaveService);
      const mediaBasicInfo = await this.mediaBasicInfoService.createMediaBasicInfo(input.MediaBasicInfo, episode, this.entitySaveService);

      episode.video = video;
      episode.season = season;
      episode.mediaImage = [mediaImage];
      episode.episodeNo = input.EpisodeNo;
      episode.mediaResource = mediaResource;
      episode.mediaBasicInfo = mediaBasicInfo;

      this.entitySaveService.push(episode);
      await this.entitySaveService.save();

      return { isSuccess: true };
    } catch (error) {
      throw new Error(error);
    }
  }
}
