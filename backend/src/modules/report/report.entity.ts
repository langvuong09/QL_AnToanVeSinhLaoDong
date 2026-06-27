import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { ReportType } from "../typeReport/report-type.entity";
import { Doet } from "../doet/doet.entity";
import { StatusHistory } from "../reportHistory/report-history.entity";
import { ReportDetail } from "./report-detail.entity";
import { FileEntity } from "../media/media.entity";

export enum ReportStatus {
  DRAFT = 'DRAFT',                     
  OVERDUE_WARNING = 'OVERDUE_WARNING', 
  OVERDUE = 'OVERDUE',
  SUBMITTED = 'SUBMITTED',             
  APPROVED = 'APPROVED',               
  REJECTED = 'REJECTED'                
}

@Entity("reports")
export class Report {
  @PrimaryGeneratedColumn("increment") id!: number;
  @Column() title!: string;
  @Column() year!: number;
  @Column({nullable: true}) note!: string;
  
  @Column({ type: "varchar", default: ReportStatus.DRAFT }) 
  status!: ReportStatus;

  @Column() reportTypeId!: number;
  @ManyToOne(() => ReportType, (type) => type.reports)
  @JoinColumn({ name: "reportTypeId" })
  reportType!: ReportType;

  @Column() doetId!: number;
  @ManyToOne(() => Doet, (doet) => doet.reports)
  @JoinColumn({ name: "doetId" })
  doet!: Doet;

  // =========================================================
  // THÔNG TIN CHUNG (Lao động cơ sở)
  // =========================================================
  @Column({ type: "int", nullable: true }) totalEmployees?: number;
  @Column({ type: "int", nullable: true }) femaleEmployees?: number;
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) totalPayroll?: number; // Tương ứng với tongQuyLuong

  // =========================================================
  // MỤC 1: TÌNH HÌNH TAI NẠN LAO ĐỘNG (Tổng số liệu chung Tab 1)
  // =========================================================
  @Column({ type: "int", nullable: true }) m1TotalCases?: number;
  @Column({ type: "int", nullable: true }) m1FatalCases?: number;
  @Column({ type: "int", nullable: true }) m1MultiVictimCases?: number;
  @Column({ type: "int", nullable: true }) m1TotalVictims?: number;
  @Column({ type: "int", nullable: true }) m1FemaleVictims?: number;
  @Column({ type: "int", nullable: true }) m1FatalVictims?: number;
  @Column({ type: "int", nullable: true }) m1SevereInjuries?: number;

  @Column({ type: "int", nullable: true }) m1NonManagedVictims?: number;
  @Column({ type: "int", nullable: true }) m1NonManagedFemaleVictims?: number;
  @Column({ type: "int", nullable: true }) m1NonManagedFatalVictims?: number;
  @Column({ type: "int", nullable: true }) m1NonManagedSevereInjuries?: number;

  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) m1MedicalCost?: number;
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) m1SalaryCompensation?: number;
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) m1PropertyDamage?: number;
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) m1TotalCost?: number;

  @Column({ type: "int", nullable: true }) m1TotalLeaveDays?: number;
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) m1TotalDamage?: number;

  // =========================================================
  // MỤC 2: TNLĐ ĐƯỢC HƯỞNG TRỢ CẤP (Khoản 2 Điều 39)
  // =========================================================
  @Column({ type: "int", nullable: true }) m2TotalCases?: number;
  @Column({ type: "int", nullable: true }) m2FatalCases?: number;
  @Column({ type: "int", nullable: true }) m2MultiVictimCases?: number;
  @Column({ type: "int", nullable: true }) m2TotalVictims?: number;
  @Column({ type: "int", nullable: true }) m2FemaleVictims?: number;
  @Column({ type: "int", nullable: true }) m2FatalVictims?: number;
  @Column({ type: "int", nullable: true }) m2SevereInjuries?: number;

  @Column({ type: "int", nullable: true }) m2NonManagedVictims?: number;
  @Column({ type: "int", nullable: true }) m2NonManagedFemaleVictims?: number;
  @Column({ type: "int", nullable: true }) m2NonManagedFatalVictims?: number;
  @Column({ type: "int", nullable: true }) m2NonManagedSevereInjuries?: number;

  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) m2MedicalCost?: number;
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) m2SalaryCompensation?: number;
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) m2PropertyDamage?: number;
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) m2TotalCost?: number;

  @Column({ type: "int", nullable: true }) m2TotalLeaveDays?: number;
 @Column({ type: "decimal", precision: 15, scale: 2, nullable: true }) m2TotalDamage?: number;

  // =========================================================
  // QUAN HỆ & FILE ĐÍNH KÈM
  // =========================================================
  @OneToMany(() => ReportDetail, (detail) => detail.report, { cascade: true })
  details!: ReportDetail[];

  @OneToMany(() => StatusHistory, (history) => history.report, { cascade: true })
  statusHistories!: StatusHistory[];

  @ManyToMany(() => FileEntity)
  @JoinTable({
    name: "report_files",
    joinColumn: { name: "reportId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "fileId", referencedColumnName: "id" }
  })
  files!: FileEntity[];
}