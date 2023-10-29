import { ObjectType, Field } from '@nestjs/graphql';
import { EntityBase } from '@/base/entity.base';
import { Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Episode } from '@/episode/entities/episode.entity';
import { Series } from '@/series/entities/series.entity';
import { Media } from '@/media/entities/media.entity';
import { IntColumn, JoinColumn } from '@/decorator/entity/entity.decorator';
import { MediaImage } from '@/media-image/entities/media-image.entity';
import { MediaBasicInfo } from '@/media-basic-info/entities/media-basic-info.entity';
import { Video } from '../../video/entities/video.entity';

@ObjectType()
@Entity({ name: 'season' })
export class Season extends EntityBase {
  @Field()
  @IntColumn({ name: 'season_no' })
  seasonNo: number;

  @Field(() => Series)
  @ManyToOne(() => Series, (series) => series.season)
  @JoinColumn({ name: 'series_id' })
  series: Series;

  @Field(() => MediaBasicInfo)
  @OneToOne(() => MediaBasicInfo, (mediaBasicInfo) => mediaBasicInfo.season)
  mediaBasicInfo: MediaBasicInfo;

  @Field(() => Video)
  @OneToOne(() => Video, (video) => video.season)
  video: Video;

  @Field(() => Media)
  @OneToMany(() => Media, (media) => media.season)
  media: Media[];

  @Field(() => MediaImage)
  @OneToMany(() => MediaImage, (mediaImage) => mediaImage.season)
  mediaImage: MediaImage[];

  @Field(() => Episode)
  @OneToMany(() => Episode, (episode) => episode.season)
  episode: Episode[];
}
