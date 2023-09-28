import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./Users";

@Entity()
export class Employer extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    @Column()
    taxCode: string

    @Column()
    companyName: string

    @Column()
    companyLocation: string

    @Column()
    careerField: string

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