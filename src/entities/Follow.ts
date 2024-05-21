import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Employer } from "./Employer";
import { Employee } from "./Employee";


@Entity()
export class Follow extends BaseEntity {
    @PrimaryColumn()
    employeeId: number;

    @PrimaryColumn()
    employerId: number

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    createAt: Date

    @ManyToOne(() => Employee, (employee) => employee.follow, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({
        name: 'employeeId',
        referencedColumnName: 'userId'
    })
    employee: Employee

    @ManyToOne(() => Employer, (employer) => employer.saveEmployee)
    @JoinColumn({
        name: 'employerId',
        referencedColumnName: 'userId'
    })
    employer: Employer
}