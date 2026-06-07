import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../role/role.entity";
import * as argon from "argon2";

@Entity(`users`)
export class User {
    @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { unique: true })
  username!: string;

  @Column("varchar")
  password!: string;

  @Column({ nullable: true })
  fullName!: string;

  @Column("varchar", { nullable: true })
  realRole!: string;

  @Column({ nullable: true })
  avatar!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  dateOfBirth!: Date;

  @Column({ nullable: true })
  status!: boolean;

  @Column({ nullable: true })
  unitId!: number;

  @Column({ nullable: true })
  deletedAt!: Date;

  @Column({ nullable: true })
  doet_id!: number;

  @ManyToOne(() => Role, (role: Role) => role.users)
  @JoinColumn({ name: "roleId" })
  role?: Role;
  province: any;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon.hash(this.password);
  }

  @Column({ nullable: true })
  workUnit?: string;
}