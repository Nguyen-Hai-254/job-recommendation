import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, BeforeUpdate, InsertEvent, OneToMany, ManyToOne } from "typeorm"
import { Employee } from "./Employee"
import { JobPosting } from "./JobPosting"
import { applicationType, approvalStatus } from "../utils/enum"



@Entity()
export class Application extends BaseEntity {
    @PrimaryGeneratedColumn()
    application_id: number

    @Column({
        type: 'enum',
        enum: applicationType,
        default: applicationType.online_profile
    })
    applicationType: applicationType

    @Column({ nullable: true })
    CV: string

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