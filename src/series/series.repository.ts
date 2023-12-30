import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Series } from './entities/series.entity';
import { Repository } from '../base/RepositoryBase';

@Injectable()
export class SeriesRepository extends Repository<Series> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(Series, entityManager);
  }

  findSeriesById(ID: string): Promise<Series> {
    return this.findOneBy({ ID });
  }

  findSeriesByManagerId(managerId: string): SelectQueryBuilder<Series> {
    return this.createQueryBuilder('series')
      .leftJoinAndSelect('series.mediaBasicInfo', 'mediaBasicInfo')
      .leftJoinAndSelect('series.mediaImage', 'mediaImage')
      .where('series.manager = :managerId', { managerId });
  }

  getManagerSeriesForTable(pageSize: number, page: number, managerId: string): SelectQueryBuilder<Series> {
    return this.createQueryBuilder('series')
      .leftJoinAndSelect('series.mediaBasicInfo', 'mediaBasicInfo')
      .leftJoinAndSelect('series.mediaAdditionalInfo', 'mediaAdditionalInfo')
      .leftJoinAndSelect('series.mediaImage', 'mediaImage')
      .where('series.manager = :managerId', { managerId })
      .take(pageSize)
      .skip(page * pageSize)
      .select([
        'series.ID',
        'mediaAdditionalInfo.mediaOriginCountry',
        'mediaAdditionalInfo.mediaOriginalLanguage',
        'mediaAdditionalInfo.mediaGenre',
        'mediaAdditionalInfo.mediaStatus',
        'mediaBasicInfo.mediaTitle',
        'mediaBasicInfo.mediaPlotSummary',
        'mediaBasicInfo.mediaReleaseDate',
        'mediaImage.mediaImageUrl',
        'series.createdAt',
        'series.updatedAt',
      ]);
  }

  public async deleteSeriesById(ID: string): Promise<void> {
    await this.delete({ ID });
  }
}
