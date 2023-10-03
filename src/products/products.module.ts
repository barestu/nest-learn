import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { getFileExtension } from 'src/common/utils/file';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
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
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
