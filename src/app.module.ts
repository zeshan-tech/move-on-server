import { Module, forwardRef } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule, makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { AuthModule } from './auth/auth.module';
import { SeriesModule } from './series/series.module';
import { SeasonModule } from './season/season.module';
import { EpisodeModule } from './episode/episode.module';
import { MediaModule } from './media/media.module';
import { ManagerModule } from './manager/manager.module';
import { ProfileInfoModule } from './profile-info/profile-info.module';
import { UserActivityModule } from './user-activity/user-activity.module';
import { ManagerActivityModule } from './manager-activity/manager-activity.module';
import { MediaInfoModule } from './media-info/media-info.module';
import { CrewModule } from './crew/crew.module';
import { CineastModule } from './cineast/cineast.module';
import { CastModule } from './cast/cast.module';
import { MovieCrewModule } from './movie-crew/movie-crew.module';
import { MovieCastModule } from './movie-cast/movie-cast.module';
import { SeriesCastModule } from './series-cast/series-cast.module';
import { SeriesCrewModule } from './series-crew/series-crew.module';
import { MediaImageModule } from './media-image/media-image.module';
import { ExternalLinkModule } from './external-link/external-link.module';
import { ReviewModule } from './review/review.module';
import { AwsModule } from './aws/aws.module';
import { VideoModule } from './video/video.module';
import { ErrorLogModule } from './error-log/error-log.module';
import { CallerModule } from './caller/caller.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    // PrometheusModule.register({
    //   path: 'http://localhost:8080/metrics',
    // }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      // playground: false,
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          name: 'default',
          type: configService.get<string>('DB_TYPE') as 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          charset: configService.get<string>('DB_CHARSET'),
          entities: [`dist/**/entities/*.js`],
          synchronize: false,
          logging: true,
          migrations: [`dist/**/migrations/*.js`],
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MovieModule,
    UserModule,
    AuthModule,
    SeriesModule,
    SeasonModule,
    EpisodeModule,
    MediaModule,
    ManagerModule,
    ProfileInfoModule,
    UserActivityModule,
    ManagerActivityModule,
    MediaInfoModule,
    CrewModule,
    CineastModule,
    CastModule,
    MovieCrewModule,
    MovieCastModule,
    SeriesCastModule,
    SeriesCrewModule,
    MediaImageModule,
    ExternalLinkModule,
    ReviewModule,
    AwsModule,
    VideoModule,
    ErrorLogModule,
    CallerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
