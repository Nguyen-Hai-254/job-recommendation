import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, CreateDateColumn } from "typeorm"
import { Employer, Employee, Notification } from "./"
import { sex, userRole } from "../utils/enum"

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    userId: number

    @Column({
        unique: true
    })
    email: string

    @Column({ select: false })
    password: string

    @Column({ nullable: true })
    name: string

    @Column({ type: 'date', nullable: true })
    dob: Date

    @Column({ nullable: true })
    address: string

    @Column({ nullable: true })
    phone: string

    @Column({
        type: 'enum',
        enum: sex,
        default: sex.Other
    })
    sex: sex

    @Column({ nullable: true })
    avatar: string

    @Column({
        type: 'enum',
        enum: userRole,
        default: userRole.Employee
    })
    role: userRole

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date

    @OneToOne(() => Employer,
        (employer) => employer.user)
    employer: Employer

    @OneToOne(() => Employee,
        (employee) => employee.user)
    employee: Employee

    @OneToMany(() => Notification,
        (notification) => notification.user)
    notifications: Notification[]
}