import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ContentType } from 'src/common/enums/content-type.enum';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductDto } from './dto/find-all-product.dto';

@ApiBearerAuth()
@ApiTags('Products')
@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiConsumes(ContentType.FORM_DATA)
  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  create(
    @Body() payload: CreateProductDto,
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    images: Express.Multer.File[],
  ) {
    return this.productsService.create({ ...payload, images });
  }

  @Get()
  findAll(@Query() query: FindAllProductDto) {
    return this.productsService.findAll(query);
  }

  @Get(':productId')
  findOne(@Param('productId') productId: number) {
    return this.productsService.findOne(productId);
  }

  @Put(':productId')
  update(
    @Param('productId') productId: number,
    @Body() payload: UpdateProductDto,
  ) {
    return this.productsService.update(productId, payload);
  }

  @Delete(':productId')
  remove(@Param('productId') productId: number) {
    return this.productsService.remove(productId);
  }
}
