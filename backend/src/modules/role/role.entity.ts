import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { User } from "../user/user.entity";
import { Permission } from "../permission/permission.entity";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn("increment") id!: number;

  @Column() name!: string; 
  
  @Column({ unique: true }) code!: string; 

  @OneToMany(() => User, (user) => user.role)
  users!: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, { cascade: true })
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "roleId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permissionId", referencedColumnName: "id" }
  })
  permissions!: Permission[];
}