import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, BeforeUpdate, InsertEvent, OneToMany, ManyToOne, CreateDateColumn } from "typeorm"
import { Employer } from "./Employer"
import { degree, sex, employmentType, experience, positionLevel, approvalStatus } from "../utils/enum"
import { Application } from "./Application"


@Entity()
export class JobPosting extends BaseEntity {
    @PrimaryGeneratedColumn()
    postId: number

    @Column({ nullable: true })
    name: string

    @Column({ nullable: true })
    email: string

    @Column({ nullable: true })
    phone: string

    @Column({ nullable: true })
    contactAddress: string

    @Column({ nullable: true })
    workAddress: string

    @Column({ nullable: true })
    jobTitle: string

    @Column({ nullable: true })
    profession: string

    @Column({
        type: 'enum',
        enum: employmentType,
        default: employmentType.Other
    })
    employmentType: employmentType

    @Column({
        type: 'enum',
        enum: degree,
        default: degree.Other
    })
    degree: degree

    @Column({
        type: 'enum',
        enum: experience,
        default: experience.OverFive
    })
    experience: experience

    @Column({
        type: 'enum',
        enum: positionLevel,
        default: positionLevel.Employee
    })
    positionLevel: positionLevel

    @Column({ nullable: true })
    minAge: number

    @Column({ nullable: true })
    maxAge: number

    @Column({
        type: 'enum',
        enum: sex,
        default: sex.Other
    })
    sex: sex

    @Column({ nullable: true })
    numberOfVacancies: number

    @Column({ nullable: true })
    trialPeriod: number

    @Column({ type: 'date', nullable: true })
    applicationDeadline: Date

    @Column({ nullable: true })
    minSalary: number

    @Column({ nullable: true })
    maxSalary: number

    @Column({ nullable: true })
    skills: string

    @Column({ type: 'longtext', nullable: true })
    jobDescription: string

    @Column({ type: 'longtext', nullable: true })
    jobRequirements: string

    @Column({ type: 'longtext', nullable: true })
    benefits: string

    // Other information ------------------------
    @CreateDateColumn({type: 'timestamp'})
    createAt: Date

    @Column({ nullable: true })
    submissionCount: number

    @Column({ nullable: true })
    view: number

    @Column({ default: false })
    isHidden: boolean

    @Column({
        type: 'enum',
        enum: approvalStatus,
        default: approvalStatus.pending
    })
    status: approvalStatus

    @ManyToOne(() => Employer, (employer) => employer.jobPostings)
    employer: Employer

    @OneToMany(() => Application, (application) => application.jobPosting)
    applications: Application[]
} 