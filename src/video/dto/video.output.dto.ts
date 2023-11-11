/* eslint-disable @typescript-eslint/no-namespace */
import { Field, ObjectType } from '@nestjs/graphql';

export namespace VideoOutputDto {
  @ObjectType()
  export class UploadVideoSignedUrlOutput {
    @Field(() => String)
    signedUrl: string;

    @Field(() => String)
    videoId: string;

    @Field(() => String)
    signedUrlKeyId: string;
  }
}
