import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, RelationId } from "typeorm"
import { Employee, JobPosting } from "./"
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

    @Column({ nullable: true })
    CV: string

    @Column({ nullable: true })
    name: string

    @Column({ nullable: true })
    email: string

    @Column({ nullable: true })
    phone: string

    // Properties of Chat GPT
    @Column({ nullable: true })
    keywords: string

    @Column({ nullable: true })
    matchingScore: number

    @Column({
        type: 'enum',
        enum: approvalStatus,
        default: approvalStatus.pending
    })
    status: approvalStatus

    @ManyToOne(() => Employee, (employee) => employee.applications, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    employee: Employee

    @ManyToOne(() => JobPosting, (jobPosting) => jobPosting.applications, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    jobPosting: JobPosting

    @RelationId((application: Application) => application.jobPosting) // you need to specify target relation
    postId: number
}