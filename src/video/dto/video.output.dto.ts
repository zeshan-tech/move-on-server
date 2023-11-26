/* eslint-disable @typescript-eslint/no-namespace */
import { Field, ObjectType } from '@nestjs/graphql';

export namespace VideoOutputDto {
  @ObjectType()
  export class UploadVideoSignedUrlOutput {
    @Field(() => String)
    SignedUrl: string;

    @Field(() => String)
    VideoId: string;

    @Field(() => String)
    SignedUrlKeyId: string;
  }
}
