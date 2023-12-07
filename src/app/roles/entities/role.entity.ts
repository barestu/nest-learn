import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AclDto } from '../dto/acl.dto';
import { User } from 'src/app/users/entities/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'json' })
  acl: AclDto;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
