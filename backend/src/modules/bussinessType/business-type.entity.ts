import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("business_types")
export class BusinessType {
  @PrimaryGeneratedColumn("increment") id!: number;
  @Column({ unique: true }) code!: string; 
  @Column() name!: string;               
  @Column({ default: true }) isActive!: boolean;
}