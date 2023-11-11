import { Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { AwsS3Service } from '../aws/aws-s3/aws-s3.service';
import { VideoInputDto } from './dto/video.input.dto';
import { VideoOutputDto } from './dto/video.output.dto';
import { Video } from './entities/video.entity';
import { handleOnGetVideoQualityBySize } from './utils/getVideoQualityBySize';
import { Transactional } from 'typeorm-transactional';
import { MovierMediaType } from '../common/types/Common.type';
import { VideoRepository } from './video.repository';
import { Movie } from '../movie/entities/movie.entity';
import { Episode } from '../episode/entities/episode.entity';
import { Trailer } from '../trailer/entities/trailer.entity';

@Injectable()
export class VideoService {
  constructor(private readonly awsS3Service: AwsS3Service, private readonly videoRepository: VideoRepository) {}

  async getUploadVideoSignedUrl(input: VideoInputDto.GetUploadVideoSignedUrlInput, currentManager: CurrentManagerType): Promise<VideoOutputDto.UploadVideoSignedUrlOutput> {
    if (input.IsShort) {
      throw new MethodNotAllowedException('Shorts feature is currently unavailable');
    }

    const signedUrl = await this.awsS3Service.generateVideoUploadUrl(input.Mime, currentManager, input.Type);
    const video = await this.createVideoInfo(input, currentManager);

    return { ...signedUrl, videoId: video.ID };
  }

  @Transactional()
  async createVideoInfo(input: VideoInputDto.GetUploadVideoSignedUrlInput, currentManager: CurrentManagerType): Promise<Video> {
    try {
      const video = new Video();

      video.videoHeight = input.Height;
      video.videoWidth = input.Width;
      video.videoMime = input.Mime;
      video.videoSizeInKb = input.SizeInKb;
      video.videoRunTime = input.RunTime;
      video.managerId = currentManager.ID;
      video.videoQuality = handleOnGetVideoQualityBySize(input.Width, input.Height);

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

      if (!video) {
        throw new NotFoundException('Invalid Video specified');
      }

      if (media instanceof Movie) video.movie = media;
      if (media instanceof Episode) video.episode = media;
      if (media instanceof Trailer) video.trailer = media;

      await media.save();
      await this.videoRepository.update(1, video);

      return video;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findVideoById(videoId: string): Promise<Video> {
    try {
      return this.videoRepository.findVideoById(videoId);
    } catch (error) {
      throw new Error(error);
    }
  }
}
