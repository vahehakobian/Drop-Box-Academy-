import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../../db/typeorm-ex.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
        UserRepository
    ]),
],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
