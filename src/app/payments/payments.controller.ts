import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AclGuard } from '../roles/guards/acl.guard';
import { PaymentsService } from './payments.service';
import { MidtransTrxNotification } from './vendors/midtrans.service';

@ApiTags('Payments')
@UseGuards(AuthGuard, AclGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('notification')
  notification(@Body() payload: MidtransTrxNotification) {
    return this.paymentsService.notification(payload);
  }
}
