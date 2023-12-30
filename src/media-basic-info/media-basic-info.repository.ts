import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { MediaBasicInfo } from './entities/media-basic-info.entity';
import { Repository } from '../base/RepositoryBase';

@Injectable()
export class MediaBasicInfoRepository extends Repository<MediaBasicInfo> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(MediaBasicInfo, entityManager);
  }

  public async findMediaBasicInfoById(ID: string): Promise<MediaBasicInfo> {
    return await this.findOneBy({ ID });
  }

  public findMediaBasicInfoByMediaId(mediaId: string): SelectQueryBuilder<MediaBasicInfo> {
    return this.createQueryBuilder('mediaBasicInfo').where('movie = :mediaId OR series = :mediaId OR season = :mediaId OR trailer = :mediaId OR episode = :mediaId', { mediaId });
  }
}
