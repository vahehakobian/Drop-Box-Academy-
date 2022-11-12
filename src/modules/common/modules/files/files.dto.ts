import { UserDto } from './../user/user.dto';
import { AbstractDto } from '../../dtoes/abstract.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileEntity } from '../../../files/file.entity';

export class FileDto extends AbstractDto {
  @ApiProperty()
  name?: string;
  
  @ApiProperty()
  path?: string;

  @ApiProperty()
  shareLink:string




  constructor(file: FileEntity) {
    super(file);
    this.name = file.name;
    this.path = file.path;
    this.shareLink = file.shareLink;
  }
}
