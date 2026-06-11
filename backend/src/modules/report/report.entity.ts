import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable, ManyToOne, JoinColumn } from "typeorm";
import { ReportType } from "../typeReport/report-type.entity";
import { Doet } from "../doet/doet.entity";
import { ReportDetail } from "../reportDetail/report-detail.entity";
import { StatusHistory } from "../reportHistory/report-history.entity";
@Entity("reports")
export class Report {
  @PrimaryGeneratedColumn("increment") id!: number;
  @Column() title!: string;
  @Column() year!: number;

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

  @OneToMany(() => StatusHistory, (history) => history.report)
  statusHistories!: StatusHistory[];
}