import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne,  CreateDateColumn } from "typeorm"
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

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date

    // Optional properties while applicationType = cv_enclosed
    @Column({ nullable: true })
    CV: string

    @Column({ nullable: true })
    name: string

    @Column({ nullable: true })
    email: string

    @Column({ nullable: true })
    phone: string

    // // Properties of Chat GPT
    // @Column({ nullable: true }) // type document of CV
    // cv_docs: string

    // @Column({ nullable: true })
    // keywords: string
    // // jobApplicationMatch, only display for employer
    // @Column({ nullable: true })
    // matchingScore: string

    ///////////////////////////////////////////////////////////
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