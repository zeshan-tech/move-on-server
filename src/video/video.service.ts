import { Injectable, NotFoundException } from '@nestjs/common';
import { AwsS3Service } from '../aws/aws-s3/aws-s3.service';
import { VideoInputDto } from './dto/video.input.dto';
import { VideoOutputDto } from './dto/video.output.dto';
import { Video } from './entities/video.entity';
import { handleOnGetVideoQualityBySize } from './utils/getVideoQualityBySize';
import { Transactional } from 'typeorm-transactional';
import { MovierMediaType } from '../common/types/Common.type';
import { VideoRepository } from './video.repository';
import { Movie } from '../movie/entities/movie.entity';
import { Series } from '../series/entities/series.entity';
import { Season } from '../season/entities/season.entity';
import { Episode } from '../episode/entities/episode.entity';

@Injectable()
export class VideoService {
  constructor(private readonly awsS3Service: AwsS3Service, private readonly videoRepository: VideoRepository) {}

  async getS3UploadVideoUrl(
    input: VideoInputDto.GetS3UploadVdeoUrlInput,
    currentManager?: CurrentManagerType,
  ): Promise<VideoOutputDto.GetS3UploadVdeoUrlOutput> {
    const signedUrl = await this.awsS3Service.generateMovieUploadUrl(input.mime, input.mime, currentManager);
    const videoInfo = await this.createVideoInfo(input, currentManager);

    return { url: signedUrl, videoInfoId: videoInfo.ID };
  }

  @Transactional()
  async createVideoInfo(input: VideoInputDto.GetS3UploadVdeoUrlInput, currentManager: CurrentManagerType): Promise<Video> {
    try {
      const video = new Video();

      video.height = input.height;
      video.width = input.width;
      video.mime = input.mime;
      video.sizeInKb = input.sizeInKb;
      video.quality = handleOnGetVideoQualityBySize(input.width, input.height);
      video.runTime = input.runTime;
      video.managerId = currentManager.ID;

      await video.save();

      return video;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Transactional()
  async assignVideoToMedia(videoId: string, media: MovierMediaType): Promise<Video> {
    try {
      const video = await this.findVideoById(videoId);
      if (!video) throw new NotFoundException('Invalid Video specified');

      if (media instanceof Movie) video.movie = media;
      if (media instanceof Series) video.series = media;
      if (media instanceof Season) video.season = media;
      if (media instanceof Episode) video.episode = media;
      // video.

      // this.videoRepository.manager.update(video);

      return video;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Transactional()
  async findVideoById(videoId: string): Promise<Video> {
    try {
      return this.videoRepository.findVideoById(videoId);
    } catch (error) {
      throw new Error(error);
    }
  }
}
