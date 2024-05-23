import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, ManyToMany, UpdateDateColumn, JoinColumn } from "typeorm"
import { Employer, Employee, Application } from "./"
import { degree, sex, employmentType, experience, positionLevel, approvalStatus } from "../utils/enum"

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
        nullable: true
    })
    sex: sex | null

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
    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date

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

    // Properties of Chat GPT to score
    @Column({ type: 'longtext', nullable: true }) // Use to score applications (100 points)
    requiredSkills: string

    @Column({ type: 'longtext', nullable: true }) // Use to score applications (30 points)
    keywords: string

    @Column({ nullable: true, type: 'varchar' })  // Use to check word
    check: boolean | null

    @ManyToOne(() => Employer, (employer) => employer.jobPostings, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({
        name: 'employer_id',
        referencedColumnName: 'userId'
    })
    employer: Employer

    @OneToMany(() => Application, (application) => application.jobPosting)
    applications: Application[]

    @ManyToMany(() => Employee, (employee) => employee.jobs)
    employee: Employee[]
} 