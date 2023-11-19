import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { JwtModule } from '@nestjs/jwt';
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { Media } from './entities/media.entity';
import { getFileExtension } from 'src/common/utils/file';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: multer.diskStorage({
          destination: configService.get('MULTER_DEST'),
          filename(_, file, cb) {
            const fileExtension = getFileExtension(file.originalname);
            const newFilename = `${uuidv4()}.${fileExtension}`;
            cb(null, newFilename);
          },
        }),
      }),
    }),
    JwtModule,
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
