import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from '../roles/roles.module';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MidtransService } from 'src/app/payments/vendors/midtrans.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), JwtModule, RolesModule],
  controllers: [OrdersController],
  providers: [OrdersService, MidtransService],
  exports: [OrdersService],
})
export class OrdersModule {}
