import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentType } from 'src/core/enums/content-type.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AclGuard } from '../roles/guards/acl.guard';
import { CheckPolicies } from '../roles/decorators/check-policies.decorator';
import { MediaService } from './media.service';
import { FindMediaQueryDto } from './dto/find-media-query.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { UploadMediaDto } from './dto/upload-media.dto';

@ApiBearerAuth()
@ApiTags('Media')
@UseGuards(AuthGuard, AclGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiConsumes(ContentType.FORM_DATA)
  @ApiBody({ type: UploadMediaDto })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  upload(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.mediaService.upload({ file });
  }

  @CheckPolicies('media.delete')
  @Post('cleanup')
  cleanup() {
    return this.mediaService.cleanup();
  }

  @Get()
  findAll(@Query() query: FindMediaQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Get(':mediaId')
  findOne(@Param('mediaId') mediaId: number) {
    return this.mediaService.findOne(mediaId);
  }

  @Put(':mediaId')
  update(@Param('mediaId') mediaId: number, @Body() payload: UpdateMediaDto) {
    return this.mediaService.update(mediaId, payload);
  }

  @CheckPolicies('media.delete')
  @Delete(':mediaId')
  remove(@Param('mediaId') mediaId: number) {
    return this.mediaService.remove(mediaId);
  }
}
