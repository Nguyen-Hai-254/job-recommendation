import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm"
import { Employer } from "./Employer"

export enum userRole {
    Employee = 'EMPLOYEE',
    Employer = 'EMPLOYER',
    Admin = 'ADMIN'
}

export enum sex {
    Male = 'MALE',
    Female = 'FEMALE',
    Other = 'OTHER'
}
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    userId: number

    @Column({
        unique: true
    })
    email: string

    @Column()
    password: string

    @Column()
    name: string

    @Column({
        type: 'enum',
        enum: sex,
        default: sex.Other
    })
    sex: sex

    @Column({
        type: 'enum',
        enum: userRole,
        default: userRole.Employee
    })
    role: userRole

    @OneToOne(() => Employer,
        (employer) => employer.user)
    employer: Employer
}