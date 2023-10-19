import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, BeforeUpdate, InsertEvent, OneToMany, ManyToOne, CreateDateColumn } from "typeorm"
import { Employer } from "./Employer"
import { degree, sex, employmentType, experience, positionLevel, approvalStatus } from "../utils/enum"
import { Application } from "./Application"
import { OnlineProfile } from "./OnlineProfile"


@Entity()
export class AnotherDegree extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    degreeName: string

    @Column({ nullable: true })
    level: string

    @ManyToOne(() => OnlineProfile, (online_profile) => online_profile.another_degrees)
    online_profile: OnlineProfile

} 