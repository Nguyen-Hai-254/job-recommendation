import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, BeforeUpdate, InsertEvent, OneToMany, ManyToOne } from "typeorm"
import { Employee } from "./Employee"
import { Jobposting } from "./Jobposting"
import { degree, employmentType, experience, positionLevel, status_admin } from "../utils/enum"


@Entity()
export class Application extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    hasCV: boolean

    @Column({
        type: 'enum',
        enum: status_admin,
        default: status_admin.pendingApproval
    })
    status: status_admin

    @ManyToOne(() => Employee, (employee) => employee.applications)
    employee: Employee
    @ManyToOne(() => Jobposting, (jobposting) => jobposting.applications)
    jobposting: Jobposting
}