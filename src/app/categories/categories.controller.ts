import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth/guards/auth.guard';
import { AclGuard } from '../roles/guards/acl.guard';
import { CheckPolicies } from '../roles/decorators/check-policies.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindCategoriesQueryDto } from './dto/find-categories-query.dto';

@ApiBearerAuth()
@ApiTags('Categories')
@UseGuards(AuthGuard, AclGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @CheckPolicies('categories.create')
  @Post()
  create(@Body() payload: CreateCategoryDto) {
    return this.categoriesService.create(payload);
  }

  @Get()
  findAll(@Query() query: FindCategoriesQueryDto) {
    return this.categoriesService.findAll(query);
  }

  @Get(':categoryId')
  findOne(@Param('categoryId') categoryId: number) {
    return this.categoriesService.findOne(categoryId);
  }

  @CheckPolicies('categories.update')
  @Put(':categoryId')
  update(
    @Param('categoryId') categoryId: number,
    @Body() payload: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(categoryId, payload);
  }

  @CheckPolicies('categories.delete')
  @Delete(':categoryId')
  remove(@Param('categoryId') categoryId: number) {
    return this.categoriesService.remove(categoryId);
  }
}
