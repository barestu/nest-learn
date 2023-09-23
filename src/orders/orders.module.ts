import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MidtransService } from 'src/payments/vendors/midtrans.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), JwtModule],
  controllers: [OrdersController],
  providers: [OrdersService, MidtransService],
  exports: [OrdersService],
})
export class OrdersModule {}
