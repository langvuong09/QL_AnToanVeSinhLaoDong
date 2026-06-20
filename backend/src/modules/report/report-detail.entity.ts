import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trauma } from "../traumaFactor/trauma-factor.entity";
import { InjuryType } from "../typeInjury/injury.entity";
import { Report } from "../report/report.entity";

@Entity("report_details")
export class ReportDetail {
  @PrimaryGeneratedColumn("increment") id!: number;

  @Column() reportId!: number;
  @ManyToOne(() => Report, (report) => report.details, { onDelete: "CASCADE" })
  @JoinColumn({ name: "reportId" })
  report!: Report;

  @Column({ nullable: true }) traumaId!: number;
  @ManyToOne(() => Trauma) @JoinColumn({ name: "traumaId" }) trauma!: Trauma;

  @Column({ nullable: true }) injuryTypeId!: number;
  @ManyToOne(() => InjuryType) @JoinColumn({ name: "injuryTypeId" }) injuryType!: InjuryType;

  // --- 2. Nhóm số liệu thống kê về Vụ/Người (Cho phép nullable để phục vụ lưu nháp) ---
  @Column({ type: "int", nullable: true }) totalCases?: number;           
  @Column({ type: "int", nullable: true }) fatalCases?: number;           
  @Column({ type: "int", nullable: true }) multiVictimCases?: number;     
  
  @Column({ type: "int", nullable: true }) totalVictims?: number;         
  @Column({ type: "int", nullable: true }) femaleVictims?: number;        
  @Column({ type: "int", nullable: true }) fatalVictims?: number;         
  @Column({ type: "int", nullable: true }) severeInjuries?: number;       
  
  // --- 3. Nhóm thống kê đối tượng không thuộc quản lý ---
  @Column({ type: "int", nullable: true }) nonManagedVictims?: number;           
  @Column({ type: "int", nullable: true }) nonManagedFemaleVictims?: number;     
  @Column({ type: "int", nullable: true }) nonManagedFatalVictims?: number;      
  @Column({ type: "int", nullable: true }) nonManagedSevereInjuries?: number;    

  // --- 4. Nhóm số liệu tài chính ---
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) medicalCost?: number;       
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) salaryCompensation?: number; 
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) propertyDamage?: number;     
  
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) totalCost?: number;
}