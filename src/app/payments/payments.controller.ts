import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags } from '@nestjs/swagger';
import { MidtransTrxNotification } from 'src/app/payments/vendors/midtrans.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('notification')
  notification(@Body() payload: MidtransTrxNotification) {
    return this.paymentsService.notification(payload);
  }
}
