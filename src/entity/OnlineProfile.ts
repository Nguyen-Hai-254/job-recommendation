import { Entity, BaseEntity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Employee } from "./Employee"
import { degree, employmentType, experience, positionLevel } from "../utils/enum"
import { WorkExperience } from "./WorkExperience";
import { EducationInformation } from "./EducationInformation";
import { AnotherDegree } from "./AnotherDegree";


@Entity()
export class OnlineProfile extends BaseEntity {
    @PrimaryColumn()
    userId: number;
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

    // Other information ------------------------
    @Column({ nullable: true })
    view: number

    @Column({ default: false })
    isHidden: boolean

    // Relations ------------------------
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