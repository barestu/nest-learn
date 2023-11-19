import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  entityId: number;

  @Column({ nullable: true })
  entityName: string;
}
