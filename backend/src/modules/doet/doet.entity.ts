import { BaseAddressEntity } from "src/commons/bases/baseAddressEntity";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FileEntity } from "../media/media.entity";
import { BusinessType } from "../bussinessType/business-type.entity";
import { Industry } from "../industry/industry.entity";
import { Report } from "../report/report.entity";

@Entity("doets")
export class Doet extends BaseAddressEntity {
  @PrimaryGeneratedColumn("increment") id!: number;

  @Column() name!: string;
  @Column({ unique: true }) taxCode!: string; 
  @Column() issuedDate!: Date;

  @Column() businessTypeId!: number;
  
  @ManyToOne(() => BusinessType, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'businessTypeId' })
  businessType!: BusinessType;

  @Column() industryId!: number;
  
  @ManyToOne(() => Industry, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'industryId' })
  industry!: Industry;

  @Column({ nullable: true }) foreignName!: string;
  @Column({ nullable: true }) representative!: string; 
  @Column({ nullable: true }) repPhone!: string;       

  @OneToMany(() => FileEntity, (file) => file.doet)
  files!: FileEntity[];

  @OneToMany(() => Report, (report) => report.doet)
  reports!: Report[];
}