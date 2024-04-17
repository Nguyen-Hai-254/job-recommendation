import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { OnlineProfile } from "./OnlineProfile"

@Entity()
export class EducationInformation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    schoolName: string

    @Column({ nullable: true })
    specialization: string

    @Column({ nullable: true })
    degreeName: string

    @Column({ type: 'date', nullable: true })
    startDate: Date

    @Column({ type: 'date', nullable: true })
    endDate: Date

    @ManyToOne(() => OnlineProfile, (online_profile) => online_profile.education_informations, {
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE' 
    })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'userId'
    })
    online_profile: OnlineProfile

} 