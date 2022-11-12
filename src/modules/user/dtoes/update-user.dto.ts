import { ApiPropertyOptional} from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

}
