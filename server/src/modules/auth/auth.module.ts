import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AuthGuard } from '@app/modules/auth/auth.guard'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
