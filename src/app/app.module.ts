import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from 'nestjs-firebase';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Interceptors
import { ResponseInterceptor } from '../core/interceptors/response.interceptor';
import { ErrorInterceptor } from '../core/interceptors/error.interceptor';

// Modules
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { MediaModule } from './media/media.module';
import { SharedModule } from './shared/shared.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RolesModule } from './roles/roles.module';

// Entities
import { User } from './users/entities/user.entity';
import { Order } from './orders/entities/order.entity';
import { Product } from './products/entities/product.entity';
import { Category } from './categories/entities/category.entity';
import { Media } from './media/entities/media.entity';
import { Role } from './roles/entities/role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule.forRoot({
      googleApplicationCredential: 'google-service-account.json',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Product, Category, Order, Media, Role],
        synchronize: true, // TODO: Turn off in production
        // logging: true,
      }),
    }),
    AuthModule,
    UsersModule,
    OrdersModule,
    PaymentsModule,
    ProductsModule,
    CategoriesModule,
    MediaModule,
    SharedModule,
    NotificationsModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
