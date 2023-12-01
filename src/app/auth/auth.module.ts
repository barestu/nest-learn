import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/app/users/users.module';
import { SharedModule } from 'src/app/shared/shared.module';

@Module({
  imports: [JwtModule, UsersModule, SharedModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
