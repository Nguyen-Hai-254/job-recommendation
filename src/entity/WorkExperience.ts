import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, BeforeUpdate, InsertEvent, OneToMany, ManyToOne, CreateDateColumn } from "typeorm"
import { Employer } from "./Employer"
import { degree, sex, employmentType, experience, positionLevel, approvalStatus } from "../utils/enum"
import { Application } from "./Application"
import { OnlineProfile } from "./OnlineProfile"


@Entity()
export class WorkExperience extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    jobTitle: string

    @Column({ nullable: true })
    companyName: string

    @Column({ type: 'date', nullable: true })
    startDate: Date

    @Column({ type: 'date', nullable: true })
    endDate: Date

    @Column({ default: false })
    isDoing: boolean

    @Column({ type: 'longtext', nullable: true })
    jobDescription: string

    @ManyToOne(() => OnlineProfile, (online_profile) => online_profile.work_experiences)
    online_profile: OnlineProfile

} 