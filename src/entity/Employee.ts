import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./Users";

@Entity()
export class Employee extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    @OneToOne(() => User, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'userId'
    })
    user: User
}