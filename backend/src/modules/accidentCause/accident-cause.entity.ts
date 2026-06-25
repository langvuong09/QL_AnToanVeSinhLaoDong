import { AccidentCauseType } from "src/commons/enums/cause-type.enum";
import { Column, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("accident_causes")
@Index("UQ_CAUSE_CODE_ACTIVE", ["code"], { unique: true, where: '"deletedAt" IS NULL' })
export class AccidentCause {
  @PrimaryGeneratedColumn("increment") id!: number;

  @Column() code!: string; 
  @Column() name!: string;

  @Column({ type: 'enum', enum: AccidentCauseType, default: AccidentCauseType.EMPLOYER })
  type!: AccidentCauseType;

  @Column({ default: true }) isActive!: boolean;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}