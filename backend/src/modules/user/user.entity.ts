import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../role/role.entity";
import { Doet } from "../doet/doet.entity";
import * as argon from "argon2";
import { FileEntity } from "../media/media.entity";
import { BaseAddressEntity } from "src/commons/bases/baseAddressEntity";

@Entity("users")
export class User extends BaseAddressEntity {
  @PrimaryGeneratedColumn("uuid") id!: string;

  @Column("varchar", { unique: true }) username!: string;

  @Column("varchar") password!: string;

  @Column({ nullable: true }) fullName!: string;

  @Column({ nullable: true, unique: true }) email!: string;

  @Column({ type: "date", nullable: true }) dateOfBirth!: Date;

  @Column({ default: true }) status!: boolean;

  @Column({ nullable: true }) roleId!: number;
  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: "roleId" })
  role?: Role;

  @Column({ nullable: true }) avatarId!: string;
  @ManyToOne(() => FileEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: "avatarId" })
  avatar?: FileEntity;

  @Column({ nullable: true }) doetId!: number;
  @ManyToOne(() => Doet, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: "doetId" })
  doet?: Doet;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$argon2')) {
      this.password = await argon.hash(this.password);
    }
  }
}