import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, OneToOne } from 'typeorm';
import { Manager } from '@/manager/entities/manager.entity';
import { EntityBase } from '@/base/EntityBase';
import { User } from '@/user/entities/user.entity';
import { EnumColumn, IntColumn, JoinColumn, TextColumn, VarcharColumn } from '@/decorator/entity/entity.decorator';
import { GenderEnum } from '@/common/enum/common.enum';

@ObjectType()
@Entity()
export class ProfileInfo extends EntityBase {
  @Field()
  @VarcharColumn()
  participantFirstName: string;

  @Field()
  @VarcharColumn()
  participantLastName: string;

  @Field()
  @VarcharColumn()
  participantContactNumber: string;

  @Field()
  @IntColumn()
  participantDOB: number;

  @Field()
  @EnumColumn({ enum: GenderEnum })
  participantGender: GenderEnum;

  // if user is not entered then we get it from (API by IP)
  @Field()
  @TextColumn()
  participantAddress: string;

  // JOIN COLUMNS //

  @Field(() => Manager)
  @OneToOne(() => Manager, (manager) => manager.profileInfo, { nullable: true })
  @JoinColumn()
  manager: Manager;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.profileInfo, { nullable: true })
  @JoinColumn()
  user: User;
}
