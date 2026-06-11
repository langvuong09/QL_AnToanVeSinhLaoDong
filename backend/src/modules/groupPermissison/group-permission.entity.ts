import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "../permission/permission.entity";

@Entity("group_permissions")
export class GroupPermission {
  @PrimaryGeneratedColumn("increment") id!: number;

  @Column() name!: string; 
  
  @Column({ unique: true }) code!: string;

  @OneToMany(() => Permission, (permission) => permission.groupPermission)
  permissions!: Permission[];
}