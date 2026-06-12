import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, DeleteDateColumn, Index } from "typeorm";

@Entity("injury_types")
@Index("UQ_INJURY_TYPE_CODE_ACTIVE", ["code"], { unique: true, where: '"deletedAt" IS NULL' })
export class InjuryType {
  @PrimaryGeneratedColumn("increment") 
  id!: number;

  @Column() 
  code!: string; 

  @Column() 
  name!: string; 

  @Column({ default: true }) 
  isActive!: boolean;

  @Column({ nullable: true })
  parentId?: number;

  @ManyToOne(() => InjuryType, (injuryType) => injuryType.children, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'parentId' })
  parent?: InjuryType;

  @OneToMany(() => InjuryType, (injuryType) => injuryType.parent)
  children?: InjuryType[];

  @DeleteDateColumn()
  deletedAt?: Date;

  level?: number;
}