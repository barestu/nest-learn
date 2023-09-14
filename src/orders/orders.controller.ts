import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() payload: CreateOrderDto) {
    return this.ordersService.create(payload);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':orderId')
  findById(@Param('orderId') orderId: string) {
    return this.ordersService.findById(+orderId);
  }

  @Put(':orderId')
  update(@Param('orderId') orderId: string, @Body() payload: UpdateOrderDto) {
    return this.ordersService.update(+orderId, payload);
  }

  @Delete(':orderId')
  delete(@Param('orderId') orderId: string) {
    return this.ordersService.delete(+orderId);
  }
}
