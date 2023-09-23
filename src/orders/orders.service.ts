import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MidtransService } from 'src/payments/vendors/midtrans.service';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly midtransService: MidtransService,
  ) {}

  async create(payload: CreateOrderDto) {
    try {
      const order = new Order();

      order.status = 'created';
      order.amount = payload.amount;
      await this.ordersRepository.save(order);

      const transaction = await this.midtransService.createTransaction({
        transaction_details: {
          order_id: order.id,
          gross_amount: order.amount,
        },
      });

      return transaction;
    } catch (e) {
      throw new BadRequestException('Create order failed');
    }
  }

  async findAll() {
    return this.ordersRepository.find();
  }

  async findById(orderId: number) {
    const order = await this.ordersRepository.findOneBy({ id: orderId });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return order;
  }

  async update(orderId: number, payload: UpdateOrderDto) {
    const order = await this.ordersRepository.findOneBy({ id: orderId });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    order.status = payload.status;

    return await this.ordersRepository.save(order);
  }

  async delete(orderId: number) {
    const order = await this.ordersRepository.findOneBy({ id: orderId });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    await this.ordersRepository.remove(order);

    return true;
  }
}
