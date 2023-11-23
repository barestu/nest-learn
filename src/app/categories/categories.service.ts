import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindCategoriesQueryDto } from './dto/find-categories-query.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  create(payload: CreateCategoryDto) {
    const category = new Category();
    category.name = payload.name;
    return this.categoriesRepository.save(category);
  }

  findAll(query: FindCategoriesQueryDto) {
    return this.categoriesRepository.findAndCount({
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      order: {
        [query.orderBy]: query.order,
      },
    });
  }

  findOne(id: number) {
    return this.categoriesRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, payload: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return this.categoriesRepository.update(id, payload);
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return this.categoriesRepository.remove(category);
  }
}
