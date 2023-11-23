import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/app/orders/orders.module';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MidtransService } from './vendors/midtrans.service';

@Module({
  imports: [OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, MidtransService],
  exports: [MidtransService],
})
export class PaymentsModule {}
