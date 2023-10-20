import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
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