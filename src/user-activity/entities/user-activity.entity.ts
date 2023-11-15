import { ObjectType, Field } from '@nestjs/graphql';
import { ActionsEnum } from '../enum/user-activity.enum';
import { EnumColumn, JoinColumn, UuidColumn } from '@/decorator/entity/entity.decorator';
import { Entity, ManyToOne } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { ActivityStatusEnum } from '@/common/enum/common.enum';
import { EntityBase } from '@/base/entity.base';

@ObjectType()
@Entity()
export class UserActivity extends EntityBase {
  @Field()
  @EnumColumn({ enum: ActionsEnum })
  userActivityAction: ActionsEnum;

  @Field()
  @EnumColumn({ enum: ActivityStatusEnum })
  userActivityStatus: ActivityStatusEnum;

  @Field()
  @UuidColumn()
  userActivityContentId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.userActivity)
  @JoinColumn()
  user: User;
}
