import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from '../roles/roles.module';
import { OrdersModule } from '../orders/orders.module';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MidtransService } from './vendors/midtrans.service';

@Module({
  imports: [JwtModule, OrdersModule, RolesModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, MidtransService],
  exports: [MidtransService],
})
export class PaymentsModule {}
