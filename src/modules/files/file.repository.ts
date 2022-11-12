import { Repository } from 'typeorm';
import { CustomRepository } from '../../db/typeorm-ex.decorator';
import { FileEntity } from './file.entity';

@CustomRepository(FileEntity)
export class FileRepository extends Repository<FileEntity> {
  async findAllById(id: string) {
    return await this.find({ where: { userId:id } });
  }
 
}
