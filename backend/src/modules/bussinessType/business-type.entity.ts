import { Column, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("business_types")
@Index("UQ_BUSINESS_TYPE_CODE_ACTIVE", ["code"], { unique: true, where: '"deletedAt" IS NULL' })
export class BusinessType  {
  @PrimaryGeneratedColumn("increment") id!: number;
  @Column() code!: string; 
  @Column() name!: string;               
  @Column({ default: true }) isActive!: boolean;
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}