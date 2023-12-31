import { Entity, BaseEntity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { Employee } from "./Employee"
import { degree, employmentType, experience, positionLevel } from "../utils/enum"


@Entity()
export class AttachedDocument extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    // general information ------------------------
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

    // Other information ------------------------
    @Column({ nullable: true })
    CV: string

    @Column({ nullable: true })
    view: number

    @Column({ default: false })
    isHidden: boolean

    // Relationship ------------------------
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