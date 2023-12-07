import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from 'nestjs-firebase';

import { dataSourceOptions } from 'db/data-source';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule.forRoot({
      googleApplicationCredential: 'google-service-account.json',
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      logging: true,
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
