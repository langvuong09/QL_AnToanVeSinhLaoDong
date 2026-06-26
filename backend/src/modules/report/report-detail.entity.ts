import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trauma } from "../traumaFactor/trauma-factor.entity";
import { InjuryType } from "../typeInjury/injury.entity";
import { Report } from "./report.entity";
import { AccidentCauseEnum } from "../../commons/enums/accident.enum";
import { AccidentCause } from "../accidentCause/accident-cause.entity";
import { Job } from "../job/job.entity";

@Entity("report_details")
export class ReportDetail {
  @PrimaryGeneratedColumn("increment") id!: number;

  @Column() reportId!: number;
  @ManyToOne(() => Report, (report) => report.details, { onDelete: "CASCADE" })
  @JoinColumn({ name: "reportId" })
  report!: Report;

  @Column({ nullable: true })
  causeId?: number;

  @ManyToOne(() => AccidentCause)
  @JoinColumn({ name: "causeId" })
  cause?: AccidentCause;

  // --- 1. Nhóm định danh của vụ tai nạn ---
  @Column({ nullable: true }) traumaId!: number;
  @ManyToOne(() => Trauma) @JoinColumn({ name: "traumaId" }) trauma!: Trauma;

  @Column({ nullable: true })
  jobId!: number;
  @ManyToOne(() => Job) 
  @JoinColumn({ name: "jobId" }) 
  job!: Job;

  // --- 2. Số liệu thống kê của vụ tai nạn này ---
  @Column({ type: "int", nullable: true }) totalCases?: number;           
  @Column({ type: "int", nullable: true }) fatalCases?: number;           
  @Column({ type: "int", nullable: true }) multiVictimCases?: number;     
  @Column({ type: "int", nullable: true }) totalVictims?: number;         
  @Column({ type: "int", nullable: true }) femaleVictims?: number;        
  @Column({ type: "int", nullable: true }) fatalVictims?: number;         
  @Column({ type: "int", nullable: true }) severeInjuries?: number;       
  
  // --- 3. Thống kê đối tượng không thuộc quản lý của vụ này ---
  @Column({ type: "int", nullable: true }) nonManagedVictims?: number;           
  @Column({ type: "int", nullable: true }) nonManagedFemaleVictims?: number;     
  @Column({ type: "int", nullable: true }) nonManagedFatalVictims?: number;      
  @Column({ type: "int", nullable: true }) nonManagedSevereInjuries?: number;    

  // --- 4. Số liệu tài chính của vụ này ---
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) medicalCost?: number;       
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) salaryCompensation?: number; 
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) propertyDamage?: number;     
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) totalCost?: number;

  @Column({ type: "int", nullable: true }) totalLeaveDays?: number; 
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) totalDamage?: number;
}