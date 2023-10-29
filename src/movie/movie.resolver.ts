import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MovieService } from './movie.service';
import { Movie } from './entities/movie.entity';
import { CommonOutputDto } from '../common/dto/common.dto';
import { MovieInputDto } from './dto/movie.input.dto';
import { MovieOutputDto } from './dto/movie.output.dto';
import { JwtManagerAuthGuard } from '../auth/guards/current-manager.jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/guards/current-user.jwt.guard';

@Resolver(() => Movie)
@UseGuards(JwtManagerAuthGuard)
export class MovieResolver {
  constructor(private readonly movieService: MovieService) {}

  /*  @Mutation(() => CommonOutputDto.SuccessOutput)
  async userRegister(@Args('UserRegisterInput') input: MovieInputDto.MovieBasicInfoCreateInput): Promise<CommonOutputDto.AuthTokenOutput> {
    const user = await this.userService.userRegister(input);
    const token = this.authService.signToken(user);
    return { token };
  } */

  @Mutation(() => MovieOutputDto.GetS3UploadVdeoUrlOutput)
  async createMovie(
    @Args('CreateMovieInput')
    input: MovieInputDto.CreateMovieInput,
    @CurrentUser() manager: CurrentManagerType,
  ): Promise<Movie> {
    try {
      return this.movieService.createMovie(input, manager);
    } catch (error) {
      return error;
    }
  }
}
