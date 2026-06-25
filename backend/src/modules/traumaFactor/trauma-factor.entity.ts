import { Column, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("traumas")
@Index("UQ_TRAUMA_CODE_ACTIVE", ["code"], { unique: true, where: '"deletedAt" IS NULL' })
export class Trauma {
  @PrimaryGeneratedColumn("increment") id!: number;
  @Column() code!: string; 
  @Column() name!: string; 
  @Column({ default: true }) isActive!: boolean;
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}