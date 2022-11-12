import {Injectable} from '@nestjs/common';
import {UpdateResult} from 'typeorm';
import {UserEntity} from './user.entity';
import {CreateUserDto} from './dtoes/create-user.dto';
import type {UserDto} from '../common/modules/user/user.dto';
import {UserRepository} from './user.repository';
import {UpdateUserDto} from './dtoes/update-user.dto';
import {UpdateUserPassword} from './dtoes/update-password.dto';
import {UserNotFoundException} from './exception/user-not-found.exception';
import {UtilsProvider} from "../../providers/utils.provider";
import { UserCredientalException } from './exception/user-crediential.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find();
    return users.map(user => user.toDto());
  }

  async getById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new UserNotFoundException()
    }
    return user.toDto();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {

    const user = await this.getById(id);
    return await this.userRepository.update(
      id, 
      {
        ...updateUserDto
      })

  }


  async updatePassword(id: string, passwords: UpdateUserPassword) {
    const user = await this.userRepository.findOne({
      where: { id }
    });
    const validOldPassword = await UtilsProvider.validateHash(
      passwords.oldPassword,
      user.password,
    );
      
    if (!validOldPassword) {
      const description = 'incorrect old password';
      throw new UserCredientalException(description);
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      const description = 'incorrect confirm password';
      throw new UserCredientalException(description);
    }
    const newHashedPassword = await UtilsProvider.generateHash(passwords.confirmPassword);
    return this.userRepository.update(id, {
      password: newHashedPassword
    });
  }
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    createUserDto.password = await UtilsProvider.generateHash(createUserDto.password);
    const userEntity = this.userRepository.create(createUserDto)
    return this.userRepository.save(userEntity);
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email }
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.userRepository.delete(id);
  }

  async getEntityById(userId: string): Promise<UserEntity> {
    const userEntity = await this.userRepository.findById(userId);
    if (!userEntity) {
      throw new UserNotFoundException();
    }
    return userEntity;
  }

  async getEntityByEmail(email: string): Promise<UserEntity> {
    const userEntity = await this.userRepository.findByEmail(email);
    if (!userEntity) {
      throw new UserNotFoundException();
    }
    return userEntity;
  }

  async resetPassword(userId: string, password: string): Promise<UserEntity> {
    const userEntity = await this.getEntityById(userId);

    await this.userRepository.merge(userEntity,{ password: await UtilsProvider.generateHash(password) });

    return userEntity;
  }
}
