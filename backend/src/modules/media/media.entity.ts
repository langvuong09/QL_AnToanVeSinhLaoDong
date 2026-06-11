import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Doet } from '../doet/doet.entity';
import { FileType } from './media.model';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  originalFilename!: string;

  @Column()
  url!: string;

  @Column()
  secureUrl!: string;

  @Column()
  publicId!: string;

  @Column({ nullable: true })
  format!: string;

  @Column({ nullable: true })
  type!: string; 

  @Column({ type: 'int', nullable: true })
  width!: number;

  @Column({ type: 'int', nullable: true })
  height!: number;

  @Column({ type: 'enum', enum: FileType, default: FileType.OTHER })
  fileType!: FileType;

  @Column({ nullable: true })
  doetId?: number;

  @ManyToOne(() => Doet, (doet) => doet.files, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'doetId' })
  doet?: Doet;
  @CreateDateColumn()
  createdAt!: Date;
}
