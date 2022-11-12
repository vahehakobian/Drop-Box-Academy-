import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UUIDParam } from '../../decorators/http.decorators';
import { UserDto } from '../common/modules/user/user.dto';
import { UpdateResult } from 'typeorm';
import { UpdateUserPassword } from './dtoes/update-password.dto';
import { UpdateUserDto } from './dtoes/update-user.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserService } from './user.service';
import { ApiFile } from '../../decorators/swagger.decorator';


@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    public readonly userService: UserService,
    ) {}

  @Get()
  async getAllUsers(): Promise<UserDto[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  async getSingleUser(
    @UUIDParam('id') userId: string
    ): Promise<UserDto> {
        return await this.userService.getById(userId);
    }

  @Put(':id')
  async updateUser(
    @AuthUser() user: UserDto,
    @UUIDParam('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
      return await this.userService.update(userId, updateUserDto);
  }

  @Put('password/:id')
  async updatePassword(
    @AuthUser() user: UserDto,
    @UUIDParam('id') id: string,
    @Body() passwords:UpdateUserPassword,
  ):Promise<UpdateResult> {
      return await this.userService.updatePassword(id, passwords);

  }

  @Delete(':id')
  async deleteUser(
    @AuthUser() user:UserDto,
    @UUIDParam('id') id:string
  ): Promise<void> {
      return await this.userService.delete(id);
  }

}