import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { OnlineProfile } from "./OnlineProfile"


@Entity()
export class AnotherDegree extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    degreeName: string

    @Column({ nullable: true })
    level: string

    @ManyToOne(() => OnlineProfile, (online_profile) => online_profile.another_degrees, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    // @JoinColumn({
    //     name: 'userId',
    //     referencedColumnName: 'userId'
    // })
    online_profile: OnlineProfile

} 