import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { ReportType } from "../typeReport/report-type.entity";
import { Doet } from "../doet/doet.entity";
import { StatusHistory } from "../reportHistory/report-history.entity";
import { ReportDetail } from "./report-detail.entity";
import { FileEntity } from "../media/media.entity";

export enum ReportStatus {
  DRAFT = 'DRAFT',               // Đang báo cáo 
  OVERDUE_WARNING = 'OVERDUE_WARNING',
  SUBMITTED = 'SUBMITTED',       // Đã gửi báo cáo (Chờ tiếp nhận)
  APPROVED = 'APPROVED',         // Đã tiếp nhận / Duyệt
  REJECTED = 'REJECTED'          // Từ chối báo cáo
}

@Entity("reports")
export class Report {
  @PrimaryGeneratedColumn("increment") id!: number;
  @Column() title!: string;
  @Column() year!: number;
  
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