import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Report } from "../report/report.entity";
import { User } from "../user/user.entity"; // Import User entity

@Entity("status_histories")
export class StatusHistory {
  @PrimaryGeneratedColumn("increment") id!: number;

  @Column() status!: string; // VD: 'DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'
  
  @Column({ nullable: true }) note!: string; 

  @Column() reportId!: number;
  @ManyToOne(() => Report, (report) => report.statusHistories, { onDelete: "CASCADE" })
  @JoinColumn({ name: "reportId" })
  report!: Report;

  @Column() userId!: string;
  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @CreateDateColumn() createdAt!: Date;
}