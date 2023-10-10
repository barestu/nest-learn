import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductDto } from './dto/find-all-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
  ) {}

  async create(payload: CreateProductDto) {
    const product = new Product();
    product.name = payload.name;
    product.description = payload.description;
    product.price = payload.price;
    await this.productsRepository.save(product);

    if (payload.images?.length) {
      await Promise.all(
        payload.images.map((image) => {
          const productImage = new ProductImage();
          productImage.filename = image.filename;
          productImage.originalname = image.originalname;
          productImage.mimetype = image.mimetype;
          productImage.size = image.size;
          productImage.url = image.path;
          productImage.product = product;
          return this.productImagesRepository.save(productImage);
        }),
      );
    }

    return product;
  }

  findAll(query: FindAllProductDto) {
    return this.productsRepository.findAndCount({
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      order: {
        [query.orderBy]: query.order,
      },
      relations: {
        images: true,
      },
    });
  }

  findOne(id: number) {
    return this.productsRepository.findOne({
      where: { id: id || IsNull() },
      relations: { images: true },
    });
  }

  async update(id: number, payload: UpdateProductDto) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return this.productsRepository.update(id, payload);
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return this.productsRepository.remove(product);
  }
}
