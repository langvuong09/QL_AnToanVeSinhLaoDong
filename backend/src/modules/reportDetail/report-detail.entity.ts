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

  // --- 2. Nhóm số liệu thống kê về Vụ/Người (Số người bị nạn) ---
  @Column({ type: "int", default: 0 }) totalCases!: number;           // Tổng số vụ
  @Column({ type: "int", default: 0 }) fatalCases!: number;           // Số vụ chết người
  @Column({ type: "int", default: 0 }) multiVictimCases!: number;     // Số vụ tai nạn nhiều người
  
  @Column({ type: "int", default: 0 }) totalVictims!: number;         // Tổng số người bị nạn
  @Column({ type: "int", default: 0 }) femaleVictims!: number;        // Số người bị nạn là nữ
  @Column({ type: "int", default: 0 }) fatalVictims!: number;         // Số người chết
  @Column({ type: "int", default: 0 }) severeInjuries!: number;       // Số người bị thương nặng
  
  // --- 3. Nhóm thống kê đối tượng không thuộc quản lý ---
  @Column({ type: "int", default: 0 }) nonManagedVictims!: number;           // Tổng người không thuộc quản lý
  @Column({ type: "int", default: 0 }) nonManagedFemaleVictims!: number;     // Nữ không thuộc quản lý
  @Column({ type: "int", default: 0 }) nonManagedFatalVictims!: number;      // Chết không thuộc quản lý
  @Column({ type: "int", default: 0 }) nonManagedSevereInjuries!: number;    // Nặng không thuộc quản lý

  // --- 4. Nhóm số liệu tài chính (Chi phí) ---
  // Dùng decimal(15,2) để tránh sai số tiền tệ
  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 }) medicalCost!: number;       // Chi phí y tế
  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 }) salaryCompensation!: number; // Chi phí bồi thường lương
  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 }) propertyDamage!: number;     // Thiệt hại tài sản
  
  // Tổng thiệt hại tính toán 
  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 }) totalCost!: number;
}