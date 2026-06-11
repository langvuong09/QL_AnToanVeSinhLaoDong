import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '../permission/permission.entity';

@Entity('views')
export class View {
  @PrimaryGeneratedColumn('increment') id!: number;

  @Column() name!: string;
  @Column() url!: string;

  @ManyToMany(() => Permission, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'view_permissions',
    joinColumn: { name: 'viewId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
  })
  requiredPermissions!: Permission[];

  @Column({ nullable: true }) parentId!: number;
  @ManyToOne(() => View, (view) => view.children)
  @JoinColumn({ name: 'parentId' })
  parent?: View;

  @OneToMany(() => View, (view) => view.parent)
  children!: View[];

  @Column({ nullable: true })
  icon!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;
}
