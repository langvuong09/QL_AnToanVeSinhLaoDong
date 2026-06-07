import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm/browser";
import { Activity } from "./view.models";

@Entity("views")
export class View {
    constructor(view?: Partial<View>, keys: string[] = ["id", "name", "activities", "url", "icon", "parentId", "doet_id", "order"]) {
        view && keys.forEach(key => {
            view[key] !== undefined && (this[key] = view[key]);
        });
    }

  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ type: 'jsonb', nullable: true })
  activities!: Activity[];

  @Column({ nullable: true })
  url!: string;

  @Column({ nullable: true })
  icon!: string;

  @Column({ nullable: true })
  parentId!: string;

  @Column({ nullable: true })
  doet_id!: number;

  @Column({ nullable: true })
  order!: number;
}