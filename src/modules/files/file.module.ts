import { FileRepository } from './file.repository';
import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../../db/typeorm-ex.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
        FileRepository
    ]),
],
  controllers: [FileController],
  exports: [FileService],
  providers: [FileService],
})
export class FileModule {}


