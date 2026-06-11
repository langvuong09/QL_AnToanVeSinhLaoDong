import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report/report.entity";

@Entity("injury_types")
export class InjuryType {
  @PrimaryGeneratedColumn("increment") id!: number;
  @Column({ unique: true }) code!: string; 
  @Column() name!: string; 
  @Column({ default: true }) isActive!: boolean;
}