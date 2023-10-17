import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, BeforeUpdate, InsertEvent, OneToMany, ManyToOne } from "typeorm"
import { Employee } from "./Employee"
import { JobPosting } from "./JobPosting"
import { approvalStatus } from "../utils/enum"



@Entity()
export class Application extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    hasCV: boolean

    @Column({
        type: 'enum',
        enum: approvalStatus,
        default: approvalStatus.pending
    })
    status: approvalStatus

    @ManyToOne(() => Employee, (employee) => employee.applications)
    employee: Employee

    @ManyToOne(() => JobPosting, (jobPosting) => jobPosting.applications)
    jobPosting: JobPosting
}