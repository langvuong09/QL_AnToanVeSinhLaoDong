import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("industries")
export class Industry {
  @PrimaryGeneratedColumn("increment") id!: number;

  @Column({ unique: true }) code!: string; 
  @Column() name!: string;               
  @Column({ default: true }) isActive!: boolean;
}