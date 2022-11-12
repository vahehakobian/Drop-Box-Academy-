import { Body, Controller, Delete, Get, Post, Put, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { UserDto } from '../common/modules/user/user.dto';
import { UpdateResult } from 'typeorm';
import { ApiFile } from '../../decorators/swagger.decorator';
import { FileService } from './file.service';
import { FileDto } from '../common/modules/files/files.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { StorageProvider } from '../../providers/storage.provider';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Response } from 'express';


@Controller('files')
@ApiTags('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post()
  @Auth()
  @ApiFile([{ name: 'files', isArray: true }], {
    isRequired: true,
    okResponseData: {
      type: FileDto,
      description: 'file creation',
    },
  })
  @UseInterceptors(
    FilesInterceptor(
      'files',
      5,
      StorageProvider.FilesOptions,
    ),
  )
  @ApiCreatedResponse({
    description: 'Your request of File is successfully done.',
  })
  @ApiForbiddenResponse({ description: 'File data does not match' })
  @ApiConflictResponse({ description: 'File name is already exist' })
  async createProduct(
    @UploadedFiles() files,
    @AuthUser() user
  ) {
    return this.fileService.create(files,user) ;
  }

  @Get(':id') 
  getAllUserFiles(
    @UUIDParam('id') userId: string
  ) {
    return this.fileService.getUserAllFiles(userId);
  }

  @Get(':userId/:id')
  getOneFile(
    @UUIDParam('userId') userId: string,
    @UUIDParam('id') id: string
  ) {
    return this.fileService.getOne(userId,id)
  }

  @Delete(':id')
  delete(
    @UUIDParam('id') id: string
  ) {
    return this.fileService.delete(id);
  }

  @Get('download/:userId/:id')
  download(
    @UUIDParam('userId') userId: string,
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.fileService.downloadFile(userId,id,response);
  }

}