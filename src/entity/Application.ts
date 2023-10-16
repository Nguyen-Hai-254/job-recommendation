import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, BeforeUpdate, InsertEvent, OneToMany, ManyToOne } from "typeorm"
import { Employee } from "./Employee"
import { JobPosting } from "./JobPosting"
import { status_admin } from "../utils/enum"



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

    @ManyToOne(() => JobPosting, (jobPosting) => jobPosting.applications)
    jobPosting: JobPosting
}