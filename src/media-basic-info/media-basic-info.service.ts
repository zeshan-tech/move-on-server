import { Injectable } from '@nestjs/common';
import { MediaBasicInfoInputDto } from './dto/media-basic-info.input.dto';
import { MediaBasicInfo } from './entities/media-basic-info.entity';
import { MovierMediaType } from '../common/types/Common.type';
import { Movie } from '../movie/entities/movie.entity';
import { Episode } from '../episode/entities/episode.entity';
import { Trailer } from '../trailer/entities/trailer.entity';
import { Season } from '../season/entities/season.entity';
import { Series } from '../series/entities/series.entity';
import { EntitySaveService } from '../adapter/save.service';
import { CommonOutputDto } from 'src/common/dto/common.dto';
import { MediaBasicInfoRepository } from './media-basic-info.repository';
import { MediaBasicInfoNotFoundException } from './media-basic-info.exceptions';

@Injectable()
export class MediaBasicInfoService {
  constructor(private readonly entitySaveService: EntitySaveService, private readonly mediaBasicInfoRepository: MediaBasicInfoRepository) {}

  async createMediaBasicInfo(
    input: MediaBasicInfoInputDto.CreateMediaBasicInfoInput,
    media: MovierMediaType,
    entitySaveService?: EntitySaveService,
  ): Promise<CommonOutputDto.SuccessOutput> {
    try {
      const mediaBasicInfo = new MediaBasicInfo();

      mediaBasicInfo.mediaTitle = input.MediaTitle;
      mediaBasicInfo.mediaPlotSummary = input.MediaPlotSummary;
      mediaBasicInfo.mediaReleaseDate = input.MediaReleaseDate;

      if (media instanceof Movie) mediaBasicInfo.movie = media;
      if (media instanceof Episode) mediaBasicInfo.episode = media;
      if (media instanceof Trailer) mediaBasicInfo.trailer = media;
      if (media instanceof Season) mediaBasicInfo.season = media;
      if (media instanceof Series) mediaBasicInfo.series = media;

      if (entitySaveService) {
        entitySaveService.push(mediaBasicInfo);
      } else {
        this.entitySaveService.save<MediaBasicInfo>(mediaBasicInfo);
      }

      return { isSuccess: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateMediaBasicInfo(
    mediaBasicInfoId: string,
    input: MediaBasicInfoInputDto.UpdateMediaBasicInfoInput,
    entitySaveService?: EntitySaveService,
  ): Promise<CommonOutputDto.SuccessOutput> {
    try {
      const mediaBasicInfo = await this.findMediaBasicInfoById(mediaBasicInfoId);

      if (input.MediaTitle) mediaBasicInfo.mediaTitle = input.MediaTitle;
      if (input.MediaPlotSummary) mediaBasicInfo.mediaPlotSummary = input.MediaPlotSummary;
      if (input.MediaReleaseDate) mediaBasicInfo.mediaReleaseDate = input.MediaReleaseDate;

      if (entitySaveService) {
        entitySaveService.push(mediaBasicInfo);
      } else {
        await this.entitySaveService.save<MediaBasicInfo>(mediaBasicInfo);
      }

      return { isSuccess: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findMediaBasicInfoById(id: string): Promise<MediaBasicInfo> {
    try {
      const mediaBasicInfo = await this.mediaBasicInfoRepository.findMediaBasicInfoById(id);
      if (!mediaBasicInfo) {
        throw new MediaBasicInfoNotFoundException();
      }

      return mediaBasicInfo;
    } catch (error) {
      throw new Error(error);
    }
  }
}
