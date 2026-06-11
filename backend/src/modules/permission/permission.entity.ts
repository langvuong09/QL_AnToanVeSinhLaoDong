import { Column, Entity, ManyToOne, ManyToMany, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Role } from "../role/role.entity";
import { GroupPermission } from "../groupPermissison/group-permission.entity";

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn("increment") id!: number;

  @Column() name!: string;
  
  @Column({ unique: true }) code!: string; 

  @Column() groupPermissionId!: number;
  @ManyToOne(() => GroupPermission, (group) => group.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "groupPermissionId" })
  groupPermission!: GroupPermission;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles!: Role[];
}