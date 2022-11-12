import { FileDto } from '../common/modules/files/files.dto';
import { UserEntity } from '../user/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';

@Entity({ name: 'files' })
export class FileEntity extends AbstractEntity<FileDto> {

  @Column()
  name?: string;

  @Column()
  path?: string;

  @Column()
  shareLink: string;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.files)
  @JoinColumn({name:'user_id'})
  user: UserEntity;

  dtoClass = FileDto;
}
