import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Employer, Employee } from "./";

@Entity()
export class Save extends BaseEntity {
    @PrimaryColumn()
    employeeId: number;

    @PrimaryColumn()
    employerId: number

    @PrimaryColumn({ type: Boolean })
    isOnlineProfile: Boolean

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    createAt: Date

    @ManyToOne(() => Employee, (employee) => employee.follow)
    @JoinColumn({
        name: 'employeeId',
        referencedColumnName: 'userId'
    })
    employee: Employee

    @ManyToOne(() => Employer, (employer) => employer.saveEmployee, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({
        name: 'employerId',
        referencedColumnName: 'userId'
    })
    employer: Employer
}