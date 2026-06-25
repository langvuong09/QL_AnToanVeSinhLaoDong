import { BaseAddressEntity } from "src/commons/bases/baseAddressEntity";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn, DeleteDateColumn, Index } from "typeorm";
import { FileEntity } from "../media/media.entity";
import { BusinessType } from "../bussinessType/business-type.entity";
import { Industry } from "../industry/industry.entity";
import { Report } from "../report/report.entity";

@Entity("doets")
@Index(["taxCode"], { unique: true, where: '"deletedAt" IS NULL' })
export class Doet extends BaseAddressEntity {
  @PrimaryGeneratedColumn("increment") id!: number;

  @Column() name!: string;
  @Column() taxCode!: string; 
  @Column() issuedDate!: Date;
  @Column({ default: true }) status!: boolean;

  @Column() businessTypeId!: number;
  
  @ManyToOne(() => BusinessType, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'businessTypeId' })
  businessType!: BusinessType | null;

  @Column() industryId!: number;
  
  @ManyToOne(() => Industry, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'industryId' })
  industry!: Industry | null;

  @Column({ nullable: true }) foreignName!: string;
  @Column({ nullable: true }) representative!: string; 
  @Column({ nullable: true }) repPhone!: string;       

  @OneToMany(() => FileEntity, (file) => file.doet)
  files!: FileEntity[];

  @OneToMany(() => Report, (report) => report.doet)
  reports!: Report[];

}