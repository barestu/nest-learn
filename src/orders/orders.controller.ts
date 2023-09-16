import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiBearerAuth()
@ApiTags('Orders')
@UseGuards(AuthGuard)
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
  findById(@Param('orderId') orderId: number) {
    return this.ordersService.findById(orderId);
  }

  @Put(':orderId')
  update(@Param('orderId') orderId: number, @Body() payload: UpdateOrderDto) {
    return this.ordersService.update(orderId, payload);
  }

  @Delete(':orderId')
  delete(@Param('orderId') orderId: number) {
    return this.ordersService.delete(orderId);
  }
}
