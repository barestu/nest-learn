import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth/guards/auth.guard';
import { AclGuard } from '../roles/guards/acl.guard';
import { CheckPolicies } from '../roles/decorators/check-policies.decorator';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';

@ApiBearerAuth()
@ApiTags('Products')
@UseGuards(AuthGuard, AclGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @CheckPolicies('products.create')
  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.productsService.create({ ...payload });
  }

  @Get()
  findAll(@Query() query: FindProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':productId')
  findOne(@Param('productId') productId: number) {
    return this.productsService.findOne(productId);
  }

  @CheckPolicies('products.update')
  @Put(':productId')
  update(
    @Param('productId') productId: number,
    @Body() payload: UpdateProductDto,
  ) {
    return this.productsService.update(productId, payload);
  }

  @CheckPolicies('products.delete')
  @Delete(':productId')
  remove(@Param('productId') productId: number) {
    return this.productsService.remove(productId);
  }
}
