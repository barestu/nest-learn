import { Injectable } from '@nestjs/common';
import { MidtransTrxNotification } from 'src/lib/vendors/midtrans.service';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly ordersService: OrdersService) {}

  async notification(payload: MidtransTrxNotification) {
    const orderId = +payload.order_id;
    const transactionStatus = payload.transaction_status;
    const fraudStatus = payload.fraud_status;

    console.log('notification', payload);

    switch (transactionStatus) {
      case 'capture':
        if (fraudStatus === 'accept') {
          await this.ordersService.update(orderId, { status: 'success' });
        }
        break;
      case 'settlement':
        await this.ordersService.update(orderId, { status: 'success' });
        break;
      case 'cancel':
      case 'deny':
      case 'expire':
        await this.ordersService.update(orderId, { status: 'failure' });
        break;
      default:
        break;
    }

    return true;
  }
}
