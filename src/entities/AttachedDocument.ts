import { Entity, BaseEntity, PrimaryColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Employee } from "./"
import { degree, employmentType, experience, positionLevel, applicationType } from "../utils/enum"

@Entity()
export class AttachedDocument extends BaseEntity {
    @PrimaryColumn()
    userId: number

    @Column({
        type: 'enum',
        enum: applicationType,
        default: applicationType.attached_document,
        nullable: false,
        update: false,
        insert: true
    })
    applicationType: applicationType


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
    CV: string

    @Column({ default: 0 })
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

}