import { Global, Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ManagerModule } from '../manager/manager.module';
import { JwtManagerAuthGuard } from './guards/current-manager.jwt.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'jwtConstants.secret', // Make sure you use your actual secret here
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule,
    forwardRef(() => ManagerModule),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, JwtManagerAuthGuard],
  exports: [AuthService, JwtManagerAuthGuard],
})
export class AuthModule {}
