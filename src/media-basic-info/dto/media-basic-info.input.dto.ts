/* eslint-disable @typescript-eslint/no-namespace */

import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsUUID, MinLength } from 'class-validator';

export namespace MediaBasicInfoInputDto {
  @InputType()
  export class CreateMediaBasicInfoInput {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    Title: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    @MinLength(15)
    PlotSummary: string;

    @Field(() => Number)
    @IsNotEmpty()
    @IsNumber()
    ReleaseDate: number;
  }

  @InputType()
  export class UpdateMediaBasicInfoInput extends PartialType(CreateMediaBasicInfoInput) {}

  @InputType()
  export class UpdateMediaBasicInfoParams {
    @Field(() => String)
    @IsNotEmpty()
    @IsUUID()
    ID: string;
  }

  @InputType()
  export class GetMediaBasicInfoByMediaIdParams {
    @Field(() => String)
    @IsNotEmpty()
    @IsUUID()
    MediaId: string;
  }
}
