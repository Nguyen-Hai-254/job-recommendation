import { Entity, BaseEntity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Employee, WorkExperience, EducationInformation, AnotherDegree } from "./"
import { degree, employmentType, experience, positionLevel, applicationType } from "../utils/enum"

@Entity()
export class OnlineProfile extends BaseEntity {
    @PrimaryColumn()
    userId: number

    @Column({
        type: 'enum',
        enum: applicationType,
        default: applicationType.online_profile,
        nullable: false,
        update: false,
        insert: true
    })
    applicationType: applicationType

    // general information
    @Column({ nullable: true })
    jobTitle: string

    @Column({ nullable: true })
    profession: string

    @Column({
        type: 'enum',
        enum: positionLevel,
        default: positionLevel.Employee
    })
    currentPosition: positionLevel

    @Column({
        type: 'enum',
        enum: positionLevel,
        default: positionLevel.Employee
    })
    desiredPosition: positionLevel

    @Column({ nullable: true })
    desiredSalary: number

    @Column({
        type: 'enum',
        enum: degree,
        default: degree.Other
    })
    degree: degree

    @Column({ nullable: true })
    workAddress: string

    @Column({
        type: 'enum',
        enum: experience,
        default: experience.OverFive
    })
    experience: experience

    @Column({
        type: 'enum',
        enum: employmentType,
        default: employmentType.Other
    })
    employmentType: employmentType

    @Column({ nullable: true })
    careerGoal: string

    @Column({ nullable: true })
    skills: string

    @Column({ nullable: true })
    view: number

    @Column({ default: false })
    isHidden: boolean

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date

    // Properties of Chat GPT
    @Column({ type: 'longtext', nullable: true })
    keywords: string

    @OneToOne(() => Employee, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'userId'
    })
    employee: Employee

    @OneToMany(() => WorkExperience, (workexperience) => workexperience.online_profile)
    work_experiences: WorkExperience[]

    @OneToMany(() => EducationInformation, (educationinformation) => educationinformation.online_profile)
    education_informations: EducationInformation[]

    @OneToMany(() => AnotherDegree, (anotherdegree) => anotherdegree.online_profile)
    another_degrees: AnotherDegree[]

}