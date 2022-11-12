import { AbstractDto } from '../../dtoes/abstract.dto';
import { UserEntity } from "../../../user/user.entity";
import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from '../files/files.dto';

export class UserDto extends AbstractDto {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  files?: FileDto[]


  constructor(user: UserEntity) {
    super(user);
    this.fullName = user.fullName;
    this.email = user.email;
    this.files = user.files?.map(file => file.toDto())
  }
}
