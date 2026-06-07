import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity('roles')
export class Role {
    constructor(role?: Partial<Role>, keys: string[] = ["id", "role", "name", "type", "status"]) {
        role && keys.forEach(key => {
            role[key] !== undefined && (this[key] = role[key]);
        });
    }
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    role!: string;

    @Column('varchar', { nullable: true })
    name!: string;

    @Column('varchar', { nullable: true })
    type!: string;

    @Column('varchar', { nullable: true })
    status!: boolean;

    @OneToMany(() => User, (user: User) => user.role, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    users!: Array<User>;
}