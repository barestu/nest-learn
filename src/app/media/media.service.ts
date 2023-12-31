import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

import { Media } from './entities/media.entity';
import { UploadMediaDto } from './dto/upload-media.dto';
import { FindMediaQueryDto } from './dto/find-media-query.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  async upload(payload: UploadMediaDto) {
    const { file } = payload;
    try {
      const media = new Media();
      media.filename = file.filename;
      media.originalname = file.originalname;
      media.mimetype = file.mimetype;
      media.size = file.size;
      media.url = file.path.replace('uploads/', '');
      const res = await this.mediaRepository.save(media);
      return res;
    } catch (error) {
      this.removeFromStorage(file.path);
      return Promise.reject(error);
    }
  }

  findAll(query: FindMediaQueryDto) {
    return this.mediaRepository.findAndCount({
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      order: {
        [query.orderBy]: query.order,
      },
    });
  }

  async findOne(id: number) {
    const media = await this.mediaRepository.findOneBy({ id });
    if (!media) {
      throw new BadRequestException('Product not found');
    }
    return media;
  }

  async update(id: number, payload: UpdateMediaDto) {
    const media = await this.mediaRepository.findOneBy({ id });
    if (!media) {
      throw new BadRequestException('Product not found');
    }
    return this.mediaRepository.update(id, payload);
  }

  removeFromStorage(location: string) {
    const realLocation = `uploads/${location}`;
    const isExist = fs.existsSync(path.resolve(realLocation));
    if (isExist) {
      fs.unlinkSync(realLocation);
    }
  }

  async remove(id: number) {
    const media = await this.mediaRepository.findOneBy({ id });
    if (!media) {
      throw new BadRequestException('Product not found');
    }
    this.removeFromStorage(media.url);
    return this.mediaRepository.remove(media);
  }

  async cleanup() {
    const mediaList = await this.mediaRepository.find({
      where: {
        entityId: IsNull(),
        entityName: IsNull(),
      },
    });
    mediaList?.forEach((media) => this.remove(media.id));
    return;
  }
}
