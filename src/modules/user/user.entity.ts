import { FileEntity } from '../files/file.entity';
import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { UserDto } from "../common/modules/user/user.dto";

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column()
  password: string;

  @OneToMany(() => FileEntity, (fileEntity) => fileEntity.user)
  files?: FileEntity[];

  dtoClass = UserDto;
}
