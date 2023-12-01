import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { CategoriesService } from '../categories/categories.service';
import { Media } from 'src/app/media/entities/media.entity';
import { MediaService } from 'src/app/media/media.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
    private readonly mediaService: MediaService,
  ) {}

  async create(payload: CreateProductDto) {
    const category = await this.categoriesService.findOne(payload.categoryId);
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const product = new Product();
    product.name = payload.name;
    product.description = payload.description;
    product.price = payload.price;
    product.category = category;
    await this.productsRepository.save(product);
    if (payload.imageIds) {
      await Promise.all(
        payload.imageIds.map((imageId) =>
          this.mediaService.update(imageId, {
            entityId: product.id,
            entityName: 'product',
          }),
        ),
      );
    }
    return product;
  }

  findAll(query: FindProductsQueryDto) {
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndMapMany(
        'product.images',
        Media,
        'media',
        "media.entityId = product.id AND media.entityName = 'product'",
      )
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .orderBy(`product.${query.orderBy}`, query.order)
      .getManyAndCount();
  }

  findOne(id: number) {
    return this.productsRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndMapMany(
        'product.images',
        Media,
        'media',
        "media.entityId = product.id AND media.entityName = 'product'",
      )
      .getOneOrFail();
  }

  async update(id: number, payload: UpdateProductDto) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    if (payload.categoryId) {
      const category = await this.categoriesService.findOne(payload.categoryId);
      if (!category) {
        throw new BadRequestException('Category not found');
      }
      product.category = category;
      delete payload.categoryId;
    }
    return this.productsRepository.save({ ...product, ...payload });
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return this.productsRepository.remove(product);
  }
}
