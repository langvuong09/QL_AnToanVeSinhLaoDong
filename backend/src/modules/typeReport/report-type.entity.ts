import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report/report.entity";

@Entity("report_types")
export class ReportType {
  @PrimaryGeneratedColumn("increment") id!: number;

  @Column() name!: string;
  
  @Column() year!: number; 
  
  @Column() period!: string; 
  
  @Column({ type: "date" }) startDate!: Date; 
  
  @Column({ type: "date" }) endDate!: Date; 
  
  @Column({ default: true }) isActive!: boolean;

  @OneToMany(() => Report, (report) => report.reportType)
  reports!: Report[];
}