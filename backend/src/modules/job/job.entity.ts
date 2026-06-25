import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("jobs")
@Index("UQ_JOB_CODE_ACTIVE", ["code"], { unique: true, where: '"deletedAt" IS NULL' })
export class Job {
  @PrimaryGeneratedColumn("increment") id!: number;

  @Column() code!: string; 
  @Column() name!: string;               
  @Column({ default: true }) isActive!: boolean;

  @Column({ nullable: true }) parentId?: number;

  @ManyToOne(() => Job, (job) => job.children, { onDelete: 'SET NULL' })
  @JoinColumn({ name: "parentId" })
  parent?: Job;

  @OneToMany(() => Job, (job) => job.parent)
  children?: Job[];

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}