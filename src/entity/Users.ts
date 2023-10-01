import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, BeforeUpdate, InsertEvent } from "typeorm"
import { Employer } from "./Employer"
import { Employee } from "./Employee"

export enum userRole {
    Employee = 'EMPLOYEE',
    Employer = 'EMPLOYER',
    Admin = 'ADMIN'
}

export enum sex {
    Male = 'Nam',
    Female = 'Nữ',
    Other = 'Khác'
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

    @Column({nullable: true})
    name: string

    @Column({ type: 'date', nullable: true })
    dob: Date

    @Column({nullable: true})
    address: string

    @Column({nullable: true})
    phone: string

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

    @OneToOne(() => Employee,
        (employee) => employee.user)
    employee: Employee
}