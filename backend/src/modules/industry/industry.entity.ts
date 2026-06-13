import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("industries")
@Index("UQ_INDUSTRY_CODE_ACTIVE", ["code"], { unique: true, where: '"deletedAt" IS NULL' })
export class Industry {
  @PrimaryGeneratedColumn("increment") id!: number;

  @Column() code!: string; 
  @Column() name!: string;               
  @Column({ default: true }) isActive!: boolean;

  @Column({ nullable: true }) parentId?: number;

  @ManyToOne(() => Industry, (industry) => industry.children, { onDelete: 'SET NULL' })
  @JoinColumn({ name: "parentId" })
  parent?: Industry;

  @OneToMany(() => Industry, (industry) => industry.parent)
  children?: Industry[];

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}