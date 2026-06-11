import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("traumas")
export class Trauma {
  @PrimaryGeneratedColumn("increment") id!: number;
  @Column({ unique: true }) code!: string; 
  @Column() name!: string; 
  @Column({ default: true }) isActive!: boolean;
}